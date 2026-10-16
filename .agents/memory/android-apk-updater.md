---
name: Android APK updater
description: The product's required Android release and update path.
---

Use the app's in-app Android APK updater backed by the hosted `update.json`; do not re-enable Expo OTA update checking. Release `versionName` and `versionCode` must come from that JSON. The installed app should display and compare the metadata actually embedded in the installed Android APK, and must never offer an APK with a lower build code. Always let the user choose to install or defer an available update, even when the manifest says `mandatory: true`. Keep a verified APK in persistent app storage if the Android installer is declined; a later update check should offer the saved APK for installation without downloading it again.

**Why:** The user explicitly chose the Android APK updater and `update.json` as the release source instead of Expo updates/config metadata, and asked that a downloaded APK remain available after declining installation.

**How to apply:** Keep the user-triggered APK check/install flow as the only app update mechanism. Show both **Update Now** and **Later** for every available build. Store prepared APKs in persistent app documents, do not schedule cleanup when opening Android's installer, and reuse the pending APK on the next update check. Sync app build metadata from the release manifest before Android builds, and read the installed package's metadata after installation.
