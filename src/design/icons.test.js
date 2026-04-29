import { describe, it, expect } from 'vitest';
import { icon, ICON_NAMES } from './icons.js';

describe('icons', () => {
  it('exposes a non-empty name list', () => {
    expect(ICON_NAMES.length).toBeGreaterThan(10);
    expect(ICON_NAMES).toContain('checkCircle');
    expect(ICON_NAMES).toContain('arrowRight');
  });

  it('returns a valid SVG string for every named icon', () => {
    for (const name of ICON_NAMES) {
      const svg = icon(name);
      expect(svg, name).toContain('<svg');
      expect(svg, name).toContain('</svg>');
    }
  });

  it('returns empty string for unknown icon', () => {
    expect(icon('does-not-exist')).toBe('');
  });

  it('respects custom size', () => {
    const svg = icon('checkCircle', { size: 32 });
    expect(svg).toContain('width="32"');
    expect(svg).toContain('height="32"');
  });

  it('respects custom color', () => {
    const svg = icon('arrowRight', { color: '#FFCC00' });
    expect(svg).toContain('#FFCC00');
  });

  it('stepCircle accepts a number string', () => {
    const svg = icon('stepCircle', { num: '03' });
    expect(svg).toContain('03');
  });
});
