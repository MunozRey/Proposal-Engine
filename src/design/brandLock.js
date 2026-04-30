export const CREDITCHECK_BRAND = Object.freeze({
  navy: '#0A1264',
  blue: '#005EFF',
  accent: '#FFCC00',
  // Single-quoted font names so the value can be embedded inside a
  // double-quoted inline `style="…"` attribute without breaking parsing.
  fontDisplay: "'Larken', 'IBM Plex Serif', Georgia, serif",
  fontBody: "'IBM Plex Sans', 'Inter', 'Segoe UI', system-ui, sans-serif",
  fontMono: "'IBM Plex Mono', 'JetBrains Mono', ui-monospace, monospace",
  themeId: 'creditcheck',
});

export function enforceCreditcheckBrand(state = {}) {
  return {
    ...state,
    brandNavy: CREDITCHECK_BRAND.navy,
    brandBlue: CREDITCHECK_BRAND.blue,
    brandAccent: CREDITCHECK_BRAND.accent,
    fontDisplay: CREDITCHECK_BRAND.fontDisplay,
    fontBody: CREDITCHECK_BRAND.fontBody,
    fontMono: CREDITCHECK_BRAND.fontMono,
    activeThemeId: CREDITCHECK_BRAND.themeId,
    ccLogoUrl: '',
  };
}
