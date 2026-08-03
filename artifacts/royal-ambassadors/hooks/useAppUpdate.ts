/**
 * hooks/useAppUpdate.ts
 * Orchestrates the full in-app update flow for Android.
 *
 * What changed from the original:
 *  - Checks for a pending install (verified APK already on disk) on mount.
 *    If found, surfaces it without re-downloading.
 *  - Posts / updates an Android notification during download so the user
 *    can background the app and still track progress.
 *  - APK is NOT deleted after the installer is handed off. Instead it is
 *    saved as a "pending install" record. It is only deleted when the user
 *    explicitly cancels from the UI, or when a newer remote version
 *    supersedes it.
 */

import Constants from "expo-constants";
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
  isNewerVersion,
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

function getInstalledVersion(): string {
  return Constants.expoConfig?.version ?? "0.0.0";
}

export function useAppUpdate() {
  const [state, setState] = useState<UpdateState>(IDLE);
  const isChecking = useRef(false);

  // ── On mount: check for a leftover verified APK first, then check remote ──
  useEffect(() => {
    if (Platform.OS !== "android") return;

    const timer = setTimeout(async () => {
      // 1. Resume a pending install if one exists from a previous session.
      const pending = await loadPendingInstall();
      if (pending) {
        updateLogger.info("Resuming pending install from previous session", pending);
        setState({
          status: "pending-install",
          version: pending.version,
          localUri: pending.localUri,
        });
        return; // Don't run the network check when an APK is already ready.
      }

      // 2. Otherwise do a normal remote version check.
      void runCheck();
    }, 2000);

    return () => clearTimeout(timer);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const runCheck = useCallback(async () => {
    if (Platform.OS !== "android") return;
    if (isChecking.current) return;

    isChecking.current = true;
    setState({ status: "checking" });

    try {
      const manifest = await fetchUpdateManifest();
      const installed = getInstalledVersion();

      updateLogger.info("Version comparison", { installed, remote: manifest.version });

      if (isNewerVersion(installed, manifest.version)) {
        // If there's a stale pending APK for an older version, clear it.
        const pending = await loadPendingInstall();
        if (pending && isNewerVersion(pending.version, manifest.version)) {
          await cleanupApk(pending.localUri);
          await clearPendingInstall();
        }

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
    updateLogger.info("User confirmed update", { version: manifest.version });

    // Request notification permission so we can show progress in the shade.
    await requestNotificationPermission();
    await postDownloadStartNotification();

    let localUri: string | null = null;

    try {
      localUri = await downloadApk(manifest.downloadUrl, async (progress) => {
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
      await savePendingInstall({ version: manifest.version, localUri });
      await postDownloadCompleteNotification(manifest.version);

      setState({ status: "installing" });
      await installApk(localUri);

      // Hand-off to the OS installer succeeded — return to idle.
      // The APK stays on disk until the user cancels or opens the app again.
      setState(IDLE);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Update failed. Please try again.";
      updateLogger.error("Update pipeline failed", err);

      await dismissDownloadNotification();

      if (localUri) {
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

  /** Manually re-triggers an update check (e.g. from a settings screen). */
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
