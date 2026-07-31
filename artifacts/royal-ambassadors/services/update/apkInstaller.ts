/**
 * update/apkInstaller.ts
 * Hands the verified APK off to Android's official package installer.
 * Only runs on Android; no-ops on other platforms.
 *
 * getContentUriAsync lives in the expo-file-system/legacy subpath in v19+.
 */

import { Platform } from "react-native";
import { getContentUriAsync } from "expo-file-system/legacy";
import * as IntentLauncher from "expo-intent-launcher";
import { updateLogger } from "./logger";
import { cleanupApk } from "./apkDownloader";

/**
 * Opens Android's native package installer for the APK at `localUri`.
 * The system installer enforces signature matching before modifying any app.
 * Schedules a cleanup of the APK file after a short delay (giving the
 * installer time to read the file before we delete it).
 *
 * @throws On non-Android platforms, or if the content URI cannot be obtained.
 */
export async function installApk(localUri: string): Promise<void> {
  if (Platform.OS !== "android") {
    throw new Error("APK installation is only supported on Android.");
  }

  updateLogger.info("Requesting content URI for APK", { localUri });

  let contentUri: string;
  try {
    contentUri = await getContentUriAsync(localUri);
  } catch (err) {
    updateLogger.error("Failed to get content URI", err);
    throw new Error(
      "Could not prepare the APK for installation. Please try again."
    );
  }

  updateLogger.info("Launching Android package installer", { contentUri });

  try {
    await IntentLauncher.startActivityAsync(
      "android.intent.action.INSTALL_PACKAGE",
      {
        data: contentUri,
        // FLAG_GRANT_READ_URI_PERMISSION (0x1) allows the installer to read
        // the file via the content URI without exposing the raw file path.
        flags: 1,
        type: "application/vnd.android.package-archive",
      }
    );
  } catch (err) {
    updateLogger.error("Package installer failed to launch", err);
    throw new Error(
      "Could not open the Android installer. Please check that installing from unknown sources is enabled in your device settings."
    );
  }

  // Clean up after giving the installer time to read the file (30 seconds).
  setTimeout(() => {
    void cleanupApk(localUri);
  }, 30_000);
}
