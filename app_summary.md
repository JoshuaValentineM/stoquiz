Nice — this is a great idea. I’ll turn it into a concrete Product Requirements Document (PRD) + architecture, tech stack, DB schema, API surface, implementation notes (code snippets), PWA + Docker + CI/CD instructions, and deployment recommendations (Netlify / Render / Neon). I’ll also call out trade-offs (cost, rate limits, complexity) and a prioritized roadmap (MVP → v1 → stretch).

I’ll assume you want a monorepo with Node.js/Express backend, PostgreSQL (Neon), and a single-page frontend (TypeScript + React), served as a PWA and deployable to Netlify (frontend) and Render (backend) — that matches your preferences. I’ll also recommend realistic historical-data providers and note their free-tier limits so you don’t accidentally pick one that blocks you during development or a demo. (Short citations after the most important claims.)

---

# Product Requirements (PRD)

## Goal

Create a lightweight, installable PWA quiz-game that tests users on **fundamental** and **technical** stock analysis using **real historical** market data and candlestick charts from past real cases.

## Users & Audience

* Retail traders & students who want to practice reading fundamentals and chart patterns.
* Casual players who want to learn stock reasoning via gamified quizzes.

## Core MVP features

1. Sign-in (optional): local username or anonymous.
2. Quiz types:

   * Fundamental quiz: show snapshot of fundamentals (PE, EPS, revenue growth, margins, debt/EBITDA etc.) and ask: **Up** / **Down** (next N days or next 30 days).
   * Technical quiz: show **candlestick chart** of a historical slice (e.g., 30–90 days), ask: **Up** / **Down** after the last candle (next N days).
3. Scoring: immediate feedback, streaks, leaderboards (optional).
4. Real historical data sources — download historical OHLCV and fundamentals from data providers.
5. PWA installable, responsive UI for mobile and desktop.
6. Admin tooling to seed quizzes from historical events.

## Success metrics

* Engagement: avg session length, daily active users
* Learning: quiz accuracy over time
* Retention: installs, return rate

---

# Top-level Architecture (recommended)

Monorepo

```
/repo
  /frontend   -> React + TypeScript + Vite (PWA)
  /backend    -> Node.js + Express + TypeScript
  /db         -> SQL migrations
  /infra      -> Docker, github actions, k8s / render manifests (optional)
```

Components:

* Frontend (React SPA, PWA): UI, local caching, Service Worker, offline support for game assets.
* Backend (Express): Auth, quiz generation, cached data retrieval, rate-limited proxy to market-data API, DB access.
* PostgreSQL (Neon): store users, quizzes, leaderboard, and cached historical data / tokens.
* Worker (optional): background job to fetch and cache historical data and compute patterns.
* CDN & hosting: Netlify for frontend; Render for backend (or single hosted on Render if you prefer full-stack on one host). Neon for Postgres.

---

# Data sources (real historical data)

**Recommendation & tradeoffs**

* For *fundamentals* (company financials): Finnhub offers fundamentals/free tier; Alpha Vantage also supplies company fundamentals but its free tier is very constrained (25 requests/day). ([Finnhub][1])
* For *historical OHLCV & candlestick charts*: Polygon.io, Finnhub, and Yahoo Finance (download) are common. Polygon offers robust historical data, but free tier rate limits exist; Finnhub is developer friendly too. If you need large historic coverage, consider a paid plan. ([Medium][2])

Practical approach:

1. During development: use free providers like **Finnhub** or **Alpha Vantage** for prototyping but cache aggressively (server-side) to avoid hitting limits. Alpha Vantage is limited on free tier (25/day). ([Alpha Vantage][3])
2. For production demo / wider usage: use **Polygon** or paid Finnhub plan, or pre-download & store historical datasets (CSV) into Neon so your app serves from your DB (recommended for a quiz game — deterministic & stable).
3. Option: scrape/download historical data from Yahoo Finance for batch import (for past cases) and store in your DB. (Yahoo data is not an official API; treat accordingly.)

