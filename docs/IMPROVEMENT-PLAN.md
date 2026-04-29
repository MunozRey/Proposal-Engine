# Improvement plan — Proposal Engine

Owner: David. Audience: anyone working on this codebase.
Last updated: 2026-04-29.

This is a **professional roadmap** for the next iterations of Proposal
Engine. It is written from the developer perspective: every item lists
the _why_, the _what_, the rough _effort_ (S = ≤1 day, M = 2–3 days,
L = ≥1 week), and a _Definition of Done_ you can sign off against.

The plan is grouped in five tracks. Tracks are independent — you can
ship them in any order — but **Track 1 (PDF vector pipeline)** unblocks
the highest-impact quality jump.

---

## Track 1 · PDF quality (vector pipeline)

The PDF is currently a 4x raster export. Text is sharp at print sizes
but **not selectable**, files are 1–3 MB per page, fonts are not
embedded into the document. This is the one limitation that blocks
the product from feeling truly premium.

### 1.1 Introduce a PageModel abstraction (M)

**Why** Generators today return HTML strings. The same content needs
to be rendered into both a DOM (preview) and a vector PDF (jsPDF
primitives). Strings can't easily produce both.

**What**

- `src/render/pageModel.js` — types for blocks (`heading`, `paragraph`,
  `pill`, `table`, `featureGrid`, `metric`, `calc`, `cta`, `image`,
  `rasterFragment`).
- `src/render/htmlRenderer.js` — `model → HTML string` (preserves
  current preview).
- `src/render/pdfRenderer.js` — `model → jsPDF primitives` (vector).
- `src/render/measure.js` — per-block height predictor for the
  paginator.
- `src/render/paginator.js` — overflow detection, splittable blocks
  (`paragraph`, `bulletList`, `table`) cascade onto a new page with a
  "(cont.)" header.

**DoD** A flag `?pdf=native` switches the export pipeline; the
recommended pricing card and the cover render correctly under both
flags; visual regression test (Playwright pixelmatch) passes.

### 1.2 Embed Larken + IBM Plex Sans into jsPDF (S)

**Why** Without `addFont`, jsPDF substitutes built-in PostScript
fonts (Helvetica/Times). Brand becomes generic.

**What**

- `scripts/embed-fonts.mjs` — read `public/fonts/Larken-*.otf` and
  `IBM Plex Sans` weights, base64-encode, emit
  `src/design/fonts.embedded.js`.
- `pdfRenderer.js` calls `pdf.addFileToVFS` + `pdf.addFont` per
  weight.
- Lazy-import the embedded module from the export worker so the
  initial bundle doesn't grow.

**DoD** Open the exported PDF in Acrobat → Properties → Fonts shows
Larken + IBM Plex Sans embedded; text is selectable.

### 1.3 Move export to a Web Worker (S)

**Why** A 9-page export blocks the main thread for ~6s. The user
sees a frozen overlay.

**What** `src/workers/pdfWorker.js` receives `{models, tokens, fonts}`,
returns a `Blob`. Main thread captures any `rasterFragment` (cover) via
html2canvas and posts the ImageBitmap to the worker. Progress is
streamed via `postMessage`.

**DoD** UI remains interactive during export; Lighthouse "blocking
time during export" < 200 ms.

### 1.4 Image optimisation (S)

**Why** Logos uploaded by sales can be 5 MP PNGs.

**What** `src/utils/imageOptimize.js` — resize raster images to
`targetWidthPt × DPR` (DPR=2 for print), pick PNG with alpha vs JPEG
q=0.88 otherwise, cache by URL hash. SVG goes through `svg2pdf.js`
unchanged for true vector embed.

**DoD** Large client logos (≥1 MB) shrink to <120 KB in the PDF; no
visible quality loss at print.

---

## Track 2 · Content & branding completeness

The team should never need to edit code to ship a proposal.

### 2.1 Lead-data deliverable section (S)

**Why** The Leads pages should make it obvious _what data_ the buyer
gets. The CreditCheck data guide lists 28 fields per Credit Score
request and 23 per Mortgage request.

