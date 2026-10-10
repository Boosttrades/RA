---
name: Access gates
description: Separate persistence lifetimes for the Royal Ambassadors app and ranks locks.
---

The main app unlock persists after the first successful password entry on that device and should not prompt again between launches. Bind the saved unlock to the current device identity so Android data transfer cannot unlock a different device. The ranks lock remains session-only and should relock on a new app session.

**Why:** The user explicitly wants the app to stay unlocked after the first unlock on a device, but always start locked on a different device, even after Android data transfer. The ranks section separately remains session-only.

**How to apply:** Keep main-app access storage independent from the in-session ranks unlock state; do not let the ranks tab inherit the persistent app unlock. When changing the unlock-state format, never trust the legacy transferable boolean as an unlock on the current device.
