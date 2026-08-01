/**
 * services/update/index.ts
 * Public barrel export for the in-app update system.
 */

export { downloadApk, cancelDownload, cleanupApk, getApkLocalPath } from "./apkDownloader";
export { installApk } from "./apkInstaller";
export { verifyApkFile } from "./certificateVerifier";
export { fetchUpdateManifest } from "./updateChecker";
export { isNewerVersion, isValidVersion } from "./versionUtils";
export {
  setupUpdateNotificationChannel,
  requestNotificationPermission,
  postDownloadStartNotification,
  updateDownloadProgressNotification,
  postDownloadCompleteNotification,
  dismissDownloadNotification,
} from "./downloadNotification";
export {
  savePendingInstall,
  loadPendingInstall,
  clearPendingInstall,
} from "./pendingInstall";
export type { UpdateManifest, DownloadProgress, UpdateState } from "./types";