**What** `src/state/leadsSchema.js` — exports the field list grouped
by category (Identity, Income, Loan, Consent). `genLeadsOverview` and
the per-model pages render a "Sample lead deliverable" card with
mini-icons per category. Editable via a new sub-tab in `PagesTab`.

**DoD** The Overview page shows a structured "what you receive" panel;
each field is editable + i18n-aware.

### 2.2 Sales template library (M)

**Why** A salesperson copying an old proposal and renaming it is
fragile. We need first-class templates.

**What**

- New tab "Library" in `EditorShell`.
- `state.org.templates[]` — array of `{ id, label, snapshot }` where
  `snapshot` is a partial state. Apply via `LOAD` action with the
  user's current branding preserved.
- Three seeded templates: "WL pilot · 2 weeks", "Leads CPL EU bank",
  "Combo enterprise".
- Export current proposal as a template ("Save as template…").

**DoD** A salesperson can pick "Leads CPL EU bank", change client
name + logo, and ship in <2 minutes.

### 2.3 Per-page section titles editable (S)

**Why** Words like "How it works", "Pricing models", "Why CreditCheck"
are still hardcoded in `gen*.js`.

**What** Surface every page's eyebrow + title in `PagesTab` so the
team can A/B copy without touching code. Defaults stay localised but
become overrideable per-proposal.

**DoD** Open `PagesTab` → every section shows an editable title and
optional eyebrow; the page generators consume those fields with
locale fallback.

### 2.4 Custom themes UI (S)

**Why** `applyTheme()` exists; the Style tab doesn't expose a picker.

**What** Add a "Theme" card at the top of `StyleTab.jsx` listing the
4 built-in themes plus a "+ Create custom" tile. `state.org.theme.custom[]`
lets users save their tweaked palette.

**DoD** One-click theme swap visibly changes preview + PDF; custom
themes survive a reload.

---

## Track 3 · Editor UX polish

The new shell ships in this iteration. Track 3 sands the rough
edges.

### 3.1 Field primitives migration (M)

**Why** Tab editors still use raw `<input>` markup with the legacy
App.css classes. The new `Field*` primitives in
`src/components/editor/Field.jsx` give us validation, inline errors,
keyboard accessibility and consistent theming.

**What** Migrate `ClientTab`, `ContentTab`, `LeadsContentTab`,
`PricingTab`, `LeadsPricingTab`, `StyleTab`, `ProposalManager`,
`PagesTab` to the new primitives. Remove `App.css` rules they
replace.

**DoD** Lint passes; visual regression diff <1 % per tab; manual
QA covers Tab navigation and screen-reader labels.

### 3.2 Drag-and-drop reorder (S)

**Why** Plans, features and steps should be reorderable without
delete/recreate.

**What** Adopt `@dnd-kit/core` (lightweight, ~7 KB gzipped).
Add a drag handle to plan/step/feature list items.

**DoD** Reordering a plan's position survives reload; PDF renders in
the new order.

### 3.3 Validation visible at-glance (S)

**Why** Today the user only finds out the avatar URL is broken when
they export.

**What** Use the `validateField` infrastructure. Show an inline
warning chip ("Logo failed to load") at the field level and block the
export button if any required field is invalid.

**DoD** Opening a proposal with an invalid email shows a chip; export
button shows tooltip "Fix 1 field to enable export".

### 3.4 Multi-locale side-by-side editor (M)

**Why** Sales often maintain EN+ES copies of the same proposal.

**What** Toggle on `PagesTab` and `ContentTab`: when enabled, every
text field renders as two stacked inputs (EN | ES). State stores per-
locale strings under `i18n[lang]` keyed by field path.

**DoD** Editing the cover line in EN doesn't overwrite ES; switching
language toggles which version is shown in the preview.

---

## Track 4 · Production-grade infrastructure

### 4.1 Storage upgrade — IndexedDB + per-proposal blobs (S)

**Why** localStorage is 5 MB hard limit; logos saturate it quickly.

**What** Move proposal state and uploaded logos to IndexedDB via
`idb-keyval`. Keep a tiny metadata index in localStorage so the
proposal switcher loads fast.

**DoD** Save 20 proposals × 2 MB logos without hitting quota errors.

