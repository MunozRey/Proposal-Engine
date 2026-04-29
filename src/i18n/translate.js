import { en } from './locales/en.js';
import { es } from './locales/es.js';
import { pt } from './locales/pt.js';
import { fr } from './locales/fr.js';
import { de } from './locales/de.js';
import { it } from './locales/it.js';

export const SUPPORTED_LOCALES = ['en', 'es', 'pt', 'fr', 'de', 'it'];
export const DEFAULT_LOCALE = 'en';

export const LOCALES = { en, es, pt, fr, de, it };

export function isSupported(lang) {
  return SUPPORTED_LOCALES.includes(lang);
}

export function normalizeLang(lang) {
  if (!lang) return DEFAULT_LOCALE;
  const code = String(lang).toLowerCase().split('-')[0];
  return isSupported(code) ? code : DEFAULT_LOCALE;
}

export function detectBrowserLang() {
  if (typeof navigator === 'undefined') return DEFAULT_LOCALE;
  const candidates = navigator.languages || [navigator.language || DEFAULT_LOCALE];
  for (const c of candidates) {
    const norm = normalizeLang(c);
    if (isSupported(norm)) return norm;
  }
  return DEFAULT_LOCALE;
}

function resolvePath(obj, key) {
  return key
    .split('.')
    .reduce((acc, part) => (acc && acc[part] !== undefined ? acc[part] : undefined), obj);
}

function interpolate(template, vars) {
  if (typeof template !== 'string' || !vars) return template;
  return template.replace(/\{(\w+)\}/g, (_, name) =>
    vars[name] !== undefined ? String(vars[name]) : `{${name}}`
  );
}

/**
 * Translate a key for a given language.
 *
 * Backwards-compatible signature: t(lang, key)
 * Extended:
 *   t(lang, key, vars)         interpolates {placeholders}
 *   t(lang, key, vars, opts)   opts.fallback = string to return if key missing
 *
 * Lookup order:
 *   requested locale → DEFAULT_LOCALE → opts.fallback → key (so missing keys are visible in dev).
 */
export function t(lang, key, vars, opts = {}) {
  const safeLang = normalizeLang(lang);
  const fromTarget = resolvePath(LOCALES[safeLang], key);
  const fromDefault = resolvePath(LOCALES[DEFAULT_LOCALE], key);
  const value = fromTarget ?? fromDefault ?? opts.fallback ?? key;
  return interpolate(value, vars);
}

/** Curried helper for components: const tt = withLang(lang); tt('tabs.client') */
export function withLang(lang) {
  return (key, vars, opts) => t(lang, key, vars, opts);
}

/**
 * Pluralize using Intl.PluralRules.
 *   pluralize('en', 3, { one: '{n} country', other: '{n} countries' })
 */
export function pluralize(lang, count, forms, vars = {}) {
  const safeLang = normalizeLang(lang);
  const rules = new Intl.PluralRules(safeLang);
  const cat = rules.select(count);
  const tpl = forms[cat] || forms.other || '';
  return interpolate(tpl, { n: count, ...vars });
}

/** Returns metadata for one locale (label, flag, native name). */
export function localeMeta(lang) {
  const safe = normalizeLang(lang);
  return LOCALES[safe]?.meta;
}

/** List all locale metadata for selectors. */
export function listLocales() {
  return SUPPORTED_LOCALES.map((code) => LOCALES[code].meta);
}
