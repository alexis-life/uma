# uma

Personal planning tool for **Uma Musume: Pretty Derby** — trainee roster, support card library, and race/deck planning. Lives at [uma.alexischao.com](https://uma.alexischao.com), part of the alexischao.com family of subdomains (sharing `theme.css`).

## Data model — this site is different from my others

My other subdomains (map, threats, cysa, data, budget, anime) build a static JSON payload from Obsidian at deploy time. **This site does not.** My roster, card library, and agenda change every time I play, so they need to be editable directly in the browser — there is no backend, no database, and no sync step.

Everything lives in **`localStorage`**, under three keys:

- `uma.horses` — trainee roster: `{ id, name, aptitudes: { Sprint, Mile, Medium, Long, Dirt }, styleApt: { Nige, Senkou, Sashi, Oikomi } }`, grades `S`–`G`
- `uma.cards` — support card library: `{ id, name, type, rarity, level }`
- `uma.agenda` — task list: `{ id, text, done, horseId, created }`

State is held in React and written to `localStorage` on every change (see `src/lib/storage.js`). Nothing is ever sent to a server — it's all local to whatever browser you're using, which also means data does **not** sync across devices/browsers on its own.

### Resetting / clearing local data

- Clear a single collection from the browser console: `localStorage.removeItem('uma.horses')` (or `.cards` / `.agenda`), then reload.
- Clear everything the app stores: `localStorage.removeItem('uma.horses'); localStorage.removeItem('uma.cards'); localStorage.removeItem('uma.agenda');`
- Or open DevTools → Application → Local Storage → `https://uma.alexischao.com` and delete keys from there.
- There is no export/import or backup mechanism — back up manually (e.g. copy the JSON values out of DevTools) before clearing if you want to keep the data.

## Development

```bash
npm install
npm run dev
```

## Deploy

Deploys to GitHub Pages via `.github/workflows/deploy.yml` on every push to `main`, building with Vite and publishing `dist/`. The `public/CNAME` file points the custom domain at `uma.alexischao.com` — set that domain in the repo's Pages settings with DNS pointed at GitHub Pages.

Swap `public/favicon.ico` and `public/apple-touch-icon.png` for the real panda favicon before shipping — they're currently placeholders pulled from alexischao.com.
