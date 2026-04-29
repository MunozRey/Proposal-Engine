// Lightweight, dependency-free field validators.
// Each returns { ok: boolean, message?: string } so consumers can render inline errors.

export function isUrl(value) {
  if (!value) return { ok: true };
  try {
    const u = new URL(value);
    if (!['http:', 'https:'].includes(u.protocol)) {
      return { ok: false, message: 'URL must use http or https' };
    }
    return { ok: true };
  } catch {
    return { ok: false, message: 'Not a valid URL' };
  }
}

export function isDomain(value) {
  if (!value) return { ok: true };
  const v = String(value).trim().toLowerCase();
  const re = /^([a-z0-9](-?[a-z0-9])*)(\.[a-z0-9](-?[a-z0-9])*)+$/;
  return re.test(v) ? { ok: true } : { ok: false, message: 'Not a valid domain' };
}

export function isEmail(value) {
  if (!value) return { ok: true };
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(value) ? { ok: true } : { ok: false, message: 'Not a valid email' };
}

export function isHexColor(value) {
  if (!value) return { ok: true };
  const re = /^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6}|[0-9A-Fa-f]{8})$/;
  return re.test(value) ? { ok: true } : { ok: false, message: 'Use hex format like #1858F5' };
}

export function isPositiveNumber(value, { allowZero = false } = {}) {
  if (value === '' || value === null || value === undefined) return { ok: true };
  const n = Number(value);
  if (Number.isNaN(n)) return { ok: false, message: 'Must be a number' };
  if (allowZero ? n < 0 : n <= 0) {
    return { ok: false, message: allowZero ? 'Must be 0 or positive' : 'Must be positive' };
  }
  return { ok: true };
}

export function isInteger(value, opts = {}) {
  const num = isPositiveNumber(value, opts);
  if (!num.ok) return num;
  if (value === '' || value === null || value === undefined) return { ok: true };
  return Number.isInteger(Number(value))
    ? { ok: true }
    : { ok: false, message: 'Must be an integer' };
}

export function isRequired(value) {
  const v = typeof value === 'string' ? value.trim() : value;
  if (v === '' || v === null || v === undefined) {
    return { ok: false, message: 'Required' };
  }
  return { ok: true };
}

export function maxLength(value, max) {
  if (!value) return { ok: true };
  return String(value).length <= max
    ? { ok: true }
    : { ok: false, message: `Max ${max} characters` };
}

export function combine(...validators) {
  return (value) => {
    for (const v of validators) {
      const result = v(value);
      if (!result.ok) return result;
    }
    return { ok: true };
  };
}

export function validateField(value, rules = []) {
  for (const rule of rules) {
    const result = typeof rule === 'function' ? rule(value) : rule;
    if (result && !result.ok) return result;
  }
  return { ok: true };
}
