---
name: Storage-conscious builds
description: The user wants app builds optimized for storage and does not want unnecessary EAS retries.
---

Before an EAS build, audit which assets actually reach the app bundle and remove only files proven unused. Prefer pixel-identical compression for important artwork; only use lossy optimization where visual quality remains acceptable.

**Why:** The user explicitly asked to optimize storage before Expo builds and avoid excessive retries that could increase app size.

**How to apply:** Run one complete local Android export and checks after changes, then start one EAS build once credentials and configuration are ready. If a build fails, diagnose the cause before retrying.
