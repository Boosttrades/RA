/**
 * update/pendingInstall.ts
 * Persists a verified-but-not-yet-installed APK across app restarts.
 *
 * When a download + verification completes but the user cancels (or ignores)
 * the Android installer prompt, the APK stays on disk. On next app launch we
 * detect it here and offer "Install Now" without re-downloading.
 *
 * The record is cleared when:
 *  - The user cancels the install explicitly from the UI
 *  - The stored APK file no longer exists on disk
 *  - A new update check supersedes the stored version
 */

import AsyncStorage from "@react-native-async-storage/async-storage";
import { getInfoAsync } from "expo-file-system/legacy";
import { updateLogger } from "./logger";

const STORAGE_KEY = "@ra_pending_install";

export interface PendingInstall {
  /** Semver string of the APK sitting on disk. */
  version: string;
  /** file:// URI of the verified APK. */
  localUri: string;
}

/** Persists a completed download that is ready for installation. */
export async function savePendingInstall(install: PendingInstall): Promise<void> {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(install));
    updateLogger.info("Saved pending install record", install);
  } catch (err) {
    updateLogger.warn("Failed to save pending install record", err);
  }
}

/**
 * Loads the pending install record (if any) and validates the APK still
 * exists on disk. Returns null if there is nothing to resume.
 */
export async function loadPendingInstall(): Promise<PendingInstall | null> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    if (!raw) return null;

    const record = JSON.parse(raw) as PendingInstall;

    // Verify the file is still on disk — it may have been wiped by the OS.
    const info = await getInfoAsync(record.localUri);
    if (!info.exists) {
      updateLogger.info("Pending APK no longer on disk — clearing record");
      await clearPendingInstall();
      return null;
    }

    updateLogger.info("Found pending install on disk", record);
    return record;
  } catch (err) {
    updateLogger.warn("Failed to load pending install record", err);
    return null;
  }
}

/** Removes the pending install record (does not delete the APK file). */
export async function clearPendingInstall(): Promise<void> {
  try {
    await AsyncStorage.removeItem(STORAGE_KEY);
  } catch {
    // Best-effort.
  }
}
