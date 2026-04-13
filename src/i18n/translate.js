import { translations } from './translations.js';

function resolvePath(obj, key) {
  return key
    .split('.')
    .reduce((acc, part) => (acc && acc[part] !== undefined ? acc[part] : undefined), obj);
}

export function t(lang, key) {
  const safeLang = lang === 'es' ? 'es' : 'en';
  return resolvePath(translations[safeLang], key) ?? resolvePath(translations.en, key) ?? key;
}
