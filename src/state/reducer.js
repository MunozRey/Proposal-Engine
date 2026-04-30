import { INIT } from './initialState.js';
import { getTemplateDefaults } from './templateDefaults.js';
import { enforceCreditcheckBrand } from '../design/brandLock.js';

/**
 * Actions use shorthand keys for compactness:
 *   t = action type, k = key, v = value,
 *   i = index, f = field, arr = array name,
 *   side = 'featuresL'|'featuresR', item = new object to add
 *
 * @typedef {Object} Action
 * @property {string} t - Action type (SET, RESET, LOAD, TOGGLE_PAGE, STEP, etc.)
 * @property {string} [k] - Field key
 * @property {*} [v] - New value
 * @property {number} [i] - Array index
 * @property {string} [f] - Object field within array item
 * @property {string} [arr] - Array name within leads
 * @property {string} [side] - 'featuresL' or 'featuresR'
 * @property {Object} [item] - New item for array add operations
 *
 * @param {import('./initialState.js').AppState} s - Current state
 * @param {Action} a - Action to process
 * @returns {import('./initialState.js').AppState} New state
 */
export function reducer(s, a) {
  if (
    a?.t === 'SET' &&
    [
      'brandNavy',
      'brandBlue',
      'brandAccent',
      'fontDisplay',
      'fontBody',
      'fontMono',
      'activeThemeId',
      'ccLogoUrl',
    ].includes(a.k)
  ) {
    return s;
  }
  switch (a.t) {
    // ── Generic ─────────────────────────────────────────────────
    case 'SET':
      return { ...s, [a.k]: a.v };

    case 'RESET':
      return enforceCreditcheckBrand({
        ...INIT,
        ...getTemplateDefaults(s.language || 'en'),
        language: s.language || 'en',
      });

    case 'LOAD':
      return enforceCreditcheckBrand({ ...INIT, ...a.v });

    case 'LOCALIZE_TEMPLATE':
      return enforceCreditcheckBrand({ ...s, ...getTemplateDefaults(a.v), language: a.v });

    // Apply a theme preset (a is the patch object: { brandNavy, brandBlue, … }).
    case 'LOAD_THEME':
      return enforceCreditcheckBrand(s);

    // Generic patch — merge a partial object into state. Useful for org bulk edits.
    case 'PATCH':
      return enforceCreditcheckBrand({ ...s, ...a.v });

    // Update nested contact card.
    case 'CONTACT':
      return { ...s, contact: { ...s.contact, [a.k]: a.v } };

    // Edit/add/remove for metrics, valueProps and closeSteps arrays.
    case 'METRIC':
      return { ...s, metrics: s.metrics.map((x, i) => (i === a.i ? { ...x, [a.f]: a.v } : x)) };
    case 'METRIC_ADD':
      return { ...s, metrics: [...(s.metrics || []), a.item || { value: '', label: '' }] };
    case 'METRIC_DEL':
      return { ...s, metrics: (s.metrics || []).filter((_, i) => i !== a.i) };
    case 'VALUEPROP':
      return {
        ...s,
        valueProps: s.valueProps.map((x, i) => (i === a.i ? { ...x, [a.f]: a.v } : x)),
      };
    case 'VALUEPROP_ADD':
      return { ...s, valueProps: [...(s.valueProps || []), a.item || { title: '', desc: '' }] };
    case 'VALUEPROP_DEL':
      return { ...s, valueProps: (s.valueProps || []).filter((_, i) => i !== a.i) };
    case 'CLOSESTEP':
      return {
        ...s,
        closeSteps: s.closeSteps.map((x, i) => (i === a.i ? { ...x, [a.f]: a.v } : x)),
      };
    case 'CLOSESTEP_ADD':
      return { ...s, closeSteps: [...(s.closeSteps || []), a.item || { title: '', desc: '' }] };
    case 'CLOSESTEP_DEL':
      return { ...s, closeSteps: (s.closeSteps || []).filter((_, i) => i !== a.i) };

    // ── Page visibility ─────────────────────────────────────────
    case 'TOGGLE_PAGE': {
      const set = new Set(s.hiddenPages);
      if (set.has(a.k)) set.delete(a.k);
      else set.add(a.k);
      return { ...s, hiddenPages: [...set] };
    }

    // ── White-Label ─────────────────────────────────────────────
    case 'STEP':
      return { ...s, steps: s.steps.map((x, i) => (i === a.i ? { ...x, [a.f]: a.v } : x)) };
    case 'STEP_ADD': {
      const num = String(s.steps.length + 1).padStart(2, '0');
      return { ...s, steps: [...s.steps, { num, title: 'New step', desc: 'Step description.' }] };
    }
    case 'STEP_DEL':
      return {
        ...s,
        steps: s.steps
          .filter((_, i) => i !== a.i)
          .map((x, i) => ({ ...x, num: String(i + 1).padStart(2, '0') })),
      };
    case 'FEAT': {
      const arr = [...s[a.side]];
      arr[a.i] = a.v;
      return { ...s, [a.side]: arr };
    }
    case 'FEAT_ADD':
      return { ...s, [a.side]: [...s[a.side], 'New item'] };
    case 'FEAT_DEL':
      return { ...s, [a.side]: s[a.side].filter((_, i) => i !== a.i) };
    case 'PLAN':
      if (a.f === 'rec') {
        // Only one recommended plan is allowed at a time.
        if (a.v) {
          return {
            ...s,
            plans: s.plans.map((x, idx) => ({ ...x, rec: idx === a.i })),
          };
        }
        return {
          ...s,
          plans: s.plans.map((x, idx) => (idx === a.i ? { ...x, rec: false } : x)),
        };
      }
      return { ...s, plans: s.plans.map((x, i) => (i === a.i ? { ...x, [a.f]: a.v } : x)) };

    // ── Leads — simple fields ───────────────────────────────────
    case 'LEADS_SET':
      return { ...s, leads: { ...s.leads, [a.k]: a.v } };

    // ── Leads — object arrays (cplLeads, cpaTramos) ─────────────
    case 'LEADS_ARR_EDIT':
      return {
        ...s,
        leads: {
          ...s.leads,
          [a.arr]: s.leads[a.arr].map((x, i) => (i === a.i ? { ...x, [a.f]: a.v } : x)),
        },
      };
    case 'LEADS_ARR_ADD':
      return { ...s, leads: { ...s.leads, [a.arr]: [...s.leads[a.arr], a.item] } };
    case 'LEADS_ARR_DEL':
      return { ...s, leads: { ...s.leads, [a.arr]: s.leads[a.arr].filter((_, i) => i !== a.i) } };

    // ── Leads — string arrays (features, notes) ─────────────────
    case 'LEADS_STR_EDIT': {
      const next = [...s.leads[a.arr]];
      next[a.i] = a.v;
      return { ...s, leads: { ...s.leads, [a.arr]: next } };
    }
    case 'LEADS_STR_ADD':
      return { ...s, leads: { ...s.leads, [a.arr]: [...s.leads[a.arr], 'New item'] } };
    case 'LEADS_STR_DEL':
      return { ...s, leads: { ...s.leads, [a.arr]: s.leads[a.arr].filter((_, i) => i !== a.i) } };

    // ── Typography ──────────────────────────────────────────────
    case 'TYPO':
      return { ...s, typo: { ...s.typo, [a.k]: parseFloat(a.v) || s.typo[a.k] } };

    default:
      return s;
  }
}
