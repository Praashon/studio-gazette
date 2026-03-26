# Studio Gazette

Studio Gazette is a premium editorial-style news app built with Next.js, Supabase, and RSS aggregation.
It ingests articles from curated RSS sources, stores them in Supabase, and serves a polished reading experience with categories, bookmarks, and feed management.

## What It Does

- Aggregates articles from multiple RSS feeds into a single news experience
- Renders a magazine-like homepage with hero, ticker, trending, and briefs sections
- Provides per-article pages with sanitized rich content and sharing tools
- Supports category browsing and bookmark persistence per browser session
- Allows users to validate and add RSS feeds from the UI
- Exposes an RSS output endpoint for aggregated content

## Tech Stack

- Next.js 16 (App Router)
- React 19 + TypeScript
- Supabase (Postgres + API)
- Tailwind CSS 4
- rss-parser for feed parsing
- sanitize-html for safe article rendering
- date-fns for date formatting

## Core Architecture

### Data flow

1. RSS sources are stored in the `rss_sources` table.
2. Ingestion fetches active feeds and upserts parsed items into `articles` (dedupe by `guid`).
3. Server components query Supabase for homepage, category, and article views.
4. Client features (bookmarks/feed manager) call Next.js API routes.

### Rendering model

- Home and key pages use ISR (`revalidate`) for freshness and speed.
- Ingestion is exposed via API and scheduled every 15 minutes on Vercel cron.

## Project Structure

```text
src/
	app/
		api/
			articles/      # fetch bookmarked article payloads by id
			bookmarks/     # add/remove bookmark records
			feeds/         # list/add/delete RSS sources
			rss/feed/      # generated public RSS feed
			rss/ingest/    # protected ingestion endpoint
		article/[slug]/  # article detail pages
		category/[slug]/ # category pages
		bookmarks/       # saved articles view
		feeds/           # feed management page
	components/
		articles/        # article cards, bookmark/share/progress widgets
		feeds/           # feed management client UI
		layout/          # navbar, footer, ticker, side modules
	lib/
		data/            # Supabase query helpers
		rss.ts           # ingestion logic
		sanitize.ts      # HTML/XML and input validation helpers
		supabase.ts      # anon + service-role client builders
```

## Local Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment

Create `.env.local` with:

```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
RSS_INGEST_SECRET=replace_with_a_strong_random_secret
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### 3. Initialize database

- Open Supabase SQL Editor
- Run `supabase-schema.sql`

This creates:

- `categories`
- `articles`
- `bookmarks`
- `rss_sources`
- RLS policies and indexes
- seed categories and starter feeds

### 4. Run the app

```bash
npm run dev
```

Open `http://localhost:3000`.

## Ingestion and Automation

### Trigger ingestion manually

```bash
curl -X POST http://localhost:3000/api/rss/ingest \
	-H "x-api-key: your_ingest_secret"
```

### Production schedule

`vercel.json` schedules ingestion every 15 minutes:

```json
{
  "crons": [{ "path": "/api/rss/ingest", "schedule": "*/15 * * * *" }]
}
```

The route accepts:

- `POST` with `x-api-key: RSS_INGEST_SECRET`
- `GET` with `Authorization: Bearer RSS_INGEST_SECRET` (Vercel cron style)

## API Overview

- `POST /api/articles`
  - input: `{ ids: string[] }`
  - returns: selected article records for bookmark rendering

- `POST /api/bookmarks`
  - input: `{ articleId, sessionId }`
  - writes bookmark row (idempotent on duplicates)

- `DELETE /api/bookmarks`
  - input: `{ articleId, sessionId }`
  - removes bookmark row

- `GET /api/feeds`
  - returns configured RSS sources

- `POST /api/feeds`
  - input: `{ feedUrl, name?, categoryId? }`
  - validates and inserts new RSS source

- `DELETE /api/feeds`
  - input: `{ feedId }`
  - removes RSS source

- `POST /api/feeds/validate`
  - input: `{ feedUrl }`
  - validates and previews feed metadata before adding

- `GET /api/rss/feed`
  - returns generated RSS XML from latest stored articles

## Scripts

- `npm run dev` - start dev server
- `npm run build` - production build
- `npm run start` - run production server
- `npm run lint` - run ESLint

## Security Notes

- Keep `SUPABASE_SERVICE_ROLE_KEY` server-only and never expose it to the browser.
- Protect `/api/rss/ingest` with a strong `RSS_INGEST_SECRET`.
- Rotate any leaked keys immediately.
- RSS article HTML is sanitized before rendering (`sanitize-html`).

## Deployment

- Deploy on Vercel (recommended)
- Set all required environment variables in the Vercel project
- Ensure cron is enabled for the ingestion path in `vercel.json`

## Troubleshooting

- Empty homepage:
  - Verify Supabase credentials
  - Confirm `articles` contains rows
  - Trigger `/api/rss/ingest` manually

- Feed validation fails:
  - Check URL is reachable and returns valid RSS/XML
  - Confirm URL uses `http` or `https`

- Bookmarks not persisting:
  - Confirm browser storage/session id is present
  - Verify `bookmarks` table and RLS policies from schema setup
