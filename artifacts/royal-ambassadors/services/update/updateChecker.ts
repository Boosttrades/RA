/**
 * update/updateChecker.ts
 * Fetches the remote update manifest and validates it.
 * Only accepts responses from the canonical GitHub Raw URL.
 */

import { UpdateManifest } from "./types";
import { updateLogger } from "./logger";
import { isValidVersion } from "./versionUtils";

/** The only URL from which update information is accepted. */
const UPDATE_MANIFEST_URL =
  "https://raw.githubusercontent.com/Boosttrades/RA-updates/main/update.json";

/** Network timeout for the manifest fetch (ms). */
const FETCH_TIMEOUT_MS = 10_000;

/**
 * Fetches and validates the remote update manifest.
 * Throws on network failure, timeout, or invalid payload.
 */
export async function fetchUpdateManifest(): Promise<UpdateManifest> {
  updateLogger.info("Fetching update manifest", { url: UPDATE_MANIFEST_URL });

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);

  let response: Response;
  try {
    response = await fetch(UPDATE_MANIFEST_URL, {
      signal: controller.signal,
      cache: "no-store",
      headers: { Accept: "application/json" },
    });
  } catch (err) {
    clearTimeout(timeoutId);
    if ((err as Error).name === "AbortError") {
      throw new Error("Update check timed out. Please try again later.");
    }
    throw new Error("No internet connection. Update check will retry next launch.");
  } finally {
    clearTimeout(timeoutId);
  }

  if (!response.ok) {
    throw new Error(`Update manifest returned HTTP ${response.status}. Will retry next launch.`);
  }

  let manifest: unknown;
  try {
    manifest = await response.json();
  } catch {
    throw new Error("Update manifest is malformed. Will retry next launch.");
  }

  return validateUpdateManifest(manifest);
}

/**
 * Type-guards and validates the raw JSON payload.
 */
export function validateUpdateManifest(raw: unknown): UpdateManifest {
  if (typeof raw !== "object" || raw === null) {
    throw new Error("Update manifest is not a valid object.");
  }

  const obj = raw as Record<string, unknown>;

  if (
    !("versionName" in obj) ||
    !("versionCode" in obj) ||
    !("apkUrl" in obj) ||
    !("mandatory" in obj)
  ) {
    throw new Error(
      "Update manifest is missing required fields (versionCode, versionName, apkUrl, mandatory)."
    );
  }

  const { versionName, versionCode, apkUrl, mandatory, releaseNotes } = obj;

  if (typeof versionName !== "string" || !isValidVersion(versionName)) {
    throw new Error(`Update manifest has an invalid versionName: "${versionName}".`);
  }

  if (
    typeof versionCode !== "number" ||
    !Number.isSafeInteger(versionCode) ||
    versionCode < 1
  ) {
    throw new Error(`Update manifest has an invalid versionCode: "${versionCode}".`);
  }

  if (typeof apkUrl !== "string" || apkUrl.trim() === "") {
    throw new Error("Update manifest has a missing or empty apkUrl.");
  }

  if (!apkUrl.startsWith("https://")) {
    throw new Error(
      "Security: Update manifest apkUrl must use HTTPS. Update rejected."
    );
  }

  if (typeof mandatory !== "boolean") {
    throw new Error("Update manifest mandatory must be true or false.");
  }

  if (releaseNotes !== undefined && typeof releaseNotes !== "string") {
    throw new Error("Update manifest releaseNotes must be a string when provided.");
  }

  return {
    versionName: versionName.trim(),
    versionCode,
    apkUrl: apkUrl.trim(),
    mandatory,
    ...(typeof releaseNotes === "string" ? { releaseNotes: releaseNotes.trim() } : {}),
  };
}
