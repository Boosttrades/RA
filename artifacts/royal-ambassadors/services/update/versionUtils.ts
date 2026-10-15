/**
 * update/versionUtils.ts
 * Pure utility functions for semver-style version comparison.
 * Handles versions like "1.0.0", "2.3.1", "10.0.0".
 */

/**
 * Parses a version string into an array of numeric parts.
 * "1.2.3" → [1, 2, 3]
 */
function parseParts(version: string): number[] {
  return version
    .trim()
    .split(".")
    .map((part) => {
      const n = parseInt(part, 10);
      return isNaN(n) ? 0 : n;
    });
}

/** Android only accepts an in-place APK upgrade when its versionCode is higher. */
export function isNewerBuildCode(installed: number, remote: number): boolean {
  return Number.isSafeInteger(installed) &&
    Number.isSafeInteger(remote) &&
    remote > installed;
}

/**
 * Returns true if the version string looks structurally valid (e.g. "1.2.3").
 */
export function isValidVersion(version: string): boolean {
  if (typeof version !== "string" || version.trim() === "") return false;
  return /^\d+(\.\d+)*$/.test(version.trim());
}
