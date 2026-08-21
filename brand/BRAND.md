# BRAND.md — Switchyard

**Phase 0 deliverable. Awaiting approval. No repo has been created and nothing has been deployed.**

---

## 1. Name

| # | Candidate | Read |
|---|-----------|------|
| 1 | **Switchyard** ✅ | The rail yard where cars are sorted and routed onto the right track |
| 2 | Milepost | Distance markers along a line — leans "milestones" only |
| 3 | Trackline | Clean, but generic, and collides conceptually with the existing `lunartrack-admin-connector` repo |

**Chosen: Switchyard** — a switchyard is precisely where work is sorted and routed onto the right track, and it sits naturally in the *Lunar Rails* family without borrowing anything from the upstream product's naming.

### Availability — verified, not assumed

| Check | Method | Result |
|---|---|---|
| Repo slug `switchyard` free | `GET /api/v1/orgs/lunarrails/repos?limit=100` — enumerated all 50 | ✅ Free |
| Subdomain free | `GET https://switchyard.apps.moon.nzero.pro/` | ✅ HTTP 404, no app bound |
| No deployed-app collision | `GET /workspaces/$WS_ID/apps/` — enumerated all 41 | ✅ No match |
| Org exists | `GET /api/v1/orgs/lunarrails` | ✅ id=2, "Lunar Rails" |

> **Deviation, flagged:** the brief specifies confirming the org via `GET /api/v1/user/orgs`. The
> N0-minted Gitea token carries scopes `write:organization, write:package, write:repository` and is
> rejected (403) by every `read:user`-gated endpoint, including that one. I confirmed the org
> directly via `/orgs/lunarrails` and by observing that all 50 enumerated repos are owned by
> `lunarrails`. The org name is **confirmed**, by a different endpoint than specified.

---

## 2. Identifier mapping — single source of truth

| Concern | Value |
|---|---|
| Product name | `Switchyard` |
| Gitea org | `lunarrails` |
| Repo slug | `switchyard` |
| Repo URL | `https://gitea-lunarrails.apps.moon.nzero.pro/lunarrails/switchyard` |
| Subdomain | `switchyard` |
| Live URL | `https://switchyard.apps.moon.nzero.pro` |
| Registry host | `gitea-lunarrails.apps.moon.nzero.pro` |
| Image prefix | `gitea-lunarrails.apps.moon.nzero.pro/lunarrails/switchyard-` |
| Images (built) | `switchyard-web`, `switchyard-space`, `switchyard-admin` |
| Images (mirrored) | `switchyard-backend`, `switchyard-live`, `switchyard-proxy` |
| Manifest service names | `web`, `space`, `admin`, `backend`, `worker`, `beat-worker`, `live`, `proxy`, `db`, `redis`, `mq`, `storage` |
| Env var prefix | `SY_` |
| CSS token prefix | `--sy-` |
| Database name | `switchyard` |
| Database user | `switchyard` |
| Docker network | `switchyard-net` |
| Volume prefix | `switchyard-` |
| Container label ns | `pro.nzero.switchyard` |

Service names are already brand-neutral; the brand appears in the **image** name, not the service key.

---

## 3. Assets

```
brand/
├── BRAND.md ......................... this file (repo root)
├── tokens.json / tokens.css ......... design tokens (--sy-* custom properties)
├── palette.py / contrast_check.py ... palette source + reproducible WCAG verifier
├── CONTRAST.md ...................... 40/40 checks passing
├── preview.html ..................... brand board (render locally)
├── logo/
│   ├── icon-{light,dark,mono,tile}.svg
│   ├── wordmark-{light,dark,mono}.svg ........ icon + text lockup
│   └── wordmark-text-{light,dark,mono}.svg ... text only
├── favicon/
│   ├── icon-{16,32,180,192,512}.png, icon-512-maskable.png
│   ├── favicon.ico (16/32/48), favicon.svg
│   └── manifest.json ................ PWA values
└── fonts/ ........................... self-hosted woff2 + ttf + OFL licences
```

**The mark** is a railway turnout: a through rail, a diverging rail, and an accent dot at the switch
points. Wordmark text is **outlined to paths** — the SVGs carry no font dependency and make no
network call. Three alternative marks were rendered and rejected (ties read as clutter; a symmetric
Y read as a generic git-merge glyph).

**Monochrome usage:** `currentColor` does not inherit into an `<img>`-loaded SVG. Inline the mono
SVG, or use it as a CSS `mask-image` with `background-color`.

---

## 4. Colour

Full ramps in `tokens.json`. Anchors:

| Role | Light | Dark | Notes |
|---|---|---|---|
| Primary — Track Teal | `#0D6A5F` | `#6FD5C3` | Brand + primary action |
| Secondary — Steel Blue | `#1E4478` | `#84ADDE` | Supporting surfaces |
| Accent — Lunar Violet | `#6D28D9` | `#BCA4F7` | Switch point, highlights |
| Success | `#15803D` | `#4ADE80` | |
| Warning | `#A16207` | `#FBBF24` | |
| Error | `#B91C1C` | `#F87171` | |
| Info | `#1D4ED8` | `#7DD3FC` | |
| Background | `#FFFFFF` | `#0B0F14` | |
| Surface | `#F6F8FA` | `#141B23` | |
| Text | `#1A2029` | `#E8ECF1` | |

Teal keeps red/amber/green free for semantics and reads as distinct from the upstream product's blue.

**Contrast: 40/40 checks pass**, every colour verified against *both* backgrounds **and** both
surface levels. See `CONTRAST.md`; re-run with `python3 brand/contrast_check.py`.

---

## 5. Typography — self-hosted, zero CDN calls

| Role | Face | Licence | Shipped |
|---|---|---|---|
| Display | Space Grotesk (variable) | OFL 1.1 | `SpaceGrotesk-var.woff2` (49 KB) |
| Body / UI | Inter (variable) | OFL 1.1 | `Inter-var.woff2` (342 KB) |
| Mono | JetBrains Mono (variable) | OFL 1.1 | `JetBrainsMono-var.woff2` (70 KB) |

Files are vendored in `brand/fonts/` with their licences. `tokens.css` declares `@font-face` with
relative paths only — no `fonts.googleapis.com`, no `fonts.gstatic.com`, nothing external.

---

## 6. Tone of voice — 5 rules

1. **Name the object, then the action.** "Cycle closed" not "Success!". Labels are nouns; buttons are verbs.
2. **State what happened and what to do next.** Every error names the cause and one recovery step. Never "Something went wrong" alone.
3. **Empty states teach one thing.** One sentence of what belongs here, one action. No illustrations carrying the explanation.
4. **Address the reader as "you"; the product never says "I".** No mascot, no exclamation marks, no congratulation for routine actions.
5. **Plain over clever.** "Delete" not "Banish". Rail metaphors live in the brand layer — never in functional UI copy where they would obscure meaning.

Email: subject lines lead with the object and state — `[Switchyard] Cycle 14 closes Friday`. No marketing voice; this is internal tooling.

---

## 7. Scope note

Deployment is **internal only** — no third-party access, no public signup, no resale. The rebrand is
**presentation-layer only**: the upstream `LICENSE` and all source-level copyright headers are
preserved. Phase 3 removes the upstream name from everything a user can reach; it does not strip
attribution required by the licence.
