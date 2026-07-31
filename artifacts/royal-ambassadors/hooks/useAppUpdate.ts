/**
 * hooks/useAppUpdate.ts
 * Orchestrates the full in-app update flow for Android.
 *
 * Usage:
 *   const { state, checkNow, startUpdate, dismiss } = useAppUpdate();
 *
 * - Call checkNow() to re-trigger an update check on demand.
 * - The hook runs a background check on first mount automatically.
 * - On non-Android platforms the hook is a no-op (state stays "idle").
 */

import Constants from "expo-constants";
import { useCallback, useEffect, useRef, useState } from "react";
import { Platform } from "react-native";

import {
  cancelDownload,
  cleanupApk,
  downloadApk,
  fetchUpdateManifest,
  installApk,
  isNewerVersion,
  UpdateManifest,
  UpdateState,
  verifyApkFile,
} from "@/services/update";
import { updateLogger } from "@/services/update/logger";

const IDLE: UpdateState = { status: "idle" };

/** Reads the installed app version from Expo Constants. */
function getInstalledVersion(): string {
  // expoConfig is the canonical source; fall back to "0.0.0" if unavailable.
  return Constants.expoConfig?.version ?? "0.0.0";
}

export function useAppUpdate() {
  const [state, setState] = useState<UpdateState>(IDLE);

  // Prevents a second simultaneous check.
  const isChecking = useRef(false);

  // Track whether the dialog has been dismissed so we don't re-show it after
  // the user explicitly closes it without updating.
  const dismissed = useRef(false);

  const check = useCallback(async () => {
    if (Platform.OS !== "android") return;
    if (isChecking.current) return;

    isChecking.current = true;
    dismissed.current = false;
    setState({ status: "checking" });

    try {
      const manifest = await fetchUpdateManifest();
      const installed = getInstalledVersion();

      updateLogger.info("Version comparison", {
        installed,
        remote: manifest.version,
      });

      if (isNewerVersion(installed, manifest.version)) {
        setState({ status: "update-available", manifest });
      } else {
        setState({ status: "up-to-date" });
        // Silently reset to idle after a short delay — no UI needed.
        setTimeout(() => setState(IDLE), 1500);
      }
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Update check failed.";
      updateLogger.error("Update check failed", err);
      setState({ status: "error", message, retryable: true });
    } finally {
      isChecking.current = false;
    }
  }, []);

  // Run once on mount in the background.
  useEffect(() => {
    // Small delay so the check never blocks or delays app startup.
    const timer = setTimeout(() => {
      void check();
    }, 2000);
    return () => clearTimeout(timer);
  }, [check]);

  /**
   * Starts the download → verify → install pipeline.
   * Called when the user taps "Update Now" in the dialog.
   */
  const startUpdate = useCallback(async (manifest: UpdateManifest) => {
    updateLogger.info("User confirmed update", { version: manifest.version });

    let localUri: string | null = null;

    try {
      localUri = await downloadApk(manifest.downloadUrl, (progress) => {
        setState({ status: "downloading", progress });
      });

      setState({ status: "verifying" });
      await verifyApkFile(localUri);

      setState({ status: "installing" });
      await installApk(localUri);

      // After handing off to the installer, return to idle.
      // The OS installer takes over from here.
      setState(IDLE);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Update failed. Please try again.";
      updateLogger.error("Update pipeline failed", err);

      if (localUri) {
        await cleanupApk(localUri);
      }

      setState({ status: "error", message, retryable: true });
    }
  }, []);

  /** Cancels an in-progress download and resets to idle. */
  const cancelUpdate = useCallback(async () => {
    updateLogger.info("User cancelled update");
    await cancelDownload();
    setState(IDLE);
  }, []);

  /** Dismisses the update dialog without installing. */
  const dismiss = useCallback(() => {
    dismissed.current = true;
    setState(IDLE);
  }, []);

  /** Manually re-triggers an update check (e.g. from a settings screen). */
  const checkNow = useCallback(() => {
    void check();
  }, [check]);

  return { state, startUpdate, cancelUpdate, dismiss, checkNow };
}
