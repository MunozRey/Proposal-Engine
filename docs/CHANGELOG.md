# Changelog

All notable changes to Proposal Engine are tracked here.
Format: [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).
Versioning: project is internal; we tag releases when there is a
visible behaviour change worth communicating to the team.

## [Unreleased] — Major redesign

### Added

- **Design tokens** in `src/design/tokens.js` — single source of truth
  for palette, typography, spacing, radii, shadows. Resolves runtime
  overrides from state.
- **Theme presets** in `src/design/themes.js` — `creditcheck`
  (official, default), `corporate`, `mint`, `bold`. Apply via the
  `LOAD_THEME` reducer action.
- **Iconography** — Lucide-aligned inline SVG library
  (`src/design/icons.js`).
- **Field validators** — `src/utils/validators.js` (URL, email, hex,
  number, integer, required, max length, combine).
- **Six locales** — `en` (source), `es`, `pt`, `fr`, `de`, `it`. Each
  in `src/i18n/locales/<code>.js`. CI guards parity via
  `src/i18n/coverage.test.js`.
- **i18n upgrades** — interpolation `{placeholder}`, fallback chain,
  `Intl.PluralRules`, `withLang`, `detectBrowserLang`, `normalizeLang`,
  `listLocales`, `localeMeta`.
- **Locale-aware formatters** — `formatCurrency` (EUR/USD/GBP/BRL/MXN/CHF),
  `formatNumber`, `formatPercent`, `formatDate*`.
- **New editor shell** — `src/components/editor/EditorShell.jsx` with
  brand top bar, command-palette launcher, segmented proposal-type
  selector, tab nav with completion dots, completion meter and
  gradient export button.
- **Command palette** — `Ctrl+K` (`src/components/editor/CommandPalette.jsx`).
- **Keyboard shortcuts overlay** — `Ctrl+/`
  (`src/components/editor/ShortcutsHelp.jsx`).
- **Additional export formats**:
  - `src/utils/exportHtml.js` for self-contained HTML exports.
  - `src/utils/exportDocx.js` for DOCX exports.
  - Print flow via browser print dialog (`Ctrl+P`) and `@media print`.
- **Editor primitives** — `Card`, `SectionHeader`, `IconButton`,
  `SaveIndicator`, `CompletionMeter`, plus `Field*` components
  (`FieldText`, `FieldNumber`, `FieldUrl`, `FieldEmail`, `FieldColor`,
  `FieldImage`, `FieldSelect`, `FieldRow`).
- **Centralised keyboard shortcuts** — `src/hooks/useShortcuts.js`,
  with `mod` / `shift` / `alt` and Mac/Windows-aware key formatting.
- **New PDF pages**:
  - `genWhyCC.js` — "Why CreditCheck" hero metrics + value props.
  - `genClose.js` — Next steps timeline + contact card + validity strip
    - CTA button (mailto link) + signature placeholders.
- **State extensions** for the new pages: `metrics`, `valueProps`,
  `closeSteps`, `contact`, `validUntil`, `proposalNumber`, `currency`,
  `whyIntro`, `brandAccent`, `fontDisplay`, `fontBody`, `fontMono`,
  `activeThemeId`, `footerCenter`.
- **Reducer verbs**: `LOAD_THEME`, `PATCH`, `CONTACT`, `METRIC*`,
  `VALUEPROP*`, `CLOSESTEP*`.
- **Tests** — vitest unit suites for tokens, themes, validators,
  reducer, translate, format, coverage, and export utilities.
- **Documentation** — `docs/ARCHITECTURE.md`, `docs/DESIGN-SYSTEM.md`,
  `docs/I18N.md`, `docs/CONTRIBUTING.md`, `docs/DEPLOYMENT.md`,
  `docs/CHANGELOG.md`.

### Changed

- **Brand alignment with creditchecker.io** — palette switched to
  the official `#0A1264` / `#005EFF` / `#FFCC00`. Typography paired
  to Larken (with IBM Plex Serif fallback) for display and IBM Plex
  Sans for body. Loaded via Google Fonts in `index.html`.
- **Cover page (`genPage1`)** — gradient background, soft mesh
  blurs, large serif title, glassmorphism client logo card, three-cell
  bottom strip (Prepared for / Date / Proposal nº), vertical
  confidentiality mono mark.
- **All page generators** rewritten to use the new shared primitives
  (`hdrStr`, `ftrStr`, `eyebrowStr`, `titleStr`, `leadStr`, `pillStr`,
  `bulletItem`, `stepCardStr`, `featureGridStr`, `featureBoxStr`,
  `calcBoxStr`, `tableStr`, `metricStr`, `notesStr`).
- **Header / footer** simplified — minimal 32pt header with hairline
  separator, mono page numbers; 3-cell footer in mono micro.
- **Pricing page** — recommended plan badge in EU yellow with
  shadow, cleaner card hierarchy, fewer redundant labels, mono
  prices with tabular numerals.
- **Leads model accents** — CPL = blue, CPA = mint, Hybrid = violet
  (kills the previous "three blues" indistinguishability).
- **Leads overview** — now lists the real CreditCheck data points
  delivered with each lead (name, email, phone verified, IBAN, income,
  loan amount, employment status, dependants).
- **PDF export pipeline** — render scale doubled to **4x** (was 2x),
  output switched to **PNG** (was JPEG q=0.93), `useCORS: true`,
  per-page `await document.fonts.ready`, raster logo pre-shrink at
  600px max side, output filename includes locale suffix.
- **Export UX and i18n** — editor now supports PDF (`Ctrl+E`), HTML (`Ctrl+Shift+E`), DOCX (`Ctrl+Alt+E`), and print (`Ctrl+P`) with localized labels and command palette entries.
- **i18n storage** — `src/i18n/translations.js` reduced to a backwards-
  compat shim that re-exports `LOCALES` from the new `translate.js`.
- **Editor chrome** uses the official brand variables and IBM Plex
  Sans throughout.
- **State schema** extended with the new fields above. Old saved
  proposals continue to load (missing fields default safely).

### Fixed

- Cover and feature pages no longer rely on Segoe UI as primary; the
  Inter/IBM Plex stack is loaded with `display=swap` and used as
  primary across both preview and export.
- Save indicator no longer disappears between debounced writes — it
  cycles through `saving → saved` and shows `unsaved` when there are
  changes since the last export.
- Command palette state is reset cleanly via `key` remount instead of
  a `useEffect` that fought with React 19's stricter checks.

### Known limitations

- The PDF export remains rasterised. A vectorial pipeline
  (`src/render/pageModel.js` + `pdfRenderer.js` + `paginator.js` +
  `pdfWorker.js`) is the next workstream — it will make text
  selectable and shrink output size further.
- Editor chrome does not yet apply user theme overrides; the brand
  shell stays on the official palette to keep the admin experience
  predictable.

## [0.1.0] — Initial commit

Pre-redesign baseline: White-Label / Leads / Combo proposal generator
with html2canvas + jsPDF (raster, 2x). EN/ES locale (UI only) with
hardcoded page content branches inside generators.
