# Architecture

This document explains how Proposal Engine is wired internally and the
rationale behind its layering. Read this before refactoring core
modules.

## Bird's-eye view

```
┌─────────────────────────────────────────────────────────────┐
│                          state                              │
│  ─────                                                      │
│  src/state/initialState.js   shape + defaults               │
│  src/state/reducer.js        all mutations                  │
│  src/state/templateDefaults  per-locale starter content     │
│  src/utils/storage.js        localStorage debounced         │
│  src/utils/history.js        undo / redo wrapper            │
└────────────────────────────┬────────────────────────────────┘
                             │
            ┌────────────────┼───────────────────────┐
            ▼                ▼                       ▼
┌────────────────┐  ┌──────────────────┐   ┌───────────────────────────────┐
│  Preview (UI)  │  │ Page generators  │   │ Export pipelines              │
│  (React tree)  │  │  src/pages/*.js  │   │ src/utils/exportPdf.js        │
│   uses st      │  │  return HTML str │   │ src/utils/exportHtml.js       │
│   directly     │  │  consumed by all │   │ src/utils/exportDocx.js       │
└──────┬─────────┘  └────────┬─────────┘   │ + print stylesheet in App.css │
       │                     │             └───────────────────────────────┘
       └─── PageCard.jsx ◀───┘
             renders the HTML in a scaled iframe-less div
```

The **same HTML strings** are reused for both the on-screen preview
(`PageCard.jsx`) and the rasterised PDF export. This keeps "what you
see is what you ship" coherent and lets us pour design effort into a
single output.

## State layer

### Shape

`INIT` in `src/state/initialState.js` lists every editable key. The
shape is intentionally flat for most fields; only deeply nested
domain objects (`leads`, `contact`, `metrics[]`, `valueProps[]`,
`closeSteps[]`, `typo`) are grouped.

| Group           | Where                                                                                                             | Purpose                                             |
| --------------- | ----------------------------------------------------------------------------------------------------------------- | --------------------------------------------------- |
| Identity        | `clientName`, `clientLogoUrl`, `productTitle`, `coverBadge`, `coverLine1`, `coverLine3`, `date`, `proposalNumber` | Cover content                                       |
| Branding        | `brandNavy`, `brandBlue`, `brandAccent`, `fontDisplay`, `fontBody`, `fontMono`, `activeThemeId`                   | Theme overrides                                     |
| Pages WL        | `introText`, `setupFee`, `steps[]`, `featuresL[]`, `featuresR[]`, `plans[]`                                       | White-Label content                                 |
| Pages Leads     | `leads.*` (cplLeads/cpaTramos/hybrid…)                                                                            | Leads model content                                 |
| Pages new       | `whyIntro`, `metrics[]`, `valueProps[]`, `closeSteps[]`, `contact`, `validUntil`                                  | Why CreditCheck + Closing                           |
| Page visibility | `hiddenPages`                                                                                                     | Subset of generated pages excluded from preview/PDF |
| Footer          | `footerLeft`, `footerRight`, `footerCenter`                                                                       | Page chrome                                         |
| Typography      | `typo.{heading,subhead,body,small,tableBody,note,micro}`                                                          | Legacy font sizes (still consumed)                  |
| Locale          | `language`                                                                                                        | One of `en`, `es`, `pt`, `fr`, `de`, `it`           |
| Currency        | `currency`                                                                                                        | One of EUR/USD/GBP/BRL/MXN/CHF                      |

### Reducer pattern

`src/state/reducer.js` uses a tagged union of actions with abbreviated
keys (`{ t, k, v, i, f, side, arr, item }`). Each domain has its own
verbs:

- Generic: `SET`, `RESET`, `LOAD`, `LOCALIZE_TEMPLATE`, `LOAD_THEME`,
  `PATCH`, `TOGGLE_PAGE`.
- White-Label: `STEP*`, `FEAT*`, `PLAN`.
- Leads: `LEADS_SET`, `LEADS_ARR_*`, `LEADS_STR_*`.
- Why CreditCheck / Close: `METRIC*`, `VALUEPROP*`, `CLOSESTEP*`,
  `CONTACT`.
- Style: `TYPO`.

Adding a new array of objects? Mirror the `METRIC*` triplet
(`METRIC`, `METRIC_ADD`, `METRIC_DEL`).

### Persistence

`src/utils/storage.js` debounces `localStorage` writes by 500ms.
`src/utils/history.js` wraps the reducer to provide
batching-friendly undo/redo (600ms window, 40-step ring buffer). Both
modules are tested via `src/state/reducer.test.js` and the pre-existing
suite.

## Design tokens

`src/design/tokens.js` is the single source of truth for visual values.
Both the editor chrome (`src/components/editor/editor.css`) and the
page generators consume the same palette / typography.

