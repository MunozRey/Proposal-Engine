# Contributing

Thanks for hacking on Proposal Engine. This guide covers the local
setup, conventions and the most common "how do I add X?" workflows.

## Setup

```bash
# Requires Node 22+ and npm 10+
git clone https://gitea.apps.privateprompt.tech/clovrlabs/david-propsal-engine.git
cd david-propsal-engine
npm install         # also installs husky pre-commit hooks

npm run dev         # http://localhost:3131  (port from .claude/launch.json)
npm run check       # lint + test + build (run before pushing)
```

Recommended editor settings:

- Prettier on save (config in `.prettierrc.json`).
- ESLint integration (`eslint.config.js`).

## Commit / PR conventions

- Branch from `master`. Keep PRs focused.
- Conventional commit prefixes are nice but not enforced
  (`feat:`, `fix:`, `docs:`, `refactor:`, `test:`, `chore:`).
- The pre-commit hook runs `prettier --write` and `eslint --fix` on
  staged files. CI re-runs the full suite (`npm run check`).
- Never commit `.env`, real client logos or PDF samples that contain
  client data — use placeholders.

## Tooling

| Script                 | What it does                   |
| ---------------------- | ------------------------------ |
| `npm run dev`          | Vite dev server, port 3131     |
| `npm run build`        | Production bundle into `dist/` |
| `npm run preview`      | Serve `dist/` locally          |
| `npm run lint`         | ESLint over the repo           |
| `npm run format`       | Prettier write                 |
| `npm run format:check` | Prettier check only            |
| `npm test`             | Vitest, single run             |
| `npm run test:watch`   | Vitest watch mode              |
| `npm run check`        | lint + test + build            |

## Project layout

```
src/
├── App.jsx                       App shell (composes EditorShell + preview)
├── App.css                       Legacy editor + preview styles
├── index.css                     Global resets, font face stack
├── main.jsx                      Vite entry
│
├── design/
│   ├── tokens.js                 Single source of truth for visual tokens
│   ├── themes.js                 Built-in theme presets + applyTheme
│   └── icons.js                  Inline SVG library
│
├── components/
│   ├── editor/
│   │   ├── editor.css            Editor chrome design system
│   │   ├── EditorShell.jsx       Top bar + tabs + body + bottom bar
│   │   ├── Card.jsx              Card + SectionHeader primitives
│   │   ├── Field.jsx             FieldText / Number / Url / Email / Color / Image / Select
│   │   ├── IconButton.jsx
│   │   ├── CommandPalette.jsx    Ctrl+K palette
│   │   ├── ShortcutsHelp.jsx     Ctrl+/ modal
│   │   ├── SaveIndicator.jsx
│   │   └── CompletionMeter.jsx
│   ├── ClientTab.jsx · ContentTab.jsx · PricingTab.jsx · …
│   ├── leads/                    CPL/CPA/Hybrid editors
│   └── shared/                   Reusable form pieces
│
├── pages/
│   ├── genPage1.js               Cover
│   ├── genPage2.js               How It Works
│   ├── genPage3.js               Pricing
│   ├── genWhyCC.js               Why CreditCheck (hero metrics)
│   ├── genClose.js               Next steps + CTA
│   └── leads/
│       ├── genLeadsOverview.js
│       ├── genLeadsCPL.js
│       ├── genLeadsCPA.js
│       └── genLeadsHybrid.js
│
├── state/
│   ├── initialState.js           Shape + defaults
│   ├── reducer.js                All mutations
│   └── templateDefaults.js       Per-locale starter content
│
├── utils/
│   ├── pageHelpers.js            Header, footer, primitives shared by pages
│   ├── exportPdf.js              Raster PDF pipeline
│   ├── storage.js                Debounced localStorage persistence
│   ├── history.js                Undo / redo wrapper around the reducer
│   ├── validators.js             URL / email / hex / number rules
│   ├── logoFetch.js              Domain-to-logo lookup helper
│   └── esc.js                    HTML escape
│
├── i18n/
│   ├── translate.js              t() and helpers
│   ├── format.js                 Intl currency / date / number formatters
│   ├── translations.js           Back-compat shim
│   └── locales/{en,es,pt,fr,de,it}.js
│
└── hooks/
    └── useShortcuts.js           Keyboard shortcut registry
```

## How do I … ?

### … add an editable field?

1. Add it to `INIT` in `src/state/initialState.js` with a sensible default.
2. If it lives inside an existing nested array (e.g. a new `plan`
   property), no reducer change is needed — `STEP`/`PLAN` etc. handle
   arbitrary `f`. Otherwise add an action verb.
3. Surface it in the right `*Tab.jsx` using one of the `Field*`
   primitives (`src/components/editor/Field.jsx`).
4. Reference it from the corresponding `gen*.js` (`st.myField`).
5. Add a key to every locale in `src/i18n/locales/*.js` if it has a
   user-visible label.
6. Add a unit test for the reducer action if you added one.

### … add a new page?

1. Create `src/pages/genYourPage.js` returning HTML. Use helpers from
   `src/utils/pageHelpers.js` (`hdrStr`, `ftrStr`, `eyebrowStr`,
   `titleStr`, `featureGridStr`, `tableStr`, `metricStr`, …).
2. Register it in `App.jsx` inside `allPageDefs` for the right
   `proposalType`.
3. Add page-title keys to every locale.
4. If the page is optional, expose a toggle via `hiddenPages` and the
   StyleTab page list.

### … add a locale?

See [`docs/I18N.md`](./I18N.md).

### … add a theme?

1. Add an entry to `BUILTIN_THEMES` in `src/design/themes.js`
   (`brandNavy`, `brandBlue`, `brandAccent`, `fontDisplay`, `fontBody`,
   `fontMono` are the keys consumed by `LOAD_THEME`).
2. Update `themes.test.js` if you change the count.
3. Update [`docs/DESIGN-SYSTEM.md`](./DESIGN-SYSTEM.md) so the
   palette is documented.

### … add a keyboard shortcut?

Use `useShortcuts` in `src/hooks/useShortcuts.js`. Combos accept
`mod` (Cmd on macOS, Ctrl elsewhere), `shift`, `alt`. Multiple
combos per action via array. Surface it in `ShortcutsHelp`'s list.

## Style guide

- Functional components only. Hooks for state.
- Avoid premature abstractions in the page generators — they are
  templated HTML, not a UI tree, and explicit code reads better.
- Keep inline styles in generators; `pageHelpers.js` is the place for
  patterns you reuse 3+ times.
- Don't import `@fontsource/*` packages at runtime; we ship Google
  Fonts via `<link rel="stylesheet">` so the dev bundle stays light.
- Tests must run in vitest (jsdom). For DOM interactions, use
  `@testing-library/react`.

## Releasing

`master` is auto-deployed via Gitea CI to the privateprompt registry
(see [`docs/DEPLOYMENT.md`](./DEPLOYMENT.md)). Tag releases when the
public-facing surface changes substantially; record entries in
[`docs/CHANGELOG.md`](./CHANGELOG.md) following Keep a Changelog.