---

# Important rate-limit citations

* Alpha Vantage free tier: limited (25 requests/day typical; also docs show per-minute guidance). Use only for prototyping. ([Alpha Vantage][4])
* Finnhub: has generous developer free tier & historical data, but you still need to check rate limits on their docs. ([Finnhub][5])
* Polygon.io: good historical data (free starter), check their free-call limits. ([Medium][2])

---

# Tech stack (detailed)

* Monorepo: pnpm / Yarn workspaces
* Frontend:

  * React + TypeScript
  * Vite
  * Charting: lightweight charting capable of candlestick charts (e.g., lightweight-charts by TradingView, or Chart.js with financial plugin). (choose one; TradingView lightweight-charts is great for candlesticks)
  * PWA: manifest + service worker (workbox or manual)
* Backend:

  * Node.js + Express + TypeScript
  * ORM: Prisma (TypeScript-first) or Knex/pg. I recommend **Prisma** for developer velocity.
  * Caching: Redis (optional) or Postgres caching table / in-memory cache for small traffic.
  * API clients: small adapters for Finnhub/AlphaVantage/Polygon.
* Database: PostgreSQL (Neon recommended for serverless Postgres) — supports branching & scale-to-zero. ([Neon][6])
* Containerization: Docker & docker-compose for local dev.
* CI/CD: GitHub Actions to run tests, build & push. Auto-deploy to Netlify (frontend) + Render (backend) or Render fullstack.
* Hosting:

  * Frontend: Netlify (excellent PWA + static site + Netlify functions if needed). ([Netlify][7])
  * Backend: Render (free plan supports Node.js services) — easy connect to Neon. ([Render][8])
  * Database: Neon serverless Postgres (free tier exists). ([Neon][6])

---

# Data model (simplified)

SQL-ish schema (Postgres). Use migrations (Prisma schema or SQL).

```sql
-- users
CREATE TABLE users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  username text UNIQUE,
  password_hash text, -- if using local auth
  created_at timestamptz DEFAULT now()
);

-- stocks (cached info)
CREATE TABLE stocks (
  symbol text PRIMARY KEY,
  name text,
  exchange text,
  last_fetched timestamptz
);

-- historical_ohlcv
CREATE TABLE ohlcv (
  id bigserial PRIMARY KEY,
  symbol text REFERENCES stocks(symbol),
  dt date,
  open numeric,
  high numeric,
  low numeric,
  close numeric,
  volume bigint,
  timeframe text, -- '1d', '1h', etc.
  UNIQUE(symbol, dt, timeframe)
);

-- fundamentals snapshot
CREATE TABLE fundamentals (
  id bigserial PRIMARY KEY,
  symbol text REFERENCES stocks(symbol),
  report_date date,
  field jsonb,
  created_at timestamptz DEFAULT now()
);

-- quizzes
CREATE TABLE quizzes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  type text NOT NULL, -- 'technical'|'fundamental'
  symbol text,
  payload jsonb, -- details shown to player (precomputed)
  correct_answer text,
  created_at timestamptz DEFAULT now()
);

-- user_scores
CREATE TABLE user_scores (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id),
  quiz_id uuid REFERENCES quizzes(id),
  answer text,
  correct boolean,
  created_at timestamptz DEFAULT now()
);
```

---

# API design (essential endpoints)

```
POST /api/auth/signup {username,password}
POST /api/auth/login {username,password}
GET  /api/quiz?type=technical|fundamental  -> returns a quiz payload
POST /api/quiz/:id/answer {answer: "up"|"down"} -> returns correctness and explanation
GET  /api/leaderboard
GET  /api/stocks/:symbol/ohlcv?from=...&to=...&tf=1d
```

Key backend responsibilities:

* Generate quizzes from **real** historical data (server uses historical OHLCV & fundamentals).
* Protect API keys for external providers; backend acts as proxy + cache.
* Admin endpoints to seed quizzes from chosen historical events.

