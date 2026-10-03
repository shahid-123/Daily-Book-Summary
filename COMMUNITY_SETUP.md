# BookPulse Community + Personal Reading Setup

## What changed

- Anonymous reader profile: name, country, state/region and yearly reading target.
- Profile is created without a password/login.
- First full book reading requires a reader profile.
- Personal `My Reading` area shows completed books, progress, target, streak and next milestone.
- Completed books are synced to the server.
- Completion celebration motivates the reader and points them toward the next milestone.
- Public comments/likes remain shared with the whole community.
- Comments can display the reader's country/state.
- Local development uses `community-data.json` as a fallback.
- Production can use Supabase/Postgres so Vercel instances share one persistent dataset.
- Vite ignores `community-data.json` so a local visit/comment write cannot trigger an HMR reload loop.

## Local development

No Python virtual environment is required.

```cmd
set DISABLE_HMR=false
npm install --legacy-peer-deps
npm run dev
```

The Vite watcher ignores `community-data.json`, so normal HMR can remain enabled.

## Production persistence

The deployed Vercel application must have a persistent database. Do not rely on `community-data.json` in production.

1. Create a Supabase project.
2. Open the Supabase SQL Editor.
3. Run `readerSchema.sql`.
4. Add these server-side environment variables to the Vercel project:

```text
SUPABASE_URL=https://YOUR_PROJECT.supabase.co
SUPABASE_SERVICE_ROLE_KEY=YOUR_SERVICE_ROLE_KEY
```

Never expose `SUPABASE_SERVICE_ROLE_KEY` as a `VITE_` variable and never put it in browser code.

The app detects these variables server-side. If they are absent locally, it falls back to `community-data.json` so local development remains simple.

## Performance approach

The database is not queried on every React render.

- Reader profile is loaded once on app start.
- Community aggregate statistics are loaded when the Community section is opened.
- A book's community data is loaded when that book is opened.
- A completed book is synced once when the reader completes it.
- Likes/comments make a single targeted API request.
- Browser localStorage continues to provide instant UI state.

This keeps the main reading experience fast while making production community data persistent and shared.
