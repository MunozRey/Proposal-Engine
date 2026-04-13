import { INIT } from './initialState.js';

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
  switch (a.t) {
    // ── Generic ─────────────────────────────────────────────────
    case 'SET':
      return { ...s, [a.k]: a.v };

    case 'RESET':
      return { ...INIT };

    case 'LOAD':
      return { ...INIT, ...a.v };

    // ── Page visibility ─────────────────────────────────────────
    case 'TOGGLE_PAGE': {
      const set = new Set(s.hiddenPages);
      if (set.has(a.k)) set.delete(a.k); else set.add(a.k);
      return { ...s, hiddenPages: [...set] };
    }

    // ── White-Label ─────────────────────────────────────────────
    case 'STEP':
      return { ...s, steps: s.steps.map((x, i) => i === a.i ? { ...x, [a.f]: a.v } : x) };
    case 'STEP_ADD': {
      const num = String(s.steps.length + 1).padStart(2, '0');
      return { ...s, steps: [...s.steps, { num, title: 'New step', desc: 'Step description.' }] };
    }
    case 'STEP_DEL':
      return { ...s, steps: s.steps.filter((_, i) => i !== a.i).map((x, i) => ({ ...x, num: String(i + 1).padStart(2, '0') })) };
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
      return { ...s, plans: s.plans.map((x, i) => i === a.i ? { ...x, [a.f]: a.v } : x) };

    // ── Leads — simple fields ───────────────────────────────────
    case 'LEADS_SET':
      return { ...s, leads: { ...s.leads, [a.k]: a.v } };

    // ── Leads — object arrays (cplLeads, cpaTramos) ─────────────
    case 'LEADS_ARR_EDIT':
      return { ...s, leads: { ...s.leads, [a.arr]: s.leads[a.arr].map((x, i) => i === a.i ? { ...x, [a.f]: a.v } : x) } };
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
