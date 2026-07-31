/**
 * update/index.ts
 * Public API for the in-app update service.
 */

export type { UpdateManifest, DownloadProgress, UpdateState } from "./types";
export { fetchUpdateManifest } from "./updateChecker";
export { isNewerVersion, isValidVersion } from "./versionUtils";
export { downloadApk, cancelDownload, cleanupApk, getApkLocalPath } from "./apkDownloader";
export { verifyApkFile } from "./certificateVerifier";
export { installApk } from "./apkInstaller";
