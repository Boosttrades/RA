/**
 * hooks/useAppUpdate.ts
 * Orchestrates the full in-app update flow for Android.
 *
 * What changed from the original:
 *  - Checks for a pending install (verified APK already on disk) on mount.
 *    If found, surfaces it without re-downloading.
 *  - Posts / updates an Android notification during download so the user
 *    can background the app and still track progress.
 *  - A verified APK is kept in persistent app storage after the installer is
 *    handed off. If installation is declined, another update check reuses it.
 *    It is deleted only after installation is detected or the user removes it.
 *  - Does NOT automatically check for updates on app startup. Users must
 *    manually tap "Check for Updates" to trigger a check.
 */

import * as Application from "expo-application";
import { useCallback, useEffect, useRef, useState } from "react";
import { Platform } from "react-native";

import {
  cancelDownload,
  cleanupApk,
  clearPendingInstall,
  dismissDownloadNotification,
  downloadApk,
  fetchUpdateManifest,
  installApk,
  isNewerBuildCode,
  loadPendingInstall,
  postDownloadCompleteNotification,
  postDownloadStartNotification,
  requestNotificationPermission,
  savePendingInstall,
  UpdateManifest,
  UpdateState,
  verifyApkFile,
} from "@/services/update";
import { updateLogger } from "@/services/update/logger";

const IDLE: UpdateState = { status: "idle" };

function getInstalledBuild(): { versionName: string; versionCode: number } {
  if (Application.applicationId !== "com.royalambassadors.nigeria") {
    throw new Error(
      "APK updates are only available in the installed RA Guide app, not Expo Go or a web preview."
    );
  }

  const versionName = Application.nativeApplicationVersion?.trim();
  const rawVersionCode = Application.nativeBuildVersion;
  const versionCode = rawVersionCode ? Number(rawVersionCode) : Number.NaN;

  if (!versionName || !Number.isSafeInteger(versionCode) || versionCode < 1) {
    throw new Error(
      "Could not read this installed app's Android version name and build code."
    );
  }

  return { versionName, versionCode };
}

