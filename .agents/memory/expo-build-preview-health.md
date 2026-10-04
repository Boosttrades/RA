---
name: Expo build vs. preview health
description: Distinguish a successful cloud APK build from a healthy Replit Expo preview.
---

An EAS cloud build can finish successfully even while the local Metro workflow is missing installed packages or has Expo SDK-incompatible dependency versions. Treat the cloud build and the Replit preview as separate validation targets.

**Why:** A successful APK build coincided with a local Metro startup failure, first from an undeployed workspace package and then from SDK 54 package-version drift.

**How to apply:** After a cloud build, verify the managed Expo workflow separately. When package installation or Expo dependency versions are implicated, check the lockfile install and Expo SDK alignment before concluding that the APK and preview are both healthy.