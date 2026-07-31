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

  return validateManifest(manifest);
}

/**
 * Type-guards and validates the raw JSON payload.
 */
function validateManifest(raw: unknown): UpdateManifest {
  if (typeof raw !== "object" || raw === null) {
    throw new Error("Update manifest is not a valid object.");
  }

  const obj = raw as Record<string, unknown>;

  if (!("version" in obj) || !("downloadUrl" in obj)) {
    throw new Error("Update manifest is missing required fields (version, downloadUrl).");
  }

  const { version, downloadUrl } = obj;

  if (typeof version !== "string" || !isValidVersion(version)) {
    throw new Error(`Update manifest has an invalid version: "${version}".`);
  }

  if (typeof downloadUrl !== "string" || downloadUrl.trim() === "") {
    throw new Error("Update manifest has a missing or empty downloadUrl.");
  }

  if (!downloadUrl.startsWith("https://")) {
    throw new Error(
      "Security: Update manifest downloadUrl must use HTTPS. Update rejected."
    );
  }

  return { version: version.trim(), downloadUrl: downloadUrl.trim() };
}
