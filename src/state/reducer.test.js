import { describe, it, expect } from 'vitest';
import { reducer } from './reducer.js';
import { INIT } from './initialState.js';

describe('reducer', () => {
  it('SET writes a top-level key', () => {
    const s = reducer(INIT, { t: 'SET', k: 'clientName', v: 'Ebury' });
    expect(s.clientName).toBe('Ebury');
  });

  it('PATCH merges a partial', () => {
    const s = reducer(INIT, { t: 'PATCH', v: { clientName: 'A', date: '2026' } });
    expect(s.clientName).toBe('A');
    expect(s.date).toBe('2026');
  });

  it('LOAD_THEME applies all patch keys and stamps activeThemeId', () => {
    const patch = { brandNavy: '#000', brandBlue: '#111', brandAccent: '#222' };
    const s = reducer(INIT, { t: 'LOAD_THEME', v: patch, id: 'mint' });
    expect(s.brandNavy).toBe('#000');
    expect(s.brandBlue).toBe('#111');
    expect(s.brandAccent).toBe('#222');
    expect(s.activeThemeId).toBe('mint');
  });

  it('CONTACT updates a single nested field', () => {
    const s = reducer(INIT, { t: 'CONTACT', k: 'email', v: 'sales@x.io' });
    expect(s.contact.email).toBe('sales@x.io');
    // other fields preserved
    expect(s.contact.name).toBe(INIT.contact.name);
  });

  it('METRIC_ADD appends a default metric', () => {
    const s = reducer(INIT, { t: 'METRIC_ADD' });
    expect(s.metrics).toHaveLength(1);
    expect(s.metrics[0]).toEqual({ value: '', label: '' });
  });

  it('METRIC edits a specific index', () => {
    const seeded = {
      ...INIT,
      metrics: [
        { value: '0', label: 'a' },
        { value: '0', label: 'b' },
      ],
    };
    const s = reducer(seeded, { t: 'METRIC', i: 1, f: 'value', v: '99' });
    expect(s.metrics[0].value).toBe('0');
    expect(s.metrics[1].value).toBe('99');
  });

  it('METRIC_DEL removes the right index', () => {
    const seeded = { ...INIT, metrics: [{ value: 'a' }, { value: 'b' }, { value: 'c' }] };
    const s = reducer(seeded, { t: 'METRIC_DEL', i: 1 });
    expect(s.metrics.map((x) => x.value)).toEqual(['a', 'c']);
  });

  it('VALUEPROP_ADD / VALUEPROP edit / VALUEPROP_DEL', () => {
    let s = reducer(INIT, { t: 'VALUEPROP_ADD' });
    s = reducer(s, { t: 'VALUEPROP', i: 0, f: 'title', v: 'Hello' });
    expect(s.valueProps[0].title).toBe('Hello');
    s = reducer(s, { t: 'VALUEPROP_DEL', i: 0 });
    expect(s.valueProps).toHaveLength(0);
  });

  it('CLOSESTEP_ADD / CLOSESTEP edit / CLOSESTEP_DEL', () => {
    let s = reducer(INIT, { t: 'CLOSESTEP_ADD' });
    s = reducer(s, { t: 'CLOSESTEP', i: 0, f: 'desc', v: 'desc text' });
    expect(s.closeSteps[0].desc).toBe('desc text');
    s = reducer(s, { t: 'CLOSESTEP_DEL', i: 0 });
    expect(s.closeSteps).toHaveLength(0);
  });

  it('TOGGLE_PAGE adds and removes', () => {
    let s = reducer(INIT, { t: 'TOGGLE_PAGE', k: 'whyCC' });
    expect(s.hiddenPages).toContain('whyCC');
    s = reducer(s, { t: 'TOGGLE_PAGE', k: 'whyCC' });
    expect(s.hiddenPages).not.toContain('whyCC');
  });

  it('TYPO parses to number', () => {
    const s = reducer(INIT, { t: 'TYPO', k: 'body', v: '14' });
    expect(s.typo.body).toBe(14);
  });

  it('RESET keeps language', () => {
    const seeded = { ...INIT, language: 'es', clientName: 'X' };
    const s = reducer(seeded, { t: 'RESET' });
    expect(s.language).toBe('es');
    expect(s.clientName).toBe('');
  });
});
