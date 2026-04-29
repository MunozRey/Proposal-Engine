// Fails CI if any locale is missing a key that exists in `en`.
// Helps keep translations in sync when adding new strings.

import { describe, it, expect } from 'vitest';
import { LOCALES, SUPPORTED_LOCALES } from './translate.js';

function flatten(obj, prefix = '') {
  const out = {};
  for (const [k, v] of Object.entries(obj)) {
    const path = prefix ? `${prefix}.${k}` : k;
    if (v && typeof v === 'object' && !Array.isArray(v)) Object.assign(out, flatten(v, path));
    else out[path] = v;
  }
  return out;
}

describe('i18n coverage', () => {
  const enFlat = flatten(LOCALES.en);
  const enKeys = new Set(Object.keys(enFlat));

  for (const code of SUPPORTED_LOCALES.filter((c) => c !== 'en')) {
    it(`locale "${code}" has all keys present in "en"`, () => {
      const localeFlat = flatten(LOCALES[code]);
      const missing = [...enKeys].filter((k) => !(k in localeFlat));
      expect(missing).toEqual([]);
    });
  }
});
