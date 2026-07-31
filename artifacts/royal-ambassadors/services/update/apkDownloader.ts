/**
 * update/apkDownloader.ts
 * Downloads an APK from a validated HTTPS URL into the app's cache directory.
 * Reports progress via a callback and cleans up stale downloads.
 *
 * expo-file-system v19+ moved the classic function-based API to the /legacy
 * subpath. All imports here come from expo-file-system/legacy so that the
 * TypeScript types and runtime behaviour match.
 */

import {
  cacheDirectory,
  createDownloadResumable,
  deleteAsync,
  getInfoAsync,
  DownloadResumable,
  DownloadProgressData,
  FileSystemDownloadResult,
} from "expo-file-system/legacy";
import { DownloadProgress } from "./types";
import { updateLogger } from "./logger";

/** Filename used for the downloaded APK in the cache directory. */
const APK_FILENAME = "ra-update.apk";

/** Network timeout for the download in ms (5 minutes for large APKs). */
const DOWNLOAD_TIMEOUT_MS = 5 * 60 * 1000;

// Singleton to prevent concurrent downloads.
let activeDownload: DownloadResumable | null = null;

/**
 * Returns the local path where the APK will be stored.
 */
export function getApkLocalPath(): string {
  return `${cacheDirectory}${APK_FILENAME}`;
}

/**
 * Downloads the APK from `url` into the cache directory.
 * Calls `onProgress` with live progress updates.
 * Returns the local file URI on success.
 * Throws if the URL is not HTTPS, a download is already in progress, or the download fails.
 */
export async function downloadApk(
  url: string,
  onProgress: (progress: DownloadProgress) => void
): Promise<string> {
  if (!url.startsWith("https://")) {
    throw new Error("Security: APK download URL must use HTTPS.");
  }

  if (activeDownload !== null) {
    throw new Error("A download is already in progress.");
  }

  const localUri = getApkLocalPath();

  // Remove any leftover APK from a previous failed download.
  await cleanupApk(localUri);

  updateLogger.info("Starting APK download", { localUri });

  const downloadResumable = createDownloadResumable(
    url,
    localUri,
    {},
    (rawProgress: DownloadProgressData) => {
      const { totalBytesWritten, totalBytesExpectedToWrite } = rawProgress;
      const percentage =
        totalBytesExpectedToWrite > 0
          ? Math.round((totalBytesWritten / totalBytesExpectedToWrite) * 100)
          : -1;

      onProgress({ totalBytesWritten, totalBytesExpectedToWrite, percentage });

      updateLogger.info("Download progress", {
        written: totalBytesWritten,
        total: totalBytesExpectedToWrite,
        percentage,
      });
    }
  );

  activeDownload = downloadResumable;

  // Apply a coarse timeout by racing against a rejection.
  const timeoutPromise = new Promise<never>((_, reject) =>
    setTimeout(() => reject(new Error("APK download timed out.")), DOWNLOAD_TIMEOUT_MS)
  );

  let result: FileSystemDownloadResult | undefined = undefined;
  try {
    result = await Promise.race([downloadResumable.downloadAsync(), timeoutPromise]);
  } catch (err) {
    updateLogger.error("APK download failed", err);
    await cleanupApk(localUri);
    throw err;
  } finally {
    activeDownload = null;
  }

  if (!result || result.status !== 200) {
    await cleanupApk(localUri);
    throw new Error(
      `APK download failed with HTTP ${result?.status ?? "unknown"}.`
    );
  }

  updateLogger.info("APK download complete", { localUri });
  return localUri;
}

/**
 * Cancels any in-progress download and removes the partial file.
 */
export async function cancelDownload(): Promise<void> {
  if (activeDownload) {
    try {
      await activeDownload.cancelAsync();
    } catch {
      // Ignore errors during cancel.
    }
    activeDownload = null;
  }
  await cleanupApk(getApkLocalPath());
}

/**
 * Deletes the APK file at `localUri` if it exists.
 */
export async function cleanupApk(localUri?: string): Promise<void> {
  const path = localUri ?? getApkLocalPath();
  try {
    const info = await getInfoAsync(path);
    if (info.exists) {
      await deleteAsync(path, { idempotent: true });
      updateLogger.info("Cleaned up APK file", { path });
    }
  } catch {
    updateLogger.warn("Failed to clean up APK file", { path });
  }
}
