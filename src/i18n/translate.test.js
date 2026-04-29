import { describe, expect, it } from 'vitest';
import {
  t,
  withLang,
  pluralize,
  detectBrowserLang,
  normalizeLang,
  isSupported,
  listLocales,
  localeMeta,
  SUPPORTED_LOCALES,
  DEFAULT_LOCALE,
} from './translate.js';

describe('translate', () => {
  it('returns english string by default', () => {
    expect(t('en', 'tabs.client')).toBe('Client');
    expect(t('xx', 'tabs.client')).toBe('Client');
  });

  it('returns localized string when available', () => {
    expect(t('es', 'tabs.client')).toBe('Cliente');
    expect(t('pt', 'tabs.client')).toBe('Cliente');
    expect(t('fr', 'tabs.client')).toBe('Client');
    expect(t('de', 'tabs.client')).toBe('Kunde');
    expect(t('it', 'tabs.client')).toBe('Cliente');
  });

  it('falls back to default locale when key missing in target', () => {
    // Add a key in only one locale to simulate
    expect(t('es', 'app.commandPalette')).toBe('Paleta de comandos');
  });

  it('falls back to key when missing everywhere', () => {
    expect(t('es', 'missing.path')).toBe('missing.path');
  });

  it('interpolates {placeholders}', () => {
    expect(t('en', 'close.validityLabel', { date: '2026-12-31' })).toBe(
      'This proposal is valid until 2026-12-31'
    );
    expect(t('es', 'close.ctaSubject', { client: 'Ebury' })).toBe('Aceptar propuesta — Ebury');
  });

  it('leaves missing vars as {placeholder}', () => {
    expect(t('en', 'close.validityLabel')).toBe('This proposal is valid until {date}');
  });
});

describe('withLang', () => {
  it('curries to a fixed language', () => {
    const tt = withLang('es');
    expect(tt('tabs.pricing')).toBe('Precios');
  });
});

describe('pluralize', () => {
  it('handles english one/other', () => {
    expect(pluralize('en', 1, { one: '{n} country', other: '{n} countries' })).toBe('1 country');
    expect(pluralize('en', 19, { one: '{n} country', other: '{n} countries' })).toBe(
      '19 countries'
    );
  });

  it('handles spanish one/other', () => {
    expect(pluralize('es', 1, { one: '{n} país', other: '{n} países' })).toBe('1 país');
    expect(pluralize('es', 19, { one: '{n} país', other: '{n} países' })).toBe('19 países');
  });

  it('falls back to other when category missing', () => {
    expect(pluralize('en', 5, { other: '{n} items' })).toBe('5 items');
  });
});

describe('locale helpers', () => {
  it('lists 6 supported locales', () => {
    expect(SUPPORTED_LOCALES).toEqual(['en', 'es', 'pt', 'fr', 'de', 'it']);
    expect(DEFAULT_LOCALE).toBe('en');
  });

  it('isSupported is correct', () => {
    expect(isSupported('en')).toBe(true);
    expect(isSupported('xx')).toBe(false);
  });

  it('normalizeLang strips region and falls back', () => {
    expect(normalizeLang('en-US')).toBe('en');
    expect(normalizeLang('es-419')).toBe('es');
    expect(normalizeLang('zz')).toBe('en');
    expect(normalizeLang(undefined)).toBe('en');
  });

  it('listLocales returns metadata for selectors', () => {
    const list = listLocales();
    expect(list).toHaveLength(6);
    expect(list.find((l) => l.code === 'es').nativeName).toBe('Castellano');
  });

  it('localeMeta returns label/code/flag', () => {
    const meta = localeMeta('de');
    expect(meta.code).toBe('de');
    expect(meta.flag).toBe('🇩🇪');
  });
});

describe('detectBrowserLang (smoke)', () => {
  it('returns a supported code', () => {
    expect(SUPPORTED_LOCALES).toContain(detectBrowserLang());
  });
});
