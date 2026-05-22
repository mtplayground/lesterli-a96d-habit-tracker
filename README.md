# Habit Tracker

A local-first habit tracker built with Vite, React, TypeScript, Tailwind CSS,
Zustand, date-fns, and Playwright. Habits and check-ins are stored in browser
`localStorage`, with JSON import/export for portability.

## Scripts

- `npm run dev` starts the Vite development server on `0.0.0.0:8080`.
- `npm run build` type-checks and builds the static app.
- `npm run test` runs unit and component tests.
- `npm run test:e2e` runs the Playwright happy-path and accessibility tests.
- `npm run preview` serves the production build on `0.0.0.0:8080`.

## Development

Install dependencies, then start the app:

```bash
npm install
npm run dev
```

## Production Build

Create the static production output:

```bash
npm run build
```

The build writes static files to `dist/`. The app does not require a backend;
serve the contents of `dist/` from any static file directory.

To verify the built files locally with a generic static server:

```bash
python3 -m http.server 4173 --directory dist
```

Then open `http://127.0.0.1:4173/`.

You can also use Vite's production preview server:

```bash
npm run preview
```

## Static Deploy

Deploy the contents of `dist/` as your static site root. Because the app uses
client-side routes such as `/habits/new` and `/habits/:id`, configure your
static host to fall back to `/index.html` for unknown paths.

Examples:

- Generic static server: serve `dist/` as the document root.
- Netlify: publish `dist/` and add `/* /index.html 200` as the SPA fallback.
- Vercel/static hosts: set the output directory to `dist/` and rewrite unknown
  routes to `/index.html`.

## Verification

Run the full local verification suite before deploying:

```bash
npm run format
npm run lint
npm test
npm run build
npm run test:e2e
```