`tokens(st)` resolves the official creditchecker.io defaults
unless `st` overrides them. Theme presets in `src/design/themes.js`
(`creditcheck`, `corporate`, `mint`, `bold`) write to `st.brandNavy`,
`st.brandBlue`, `st.brandAccent`, `st.fontDisplay`, `st.fontBody`,
`st.fontMono`, `st.activeThemeId` via the `LOAD_THEME` action.

## Page generators

Each `src/pages/gen*.js` exports a single function `(st, pageNum?) => string`
returning self-contained HTML for a 595×842 page. They share helpers
in `src/utils/pageHelpers.js` (header, footer, eyebrow, title, lead,
pill, bullet, stepCard, featureGrid, featureBox, calcBox, table,
metric, notes).

| Generator             | Role                                                    |
| --------------------- | ------------------------------------------------------- |
| `genPage1.js`         | Cover (deep navy gradient, serif title, validity strip) |
| `genWhyCC.js`         | "Why CreditCheck" hero metrics + value props            |
| `genPage2.js`         | How It Works (3 step cards + feature grid)              |
| `genPage3.js`         | Pricing (setup card + 4 plans + footnote)               |
| `genLeadsOverview.js` | 3-model comparison cards (CPL/CPA/Hybrid accents)       |
| `genLeadsCPL.js`      | CPL model (blue accent)                                 |
| `genLeadsCPA.js`      | CPA model (mint accent)                                 |
| `genLeadsHybrid.js`   | Hybrid model (violet accent)                            |
| `genClose.js`         | Next steps timeline + contact + validity + CTA          |

`App.jsx` composes the active set per `proposalType` (`wl`, `leads`,
`combo`) and respects `hiddenPages` for visibility toggles.

## Export pipelines

`src/utils/exportPdf.js` rasterises each page at **4x scale** and
emits PNG into a jsPDF document.

Why raster (still): a vectorial pipeline (jsPDF text/SVG primitives) is
the long-term plan because text becomes selectable and file sizes
shrink. The current raster path was upgraded to:

- `scale: 4` (was 2) — text crisp at print sizes.
- `image/png` (was JPEG q=0.93) — no chroma blocking.
- `useCORS: true` — improves logo loading.
- Pre-resize raster logos > 600px before embedding.
- `await document.fonts.ready` + per-page font flush before each
  capture (so Inter / IBM Plex Sans / serif Larken-fallbacks actually
  render).

Additional export modules:

- `src/utils/exportHtml.js`: creates a self-contained HTML file that mirrors preview pages and includes print-ready CSS.
- `src/utils/exportDocx.js`: generates a DOCX file with proposal sections extracted from page content.
- `src/App.css` `@media print`: provides print pagination and A4 output behavior.

## Editor shell

`src/components/editor/EditorShell.jsx` is the rebuilt left panel:

- Top bar: brand + save indicator + undo/redo + shortcuts gear +
  collapse.
- Search/command launcher (`src/components/editor/CommandPalette.jsx`,
  `Ctrl+K`).
- Segmented selector (White-Label / Leads / Combo).
- Tab nav with section icons (`src/design/icons.js`) and per-tab
  completion dots.
- Body: existing `*Tab.jsx` components (will progressively migrate to
  the new `Field*` primitives in `src/components/editor/Field.jsx`).
- Bottom bar: completion meter + zoom + export gradient + reset.

Keyboard shortcuts are routed through `src/hooks/useShortcuts.js`
which understands `mod`, `shift`, `alt` and Mac/Windows differences.

## i18n

`src/i18n/translate.js` exposes `t(lang, key, vars, opts)`,
`pluralize`, `withLang`, `detectBrowserLang`, plus locale metadata
(`listLocales`, `localeMeta`).

Locale files live in `src/i18n/locales/{en,es,pt,fr,de,it}.js` and
the legacy `src/i18n/translations.js` is now a back-compat shim that
re-exports them.

`src/i18n/format.js` provides Intl-backed `formatCurrency`,
`formatNumber`, `formatPercent`, `formatDate*`. CI guards locale
parity via `src/i18n/coverage.test.js`.

See [`docs/I18N.md`](./I18N.md) for how to add a language.

## Verification

- `npm run lint` — ESLint, react-hooks, no warnings allowed in CI.
- `npm test` — vitest unit suite.
- `npm run check` — lint + test + build.
- Manual: open `http://localhost:3131`, switch proposal types,
  language, theme; click Export PDF, inspect the file.

## Decisions worth remembering

1. **Same HTML for preview and PDF**: cuts the maintenance cost of
   keeping both in sync, at the price of a one-time vectorial rewrite
   later.
2. **Tokens centralised, brand exposed in state**: themes can ship as
   patch objects; per-proposal overrides are still possible.
3. **Locales loaded via a single index module**: no dynamic imports
   today (small payload); easy to swap later if the locale count
   explodes.
4. **Generators return strings, not React trees**: html2canvas needs
   real DOM, and string templates are trivially rendered to either an
   off-screen `<div>` for PDF capture or via
   `dangerouslySetInnerHTML` in `PageCard`.
