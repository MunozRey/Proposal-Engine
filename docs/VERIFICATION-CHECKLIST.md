# Verification Checklist

Use this checklist before merging export or i18n-related changes.

## Automated checks

- `npm run lint`
- `npm run test`
- `npm run build`
- `npm run check`

## Functional checks

- Open the app and validate all proposal types:
  - White-Label
  - Leads
  - Combo
- Switch locales and confirm UI labels render correctly:
  - `en`, `es`, `pt`, `fr`, `de`, `it`
- Confirm state persistence survives refresh and restore.

## Export checks

- Export PDF (`Ctrl+E`) and verify:
  - file is downloaded
  - page order matches visible page selection
  - branding and logos render
- Export HTML (`Ctrl+Shift+E`) and verify:
  - file opens standalone
  - page layout matches preview
  - print output remains A4 paginated
- Export DOCX (`Ctrl+Alt+E`) and verify:
  - file is generated
  - section/page labels are present
  - text content is readable
- Print flow (`Ctrl+P`) and verify:
  - print dialog opens
  - page breaks are clean
  - each page maps to A4 output

## i18n checks

- No newly added hardcoded UI strings.
- New strings are present in `src/i18n/locales/en.js`.
- Locale parity test passes (`src/i18n/coverage.test.js`).
- Command palette sections and export toasts are localized.
