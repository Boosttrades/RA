---
name: Android APK updater
description: The product's required Android release and update path.
---

Use the app's in-app Android APK updater backed by the hosted `update.json`; do not re-enable Expo OTA update checking. Release `versionName` and `versionCode` must come from that JSON. The installed app should display and compare the metadata actually embedded in the installed Android APK, and must never offer an APK with a lower build code.

**Why:** The user explicitly chose the Android APK updater and `update.json` as the release source instead of Expo updates/config metadata.

**How to apply:** Keep the user-triggered APK check/install flow as the only app update mechanism. Sync app build metadata from the release manifest before Android builds, and read the installed package's metadata after installation.
