import { describe, it, expect } from 'vitest';
import {
  isUrl,
  isDomain,
  isEmail,
  isHexColor,
  isPositiveNumber,
  isInteger,
  isRequired,
  maxLength,
  combine,
  validateField,
} from './validators.js';

describe('validators', () => {
  describe('isUrl', () => {
    it('accepts empty', () => expect(isUrl('').ok).toBe(true));
    it('accepts https', () => expect(isUrl('https://creditcheck.com/path').ok).toBe(true));
    it('rejects ftp', () => expect(isUrl('ftp://x.com').ok).toBe(false));
    it('rejects garbage', () => expect(isUrl('not a url').ok).toBe(false));
  });

  describe('isDomain', () => {
    it('accepts simple domain', () => expect(isDomain('example.com').ok).toBe(true));
    it('accepts subdomain', () => expect(isDomain('app.example.co.uk').ok).toBe(true));
    it('rejects spaces', () => expect(isDomain('not a domain').ok).toBe(false));
    it('rejects no tld', () => expect(isDomain('localhost').ok).toBe(false));
  });

  describe('isEmail', () => {
    it('accepts valid', () => expect(isEmail('a@b.co').ok).toBe(true));
    it('rejects no @', () => expect(isEmail('a.b.co').ok).toBe(false));
    it('rejects no tld', () => expect(isEmail('a@b').ok).toBe(false));
  });

  describe('isHexColor', () => {
    it('accepts 3-digit', () => expect(isHexColor('#abc').ok).toBe(true));
    it('accepts 6-digit', () => expect(isHexColor('#1858F5').ok).toBe(true));
    it('accepts 8-digit alpha', () => expect(isHexColor('#1858F5FF').ok).toBe(true));
    it('rejects without #', () => expect(isHexColor('1858F5').ok).toBe(false));
    it('rejects bad chars', () => expect(isHexColor('#GGGGGG').ok).toBe(false));
  });

  describe('isPositiveNumber', () => {
    it('rejects zero by default', () => expect(isPositiveNumber(0).ok).toBe(false));
    it('accepts zero with allowZero', () =>
      expect(isPositiveNumber(0, { allowZero: true }).ok).toBe(true));
    it('rejects negative', () => expect(isPositiveNumber(-1).ok).toBe(false));
    it('rejects non-number', () => expect(isPositiveNumber('abc').ok).toBe(false));
    it('accepts numeric string', () => expect(isPositiveNumber('42').ok).toBe(true));
  });

  describe('isInteger', () => {
    it('rejects float', () => expect(isInteger(1.5).ok).toBe(false));
    it('accepts integer', () => expect(isInteger(42).ok).toBe(true));
  });

  describe('isRequired', () => {
    it('rejects empty string', () => expect(isRequired('').ok).toBe(false));
    it('rejects whitespace-only', () => expect(isRequired('   ').ok).toBe(false));
    it('accepts populated', () => expect(isRequired('hello').ok).toBe(true));
  });

  describe('maxLength', () => {
    it('accepts short', () => expect(maxLength('abc', 5).ok).toBe(true));
    it('rejects long', () => expect(maxLength('abcdef', 3).ok).toBe(false));
  });

  describe('combine + validateField', () => {
    it('returns first failure', () => {
      const result = validateField('', [isRequired, isEmail]);
      expect(result.ok).toBe(false);
      expect(result.message).toBe('Required');
    });
    it('passes when all rules pass', () => {
      const result = validateField('hello@x.io', [isRequired, isEmail]);
      expect(result.ok).toBe(true);
    });
    it('combine works the same way', () => {
      const all = combine(isRequired, isEmail);
      expect(all('hello@x.io').ok).toBe(true);
      expect(all('').ok).toBe(false);
    });
  });
});
