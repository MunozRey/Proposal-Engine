# Proposal Engine

[![CI](https://gitea.apps.privateprompt.tech/clovrlabs/david-propsal-engine/actions/workflows/build-and-push.yaml/badge.svg)](https://gitea.apps.privateprompt.tech/clovrlabs/david-propsal-engine/actions)
[![Node](https://img.shields.io/badge/node-22%2B-43853d.svg)](https://nodejs.org/)
[![Stack](https://img.shields.io/badge/stack-React%2019%20%2B%20Vite%208-005EFF.svg)](https://vite.dev/)
[![Locales](https://img.shields.io/badge/locales-EN%20·%20ES%20·%20PT%20·%20FR%20·%20DE%20·%20IT-0A1264.svg)](docs/I18N.md)

Internal SaaS for the **CreditCheck** team to author commercial proposals
(White-Label, Leads — CPL/CPA/Hybrid — and Combo) with a real-time preview
and a one-click PDF export. Aligned with the [creditchecker.io](https://creditchecker.io)
brand: deep navy, electric blue, EU-yellow accent, IBM Plex Sans body, Larken/IBM Plex Serif display.

|                  |                                                                     |
| ---------------- | ------------------------------------------------------------------- |
| **Localised in** | English · Castellano · Português · Français · Deutsch · Italiano    |
| **Themes**       | CreditCheck (official) · Corporate Navy · Modern Mint · Bold Dark   |
| **Output**       | A4 vector-friendly PDF (Inter / IBM Plex embedded via Google Fonts) |
| **Persistence**  | localStorage with debounced autosave + JSON import/export           |

## Documentation

- 🇬🇧 English — [`README.en.md`](./README.en.md)
- 🇪🇸 Castellano — [`README.es.md`](./README.es.md)
- 🏗 Architecture — [`docs/ARCHITECTURE.md`](./docs/ARCHITECTURE.md)
- 🎨 Design system — [`docs/DESIGN-SYSTEM.md`](./docs/DESIGN-SYSTEM.md)
- 🌍 Internationalisation — [`docs/I18N.md`](./docs/I18N.md)
- 🤝 Contributing — [`docs/CONTRIBUTING.md`](./docs/CONTRIBUTING.md)
- 🚀 Deployment — [`docs/DEPLOYMENT.md`](./docs/DEPLOYMENT.md)
- 📜 Changelog — [`docs/CHANGELOG.md`](./docs/CHANGELOG.md)

## Quickstart

```bash
git clone https://gitea.apps.privateprompt.tech/clovrlabs/david-propsal-engine.git
cd david-propsal-engine
npm install
npm run dev          # http://localhost:3131 (configured in .claude/launch.json)
```

## Architecture at a glance

```
   ┌──────────────────────────┐
   │  state (reducer + INIT)  │
   └────────────┬─────────────┘
                │
                ▼
       ┌────────────────┐         ┌─────────────────┐
       │ pages/gen*.js  │ ─────▶  │ preview (React) │
       │ pageHelpers.js │         └─────────────────┘
       └────────┬───────┘
                │  same HTML strings
                ▼
   ┌──────────────────────────┐
   │ exportPdf.js (raster 4x) │ ──▶ A4 PDF
   └──────────────────────────┘
```

See [`docs/ARCHITECTURE.md`](./docs/ARCHITECTURE.md) for the full rationale.

## Deployment note

Production deployments are built by the Gitea CI workflow at
`.gitea/workflows/build-and-push.yaml` and shipped through the
`privateprompt-app.json` manifest. Push to `master` triggers a Docker image
build + push to the registry; see [`docs/DEPLOYMENT.md`](./docs/DEPLOYMENT.md).
