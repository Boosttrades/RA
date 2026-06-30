# Royal Ambassadors of Nigeria

An offline-first mobile app for the Royal Ambassadors of Nigeria (Nigerian Baptist Convention), built with Expo and React Native. Designed for boys aged 10–24 to study the RA manual, track rank progression, and take Bible quizzes.

---

## What it does

The app has five tabs:

| Tab | What it contains |
|---|---|
| **Home** | Greeting, current rank card, daily memory verse, "Continue Studying" shortcut |
| **Manual** | All 46 scanned pages of the real RAN Manual as a searchable, image-based reader with a clickable Table of Contents |
| **Ranks** | All official RA ranks (Candidate → Ambassador Plenipotentiary) with age groups and requirements pulled from the manual |
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
│   │   │   ├── ranks.ts          # Rank definitions and requirements
│   │   │   ├── quizzes.ts        # Quiz questions
│   │   │   └── verses.ts         # Daily memory verses
│   │   └── hooks/useColors.ts    # Theme-aware colour hook
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

## Setup and run

**Prerequisites:** Node 24, pnpm

```bash
# Install dependencies
pnpm install

# Start the mobile app (Expo)
pnpm --filter @workspace/royal-ambassadors run dev
# Scan the QR code with Expo Go (Android) or open in a browser

# Start the API server
pnpm --filter @workspace/api-server run dev
# Runs on port 8080 — health check: GET /api/healthz
```

**Environment variables required for the API server:**

| Variable | Description |
|---|---|
| `DATABASE_URL` | PostgreSQL connection string |
| `SESSION_SECRET` | Secret for session signing |

The mobile app has no required env vars — it runs fully offline.

---

## Key commands

```bash
# Typecheck everything
pnpm run typecheck

# Typecheck just the mobile app
pnpm --filter @workspace/royal-ambassadors run typecheck

# Regenerate API hooks and Zod schemas from the OpenAPI spec
pnpm --filter @workspace/api-spec run codegen

# Push DB schema changes (dev only)
pnpm --filter @workspace/db run push
```
