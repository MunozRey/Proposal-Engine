// Leads overview. Three model cards differentiated using the brand palette only
// (navy / blue / yellow), no off-brand violet or mint. Differentiation comes
// from the accent stripe and the price-pill tone, not from foreign hues.

import { esc } from '../../utils/esc.js';
import {
  hdrStr,
  ftrStr,
  getColors,
  FONTS,
  eyebrowStr,
  titleStr,
  leadStr,
  bulletItem,
} from '../../utils/pageHelpers.js';
import { t } from '../../i18n/translate.js';

export function genLeadsOverview(st, pageNum = '01') {
  const { N, B, A } = getColors(st);
  const MODEL_ACCENTS = {
    CPL: B, // brand blue
    CPA: A, // brand yellow (premium / paid-on-conversion)
    Hybrid: N, // brand navy (combination)
  };
  const lang = st.language || 'en';
  const tt = (k, v) => t(lang, k, v);
  const l = st.leads || {};

  const introClient = st.clientName || tt('leadsOverview.introClientFallback');
  const intro = l.overviewIntro || tt('leadsOverview.introDefault', { client: introClient });

  const cplPrice = `${l.cplLeads?.[0]?.price || '€12'} - ${l.cplLeads?.[1]?.price || '€20'}`;
  const cpaPrice = `${l.cpaTramos?.[0]?.fee || '€30'} - ${l.cpaTramos?.slice(-1)?.[0]?.fee || '€150'}`;

  const commission = l.cpaCommission || '1.5%';

  const cards = [
    {
      key: 'CPL',
      label: 'CPL',
      name: tt('leadsOverview.cplName'),
      price: cplPrice,
      per: tt('leadsOverview.perLead'),
      sub: tt('leadsOverview.cplSub'),
      accent: MODEL_ACCENTS.CPL,
      features: (l.cplFeatures || []).slice(0, 3),
    },
    {
      key: 'CPA',
      label: 'CPA',
      name: tt('leadsOverview.cpaName'),
      price: cpaPrice,
      per: '',
      sub: tt('leadsOverview.cpaSub', { commission }),
      accent: MODEL_ACCENTS.CPA,
      features: (l.cpaFeatures || []).slice(0, 3),
    },
    {
      key: 'Hybrid',
      label: 'HYBRID',
      name: tt('leadsOverview.hybridName'),
      price: `${l.hybridCPLPrice || '€8'} + ${l.hybridCPAFee || '€50'}`,
      per: '',
      sub: tt('leadsOverview.hybridSub'),
      accent: MODEL_ACCENTS.Hybrid,
      features: (l.hybridFeatures || []).slice(0, 3),
    },
  ];

  const cardHtml = cards.map((c) => modelCard(c, st)).join('');

  // Real "what's in each lead", sourced from CreditCheck data guide.
  const includedLeft = [
    tt('leadsOverview.bullet1L'),
    tt('leadsOverview.bullet2L'),
    tt('leadsOverview.bullet3L'),
  ];
  const includedRight = [
    tt('leadsOverview.bullet1R'),
    tt('leadsOverview.bullet2R'),
    tt('leadsOverview.bullet3R'),
  ];

  return `
<div style="width:595px;height:842px;background:linear-gradient(180deg, #FAFCFF 0%, #F5F8FF 100%);position:relative;overflow:hidden;font-family:${FONTS.SANS}">
  ${hdrStr(pageNum, tt('leadsOverview.headerTitle'), st)}

  <div style="position:absolute;top:60px;left:42px;right:42px;font-family:inherit">
    ${eyebrowStr(tt('leadsOverview.eyebrow'))}
    ${titleStr(tt('leadsOverview.heading'), N, 22)}
    <div style="height:12px"></div>
    ${leadStr(intro, '#30465F', 11)}

    <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:11px;margin-top:22px">${cardHtml}</div>

    <!-- Lead deliverable: real CreditCheck data points -->
    <div style="background:${N};border-radius:12px;padding:16px 20px;margin-top:18px;font-family:${FONTS.SANS}">
      <div style="display:flex;align-items:center;gap:8px;margin-bottom:10px">
        <span style="width:5px;height:5px;border-radius:50%;background:#FFCC00"></span>
        <span style="font-size:9px;color:rgba(255,255,255,.92);letter-spacing:0.1em;text-transform:uppercase;font-family:${FONTS.MONO};font-weight:700">${esc(tt('leadsOverview.eachLeadIncludes'))}</span>
      </div>
      <div style="font-size:13px;font-weight:600;color:#fff;margin-bottom:12px;letter-spacing:-0.01em">${esc(tt('leadsOverview.eachLeadHeading'))}</div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:0 18px">
        <div>${includedLeft.map((f) => bulletItem(esc(f), '#FFFFFF', st)).join('')}</div>
        <div>${includedRight.map((f) => bulletItem(esc(f), 'rgba(255,255,255,.94)', st)).join('')}</div>
      </div>
    </div>
  </div>

  ${ftrStr(st)}
</div>`;
}

function modelCard(c, st) {
  const { N, A } = getColors(st);
  // Pick a readable text color for the small label pill: yellow accent needs
  // navy text (yellow-on-yellow tint is unreadable); blue/navy keep their hue.
  const isYellow = c.accent === A;
  const labelBg = isYellow ? c.accent : `${c.accent}14`;
  const labelColor = isYellow ? N : c.accent;
  const labelBorder = isYellow ? 'transparent' : `${c.accent}33`;
  return `
  <div style="background:#fff;border:1px solid #D5DDE7;border-radius:12px;overflow:hidden;font-family:${FONTS.SANS};display:flex;flex-direction:column;box-shadow:0 1px 2px rgba(10,18,100,.04)">
    <div style="height:3px;background:${c.accent}"></div>
    <div style="padding:14px 14px 12px">
      <div style="display:flex;align-items:center;gap:6px;margin-bottom:8px;flex-wrap:wrap">
        <span style="background:${labelBg};color:${labelColor};border:1px solid ${labelBorder};font-family:${FONTS.MONO};font-size:9px;font-weight:800;letter-spacing:0.1em;padding:3px 8px;border-radius:9999px">${c.label}</span>
        <span style="font-size:9px;color:#3D5166;font-weight:500">${esc(c.name)}</span>
      </div>
      <div style="font-family:${FONTS.SERIF};font-size:18px;font-weight:700;color:${N};letter-spacing:-0.02em;line-height:1.1;margin-bottom:4px">${esc(c.price)} <span style="font-family:${FONTS.SANS};font-size:9.5px;color:#3D5166;font-weight:500">${esc(c.per || '')}</span></div>
      <div style="font-size:10px;color:#3D5166;line-height:1.45;margin-bottom:10px">${esc(c.sub)}</div>
      <div style="height:1px;background:#E6ECF3;margin-bottom:8px"></div>
      ${c.features.map((f) => bulletItem(esc(f), '#3D5166', st)).join('')}
    </div>
  </div>`;
}
