/**
 * @typedef {'wl'|'leads'} ProposalType
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

  // ── Shared ────────────────────────────────────────────────────
  clientName: 'Ebury',
  clientLogoUrl: '',
  ccLogoUrl: '',
  date: autoDate,
  productTitle: 'credit scoring',
  coverBadge: 'PARTNERSHIP PROPOSAL',
  coverLine1: '',
  coverLine3: '',

  // ── Brand colors (empty = use defaults from constants.js) ──
  brandNavy: '',
  brandBlue: '',

  // ── Footer / Header (editables) ─────────────────────────────
  footerLeft: 'CreditCheck · Clovr Labs S.L. · Confidential',
  footerRight: 'creditchecker.io',

  // ── Page visibility (set of page labels to HIDE) ─────────────
  hiddenPages: [],

  // ── White-Label ───────────────────────────────────────────────
  introText: '',
  setupFee: 'EUR 1.000',
  steps: [
    { num: '01', title: 'IBAN and applicant data received', desc: 'Send the IBAN and applicant details within your existing flow. The visual experience remains unchanged for the end user.' },
    { num: '02', title: 'Open Banking connection for income and solvency verification', desc: 'CreditCheck sends the account holder a secure link to complete the SCA flow. The screen shows only your brand identity.' },
    { num: '03', title: 'Real-time credit eligibility result', desc: 'The system returns: Eligible / Not eligible / Manual review, net income, effort ratio and risk profile.' },
  ],
  featuresL: [
    'Eligibility result with confidence level',
    'Monthly net income verified via Open Banking',
    'Coverage in 19 European countries (~2,000 banks)',
  ],
  featuresR: [
    'Anomaly detection and risk pattern analysis',
    'Effort ratio, DTI and risk profile',
    'Documented REST API + white-label widget',
  ],
  plans: [
    { name: 'Starter',    price: '€49',      per: '/mes', verifs: '50',   avg: '€0,98',    extra: '€1,20',     rec: false },
    { name: 'Growth',     price: '€99',      per: '/mes', verifs: '120',  avg: '€0,825',   extra: '€1,00',     rec: true  },
    { name: 'Enterprise', price: '€199',     per: '/mes', verifs: '300',  avg: '€0,663',   extra: '€0,85',     rec: false },
    { name: 'Custom',     price: 'Custom',   per: '',     verifs: '300+', avg: 'Vol-based', extra: 'Vol-based', rec: false },
  ],

  // ── Leads ─────────────────────────────────────────────────────
  leads: {
    overviewIntro: 'CreditCheck captures and delivers verified leads via Open Banking. We propose three collaboration models adapted to your commercial strategy and shared risk level.',

    // CPL
    cplIntro: 'Fixed fee per lead delivered with completed Open Banking. Predictable pricing with no conversion risk for the client.',
    cplLeads: [
      { type: 'Qualified Lead', price: '€12', desc: 'Open Banking completed · income and solvency verified · basic risk profile' },
      { type: 'Premium Lead',   price: '€20', desc: 'Full credit scoring · effort ratio · detailed risk profile' },
    ],
    cplFeatures: [
      'Lead delivered only if OB flow is completed',
      'Monthly net income verified',
      'Effort ratio and DTI calculated',
      'Name, IBAN and contact details validated',
    ],
    cplCalcTitle: 'Monthly calculation example',
    cplCalcText: '50 Qualified Leads × €12 = €600\n20 Premium Leads × €20 = €400\nTotal estimated: €1,000/month',
    cplNotes: [
      'Lead delivered only if the Open Banking flow is completed successfully.',
      'Monthly billing for leads actually delivered.',
      'Minimum monthly volume and conditions are negotiable.',
    ],

    // CPA
    cpaIntro: 'No cost until formalization. Fixed tiered fee based on loan amount plus commission on the approved amount.',
    cpaTramos: [
      { importe: 'Up to €5,000',        fee: '€30'  },
      { importe: '€5,001 – €15,000',    fee: '€60'  },
      { importe: '€15,001 – €30,000',   fee: '€100' },
      { importe: 'Over €30,000',        fee: '€150' },
    ],
    cpaCommission: '1.5%',
    cpaCommissionBase: 'approved amount',
    cpaFeatures: [
      'No cost if the lead does not convert',
      'Full incentive alignment between client and CreditCheck',
      'Tiered fee based on formalized amount',
      'Maximum efficiency in acquisition cost',
    ],
    cpaCalcTitle: 'Calculation example',
    cpaCalcText: 'Loan €10,000 approved:\nFixed tier fee: €60\nCommission 1.5% × €10,000 = €150\nTotal per deal: €210',
    cpaNotes: [
      'Fee due at the time of loan formalization.',
      'Commission calculated on the net formalized amount.',
      'Not applicable if the application is rejected or not formalized.',
    ],

    // Hybrid
    hybridIntro: 'Reduced base CPL plus CPA bonus upon formalization. Covers acquisition costs and rewards real conversion. Ideal model for high volume with a good conversion rate.',
    hybridCPLPrice: '€8',
    hybridCPAFee: '€50',
    hybridCPAComm: '0.5%',
    hybridFeatures: [
      'Base CPL covers guaranteed acquisition costs',
      'CPA bonus rewards the real lead conversion',
      'Transparent and predictable model for both parties',
      'Ideal for partners with a high conversion rate',
    ],
    hybridCalcTitle: 'Calculation example',
    hybridCalcText: 'Lead captured: €8 (base CPL)\nLoan €10,000 formalized:\n  Fixed CPA bonus: €50\n  Commission 0.5% × €10,000 = €50\nTotal per converted lead: €158',
    hybridNotes: [
      'Base CPL is billed at the time of delivery of the verified lead.',
      'CPA bonus is billed upon deal formalization.',
      'Commission calculated on the net formalized amount.',
    ],
  },

  // ── Typography (sizes in px) ─────────────────────────────────
  typo: {
    heading:   18,
    subhead:   14,
    body:      12,
    small:     10,
    tableBody: 10,
    note:       8,
    micro:      7,
  },
};
