# Design system

Source of truth: [`src/design/tokens.js`](../src/design/tokens.js)
and [`src/design/themes.js`](../src/design/themes.js). The values
below are **the official CreditCheck (creditchecker.io) palette and
type pairings**. Override them per-proposal via state (`brandNavy`,
`brandBlue`, `brandAccent`, `fontDisplay`, `fontBody`, `fontMono`).

## Palette

### Brand

| Token          | Hex       | Usage                                               |
| -------------- | --------- | --------------------------------------------------- |
| `brand.navy`   | `#0A1264` | Page backgrounds, dark surfaces, headlines on light |
| `brand.blue`   | `#005EFF` | Primary CTA, links, metric accents, focus rings     |
| `brand.accent` | `#FFCC00` | Yellow accent, validity strips, "Most popular" pill |
| `midnight`     | `#050B1E` | Cover gradient bottom                               |

### Surfaces

| Token                 | Hex          |
| --------------------- | ------------ |
| `surface.paper`       | `#FFFFFF`    |
| `surface.subtle`      | `#F6F8FC`    |
| `surface.inverse`     | `brand.navy` |
| `surface.inverseSoft` | `#122749`    |

### Grays

`gray.50` → `gray.900` (`#F6F8FC` to `#0F172A`). Use `gray.700`
(`#2C3A52`) for body text on light, `gray.500` (`#6B7B92`) for muted
captions, `gray.300` (`#C0CCDB`) for hairlines and dashed signature
lines.

### State

| Token           | Hex       | Soft      |
| --------------- | --------- | --------- |
| `state.success` | `#22C55E` | `#DCFCE7` |
| `state.warning` | `#F59E0B` | `#FEF3C7` |
| `state.danger`  | `#EF4444` | `#FEE2E2` |
| `state.info`    | `#3B82F6` | `#DBEAFE` |

### Per-Leads-model accents (kills the "three blues" problem)

| Model  | Hex                                    |
| ------ | -------------------------------------- |
| CPL    | `#005EFF` (brand blue)                 |
| CPA    | `#22D3A0` (mint, "approved/converted") |
| Hybrid | `#7C5CFF` (violet, "blended")          |

## Typography

| Role    | Family                                                | Weights               | Used in                                        |
| ------- | ----------------------------------------------------- | --------------------- | ---------------------------------------------- |
| Display | Larken (custom) → IBM Plex Serif (fallback) → Georgia | 500 / 600 / 700       | Cover title, page H1, hero metrics, plan price |
| Body    | IBM Plex Sans → Inter → Segoe UI                      | 400 / 500 / 600 / 700 | Paragraphs, labels, table cells, UI            |
| Mono    | IBM Plex Mono → JetBrains Mono                        | 400 / 500 / 600       | Page numbers, eyebrows, prices, dates          |

**Modular scale (pt, used in PDF; preview applies the same numbers
to a CSS-transform-scaled div):**

| Token    | Pt  |
| -------- | --- |
| display  | 56  |
| h1       | 40  |
| h2       | 28  |
| h3       | 20  |
| body     | 14  |
| bodySm   | 12  |
| micro    | 10  |
| hairline | 8   |

The legacy `st.typo.{heading,subhead,body,small,tableBody,note,micro}`
is preserved for backwards compat; `tokens.js` aliases the new keys to
the legacy ones at runtime.

## Spacing & shape

- Spacing scale: `[0, 2, 4, 8, 12, 16, 24, 32, 48, 64, 96, 128]`.
- Radii: `none / sm 4 / md 8 / lg 12 / xl 16 / xxl 24 / pill 9999`.
- Shadows (cards, elevation):
  - `sm` `0 1px 2px rgba(10,18,100,.06)`
  - `md` `0 4px 12px rgba(10,18,100,.08)`
  - `lg` `0 12px 32px rgba(10,18,100,.14)` (recommended plan)
  - `xl` `0 24px 48px rgba(10,18,100,.18)`

## Iconography

Inline SVG library in [`src/design/icons.js`](../src/design/icons.js)
(Lucide-aligned subset, stroke 1.75). Use `currentColor` so the icon
inherits whichever container colour applies.

| Category | Names                                                                                        |
| -------- | -------------------------------------------------------------------------------------------- |
| Product  | `landmark`, `shieldCheck`, `lock`, `lineChart`, `zap`, `clock`, `globe`, `key`, `fileSearch` |
| Trust    | `badgeCheck`, `star`, `sparkles`                                                             |
| State    | `checkCircle`, `xCircle`                                                                     |
| Action   | `arrowRight`, `download`, `stepCircle(num)`                                                  |

## Themes

Four built-in presets (in [`src/design/themes.js`](../src/design/themes.js)):

| ID            | Label                  | Navy      | Blue      | Accent    | Display                 | Body          |
| ------------- | ---------------------- | --------- | --------- | --------- | ----------------------- | ------------- |
| `creditcheck` | CreditCheck (official) | `#0A1264` | `#005EFF` | `#FFCC00` | Larken / IBM Plex Serif | IBM Plex Sans |
| `corporate`   | Corporate Navy         | `#0A1B36` | `#1858F5` | `#22D3A0` | Inter Tight             | Inter         |
| `mint`        | Modern Mint            | `#0E2A2A` | `#0E9E7E` | `#34E5B5` | Manrope                 | Inter         |
| `bold`        | Bold Dark              | `#07080F` | `#6366F1` | `#A78BFA` | Space Grotesk           | Inter         |

Custom themes are stored at runtime under `state.org.theme.custom[]`
and merged into the picker via `listThemes(custom)`. To create a
new built-in, add an entry to `BUILTIN_THEMES` in `themes.js`.

Apply a theme via `applyTheme(state, themeId, custom?)` or by
dispatching `{ t: 'LOAD_THEME', v: pickThemePatch(theme), id: theme.id }`.

## Editor chrome

The left panel exposes its own variables in
[`src/components/editor/editor.css`](../src/components/editor/editor.css)
(`--ed-*`). They mirror the brand palette so the editor visually
agrees with whatever theme the proposal uses (primary blue =
`#005EFF`, accent yellow = `#FFCC00`, deep navy `#0A1264`).

If you change brand colours via state, the **PDF pages** pick up the
new values automatically; the **editor chrome** does not (yet) — it
stays on the official palette so admins always see a stable shell.
