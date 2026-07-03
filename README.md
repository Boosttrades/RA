# Royal Ambassadors of Nigeria

An offline-first mobile app for the Royal Ambassadors of Nigeria (Nigerian Baptist Convention), built with Expo and React Native. Designed for boys aged 10–24 to study the RA manual, track rank progression, and take Bible quizzes.

---

## Recent Activity

### July 2026
- **Project imported to Replit** — pnpm dependencies installed, Expo mobile app and API server workflows configured and verified running.
- **Ranks updated from the official manual** — All 10 official RA ranks now reflect the real requirements as printed in the RAN Manual (Candidate through Ambassador Extraordinary), replacing the placeholder rank data. Each rank now includes the correct age group and full list of requirements.
- **APK build config added** — `eas.json` created with `preview` profile (produces a downloadable `.apk`) and `production` profile (produces an `.aab` for the Play Store). See the *Build an APK* section below.

---

## What it does

The app has five tabs:

| Tab | What it contains |
|---|---|
| **Home** | Greeting, current rank card, daily memory verse, "Continue Studying" shortcut |
| **Manual** | All 46 scanned pages of the real RAN Manual as a searchable, image-based reader with a clickable Table of Contents |
| **Ranks** | All 10 official RA ranks (Candidate → Ambassador Extraordinary) with age groups and full requirements pulled from the manual |
| **Quiz** | 10-question Bible/RA knowledge quiz with score tracking |
| **Profile** | Member name editor and stats, persisted with AsyncStorage |

All data is local — no login, no network calls from the app. The API server exists as a backend scaffold but is not yet connected to the mobile app.

---

## Tech stack

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

### API server (`artifacts/api-server`) — scaffolded
- **Express 5**, **Drizzle ORM**, **PostgreSQL**
- **pino** / **pino-http** for structured logging
- Bundled with **esbuild**; exposes `GET /api/healthz`
- Requires `DATABASE_URL` env var

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

## Folder structure

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
│   │   │   ├── ranks.ts          # Rank definitions and requirements (from manual)
│   │   │   ├── quizzes.ts        # Quiz questions
│   │   │   └── verses.ts         # Daily memory verses
│   │   ├── hooks/useColors.ts    # Theme-aware colour hook
│   │   └── eas.json              # EAS Build config (APK / AAB profiles)
│   ├── api-server/               # Express 5 backend (scaffold)
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

## Setup and run (on Replit)

Workflows are already configured. When you open this project on Replit:

1. **Install dependencies** (first time only):
   ```bash
   pnpm install
   ```

2. **Start the mobile app** — run the `artifacts/royal-ambassadors: expo` workflow, then:
   - **In browser**: the preview pane shows the web version automatically
   - **On device**: scan the QR code from the workflow logs with **Expo Go** (App Store / Play Store)

3. **Start the API server** — run the `artifacts/api-server: API Server` workflow
   - Health check: `GET /api/healthz`

**Environment variables required for the API server:**

| Variable | Description |
|---|---|
| `DATABASE_URL` | PostgreSQL connection string |
| `SESSION_SECRET` | Secret for session signing (already set in Replit Secrets) |

The mobile app has no required env vars — it runs fully offline.

---

## Build an APK (Android)

The project uses **EAS Build** (Expo's cloud build service). You need a free [Expo account](https://expo.dev/signup) and the EAS CLI.

```bash
# Install EAS CLI globally
npm install -g eas-cli

# Log in to your Expo account
eas login

# Inside the mobile app folder
cd artifacts/royal-ambassadors

# Build a debug APK (downloadable, no store required)
eas build --platform android --profile preview

# Build a production AAB (for Google Play Store)
eas build --platform android --profile production
```

After the build finishes, EAS will give you a download link for the `.apk` file. Install it directly on any Android device.

> **Note:** The first build will ask you to create or link an Android keystore — let EAS manage it automatically.

---

## Key commands

```bash
# Install all dependencies
pnpm install

# Typecheck everything
pnpm run typecheck

# Typecheck just the mobile app
pnpm --filter @workspace/royal-ambassadors run typecheck

# Regenerate API hooks and Zod schemas from the OpenAPI spec
pnpm --filter @workspace/api-spec run codegen

# Push DB schema changes (dev only)
pnpm --filter @workspace/db run push
```

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
