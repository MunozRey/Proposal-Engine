// Theme presets — one-click visual identity swap.
// Applied via dispatch({ type: 'LOAD_THEME', theme }).
// Custom themes can be added at runtime; user-defined themes live in state.org.theme.custom[].

// Brand themes. The default ("creditcheck") mirrors the live brand from
// creditchecker.io (deep navy #0A1264, electric blue #005EFF, EU yellow #FFCC00,
// Larken/IBM Plex Sans typography). Other themes are alternative palettes for
// teams that want a different feel without leaving fintech-credible territory.
export const BUILTIN_THEMES = {
  creditcheck: {
    id: 'creditcheck',
    label: 'CreditCheck (official)',
    description: 'Live brand from creditchecker.io. Deep navy, electric blue, EU-yellow accent.',
    brandNavy: '#0A1264',
    brandBlue: '#005EFF',
    brandAccent: '#FFCC00',
    fontDisplay: "'Larken', 'IBM Plex Serif', Georgia, serif",
    fontBody: "'IBM Plex Sans', 'Inter', 'Segoe UI', system-ui, sans-serif",
    fontMono: "'IBM Plex Mono', 'JetBrains Mono', ui-monospace, monospace",
  },
  corporate: {
    id: 'corporate',
    label: 'Corporate Navy',
    description: 'Quieter fintech palette. Slate navy, classic blue, mint accent.',
    brandNavy: '#0A1B36',
    brandBlue: '#1858F5',
    brandAccent: '#22D3A0',
    fontDisplay: "'Inter Tight', 'Segoe UI', system-ui, sans-serif",
    fontBody: "'Inter', 'Segoe UI', system-ui, sans-serif",
    fontMono: "'JetBrains Mono', ui-monospace, monospace",
  },
  mint: {
    id: 'mint',
    label: 'Modern Mint',
    description: 'Fresh and approachable. Highlights credit-positive products.',
    brandNavy: '#0E2A2A',
    brandBlue: '#0E9E7E',
    brandAccent: '#34E5B5',
    fontDisplay: "'Manrope', 'Segoe UI', system-ui, sans-serif",
    fontBody: "'Inter', 'Segoe UI', system-ui, sans-serif",
    fontMono: "'JetBrains Mono', ui-monospace, monospace",
  },
  bold: {
    id: 'bold',
    label: 'Bold Dark',
    description: 'High-contrast, premium. Stands out in saturated decks.',
    brandNavy: '#07080F',
    brandBlue: '#6366F1',
    brandAccent: '#A78BFA',
    fontDisplay: "'Space Grotesk', 'Segoe UI', system-ui, sans-serif",
    fontBody: "'Inter', 'Segoe UI', system-ui, sans-serif",
    fontMono: "'JetBrains Mono', ui-monospace, monospace",
  },
};

export const DEFAULT_THEME_ID = 'creditcheck';

export const THEME_KEYS = [
  'brandNavy',
  'brandBlue',
  'brandAccent',
  'fontDisplay',
  'fontBody',
  'fontMono',
];

export function listThemes(custom = []) {
  return [...Object.values(BUILTIN_THEMES), ...custom];
}

export function getTheme(id, custom = []) {
  return BUILTIN_THEMES[id] || custom.find((t) => t.id === id) || BUILTIN_THEMES[DEFAULT_THEME_ID];
}

export function applyTheme(state, themeId, custom = []) {
  const theme = getTheme(themeId, custom);
  const patch = {};
  for (const k of THEME_KEYS) {
    if (theme[k] !== undefined) patch[k] = theme[k];
  }
  return { ...state, ...patch, activeThemeId: theme.id };
}

export function pickThemePatch(theme) {
  const patch = {};
  for (const k of THEME_KEYS) {
    if (theme[k] !== undefined) patch[k] = theme[k];
  }
  return patch;
}
