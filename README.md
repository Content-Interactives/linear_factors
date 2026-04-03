# Linear Factors Interactive

Vite + React SPA for visualizing and manipulating linear factors of functions.

**Live:** [https://content-interactives.github.io/linear_factors/](https://content-interactives.github.io/linear_factors/)

Curriculum alignment: [Standards.md](Standards.md).

## Stack

- React, Vite
- Tailwind CSS
- ESLint

## Setup

```bash
npm install
npm run dev
```

## Scripts

| Command | Description |
|--------|-------------|
| `npm run dev` | Dev server |
| `npm run build` | `vite build` → `dist/` |
| `npm run preview` | Preview production output |
| `npm run lint` | ESLint |
| `npm run deploy` | Build and push to GitHub Pages |

## Configuration

- `vite.config.js` — `base: '/linear_factors/'` for GitHub Pages.
- Entry and components: `src/`. Static assets: `public/`.
