# uma

Personal planning tool for **Uma Musume: Pretty Derby** — trainee roster, support card library, and race/deck planning. Lives at [uma.alexischao.com](https://uma.alexischao.com), part of the alexischao.com family of subdomains (sharing `theme.css`).

## Data model — this site is different from my others

My other subdomains (map, threats, cysa, data, budget, anime) build a static JSON payload from Obsidian at deploy time. **This site does not.** My roster, card library, and agenda change every time I play, so they need to be editable — but unlike a first pass at this app, it's not just per-browser `localStorage` either. It's backed by **Supabase** (the same project used by my cysa+ study tracker, in separate `uma_`-prefixed tables) so the same data follows me across devices, gated behind a single login.

Tables (see `supabase/schema.sql` for the full DDL + RLS policies):

- `uma_horses` — trainee roster: `id, name, talent_rank (1-5), aptitudes jsonb ({ Sprint, Mile, Medium, Long, Dirt }), style_apt jsonb ({ Nige, Senkou, Sashi, Oikomi })`, grades `S`–`G`
- `uma_cards` — support card library: `id, name, type, rarity, level`
- `uma_agenda` — task list: `id, text, done, horse_id, created_at`

Row Level Security is on for all three tables; the only policy is "any authenticated session gets full read/write access" — this is a single-user app, so there's exactly one login (created by hand in the Supabase dashboard, Authentication → Users), not per-row ownership.

The app reads/writes via `@supabase/supabase-js` (see `src/lib/useSupabaseTable.js`) instead of `localStorage` — every write is diffed against the last-synced snapshot and pushed to Supabase in the background, while the UI updates immediately.

### Environment variables

Two are required, both public-safe (the anon/publishable key, not the `service_role` key):

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

Locally, put them in `.env.local` (gitignored). In CI, they're GitHub Actions repo secrets of the same names, injected at build time in `.github/workflows/deploy.yml`.

### Resetting data

There's no in-app export/import — use the Supabase Table Editor (or SQL Editor) directly on `uma_horses` / `uma_cards` / `uma_agenda` to inspect, back up, or clear rows.

## Development

```bash
npm install
npm run dev
```

Requires `.env.local` with `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` set (see above) — the dev server won't be able to load or save data without them.

## Deploy

Deploys to GitHub Pages via `.github/workflows/deploy.yml` on every push to `main`, building with Vite and publishing `dist/`. The `public/CNAME` file points the custom domain at `uma.alexischao.com` — set that domain in the repo's Pages settings with DNS pointed at GitHub Pages.

Swap `public/favicon.ico` and `public/apple-touch-icon.png` for the real panda favicon before shipping — they're currently placeholders pulled from alexischao.com.
