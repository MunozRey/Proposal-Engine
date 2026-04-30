// Inline SVG icons (Lucide-aligned subset).
// Returns an SVG string. Use `currentColor` so consumers can color via CSS or inline style.
// Sized in pt to match the PDF render pipeline; preview scales naturally with viewBox.

const STROKE_PROPS = (color, stroke) =>
  `fill="none" stroke="${color}" stroke-width="${stroke}" stroke-linecap="round" stroke-linejoin="round"`;

function svg(content, size, color, stroke, viewBox = '0 0 24 24') {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="${viewBox}" ${STROKE_PROPS(color, stroke)}>${content}</svg>`;
}

const ICONS = {
  // Product
  landmark: (s, c, w) =>
    svg(
      '<line x1="3" y1="22" x2="21" y2="22"/><line x1="6" y1="18" x2="6" y2="11"/><line x1="10" y1="18" x2="10" y2="11"/><line x1="14" y1="18" x2="14" y2="11"/><line x1="18" y1="18" x2="18" y2="11"/><polygon points="12 2 20 7 4 7"/>',
      s,
      c,
      w
    ),
  shieldCheck: (s, c, w) =>
    svg(
      '<path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/><path d="m9 12 2 2 4-4"/>',
      s,
      c,
      w
    ),
  lock: (s, c, w) =>
    svg(
      '<rect width="18" height="11" x="3" y="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>',
      s,
      c,
      w
    ),
  lineChart: (s, c, w) => svg('<path d="M3 3v18h18"/><path d="m19 9-5 5-4-4-3 3"/>', s, c, w),
  zap: (s, c, w) =>
    svg(
      '<path d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z"/>',
      s,
      c,
      w
    ),
  checkCircle: (s, c, w) =>
    svg('<circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/>', s, c, w),
  xCircle: (s, c, w) =>
    svg('<circle cx="12" cy="12" r="10"/><path d="m15 9-6 6"/><path d="m9 9 6 6"/>', s, c, w),
  clock: (s, c, w) =>
    svg('<circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>', s, c, w),
  globe: (s, c, w) =>
    svg(
      '<circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/>',
      s,
      c,
      w
    ),
  key: (s, c, w) =>
    svg(
      '<path d="m21 2-9.6 9.6"/><circle cx="7.5" cy="15.5" r="5.5"/><path d="m21 2-3 3"/><path d="m18 5 3 3"/>',
      s,
      c,
      w
    ),
  fileSearch: (s, c, w) =>
    svg(
      '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><circle cx="11.5" cy="14.5" r="2.5"/><path d="m13.5 16.5 2 2"/>',
      s,
      c,
      w
    ),
  // Trust
  badgeCheck: (s, c, w) =>
    svg(
      '<path d="M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z"/><path d="m9 12 2 2 4-4"/>',
      s,
      c,
      w
    ),
  star: (s, c, w) =>
    svg(
      '<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>',
      s,
      c,
      w
    ),
  sparkles: (s, c, w) =>
    svg(
      '<path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z"/>',
      s,
      c,
      w
    ),
  // Action
  arrowRight: (s, c, w) => svg('<path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>', s, c, w),
  arrowLeft: (s, c, w) => svg('<path d="M19 12H5"/><path d="m12 19-7-7 7-7"/>', s, c, w),
  undo: (s, c, w) =>
    svg('<path d="M3 7v6h6"/><path d="M21 17a9 9 0 0 0-9-9 9 9 0 0 0-6.7 2.97L3 13"/>', s, c, w),
  redo: (s, c, w) =>
    svg('<path d="M21 7v6h-6"/><path d="M3 17a9 9 0 0 1 9-9 9 9 0 0 1 6.7 2.97L21 13"/>', s, c, w),
  panelLeft: (s, c, w) =>
    svg('<rect width="18" height="18" x="3" y="3" rx="2"/><path d="M9 3v18"/>', s, c, w),
  search: (s, c, w) => svg('<circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>', s, c, w),
  rotateCcw: (s, c, w) =>
    svg(
      '<path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/>',
      s,
      c,
      w
    ),
  download: (s, c, w) =>
    svg(
      '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>',
      s,
      c,
      w
    ),
  // Process
  stepCircle: (s, c, w, n = '01') => {
    const inner = `<circle cx="12" cy="12" r="10"/><text x="12" y="14.5" text-anchor="middle" font-size="9" font-family="ui-monospace, monospace" fill="${c}" stroke="none">${n}</text>`;
    return svg(inner, s, c, w);
  },
};

export function icon(name, opts = {}) {
  const { size = 16, color = 'currentColor', stroke = 1.75, num } = opts;
  const fn = ICONS[name];
  if (!fn) return '';
  if (name === 'stepCircle') return fn(size, color, stroke, num);
  return fn(size, color, stroke);
}

export const ICON_NAMES = Object.keys(ICONS);
