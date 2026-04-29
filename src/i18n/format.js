// Locale-aware formatting helpers built on Intl.
// Currency / date / number / percent strings are NEVER hardcoded — always pass through these.

import { normalizeLang } from './translate.js';

export const SUPPORTED_CURRENCIES = ['EUR', 'USD', 'GBP', 'BRL', 'MXN', 'CHF'];
export const DEFAULT_CURRENCY = 'EUR';

export function formatCurrency(value, currency = DEFAULT_CURRENCY, lang) {
  const num = Number(value);
  if (!Number.isFinite(num)) return '';
  try {
    return new Intl.NumberFormat(normalizeLang(lang), {
      style: 'currency',
      currency,
      maximumFractionDigits: Number.isInteger(num) ? 0 : 2,
    }).format(num);
  } catch {
    return `${currency} ${num}`;
  }
}

export function formatNumber(value, lang, options = {}) {
  const num = Number(value);
  if (!Number.isFinite(num)) return '';
  return new Intl.NumberFormat(normalizeLang(lang), options).format(num);
}

export function formatPercent(value, lang, fractionDigits = 1) {
  const num = Number(value);
  if (!Number.isFinite(num)) return '';
  return new Intl.NumberFormat(normalizeLang(lang), {
    style: 'percent',
    maximumFractionDigits: fractionDigits,
  }).format(num);
}

export function formatDate(value, lang, options = { month: 'long', year: 'numeric' }) {
  const d = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(d.getTime())) return '';
  return new Intl.DateTimeFormat(normalizeLang(lang), options).format(d);
}

export function formatMonthYear(value, lang) {
  return formatDate(value, lang, { month: 'long', year: 'numeric' });
}

export function formatDateLong(value, lang) {
  return formatDate(value, lang, { day: 'numeric', month: 'long', year: 'numeric' });
}

export function formatDateShort(value, lang) {
  return formatDate(value, lang, { day: '2-digit', month: '2-digit', year: 'numeric' });
}

export function listCurrencies(lang) {
  const dn = (() => {
    try {
      return new Intl.DisplayNames([normalizeLang(lang)], { type: 'currency' });
    } catch {
      return null;
    }
  })();
  return SUPPORTED_CURRENCIES.map((code) => ({
    code,
    label: dn ? `${code} — ${dn.of(code)}` : code,
  }));
}
