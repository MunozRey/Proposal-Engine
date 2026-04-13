import { getTemplateDefaults } from './templateDefaults.js';
/**
 * @typedef {'wl'|'leads'|'combo'} ProposalType
 *
 * @typedef {Object} Step
 * @property {string} num   - e.g. '01'
 * @property {string} title
 * @property {string} desc
 *
 * @typedef {Object} Plan
 * @property {string} name    - e.g. 'Starter'
 * @property {string} price   - e.g. '€49'
 * @property {string} per     - e.g. '/month'
 * @property {string} verifs  - e.g. '50'
 * @property {string} avg     - e.g. '€0,98'
 * @property {string} extra   - e.g. '€1,20'
 * @property {boolean} rec    - recommended flag
 *
 * @typedef {Object} CplLead
 * @property {string} type
 * @property {string} price
 * @property {string} desc
 *
 * @typedef {Object} CpaTramo
 * @property {string} importe
 * @property {string} fee
 *
 * @typedef {Object} LeadsState
 * @property {string} overviewIntro
 * @property {string} cplIntro
 * @property {CplLead[]} cplLeads
 * @property {string[]} cplFeatures
 * @property {string} cplCalcTitle
 * @property {string} cplCalcText
 * @property {string[]} cplNotes
 * @property {string} cpaIntro
 * @property {CpaTramo[]} cpaTramos
 * @property {string} cpaCommission
 * @property {string} cpaCommissionBase
 * @property {string[]} cpaFeatures
 * @property {string} cpaCalcTitle
 * @property {string} cpaCalcText
 * @property {string[]} cpaNotes
 * @property {string} hybridIntro
 * @property {string} hybridCPLPrice
 * @property {string} hybridCPAFee
 * @property {string} hybridCPAComm
 * @property {string[]} hybridFeatures
 * @property {string} hybridCalcTitle
 * @property {string} hybridCalcText
 * @property {string[]} hybridNotes
 *
 * @typedef {Object} Typo
 * @property {number} heading
 * @property {number} subhead
 * @property {number} body
 * @property {number} small
 * @property {number} tableBody
 * @property {number} note
 * @property {number} micro
 *
 * @typedef {Object} AppState
 * @property {ProposalType} proposalType
 * @property {'en'|'es'} language
 * @property {string} clientName
 * @property {string} clientLogoUrl
 * @property {string} ccLogoUrl
 * @property {string} date
 * @property {string} productTitle
 * @property {string} coverBadge
 * @property {string} coverLine1
 * @property {string} coverLine3
 * @property {string} footerLeft
 * @property {string} footerRight
 * @property {string[]} hiddenPages
 * @property {string} introText
 * @property {string} setupFee
 * @property {Step[]} steps
 * @property {string[]} featuresL
 * @property {string[]} featuresR
 * @property {Plan[]} plans
 * @property {LeadsState} leads
 * @property {Typo} typo
 */

/* Auto-generate current month in English */
const autoDate = (() => {
  const d = new Intl.DateTimeFormat('en', { month: 'long', year: 'numeric' }).format(new Date());
  return d.charAt(0).toUpperCase() + d.slice(1);
})();

export const INIT = {
  proposalType: 'wl', // 'wl' | 'leads'
  language: 'en',

  // ── Shared ────────────────────────────────────────────────────
  clientName: '',
  clientLogoUrl: '',
  ccLogoUrl: '',
  date: autoDate,
  productTitle: '',
  coverBadge: 'PARTNERSHIP PROPOSAL',
  coverLine1: '',
  coverLine3: '',

  // ── Brand colors (empty = use defaults from constants.js) ──
  brandNavy: '',
  brandBlue: '',

  // ── Footer / Header (editables) ─────────────────────────────
  footerLeft: 'Your Company · Confidential',
  footerRight: 'your-domain.com',

  // ── Page visibility (set of page labels to HIDE) ─────────────
  hiddenPages: [],

  ...getTemplateDefaults('en'),

  // ── Typography (sizes in px) ─────────────────────────────────
  typo: {
    heading: 18,
    subhead: 14,
    body: 12,
    small: 10,
    tableBody: 10,
    note: 8,
    micro: 7,
  },
};
