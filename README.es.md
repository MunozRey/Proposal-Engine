# Proposal Engine

SaaS interno para que el equipo de **CreditCheck** elabore propuestas
comerciales (White-Label, Leads — CPL/CPA/Híbrido — y Combo) con
vista previa en tiempo real y exportación a PDF de un click. Alineado
con el branding de [creditchecker.io](https://creditchecker.io).

## Stack

- React 19 + Vite 8
- IBM Plex Sans / Larken (con IBM Plex Serif como fallback) vía Google Fonts
- jsPDF + html2canvas (pipeline raster a 4x)
- Vitest (tests unitarios), ESLint, Prettier, Husky + lint-staged
- Internacionalización: EN · ES · PT · FR · DE · IT

## Requisitos

- Node.js 22+
- npm 10+

## Instalación

```bash
npm install
```

## Desarrollo

```bash
npm run dev
```

URL: `http://localhost:3131` (puerto definido en `.claude/launch.json`).

## Scripts disponibles

- `npm run dev` — servidor de desarrollo.
- `npm run build` — bundle de producción en `dist/`.
- `npm run preview` — sirve el bundle de producción localmente.
- `npm run lint` — ESLint.
- `npm test` — suite vitest unitaria.
- `npm run format` — Prettier (escribe).
- `npm run format:check` — Prettier (comprueba).
- `npm run check` — `lint` + `test` + `build`.

## Estructura principal

- `src/App.jsx` — shell principal.
- `src/components/editor/` — nuevas primitivas (TopBar, Card,
  Field\*, CommandPalette, ShortcutsHelp, …).
- `src/components/*Tab.jsx` — editores por sección.
- `src/pages/gen*.js` — generadores HTML reutilizados por la vista
  previa y la exportación a PDF.
- `src/state/` — reducer, estado inicial y plantillas por idioma.
- `src/utils/exportPdf.js` — pipeline de exportación PDF (raster @ 4x).
- `src/utils/storage.js` — persistencia con debounce en localStorage.
- `src/i18n/locales/{en,es,pt,fr,de,it}.js` — traducciones.
- `src/design/` — tokens, temas y librería de iconos inline.

## Flujo funcional

1. El usuario edita Cliente / Contenido / Precios / Estilo en el
   panel izquierdo.
2. Los generadores producen el HTML que alimenta la vista previa.
3. Al exportar, `exportPdf.js` rasteriza cada página a 4x y genera
   un PDF A4 (basado en PNG, con sufijo de idioma en el nombre).
4. El estado se persiste en `localStorage` con autoguardado.

## Idiomas

- Seis locales por defecto (EN, ES, PT, FR, DE, IT). EN es la
  fuente de verdad; el resto replica las claves.
- Selector compacto en el editor; claves por idioma en
  `src/i18n/locales/`. CI verifica paridad.
- Formato de moneda / número / fecha consciente del idioma en
  `src/i18n/format.js`.

## Solución de problemas

- Falla el build: ejecuta `npm run lint` y arregla warnings/errors.
- Logos remotos: verifica el dominio o sube el logo manualmente.
- Calidad del PDF: el 4x raster da ~1-2 MB por página A4 a densidad
  típica de contenido.

Consulta [`docs/`](./docs/) para arquitectura completa, sistema
de diseño, guía i18n, contribución y deployment.
