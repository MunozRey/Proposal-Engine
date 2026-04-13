# Proposal Engine

Commercial proposal generator (White-Label, Leads, and Combo) with real-time preview and PDF export.

## Stack

- React 19
- Vite 8
- html2canvas + jsPDF

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

App URL: `http://localhost:5173`

## Available Scripts

- `npm run dev`: start development server.
- `npm run build`: create production build.
- `npm run preview`: serve production build locally.
- `npm run lint`: run ESLint.
- `npm run test`: run tests with Vitest.
- `npm run format`: format code with Prettier.
- `npm run check`: run lint + test + build.

## Main Structure

- `src/App.jsx`: main application shell.
- `src/components`: sidebar editor tabs and UI components.
- `src/pages`: HTML page generators for preview/PDF.
- `src/state`: initial state and global reducer.
- `src/utils/exportPdf.js`: PDF export pipeline.
- `src/utils/storage.js`: local state persistence.

## Functional Flow

1. User edits client, content, pricing, and style in the left panel.
2. HTML pages are generated from `src/pages` for real-time preview.
3. On export, `exportPdf` renders pages and generates an A4 PDF.
4. State is persisted to `localStorage` using debounce.

## Languages (ES/EN)

- Global language switcher in the sidebar.
- Main editor controls are translated.
- Preview and PDF output texts are translated.
- Selected language is persisted in saved state.

## Quick Troubleshooting

- Build fails: run `npm run lint` and fix warnings/errors.
- Remote logos fail: verify domain or upload logo manually.
- PDF export fails: reduce visible pages and verify external images.
