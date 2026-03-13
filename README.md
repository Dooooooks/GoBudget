# GoBudget

React + Vite budget app with Supabase Auth + Postgres.

## Prereqs

- Docker (recommended)
OR
- Node.js 20+

## Environment Variables

Create a `.env` in the project root (or copy from `.env.example`).

Required for the frontend:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

Required only if you want email for forgot-password (server endpoint):

- `PORT` (default `8787`)
- `SMTP_HOST`
- `SMTP_PORT`
- `SMTP_SECURE` (`true`/`false`)
- `SMTP_USER`
- `SMTP_PASS`
- `SMTP_FROM`

## Run With Docker (Recommended)

1) Create `.env`

2) Build the image:

```bash
docker build -t gobudget .
```

3) Run the container:

```bash
docker run --rm -p 8787:8787 --env-file .env gobudget
```

4) Open the app:

- http://localhost:8787
- Health check: http://localhost:8787/health

## Run Locally (No Docker)

Terminal 1 (frontend dev server):

```bash
npm install
npm run dev
```

Terminal 2 (API server for emails):

```bash
npm run dev:server
```

## Supabase Setup

This project expects a Supabase project with a `public.budgets` table and RLS.

- Schema file: `supabase/schema.sql`
- In Supabase dashboard: SQL Editor -> paste/run the schema

## Notes

- The container injects Supabase config at runtime via `/config.js` (set `VITE_SUPABASE_URL` + `VITE_SUPABASE_ANON_KEY` in `.env`).
- The production Docker image serves the built SPA from `dist/` and the API routes under `/api/*` from `server/index.js`.