---

# Quiz generation logic (high-level)

* **Fundamental quiz**:

  * Select a company & snapshot date `D` where fundamentals exist.
  * Choose a prediction horizon H (e.g., 30 calendar days).
  * Compute ground truth by checking price movement from `D` close to `D+H` close (or percent change threshold).
  * Store payload: fundamentals (P/E, EPS growth, revenue YoY, debt/equity, free float, sector), snapshot date, horizon, and correct answer.

* **Technical quiz**:

  * Select a historical interval `[T0..Tn]` (sliding windows).
  * Show candlestick chart for `[T0..Tn]`. Define the prediction horizon as next H days and compute ground truth from actual historic data.
  * Optionally, tag with pattern type (hammer, head & shoulders) using a pattern detection routine (either heuristic or ML).

**Important:** Always use past data to compute ground truth (i.e., you’re showing a historical window and asking what happened next — this ensures the data is real & reproducible).

---

# Sample backend code (Express + TypeScript snippet)

*(illustrative — adapt to your project)*

```ts
// GET /api/quiz?type=technical
app.get('/api/quiz', async (req, res) => {
  const type = req.query.type === 'fundamental' ? 'fundamental' : 'technical';
  if (type === 'technical') {
    // pick random symbol and window from DB
    const row = await db.query(`SELECT symbol FROM stocks ORDER BY random() LIMIT 1`);
    const symbol = row.rows[0].symbol;
    // choose random end date where we have H days after it
    // fetch OHLCV for window, build payload, compute answer
    const ohlcv = await db.query(`SELECT dt, open, high, low, close FROM ohlcv WHERE symbol=$1 ORDER BY dt DESC LIMIT 90`, [symbol]);
    // prepare payload and compute ground truth offline
    res.json({ id: quizId, type: 'technical', payload: { symbol, candles: ohlcv.rows }, horizonDays: 10 });
  } else {
    // fundamental generation
  }
});
```

---

# Frontend: UX / UI notes

* Splash / landing explaining rules.
* Two prominent buttons: "Fundamentals" and "Technical".
* Quiz screen:

  * Top: symbol, date snapshot, time horizon.
  * Middle: fundamentals table OR candlestick chart (TradingView lightweight-charts).
  * Bottom: two large action buttons: UP / DOWN.
  * Right after answer: show the actual outcome (chart or percent change) plus explanation (e.g., "Revenue +40% Y/Y; price rose 12% in 30 days").
* Provide "Explain" button showing why answer correct — derive explanation from metrics (e.g., if correct `close(D+H)/close(D)` > threshold -> "price rose X%").

---

# PWA config (manifest + service worker basics)

`manifest.webmanifest`:

```json
{
  "name": "Market Quiz",
  "short_name": "MK Quiz",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#0f172a",
  "theme_color": "#0ea5e9",
  "icons": [
    { "src": "/icons/icon-192.png", "sizes": "192x192", "type": "image/png" },
    { "src": "/icons/icon-512.png", "sizes": "512x512", "type": "image/png" }
  ]
}
```

Service worker (simple caching example using Workbox recommended; manual example below):

```js
self.addEventListener('install', (e) => {
  e.waitUntil(caches.open('static-v1').then(c => c.addAll(['/','/index.html','/build/main.js','/icons/icon-192.png'])));
});
self.addEventListener('fetch', (e) => {
  e.respondWith(caches.match(e.request).then(r => r || fetch(e.request)));
});
```

---

# Docker + local dev

`Dockerfile` (backend):

```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --production
COPY . .
ENV NODE_ENV=production
CMD ["node", "dist/index.js"]
```

`docker-compose.yml`:

