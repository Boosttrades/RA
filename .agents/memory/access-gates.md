---
name: Access gates
description: Separate persistence lifetimes for the Royal Ambassadors app and ranks locks.
---

The main app unlock persists after the first successful password entry and should not prompt again between launches. The ranks lock remains session-only and should relock on a new app session.

**Why:** The user explicitly asked for one-time app access while keeping the ranks lock able to lock again.

**How to apply:** Keep main-app access storage independent from the in-session ranks unlock state; do not let the ranks tab inherit the persistent app unlock.
