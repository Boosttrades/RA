# Royal Ambassadors of Nigeria

An offline-first mobile app for the Royal Ambassadors of Nigeria (Nigerian Baptist Convention), built with Expo and React Native. Designed for boys aged 10–24 to study the RA manual, track rank progression, and take Bible quizzes.

> **For collaborators importing this project:** Follow the [Quick Start](#quick-start-for-collaborators) section below — it covers everything you need from a fresh GitHub import to a running app.

---

## What it does

The app has five tabs:

| Tab | What it contains |
|---|---|
| **Home** | Greeting, current rank card, daily memory verse, "Continue Studying" shortcut |
| **Manual** | All 46 scanned pages of the real RAN Manual as a searchable, image-based reader with a clickable Table of Contents |
| **Ranks** | All 10 official RA ranks (Candidate → Ambassador Extraordinary) with age groups and full requirements from the manual |
| **Quiz** | 10-question Bible/RA knowledge quiz with score tracking |
| **Profile** | Member name editor and stats, persisted with AsyncStorage |

All data is local — no login, no internet required from the app. The API server exists as a backend scaffold but is not yet connected to the mobile app.

---

## Quick Start for Collaborators

This project is a **pnpm monorepo** hosted on Replit. Follow these steps after importing from GitHub:

### 1. Import to Replit
- Go to [replit.com](https://replit.com) and create a new Repl from this GitHub repository
- Replit will detect the project automatically
- Use a **desktop browser** (Chrome, Firefox, or Safari on Mac/PC) for the best experience — the live preview does not work in iOS Safari or standalone mobile browsers

### 2. Install dependencies
Open the **Shell** tab and run:
```bash
pnpm install
```
This installs all packages for every workspace (mobile app, API server, shared libraries) in one command.

### 3. Start the mobile app
Run the **`artifacts/royal-ambassadors: expo`** workflow from the Replit workflow panel (or run manually):
```bash
pnpm --filter @workspace/royal-ambassadors run dev
```
- The **Replit preview pane** (bottom or side panel) will show the web version of the app automatically
- To view on a real device, install **Expo Go** from the App Store or Play Store and scan the QR code printed in the workflow logs

### 4. Start the API server (optional)
Run the **`artifacts/api-server: API Server`** workflow, or:
```bash
pnpm --filter @workspace/api-server run dev
```
The API server requires a `DATABASE_URL` environment variable (PostgreSQL). Without it the server will not start. Add it in **Replit Secrets** (`SESSION_SECRET` is already set).

---

## Known Replit Limitations

| Issue | Explanation |
|---|---|
| Preview doesn't open in iOS Safari | The Replit dev preview URL uses a secure internal proxy — open the project in the **Replit iOS app** or on a desktop browser instead |
| Preview URL changes between accounts | Each Replit account gets a unique dev domain — the old URL from another account will not work; always use the current preview pane |
| API server needs DATABASE_URL | Without a PostgreSQL connection string set in Replit Secrets, the API server workflow will fail — this is expected if you only need the mobile app |

---

## Tech Stack

### Mobile app (`artifacts/royal-ambassadors`)
- **Expo** ~54 / **expo-router** ~6 (file-based routing)
- **React Native** 0.81 / **React** 19
- **@react-native-async-storage/async-storage** 2.2 — offline persistence
- **expo-image** — manual page image rendering
- **expo-linear-gradient**, **expo-haptics**, **expo-blur**
- **@expo/vector-icons** (Feather, Ionicons, MaterialCommunityIcons)
- **@expo-google-fonts/inter** — Inter typeface
- **react-native-reanimated** ~4, **react-native-safe-area-context** ~5
- TypeScript 5.9

### API server (`artifacts/api-server`) — scaffolded, not yet connected
- **Express 5**, **Drizzle ORM**, **PostgreSQL**
- **pino** / **pino-http** for structured logging
- Bundled with **esbuild**; exposes `GET /api/healthz`
- Requires `DATABASE_URL` and `SESSION_SECRET` env vars

### Shared libraries (`lib/`)
- `lib/db` — Drizzle schema + migrations
- `lib/api-spec` — OpenAPI 3.1 spec (`openapi.yaml`) + **Orval** codegen config
- `lib/api-client-react` — generated React Query hooks (from Orval)
- `lib/api-zod` — generated Zod schemas (from Orval)

### Tooling
- **pnpm** workspaces (Node 24)
- **TypeScript** 5.9 (composite libs + `--noEmit` for apps)
- **Prettier** at the root

---

## Folder Structure

```
/
├── artifacts/
│   ├── royal-ambassadors/        # Expo mobile app
│   │   ├── app/
│   │   │   ├── _layout.tsx       # Root layout, AppProvider
│   │   │   └── (tabs)/
│   │   │       ├── _layout.tsx   # Tab bar
│   │   │       ├── index.tsx     # Home screen
│   │   │       ├── manual.tsx    # Manual reader (TOC + image viewer)
│   │   │       ├── ranks.tsx     # Rank progression screen
│   │   │       ├── quiz.tsx      # Bible quiz screen
│   │   │       └── profile.tsx   # Profile screen
│   │   ├── assets/manual/        # 46 scanned JPG pages (IMG_1411–IMG_1459)
│   │   ├── constants/colors.ts   # Brand colour palette
│   │   ├── context/AppContext.tsx # Global state + AsyncStorage
│   │   ├── data/
│   │   │   ├── manualPages.ts    # Static image requires + TOC with keywords
│   │   │   ├── ranks.ts          # All 10 official ranks from the RAN Manual
│   │   │   ├── quizzes.ts        # Quiz questions
│   │   │   └── verses.ts         # Daily memory verses
│   │   ├── hooks/useColors.ts    # Theme-aware colour hook
│   │   └── eas.json              # EAS Build config (APK / AAB profiles)
│   ├── api-server/               # Express 5 backend (scaffold, not yet wired)
│   │   └── src/
│   │       ├── app.ts            # Express app setup
│   │       └── routes/health.ts  # GET /api/healthz
│   └── mockup-sandbox/           # Vite dev server for UI component previews
├── lib/
│   ├── db/src/schema/            # Drizzle table definitions
│   ├── api-spec/openapi.yaml     # OpenAPI 3.1 contract
│   ├── api-client-react/         # Generated React Query hooks
│   └── api-zod/                  # Generated Zod validators
├── pnpm-workspace.yaml
└── package.json
```

---

## Building an APK (Android)

This project uses **EAS Build** — Expo's cloud build service. You need a free [expo.dev](https://expo.dev/signup) account.

```bash
# Install EAS CLI
npm install -g eas-cli

# Log in to your Expo account
eas login

# Navigate to the mobile app
cd artifacts/royal-ambassadors

# Build a debug APK (downloadable, no store needed)
eas build --platform android --profile preview

# Build a production AAB (for Google Play Store)
eas build --platform android --profile production
```

EAS builds in the cloud (~10–15 min) and gives you a download link for the `.apk`. Install it directly on any Android device without needing the Play Store.

> The first build will prompt you to create an Android keystore — let EAS manage it automatically.

---

## Official RA Ranks (from the manual)

| # | Rank | Age Group |
|---|------|-----------|
| 1 | Candidate (Prospect) | Any age — entry rank |
| 2 | Assistant Intern | 10 years old |
| 3 | Intern | 11 years old |
| 4 | Senior Intern | 12 years old |
| 5 | Envoy | 13 years old |
| 6 | Special Envoy | 14 years old |
| 7 | Senior Envoy | 15 years old |
| 8 | Dean | 16 years old |
| 9 | Ambassador | 17–19 years old |
| 10 | Ambassador Extraordinary | 20–22 years old |

Full requirements for each rank are in `artifacts/royal-ambassadors/data/ranks.ts`.

---

## Environment Variables

| Variable | Where | Required | Description |
|---|---|---|---|
| `DATABASE_URL` | Replit Secrets | API server only | PostgreSQL connection string |
| `SESSION_SECRET` | Replit Secrets | API server only | Secret for session signing (already set) |

The mobile app has **no required environment variables** — it runs fully offline.

---

## Key Commands

```bash
# Install all workspace dependencies (run this first after import)
pnpm install

# Typecheck everything
pnpm run typecheck

# Typecheck just the mobile app
pnpm --filter @workspace/royal-ambassadors run typecheck

# Regenerate API hooks and Zod schemas from the OpenAPI spec
pnpm --filter @workspace/api-spec run codegen

# Push DB schema changes to the database (dev only)
pnpm --filter @workspace/db run push
```

---

## Recent Activity

### July 2026
- **Project imported to Replit** — pnpm dependencies installed, Expo mobile app and API server workflows configured and verified running.
- **Ranks updated from the official manual** — All 10 official RA ranks now reflect the real requirements as printed in the RAN Manual (Candidate through Ambassador Extraordinary), replacing the placeholder rank data. Each rank includes the correct age group and full list of requirements.
- **APK build config added** — `eas.json` created with `preview` profile (downloadable `.apk`) and `production` profile (Play Store `.aab`).
- **README overhauled** — Added collaborator quick-start guide, known Replit limitations, and import instructions so any new collaborator can get up and running immediately.
- **Fixed Expo origin config** — Removed hardcoded `origin: https://replit.com/` from `app.json` that caused web preview routing to break when importing to a different Replit account.