```yaml
version: '3.8'
services:
  db:
    image: postgres:15
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
      POSTGRES_DB: marketquiz
    ports: ['5432:5432']
  backend:
    build: ./backend
    depends_on: ['db']
    environment:
      DATABASE_URL: postgres://postgres:postgres@db:5432/marketquiz
    ports: ['4000:4000']
  frontend:
    build: ./frontend
    ports: ['5173:5173']
```

---

# Deployment & hosting (recommended flow)

Option A (recommended for your preferences):

* Frontend: **Netlify** (deploy from GitHub repo; supports PWA static hosting). ([Netlify][7])
* Backend: **Render** (host Node.js service; easy connect to Neon). ([Render][8])
* Database: **Neon** serverless Postgres (free tier) — connect DB URL to Render and Netlify functions if needed. ([Neon][6])

Why: Netlify is great for static PWAs; Render provides an easy-to-use free Node host and automatic deploys. Neon is a modern serverless Postgres with a developer-friendly free tier.

Deployment steps (high-level):

1. Create Neon DB; copy `DATABASE_URL`.
2. Push monorepo to GitHub.
3. On Render, create new Web Service, link repo, set `DATABASE_URL` env var to Neon connection. Configure Node build & start commands.
4. On Netlify, connect frontend folder, set build command (e.g., `pnpm --filter frontend build`), publish directory `frontend/dist`, set env vars (e.g., `REACT_APP_API_URL = https://your-render-service.onrender.com`).
5. Optionally, use Netlify Functions for light backend needs and to talk to Neon directly (Neon docs show Netlify functions example). ([Neon][9])

Alternative: Deploy the entire stack on **Render** (both frontend as static site + backend) if you prefer one host. Or use **Vercel** for frontend and API Routes (but you asked for Netlify and Render).

---

# CI/CD (GitHub Actions)

* Run `pnpm -w test` on PRs
* On push to `main`, build frontend and backend; deploy to Netlify (Netlify GitHub App auto-deploys) and Render (auto-deploys from repo). Optionally set up action to run DB migrations against Neon.

---

# Security & Compliance

* Never expose data provider API keys in frontend. Store in backend/environment variables or Netlify/Render env settings.
* Rate-limiting: implement server-side caching and rate limiting on API endpoints (express-rate-limit).
* CORS: allow only your frontend origin.
* User data: If storing passwords, use bcrypt + salted hashing. Consider OAuth if you want social login.

---

# Cost & scaling notes

* Free dev use: Netlify + Render + Neon free tiers are often sufficient for low-traffic demos. Long-term use for many users may require paid plans or optimizing to serve most assets from your own DB (reduce external API calls).
* APIs: Alpha Vantage free tier is tiny (25 requests/day) — not viable for heavy demo use; Finnhub/Polygon have more suitable free tiers but watch limits. ([Alpha Vantage][3])
* Recommendation: Preimport a curated dataset of ~1000 quiz-worthy historical windows (both fundamentals and technical) into your DB. This reduces external API dependency and makes the game stable & reproducible.

---

# MVP backlog (prioritized)

1. Basic frontend UI + local quiz flow (no auth).
2. Backend endpoints; local DB with pre-imported dataset of 200 quizzes (both types).
3. Candlestick rendering (TradingView lightweight-charts).
4. PWA + manifest + service worker.
5. Deployment: Netlify static + Render backend + Neon DB.
6. Admin UI to add quizzes from CSV (seed).
7. Leaderboard + basic user accounts.

Stretch:

* Pattern detection (auto-label patterns in technical quizzes).
* Social sharing of scores.
* Daily challenge & tournaments.
* In-app purchases / premium dataset.

---

# Example project plan + timeline (rough milestones)

* Week 0: repo scaffolding, monorepo setup (pnpm + workspaces), basic UI wireframes.
* Week 1–2: backend + DB schema + seed import scripts (50 sample quizzes).
* Week 3: frontend quiz UI + candlestick charts + PWA basics.
* Week 4: deploy MVP to Netlify/Render/Neon and manual QA.
* Week 5: polish UX, add scoring, analytics, and admin import tool.