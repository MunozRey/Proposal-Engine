import { describe, it, expect } from 'vitest';
import { tokens, TOKEN_DEFAULTS } from './tokens.js';

describe('tokens', () => {
  it('returns defaults when no state is given', () => {
    const t = tokens();
    expect(t.color.brand.navy).toBe(TOKEN_DEFAULTS.brand.navy);
    expect(t.color.brand.blue).toBe(TOKEN_DEFAULTS.brand.blue);
    expect(t.color.brand.accent).toBe(TOKEN_DEFAULTS.brand.accent);
    expect(t.type.scale.body).toBe(TOKEN_DEFAULTS.typo.scale.body);
  });

  it('overrides brand colors from state', () => {
    const t = tokens({ brandNavy: '#000000', brandBlue: '#FF0000', brandAccent: '#00FF00' });
    expect(t.color.brand.navy).toBe('#000000');
    expect(t.color.brand.blue).toBe('#FF0000');
    expect(t.color.brand.accent).toBe('#00FF00');
  });

  it('respects legacy typo size keys', () => {
    const t = tokens({ typo: { heading: 22, body: 9, small: 7 } });
    expect(t.type.scale.h2).toBe(22);
    expect(t.type.scale.body).toBe(9);
    expect(t.type.scale.bodySm).toBe(7);
  });

  it('exposes leadsAccent palette', () => {
    const t = tokens();
    expect(t.leadsAccent.CPL).toBeDefined();
    expect(t.leadsAccent.CPA).toBeDefined();
    expect(t.leadsAccent.Hybrid).toBeDefined();
    expect(t.leadsAccent.CPA).not.toBe(t.leadsAccent.CPL);
    expect(t.leadsAccent.Hybrid).not.toBe(t.leadsAccent.CPL);
  });

  it('exposes A4 page geometry', () => {
    const t = tokens();
    expect(t.page.width).toBeCloseTo(595.28);
    expect(t.page.height).toBeCloseTo(841.89);
  });

  it('inverse surface follows brand navy override', () => {
    const t = tokens({ brandNavy: '#123456' });
    expect(t.color.surface.inverse).toBe('#123456');
  });
});
