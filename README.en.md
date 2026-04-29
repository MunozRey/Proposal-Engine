# Proposal Engine

Internal SaaS for the **CreditCheck** team to author commercial proposals
(White-Label, Leads — CPL/CPA/Hybrid — and Combo) with a real-time preview
and a one-click PDF export. Aligned with the [creditchecker.io](https://creditchecker.io)
brand.

## Stack

- React 19 + Vite 8
- IBM Plex Sans / Larken (with IBM Plex Serif fallback) via Google Fonts
- jsPDF + html2canvas (4x raster PDF pipeline)
- Vitest (unit), ESLint, Prettier, Husky + lint-staged
- Internationalisation: EN · ES · PT · FR · DE · IT

## Requirements

- Node.js 22+
- npm 10+

## Installation

```bash
npm install
```

## Development

```bash
npm run dev
```

App URL: `http://localhost:3131` (port from `.claude/launch.json`).

## Available scripts

- `npm run dev` — start the dev server
- `npm run build` — production bundle into `dist/`
- `npm run preview` — serve the production bundle locally
- `npm run lint` — run ESLint
- `npm test` — run the vitest unit suite
- `npm run format` — Prettier write
- `npm run format:check` — Prettier check
- `npm run check` — `lint` + `test` + `build`

## Main structure

- `src/App.jsx` — application shell.
- `src/components/editor/` — new editor primitives (TopBar, Card,
  Field\*, CommandPalette, ShortcutsHelp, …).
- `src/components/*Tab.jsx` — section editors (Client, Content,
  Pricing, Leads, Style, File).
- `src/pages/gen*.js` — HTML page generators consumed by both the
  preview and the PDF export.
- `src/state/` — reducer, initial state, per-locale template defaults.
- `src/utils/exportPdf.js` — PDF export pipeline (raster @ 4x).
- `src/utils/storage.js` — debounced localStorage persistence.
- `src/i18n/locales/{en,es,pt,fr,de,it}.js` — translation files.
- `src/design/` — tokens, themes and inline icon library.

## Functional flow

1. The user edits Client / Content / Pricing / Style in the left panel.
2. The page generators emit HTML for the live preview.
3. On export, `exportPdf.js` rasterises each page at 4x and emits an
   A4 PDF (PNG-backed, locale suffix in filename).
4. State is persisted to `localStorage` via debounced autosave.

## Languages

- Six locales out of the box (EN, ES, PT, FR, DE, IT). EN is the
  source-of-truth; the others mirror its key shape.
- Selector compact in the editor; per-language keys in
  `src/i18n/locales/`. CI guards parity.
- Locale-aware currency / number / date formatting in
  `src/i18n/format.js`.

## Quick troubleshooting

- Build fails: run `npm run lint` and fix warnings/errors.
- Remote logos fail: verify the domain or upload the logo manually.
- PDF export quality: keep visible pages reasonable; the 4x raster
  yields ~1–2 MB per A4 page at typical content density.

See [`docs/`](./docs/) for the full architecture, design system,
i18n guide, contributing rules and deployment runbook.
