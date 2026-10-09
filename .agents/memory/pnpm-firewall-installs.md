---
name: pnpm firewall installs
description: Recovering from Replit package firewall blocks during workspace installs.
---

When a Replit workspace install is blocked on an outdated transitive package, first identify the affected dependency chain and check the latest compatible release. If unrelated workspace packages are blocking the immediate app, install only the app and its workspace dependencies. Use a narrowly scoped override when its parent cannot safely advance, then keep the lockfile aligned.

**Why:** The imported pnpm monorepo's all-workspace install hit a firewall denial in an optional API dependency, and the Expo-only install separately hit a denial in React Native's devtools dependency.

**How to apply:** Keep setup focused on the requested artifact; do not upgrade unrelated workspace services or disable package safety protections just to complete an app preview install.