export function useAppUpdate() {
  const [state, setState] = useState<UpdateState>(IDLE);
  const isChecking = useRef(false);

  // ── On mount: only check for leftover pending install, don't check remote ──
  useEffect(() => {
    if (Platform.OS !== "android") return;

    const timer = setTimeout(async () => {
      // 1. Resume a pending install if one exists from a previous session.
      const pending = await loadPendingInstall();
      if (pending) {
        const installed = getInstalledBuild();
        if (
          pending.versionCode === undefined ||
          pending.versionCode <= installed.versionCode
        ) {
          updateLogger.info("Pending APK is already installed or no longer usable", {
            pendingVersionCode: pending.versionCode,
            installedVersionCode: installed.versionCode,
          });
          await cleanupApk(pending.localUri);
          await clearPendingInstall();
          return;
        }

        updateLogger.info("Resuming pending install from previous session", pending);
        setState({
          status: "pending-install",
          versionName: pending.version,
          versionCode: pending.versionCode,
          localUri: pending.localUri,
        });
        return;
      }

      // 2. Do NOT automatically check remote — wait for user to manually trigger
      // via "Check for Updates" button or checkNow() call.
      updateLogger.info("App started. Awaiting manual update check.");
    }, 1000);

    return () => clearTimeout(timer);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const runCheck = useCallback(async () => {
    if (Platform.OS !== "android") return;
    if (isChecking.current) return;

    isChecking.current = true;
    setState({ status: "checking" });

    try {
      const installed = getInstalledBuild();
      const pending = await loadPendingInstall();
      if (pending) {
        if (
          pending.versionCode !== undefined &&
          pending.versionCode > installed.versionCode
        ) {
          updateLogger.info("Reusing previously downloaded APK", pending);
          setState({
            status: "pending-install",
            versionName: pending.version,
            versionCode: pending.versionCode,
            localUri: pending.localUri,
          });
          return;
        }

        updateLogger.info("Removing a pending APK that is already installed or invalid", {
          pendingVersionCode: pending.versionCode,
          installedVersionCode: installed.versionCode,
        });
        await cleanupApk(pending.localUri);
        await clearPendingInstall();
      }

      const manifest = await fetchUpdateManifest();

      updateLogger.info("Build-code comparison", {
        installed: installed.versionCode,
        remote: manifest.versionCode,
      });

      if (manifest.versionCode < installed.versionCode) {
        setState({
          status: "error",
          message:
            `The update feed is behind this app (feed build ${manifest.versionCode}, ` +
            `installed build ${installed.versionCode}). The publisher needs to update update.json.`,
          retryable: false,
        });
        return;
      }

      if (isNewerBuildCode(installed.versionCode, manifest.versionCode)) {
        setState({ status: "update-available", manifest });
      } else {
        setState({ status: "up-to-date" });
        // Extended timeout to 3s so users can see the "You're all set!" message
        setTimeout(() => setState(IDLE), 3000);
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "Update check failed.";
      updateLogger.error("Update check failed", err);
      setState({ status: "error", message, retryable: true });
    } finally {
      isChecking.current = false;
    }
  }, []);

  /**
   * Starts the download → verify → install pipeline.
   * Called when the user taps "Update Now".
   */
  const startUpdate = useCallback(async (manifest: UpdateManifest) => {
    updateLogger.info("User confirmed update", {
      versionName: manifest.versionName,
      versionCode: manifest.versionCode,
    });

    let localUri: string | null = null;
    let pendingSaved = false;

    try {
      const installed = getInstalledBuild();
      const pending = await loadPendingInstall();
      if (
        pending &&
        pending.versionCode !== undefined &&
        pending.versionCode > installed.versionCode
      ) {
        setState({
          status: "pending-install",
          versionName: pending.version,
          versionCode: pending.versionCode,
          localUri: pending.localUri,
        });
        return;
      }

      if (pending) {
        await cleanupApk(pending.localUri);
        await clearPendingInstall();
      }

      // Request notification permission so we can show progress in the shade.
      await requestNotificationPermission();
      await postDownloadStartNotification();

      localUri = await downloadApk(manifest.apkUrl, async (progress) => {
        setState({ status: "downloading", progress });

        // Throttle notification updates to every ~5% to avoid flooding.
        if (progress.percentage % 5 === 0 || progress.percentage < 0) {
          const mb = (progress.totalBytesWritten / 1_048_576).toFixed(1);
          await updateDownloadProgressNotification(progress.percentage, mb);
        }
      });

      await dismissDownloadNotification();

      setState({ status: "verifying" });
      await verifyApkFile(localUri);

      // Save the verified APK so we can resume if the user cancels the installer.
      await savePendingInstall({
        version: manifest.versionName,
        versionCode: manifest.versionCode,
        localUri,
      });
      pendingSaved = true;
      await postDownloadCompleteNotification(manifest.versionName);

      setState({ status: "installing" });
      await installApk(localUri);

      // Hand-off to the OS installer succeeded — return to idle.
      // The APK stays on disk until the user cancels or opens the app again.
      setState(IDLE);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Update failed. Please try again.";
      updateLogger.error("Update pipeline failed", err);

      await dismissDownloadNotification();

      if (localUri && !pendingSaved) {
        await cleanupApk(localUri);
        await clearPendingInstall();
      }

      setState({ status: "error", message, retryable: true });
    }
  }, []);

  /**
   * Installs a previously verified APK that's still on disk.
   * Used when the user taps "Install Now" on the pending-install card.
   */
  const resumeInstall = useCallback(async (localUri: string) => {
    updateLogger.info("Resuming install from pending APK", { localUri });

    try {
      setState({ status: "installing" });
      await installApk(localUri);
      setState(IDLE);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Installation failed. Please try again.";
      updateLogger.error("Resume install failed", err);
      setState({ status: "error", message, retryable: false });
    }
  }, []);

  /** Cancels an in-progress download and resets to idle. */
  const cancelUpdate = useCallback(async () => {
    updateLogger.info("User cancelled download");
    await cancelDownload();
    await dismissDownloadNotification();
    setState(IDLE);
  }, []);

  /**
   * Dismisses the update dialog and clears the pending install record.
   * Called when the user explicitly taps "Cancel" on the pending-install card.
   */
  const cancelPendingInstall = useCallback(async (localUri: string) => {
    updateLogger.info("User dismissed pending install");
    await cleanupApk(localUri);
    await clearPendingInstall();
    setState(IDLE);
  }, []);

  /** Dismisses the update-available, up-to-date or error dialog without taking action. */
  const dismiss = useCallback(() => {
    setState(IDLE);
  }, []);

  /** Manually triggers an update check (user must explicitly tap "Check for Updates" button). */
  const checkNow = useCallback(() => {
    void runCheck();
  }, [runCheck]);

  return {
    state,
    startUpdate,
    resumeInstall,
    cancelUpdate,
    cancelPendingInstall,
    dismiss,
    checkNow,
  };
}

// Inline helper used inside startUpdate — needs to be importable by the
// closure without adding it to the public barrel export.
async function updateDownloadProgressNotification(
  percentage: number,
  mb: string
): Promise<void> {
  const { updateDownloadProgressNotification: fn } = await import(
    "@/services/update/downloadNotification"
  );
  await fn(percentage, mb);
}