### 4.2 Auth + multi-user (L)

**Why** Today everyone shares the same browser-local store.

**What** Define a thin server contract:

```
GET  /api/proposals       list (id, name, updatedAt, owner)
GET  /api/proposals/:id   full state JSON
POST /api/proposals       create
PUT  /api/proposals/:id   update
DELETE /api/proposals/:id remove
GET  /api/auth/me         current user
```

Keep the SPA, add a thin Node/Express or Cloudflare Workers backend.
Auth via the existing privateprompt SSO if available.

**DoD** Two logged-in salespeople see the same proposal list; the
last writer wins (with a `If-Match` ETag for safety).

### 4.3 Telemetry + error reporting (S)

**Why** When export fails on a sales call, we have no idea why.

**What** Sentry (or a self-hosted GlitchTip) for runtime errors,
PostHog (or self-hosted Plausible) for "proposal exported / template
applied / theme switched" events. Keep PII out (no client names in
events).

**DoD** Crashing the export flow surfaces the error in Sentry within
30s; an internal dashboard shows daily exports per template.

### 4.4 CI: visual regression (S)

**Why** It is too easy to break a page generator without noticing.

**What** Playwright + `pixelmatch`. Per-page screenshots stored as
fixtures; PR fails if any page changes >0.5 % of pixels without an
explicit fixture update.

**DoD** A PR that swaps `#FFCC00` for `#FFAA00` fails CI with a
diff image attached to the run.

---

## Track 5 · Code health

### 5.1 Vector logo asset (S)

**Why** `/Logo-white.svg` is hard-coded white — invisible on light
pages. We worked around this with `ccLogoSvg()`, but the asset is now
duplicated.

**What** Delete `public/Logo-white.svg`. `ccLogoSvg()` is the single
source of truth. Update README + any docs that referenced the file.

**DoD** No file in `public/` is shipped that no code references.

### 5.2 Drop legacy typo keys (S)

**Why** `st.typo.{heading,subhead,body,small,tableBody,note,micro}` is
a parallel scale to `tokens.type.scale`. Two systems are confusing.

**What** Migrate every `${T.heading}` to `tokens(st).type.scale.h2`
etc. Remove the `typo` key from `INIT`. Keep a `LOAD` migration that
renames legacy keys for stored proposals.

**DoD** `grep -r 'st\.typo\.' src/` returns nothing.

### 5.3 Generators → modules (S)

**Why** `gen*.js` files duplicate the same A4 wrapper boilerplate.

**What** A `pageWrapper(content, opts)` helper in `pageHelpers.js`
that owns the 595×842 div + background + header + footer. Each
`gen*.js` becomes ~20 lines of model-specific content.

**DoD** Pre/post diff shows ~150 fewer lines across `src/pages`.

### 5.4 Migrate i18n locale loading to dynamic import (S)

**Why** `translate.js` imports all 6 locales eagerly. PT/FR/DE/IT
are unused for most users.

**What** `loadLocale(code) → Promise<LocaleObject>`, lazy-import per
file. Cache the result. The component tree awaits the active locale
before first render.

**DoD** Initial bundle drops by ≥4 KB gzipped (one locale instead of
six).

---

## Sequencing recommendation

If you can only ship one quarter's worth of work, pick this order:

1. **Track 1.1 + 1.2** (PageModel + font embed) — biggest perceived
   quality jump.
2. **Track 2.1** (Lead-data deliverable section) — closes the
   credibility gap on the Leads pages.
3. **Track 2.4 + 3.1** (Theme picker + field primitives migration) —
   editor feels modern.
4. **Track 4.1 + 4.4** (IndexedDB + visual regression CI) —
   foundation for safe iteration.
5. Everything else as backlog / opportunistic.

## Working agreement

- Open one PR per track item, not per track.
- Title PRs `feat(track-X.Y): …` so the roadmap stays mappable.
- Update [`docs/CHANGELOG.md`](./CHANGELOG.md) on every merge.
- Ship behind a flag (`?pdf=native`, `?editor=v2`, …) when the change
  is risky; only flip the default after a week of internal use.
