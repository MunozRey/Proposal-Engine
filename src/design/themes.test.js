import { describe, it, expect } from 'vitest';
import { BUILTIN_THEMES, THEME_KEYS, listThemes, getTheme, applyTheme } from './themes.js';

describe('themes', () => {
  it('exposes the builtin presets including official creditcheck', () => {
    expect(BUILTIN_THEMES.creditcheck).toBeDefined();
    expect(BUILTIN_THEMES.creditcheck.brandNavy).toBe('#0A1264');
    expect(BUILTIN_THEMES.creditcheck.brandBlue).toBe('#005EFF');
    expect(BUILTIN_THEMES.creditcheck.brandAccent).toBe('#FFCC00');
    expect(BUILTIN_THEMES.corporate).toBeDefined();
    expect(BUILTIN_THEMES.mint).toBeDefined();
    expect(BUILTIN_THEMES.bold).toBeDefined();
  });

  it('listThemes merges builtins and custom', () => {
    const custom = [
      {
        id: 'custom1',
        label: 'Custom 1',
        brandNavy: '#000',
        brandBlue: '#111',
        brandAccent: '#222',
      },
    ];
    const all = listThemes(custom);
    expect(all).toHaveLength(5);
    expect(all.find((t) => t.id === 'custom1')).toBeDefined();
  });

  it('getTheme falls back to creditcheck', () => {
    expect(getTheme('does-not-exist').id).toBe('creditcheck');
  });

  it('applyTheme writes all theme keys to state and stamps activeThemeId', () => {
    const next = applyTheme({ unrelated: 'keep' }, 'mint');
    expect(next.unrelated).toBe('keep');
    expect(next.activeThemeId).toBe('mint');
    for (const k of THEME_KEYS) {
      expect(next[k]).toBe(BUILTIN_THEMES.mint[k]);
    }
  });

  it('applyTheme works with custom themes', () => {
    const custom = [{ id: 'custom1', brandNavy: '#000', brandBlue: '#111', brandAccent: '#222' }];
    const next = applyTheme({}, 'custom1', custom);
    expect(next.activeThemeId).toBe('custom1');
    expect(next.brandNavy).toBe('#000');
  });
});
