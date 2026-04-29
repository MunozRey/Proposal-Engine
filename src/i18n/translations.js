// Backwards-compat shim. New code should import from `./translate.js`
// (which loads ./locales/{en,es,pt,fr,de,it}.js). This file remains so
// existing imports of `{ translations }` keep working until they migrate.

import { LOCALES } from './translate.js';

export const translations = LOCALES;
