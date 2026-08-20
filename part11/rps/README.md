# Reaktor RPS (Rock‑Paper‑Scissors)

A small full‑stack demo that streams live match updates via SSE to a React frontend, stores history in Postgres, and keeps things responsive with a short in‑memory cache.

## Application screenshots

<details> <summary>Matches</summary>
<img width="2539" height="1393" alt="image" src="https://github.com/user-attachments/assets/50a310bd-0bf0-4b03-88b3-1ef9d5e25ca8" />
</details>

<details> <summary>Leaderboard</summary>
<img width="2541" height="1382" alt="image" src="https://github.com/user-attachments/assets/90365680-db66-4d4c-8457-24d9e21ebc67" />
</details>

## Tech stack
- **Backend:** Fastify + TypeORM (Postgres)
- **Frontend:** React + Vite + SSE client
- **DB:** PostgreSQL (docker volume persisted)
- **Realtime:** Server‑Sent Events (SSE)
- **Caching:** simple in‑process LRU-ish cache

## Key features
- ✅ **Live match feed (SSE)** from backend → clients
- ✅ **Historic match storage** (Postgres) with upserts
- ✅ **Cached queries** (per-day / per-player) to reduce load
- ✅ **Scheduled sync** pulls latest game history from legacy API
- ✅ **Self‑healing startup**: scheduler can hydrate DB without blocking

## Getting started
> Warning: Make sure you create a local `.env` from the example before running anything.
>
> Provide own valid LEGACY_API_TOKEN or add TEST=true in .env
```bash
cp .env.example .env
```

### Quick start (recommended)
From the repo root:

**build & start dev containers (docker-compose.dev.yml)**
> **Note:** This project requires Docker Compose v5+ (`docker compose`), as legacy `docker-compose` can fail during build.
```bash
make build
```

Then open the app at **http://localhost:8081** (nginx proxy).

### Common commands
- `make start`   — start dev containers (skips rebuild)
- `make down`    — stop & remove containers
- `make restart` — restart containers (down + start)
- `make logs`    — follow logs for all containers

### Docker Compose (alternative)

**dev mode (build + run)**
```bash
docker compose -f docker-compose.dev.yml up --build
```

## Localhost benchmark note
Result for finding matches 2 days ago (local run):
- **5.84 sec** — request without DB/cache (legacy API)
- **50-80 ms** — DB
- **17-25 ms** — cache

## Request + SSE flow (high level)
### Normal request flow (matches list)

```
Frontend
  ↓
Backend (/api/matches)
  ↓
Cache → return cached response (if available)
  ↓
  DB  → return DB response (if available)
  ↓
Legacy API
  ↓
DB (write)
  ↓
response → Frontend
```

### Live updates flow (SSE)

```
Legacy API (SSE)
  ↓
Backend SSE receiver
  ↓
MatchesService.saveMatches() → DB upsert
  ↓
SSE broadcast
  ↓
Frontend (SSE client)
```

## Repository Structure

<details>
<summary>Backend (Fastify) tree</summary>

```
.
├── Dockerfile
├── eslint.config.js
├── package.json
├── src
│   ├── app.ts
│   ├── config.ts
│   ├── main.ts
│   ├── modules
│   │   ├── health
│   │   │   ├── health.controller.ts
│   │   │   └── health.service.ts
│   │   ├── leaderboard
│   │   │   ├── decorators
│   │   │   │   └── leaderboard.decorator.ts
│   │   │   ├── dto
│   │   │   │   ├── leaderboard-query.dto.ts
│   │   │   │   └── leaderboard-res.dto.ts
│   │   │   ├── leaderboard.controller.ts
│   │   │   ├── leaderboard.module.ts
│   │   │   ├── leaderboard.service.ts
│   │   │   ├── leaderboardSse.service.ts
│   │   │   └── types
│   │   │       └── leaderboard.type.ts
│   │   └── matches
│   │       ├── decorators
│   │       │   └── matches.decorator.ts
│   │       ├── dto
│   │       │   ├── matches-query.dto.ts
│   │       │   └── matches-res.dto.ts
│   │       ├── matches.controller.ts
│   │       ├── matches.module.ts
│   │       ├── matches.service.ts
│   │       └── matchesSse.service.ts
│   ├── plugins
│   │   ├── db.plugin.ts
│   │   ├── scheduler.plugin.ts
│   │   └── services.plugin.ts
│   ├── repositories
│   │   └── matches.entity.ts
│   ├── services
│   │   ├── cache.service.ts
│   │   ├── legacy-api.service.ts
│   │   ├── sse-client.service.ts
│   │   └── sse-server.service.ts
│   ├── types
│   │   ├── legacy-api.type.ts
│   │   ├── matches.type.ts
│   │   └── sse.type.ts
│   └── utils
│       ├── dateSearch.ts
│       ├── defineWinner.ts
│       ├── parseData.ts
│       └── time.ts
├── tsconfig.json
└── yarn.lock
```
</details>

<details>
<summary>Frontend (React / Vite) tree</summary>

```
.
├── Dockerfile
├── eslint.config.js
├── index.html
├── package.json
├── public
│   └── vite.svg
├── src
│   ├── app
│   │   ├── App.module.css
│   │   └── App.tsx
│   ├── features
│   │   ├── ApiHealth
│   │   │   ├── components
│   │   │   │   └── ApiHealth
│   │   │   │       ├── ApiHealth.module.css
│   │   │   │       └── ApiHealth.tsx
│   │   │   └── services
│   │   │       └── health.service.ts
│   │   ├── Leaderboard
│   │   │   ├── components
│   │   │   │   ├── DateRangeForm
│   │   │   │   │   ├── DateRangeForm.module.css
│   │   │   │   │   └── DateRangeForm.tsx
│   │   │   │   └── Leaderboard
│   │   │   │       ├── Leaderboard.module.css
│   │   │   │       └── Leaderboard.tsx
│   │   │   ├── hooks
│   │   │   │   └── useLeaderboard.ts
│   │   │   ├── services
│   │   │   │   └── leaderboard.service.ts
│   │   │   └── types
│   │   │       └── leaderboard.type.ts
│   │   └── Matches
│   │       ├── components
│   │       │   ├── MatchRow
│   │       │   │   ├── MatchRow.module.css
│   │       │   │   └── MatchRow.tsx
│   │       │   ├── Matches
│   │       │   │   ├── Matches.module.css
│   │       │   │   └── Matches.tsx
│   │       │   └── MatchesFilterForm
│   │       │       ├── MatchesFilterForm.module.css
│   │       │       └── MatchesFilterForm.tsx
│   │       ├── hooks
│   │       │   └── useMatches.ts
│   │       ├── services
│   │       │   └── matches.service.ts
│   │       └── types
│   │           └── matches.type.ts
│   ├── main.tsx
│   └── shared
│       ├── hooks
│       │   └── useSse.ts
│       ├── services
│       │   └── api.ts
│       └── styles
│           ├── global.css
│           └── tokens.css
├── tsconfig.app.json
├── tsconfig.json
├── tsconfig.node.json
├── vite.config.ts
└── yarn.lock
```
</details>
