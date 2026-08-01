/**
 * update/types.ts
 * Shared types for the in-app update system.
 */

/** Shape of the remote update.json hosted on GitHub Raw. */
export interface UpdateManifest {
  version: string;
  downloadUrl: string;
}

/** Granular download progress reported to the UI. */
export interface DownloadProgress {
  totalBytesWritten: number;
  totalBytesExpectedToWrite: number;
  /** 0–100 percentage, or -1 if total size is unknown. */
  percentage: number;
}

/** Discriminated union describing where the update flow currently stands. */
export type UpdateState =
  | { status: "idle" }
  | { status: "checking" }
  | { status: "up-to-date" }
  | { status: "update-available"; manifest: UpdateManifest }
  | { status: "downloading"; progress: DownloadProgress }
  | { status: "verifying" }
  /**
   * A verified APK is already on disk (from a previous session where the user
   * downloaded but cancelled the installer). The user can install without
   * re-downloading.
   */
  | { status: "pending-install"; version: string; localUri: string }
  | { status: "installing" }
  | { status: "error"; message: string; retryable: boolean };
