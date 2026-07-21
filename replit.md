# Royal Ambassadors of Nigeria

Offline-first mobile app (Expo/React Native) for the Royal Ambassadors of Nigeria (Nigerian Baptist Convention). Boys aged 10–24 study the RA manual, track rank progression, and take Bible quizzes.

## Run & Operate

- `pnpm --filter @workspace/royal-ambassadors run dev` — run the Expo mobile app (main app)
- `pnpm --filter @workspace/api-server run dev` — run the API server (optional backend, needs `DATABASE_URL`)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- Required env for API server only: `DATABASE_URL` — Postgres connection string
- Mobile app has **no required secrets** — fully offline

## Stack

- pnpm workspaces, Node.js 20, TypeScript 5.9
- Mobile: Expo SDK 54, React Native, Expo Router (file-based routing)
- API: Express 5
- DB: PostgreSQL + Drizzle ORM
- Validation: Zod (`zod/v4`), `drizzle-zod`
- API codegen: Orval (from OpenAPI spec)
- Build: esbuild (CJS bundle)

## Where things live

- `artifacts/royal-ambassadors/` — the Expo mobile app
  - `app/(tabs)/` — five tabs: Home, Manual, Ranks, Quiz, Profile
  - `context/AppContext.tsx` — global state (user, ranks, bookmarks, **themePreference**)
  - `constants/colors.ts` — light + dark color palettes
  - `hooks/useColors.ts` — returns active palette based on themePreference
  - `components/SettingsDrawer.tsx` — slide-in settings panel (theme + update checker)
  - `data/ranks.ts` — **source of truth** for all rank data (exact manual wording)
  - `data/manualContent.ts` — canonical reference for manual text
  - `eas.json` — APK build profiles: `preview` → .apk, `production` → .aab
- `artifacts/api-server/` — Express API server (optional backend scaffold)
- `lib/` — shared libraries (api-spec, api-client-react, api-zod, db)

## Architecture decisions

- All app data is local (AsyncStorage) — no login, no internet required from the mobile app
- `themePreference` ("light" | "dark" | "system") is persisted in AsyncStorage and controls the active palette globally via `useColors` + `AppContext`
- `expo-updates` used for OTA updates — works in production/EAS builds; gracefully reports dev mode in Expo Go
- `tar` override in `pnpm-workspace.yaml` works around a Replit package firewall timing issue on 2026-07-21 — remove `tar: "file:/tmp/tar-pkg"` override after 2026-07-22
- `data/ranks.ts` requirements are verbatim from the printed manual — do not paraphrase

## Product

- **Home**: greeting, rank card, daily memory verse, Continue Studying shortcut, hamburger menu → Settings
- **Manual**: 46 scanned pages, image-based reader with Table of Contents
- **Ranks**: all 11 official RA ranks (Candidate → Ambassador Plenipotentiary) with full requirements
- **Quiz**: 10-question Bible/RA quiz with score tracking
- **Profile**: name editor, stats

## User preferences

- Updates are published from the user's own Replit account — keep OTA update checking via expo-updates
- Do not summarise, shorten, or paraphrase rank requirements — preserve exact wording from the manual

## Gotchas

- The `tar` package override (`file:/tmp/tar-pkg`) in `pnpm-workspace.yaml` points to `/tmp` which is ephemeral — if the override breaks after a restart, re-download: `curl -s -o /tmp/tar-7.5.17.tgz https://registry.npmjs.org/tar/-/tar-7.5.17.tgz && mkdir -p /tmp/tar-pkg && tar -xzf /tmp/tar-7.5.17.tgz -C /tmp/tar-pkg --strip-components=1`
- expo-updates version check warns about version mismatch (0.28.18 vs ~29.x) — safe to ignore for now; update when upgrading Expo SDK
- Run `eas login` then `eas build --profile preview --platform android` from `artifacts/royal-ambassadors/` to build the APK

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
- See the `expo` skill for mobile UI, animations, and native features
