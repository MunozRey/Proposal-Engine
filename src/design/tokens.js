// Single source of truth for design tokens.
// Resolves runtime overrides from state (brand colors, typography sizes, fonts).
// Both htmlRenderer (preview) and pdfRenderer (export) consume the resolved object.

// Note: legacy NAVY/BLUE constants in src/constants.js still exist for
// page generators that import them directly. tokens() always exposes the
// official creditchecker.io palette regardless.

// Brand identity sourced from creditchecker.io (cc-dark-blue, cc-light-blue,
// EU-yellow accent, IBM Plex Sans body, Larken serif display).
const DEFAULTS = Object.freeze({
  brand: { navy: '#0A1264', blue: '#005EFF', accent: '#FFCC00' },
  typo: {
    family: {
      display: '"Larken", "IBM Plex Serif", "Source Serif 4", "Charter", "Cambria", Georgia, serif',
      body: '"IBM Plex Sans", "Inter", "Segoe UI", system-ui, sans-serif',
      mono: '"IBM Plex Mono", "JetBrains Mono", ui-monospace, SFMono-Regular, monospace',
    },
    // points (jsPDF unit:'pt' uses these directly; preview scales via CSS transform)
    scale: {
      display: 56,
      h1: 40,
      h2: 28,
      h3: 20,
      body: 14,
      bodySm: 12,
      micro: 10,
      hairline: 8,
    },
    weight: { regular: 400, medium: 500, semibold: 600, bold: 700, black: 800 },
    leading: { tight: 1.1, snug: 1.25, normal: 1.5, relaxed: 1.7 },
    tracking: { tight: '-0.02em', normal: '0', wide: '0.05em', wider: '0.08em' },
  },
});

export function tokens(st = {}) {
  const brand = {
    navy: st.brandNavy || DEFAULTS.brand.navy,
    blue: st.brandBlue || DEFAULTS.brand.blue,
    accent: st.brandAccent || DEFAULTS.brand.accent,
  };

  const family = {
    display: st.fontDisplay || DEFAULTS.typo.family.display,
    body: st.fontBody || DEFAULTS.typo.family.body,
    mono: st.fontMono || DEFAULTS.typo.family.mono,
  };

  // st.typo is the legacy size config (kept for backwards-compat with stored proposals)
  const legacy = st.typo || {};
  const scale = {
    display: legacy.display ?? DEFAULTS.typo.scale.display,
    h1: legacy.h1 ?? DEFAULTS.typo.scale.h1,
    h2: legacy.heading ?? legacy.h2 ?? DEFAULTS.typo.scale.h2,
    h3: legacy.subhead ?? legacy.h3 ?? DEFAULTS.typo.scale.h3,
    body: legacy.body ?? DEFAULTS.typo.scale.body,
    bodySm: legacy.small ?? legacy.bodySm ?? DEFAULTS.typo.scale.bodySm,
    micro: legacy.micro ?? DEFAULTS.typo.scale.micro,
    hairline: legacy.note ?? legacy.hairline ?? DEFAULTS.typo.scale.hairline,
  };

  return {
    color: {
      brand,
      midnight: '#050B1E',
      surface: {
        paper: '#FFFFFF',
        subtle: '#F6F8FC',
        card: '#FFFFFF',
        inverse: brand.navy,
        inverseSoft: '#122749',
      },
      gray: {
        50: '#F6F8FC',
        100: '#E6ECF3',
        200: '#D5DDE7',
        300: '#C0CCDB',
        400: '#94A3B8',
        500: '#6B7B92',
        600: '#475569',
        700: '#2C3A52',
        800: '#1E293B',
        900: '#0F172A',
      },
      state: {
        success: '#22C55E',
        successSoft: '#DCFCE7',
        warning: '#F59E0B',
        warningSoft: '#FEF3C7',
        danger: '#EF4444',
        dangerSoft: '#FEE2E2',
        info: '#3B82F6',
        infoSoft: '#DBEAFE',
      },
      text: {
        primary: '#1A2332',
        muted: '#4A5568',
        subtle: '#94A3B8',
        invert: '#FFFFFF',
        invertMuted: 'rgba(255,255,255,0.7)',
        invertSubtle: 'rgba(255,255,255,0.4)',
      },
    },
    type: {
      family,
      scale,
      weight: DEFAULTS.typo.weight,
      leading: DEFAULTS.typo.leading,
      tracking: DEFAULTS.typo.tracking,
    },
    space: [0, 2, 4, 8, 12, 16, 24, 32, 48, 64, 96, 128],
    radius: { none: 0, sm: 4, md: 8, lg: 12, xl: 16, xxl: 24, pill: 9999 },
    shadow: {
      none: 'none',
      sm: '0 1px 2px rgba(10,27,54,.06)',
      md: '0 4px 12px rgba(10,27,54,.08)',
      lg: '0 12px 32px rgba(10,27,54,.12)',
      xl: '0 24px 48px rgba(10,27,54,.18)',
      glow: '0 0 0 4px rgba(24,88,245,.12)',
    },
    page: {
      width: 595.28,
      height: 841.89,
      marginX: 32,
      marginY: 28,
      headerH: 28,
      footerH: 24,
    },
    leadsAccent: {
      CPL: '#1858F5',
      CPA: '#22D3A0',
      Hybrid: '#7C5CFF',
    },
  };
}

export const TOKEN_DEFAULTS = DEFAULTS;
