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

/**
 * Returns true if `remote` is strictly newer than `installed`.
 * Compares major, minor, and patch components in order.
 */
export function isNewerVersion(installed: string, remote: string): boolean {
  const a = parseParts(installed);
  const b = parseParts(remote);
  const len = Math.max(a.length, b.length);

  for (let i = 0; i < len; i++) {
    const ai = a[i] ?? 0;
    const bi = b[i] ?? 0;
    if (bi > ai) return true;
    if (bi < ai) return false;
  }
  return false; // equal
}

/**
 * Returns true if the version string looks structurally valid (e.g. "1.2.3").
 */
export function isValidVersion(version: string): boolean {
  if (typeof version !== "string" || version.trim() === "") return false;
  return /^\d+(\.\d+)*$/.test(version.trim());
}
