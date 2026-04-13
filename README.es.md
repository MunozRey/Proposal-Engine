# Proposal Engine

Generador de propuestas comerciales (White-Label, Leads y Combo) con vista previa en tiempo real y exportacion a PDF.

## Stack

- React 19
- Vite 8
- html2canvas + jsPDF

## Requisitos

- Node.js 22 o superior
- npm 10 o superior

## Instalacion

```bash
npm install
```

## Desarrollo

```bash
npm run dev
```

URL de la app: `http://localhost:5173`

## Scripts Disponibles

- `npm run dev`: arranca el entorno de desarrollo.
- `npm run build`: genera build de produccion.
- `npm run preview`: sirve el build localmente.
- `npm run lint`: ejecuta ESLint.
- `npm run test`: ejecuta tests con Vitest.
- `npm run format`: formatea codigo con Prettier.
- `npm run check`: corre lint + test + build.

## Estructura Principal

- `src/App.jsx`: shell principal de la aplicacion.
- `src/components`: editor lateral por tabs y componentes de UI.
- `src/pages`: generadores HTML de paginas para preview/PDF.
- `src/state`: estado inicial y reducer global.
- `src/utils/exportPdf.js`: pipeline de exportacion a PDF.
- `src/utils/storage.js`: persistencia local del estado.

## Flujo Funcional

1. El usuario edita cliente, contenido, precios y estilo en el panel izquierdo.
2. Se generan paginas HTML desde `src/pages` para la vista previa.
3. Al exportar, `exportPdf` renderiza paginas y genera un PDF A4.
4. El estado se guarda en `localStorage` con debounce.

## Idiomas (ES/EN)

- Selector global de idioma en el panel lateral.
- Traduccion de controles principales del editor.
- Traduccion de textos de salida en preview y PDF.
- El idioma seleccionado se persiste en el estado guardado.

## Resolucion Rapida de Problemas

- Si falla el build: ejecuta `npm run lint` y corrige warnings/errores.
- Si no cargan logos remotos: valida dominio o sube el logo manualmente.
- Si falla la exportacion PDF: reduce paginas visibles y verifica imagenes externas.
