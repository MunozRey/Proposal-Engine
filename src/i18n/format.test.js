import { describe, it, expect } from 'vitest';
import {
  formatCurrency,
  formatNumber,
  formatPercent,
  formatDate,
  formatMonthYear,
  listCurrencies,
  SUPPORTED_CURRENCIES,
  DEFAULT_CURRENCY,
} from './format.js';

describe('format', () => {
  it('formats currency in EUR with separators for large numbers', () => {
    const out = formatCurrency(12500, 'EUR', 'es');
    expect(out).toMatch(/12[.,\u00a0\u202f ]500/);
    expect(out).toMatch(/€/);
  });

  it('formats USD in en-US fashion', () => {
    const out = formatCurrency(1500.5, 'USD', 'en');
    expect(out).toContain('$');
    expect(out).toMatch(/1,500\.5/);
  });

  it('returns empty string for invalid number', () => {
    expect(formatCurrency('not a number', 'EUR', 'en')).toBe('');
  });

  it('formats numbers with locale separators', () => {
    expect(formatNumber(1234567, 'es')).toMatch(/1[.,]234[.,]567/);
  });

  it('formats percent', () => {
    const p = formatPercent(0.95, 'en');
    expect(p).toContain('95');
    expect(p).toContain('%');
  });

  it('formats month-year date', () => {
    const result = formatMonthYear(new Date(2026, 2, 15), 'en');
    expect(result.toLowerCase()).toContain('march');
    expect(result).toContain('2026');
  });

  it('formatDate accepts ISO strings', () => {
    expect(formatDate('2026-03-15', 'es')).toContain('2026');
  });

  it('listCurrencies returns codes from SUPPORTED_CURRENCIES', () => {
    const list = listCurrencies('en');
    const codes = list.map((c) => c.code);
    expect(codes).toEqual(SUPPORTED_CURRENCIES);
  });

  it('default currency is EUR', () => {
    expect(DEFAULT_CURRENCY).toBe('EUR');
  });
});
