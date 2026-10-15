const fs = require("node:fs/promises");
const path = require("node:path");

const UPDATE_MANIFEST_URL =
  "https://raw.githubusercontent.com/Boosttrades/RA-updates/main/update.json";
const APP_CONFIG_PATH = path.join(__dirname, "..", "app.json");

async function main() {
  const response = await fetch(UPDATE_MANIFEST_URL, {
    cache: "no-store",
    headers: { Accept: "application/json" },
  });
  if (!response.ok) {
    throw new Error(`Could not fetch update.json (HTTP ${response.status}).`);
  }

  const manifest = await response.json();
  if (
    typeof manifest.versionName !== "string" ||
    !/^\d+(\.\d+)*$/.test(manifest.versionName.trim()) ||
    !Number.isSafeInteger(manifest.versionCode) ||
    manifest.versionCode < 1 ||
    typeof manifest.apkUrl !== "string" ||
    !manifest.apkUrl.startsWith("https://") ||
    typeof manifest.mandatory !== "boolean"
  ) {
    throw new Error("update.json is missing valid Android release metadata.");
  }

  const config = JSON.parse(await fs.readFile(APP_CONFIG_PATH, "utf8"));
  const currentCode = config.expo?.android?.versionCode;
  if (!Number.isSafeInteger(currentCode) || currentCode < 1) {
    throw new Error("app.json does not contain a valid Android versionCode.");
  }
  if (manifest.versionCode < currentCode) {
    throw new Error(
      `update.json build ${manifest.versionCode} is older than this project's configured build ${currentCode}. ` +
        "Bump versionCode in the release feed before building; Android cannot install a lower-code APK as an update."
    );
  }

  config.expo.version = manifest.versionName.trim();
  config.expo.android.versionCode = manifest.versionCode;
  await fs.writeFile(APP_CONFIG_PATH, `${JSON.stringify(config, null, 2)}\n`);

  console.log(
    `Android package metadata synced from update.json: ${manifest.versionName.trim()} (build ${manifest.versionCode}).`
  );
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
