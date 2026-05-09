# AGENTS.md

## Cursor Cloud specific instructions

This is a single-page React/TypeScript breathing meditation app built with Vite.

### Services

| Service | Command | Port |
|---------|---------|------|
| Vite Dev Server | `npm run dev -- --port 5174 --host` | 5174 |

### Key commands

- **Dev server**: `npm run dev` (Vite with HMR)
- **Type check / lint**: `npx tsc --noEmit` (no separate ESLint config; TypeScript strict mode is the linter)
- **Build**: `npm run build`
- **Preview production build**: `npm run preview`

### Notes

- Firebase is **optional**. The app degrades gracefully when `VITE_FIREBASE_*` env vars are not set (uses localStorage fallback). No `.env` file is needed to run locally.
- There is no dedicated test runner or ESLint configuration in this repo. TypeScript strict compilation (`npx tsc --noEmit`) is the primary code quality check.
- The `.claude/launch.json` specifies port 5174 for the dev server.
- Cloudflare Wrangler is included as a dependency for production deployment but is not needed for local dev.
