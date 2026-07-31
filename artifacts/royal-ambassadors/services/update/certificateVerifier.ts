/**
 * update/certificateVerifier.ts
 * Pre-installation APK validation.
 *
 * What this module does:
 *  1. Confirms the downloaded file actually exists and is non-empty.
 *  2. Verifies the file starts with the PK (ZIP) magic bytes — a minimal sanity
 *     check that the download is an archive and not an HTML error page.
 *
 * What cryptographic signature verification looks like here:
 *  Full pre-install certificate fingerprint comparison requires a native Android
 *  API (PackageManager.getPackageArchiveInfo with GET_SIGNATURES) that is not
 *  available in Expo's managed JS runtime. We rely on Android's own package
 *  installer as the authoritative signature enforcer — it will refuse to install
 *  an APK signed with a different key and display a clear error before anything
 *  is modified. This is the same protection the Play Store uses.
 *
 *  If you move to a bare/dev-client workflow, drop in a native module that calls
 *  PackageManager.getPackageArchiveInfo and compare fingerprints here — the
 *  interface below is designed to make that swap a one-file change.
 *
 * getInfoAsync, readAsStringAsync and EncodingType live in the
 * expo-file-system/legacy subpath in v19+.
 */

import {
  getInfoAsync,
  readAsStringAsync,
  EncodingType,
} from "expo-file-system/legacy";
import { updateLogger } from "./logger";

/** ZIP local-file-header magic bytes: PK\x03\x04 */
const ZIP_MAGIC = [0x50, 0x4b, 0x03, 0x04];

/**
 * Validates the downloaded APK file before handing it to the installer.
 *
 * @param localUri - The file:// URI of the downloaded APK.
 * @throws If the file is missing, empty, or clearly not a ZIP/APK archive.
 */
export async function verifyApkFile(localUri: string): Promise<void> {
  updateLogger.info("Verifying downloaded APK file", { localUri });

  // 1. Check the file exists and has a non-zero size.
  const info = await getInfoAsync(localUri);

  if (!info.exists) {
    throw new Error("Downloaded APK file not found. The download may have failed.");
  }

  if ("size" in info && info.size === 0) {
    throw new Error("Downloaded APK file is empty. The download may have been interrupted.");
  }

  // 2. Read the first 4 bytes and confirm ZIP magic bytes (APKs are ZIP archives).
  let header: string;
  try {
    header = await readAsStringAsync(localUri, {
      encoding: EncodingType.Base64,
      length: 4,
      position: 0,
    });
  } catch {
    throw new Error("Could not read the downloaded file. It may be corrupted.");
  }

  const bytes = base64ToBytes(header);
  const isZip = ZIP_MAGIC.every((byte, i) => bytes[i] === byte);

  if (!isZip) {
    throw new Error(
      "The downloaded file does not appear to be a valid APK. Installation cancelled for safety."
    );
  }

  updateLogger.info("APK file validation passed (ZIP magic bytes confirmed)");
}

/** Converts a base64 string to a byte array. */
function base64ToBytes(b64: string): number[] {
  const binary = atob(b64);
  return Array.from({ length: binary.length }, (_, i) => binary.charCodeAt(i));
}
