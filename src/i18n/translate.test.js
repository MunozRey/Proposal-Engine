import { describe, expect, it } from 'vitest';
import { t } from './translate.js';

describe('translate helper', () => {
  it('returns english string by default', () => {
    expect(t('en', 'tabs.client')).toBe('Client');
    expect(t('xx', 'tabs.client')).toBe('Client');
  });

  it('returns spanish translation when available', () => {
    expect(t('es', 'tabs.client')).toBe('Cliente');
  });

  it('falls back to key when missing', () => {
    expect(t('es', 'missing.path')).toBe('missing.path');
  });
});
