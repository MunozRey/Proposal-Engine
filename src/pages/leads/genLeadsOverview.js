// Leads overview. Three model cards with distinct accent colors (blue/mint/violet)
// to break the "three blues" problem. Below: real lead schema —
// what the buyer actually receives per delivered lead. Less dense than v1.

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

const MODEL_ACCENTS = {
  CPL: '#005EFF',
  CPA: '#22D3A0',
  Hybrid: '#7C5CFF',
};

export function genLeadsOverview(st, pageNum = '01') {
  const { N } = getColors(st);
  const isEs = st.language === 'es';
  const l = st.leads || {};

  const intro =
    l.overviewIntro ||
    (isEs
      ? `CreditCheck capta y entrega leads pre-cualificados vía Open Banking para ${st.clientName || 'el cliente'}.`
      : `CreditCheck captures and delivers Open Banking pre-qualified leads for ${st.clientName || 'the client'}.`);

  const cplPrice = `${l.cplLeads?.[0]?.price || '€12'} – ${l.cplLeads?.[1]?.price || '€20'}`;
  const cpaPrice = `${l.cpaTramos?.[0]?.fee || '€30'} – ${l.cpaTramos?.slice(-1)?.[0]?.fee || '€150'}`;

  const cards = [
    {
      key: 'CPL',
      label: 'CPL',
      name: isEs ? 'Coste por Lead' : 'Cost per Lead',
      price: cplPrice,
      per: isEs ? '/ lead' : '/ lead',
      sub: isEs ? 'Fee fijo por lead entregado' : 'Fixed fee per delivered lead',
      accent: MODEL_ACCENTS.CPL,
      features: (l.cplFeatures || []).slice(0, 3),
    },
    {
      key: 'CPA',
      label: 'CPA',
      name: isEs ? 'Coste por Adquisición' : 'Cost per Acquisition',
      price: cpaPrice,
      per: '',
      sub: isEs
        ? `Fee por tramos + comisión ${l.cpaCommission || '1.5%'}`
        : `Tiered fee + ${l.cpaCommission || '1.5%'} commission`,
      accent: MODEL_ACCENTS.CPA,
      features: (l.cpaFeatures || []).slice(0, 3),
    },
    {
      key: 'Hybrid',
      label: 'HYBRID',
      name: isEs ? 'CPL base + bonus CPA' : 'Base CPL + CPA bonus',
      price: `${l.hybridCPLPrice || '€8'} + ${l.hybridCPAFee || '€50'}`,
      per: '',
      sub: isEs ? 'CPL reducido + bonus por formalización' : 'Reduced CPL + bonus on close',
      accent: MODEL_ACCENTS.Hybrid,
      features: (l.hybridFeatures || []).slice(0, 3),
    },
  ];

  const cardHtml = cards.map((c) => modelCard(c, st)).join('');

  // Real "what's in each lead" — sourced from CreditCheck data guide.
  const includedLeft = [
    isEs ? 'Nombre, email y teléfono verificados' : 'Verified name, email and phone',
    isEs ? 'Open Banking completado al 100%' : '100% completed Open Banking flow',
    isEs ? 'Ingreso neto mensual verificado' : 'Verified monthly net income',
  ];
  const includedRight = [
    isEs ? 'Importe de préstamo y plazo deseado' : 'Desired loan amount and term',
    isEs ? 'Situación laboral y dependientes' : 'Employment status and dependants',
    isEs ? 'IBAN validado y consentimiento legal' : 'Validated IBAN and legal consent',
  ];

  return `
<div style="width:595px;height:842px;background:linear-gradient(180deg, #FAFCFF 0%, #F5F8FF 100%);position:relative;overflow:hidden;font-family:${FONTS.SANS}">
  ${hdrStr(pageNum, isEs ? 'Propuesta Leads' : 'Leads Proposal', st)}

  <div style="position:absolute;top:60px;left:42px;right:42px;font-family:inherit">
    ${eyebrowStr(isEs ? 'Modelos disponibles' : 'Available models')}
    ${titleStr(isEs ? 'Tres modelos de colaboración' : 'Three collaboration models', N, 22)}
    <div style="height:12px"></div>
    ${leadStr(intro, '#30465F', 11)}

    <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:11px;margin-top:22px">${cardHtml}</div>

    <!-- Lead deliverable: real CreditCheck data points -->
    <div style="background:${N};border-radius:12px;padding:16px 20px;margin-top:18px;font-family:${FONTS.SANS}">
      <div style="display:flex;align-items:center;gap:8px;margin-bottom:10px">
        <span style="width:5px;height:5px;border-radius:50%;background:#FFCC00"></span>
        <span style="font-size:9px;color:rgba(255,255,255,.92);letter-spacing:0.1em;text-transform:uppercase;font-family:${FONTS.MONO};font-weight:700">${isEs ? 'Cada lead incluye' : 'Each lead includes'}</span>
      </div>
      <div style="font-size:13px;font-weight:600;color:#fff;margin-bottom:12px;letter-spacing:-0.01em">${isEs ? 'Datos verificados con Open Banking, listos para tu motor de underwriting' : 'Open Banking-verified data, ready for your underwriting engine'}</div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:0 18px">
        <div>${includedLeft.map((f) => bulletItem(f, '#FFFFFF', st)).join('')}</div>
        <div>${includedRight.map((f) => bulletItem(f, 'rgba(255,255,255,.94)', st)).join('')}</div>
      </div>
    </div>
  </div>

  ${ftrStr(st)}
</div>`;
}

function modelCard(c, st) {
  const { N } = getColors(st);
  return `
  <div style="background:#fff;border:1px solid #E6ECF3;border-radius:12px;overflow:hidden;font-family:${FONTS.SANS};display:flex;flex-direction:column">
    <div style="height:3px;background:${c.accent}"></div>
    <div style="padding:14px 14px 12px">
      <div style="display:flex;align-items:center;gap:6px;margin-bottom:8px">
        <span style="background:${c.accent}14;color:${c.accent};font-family:${FONTS.MONO};font-size:8.5px;font-weight:700;letter-spacing:0.08em;padding:3px 7px;border-radius:9999px">${c.label}</span>
        <span style="font-size:8.5px;color:#4C6078">${esc(c.name)}</span>
      </div>
      <div style="font-family:${FONTS.SERIF};font-size:18px;font-weight:600;color:${N};letter-spacing:-0.02em;line-height:1.1;margin-bottom:3px">${esc(c.price)} <span style="font-family:${FONTS.SANS};font-size:9px;color:#4C6078;font-weight:500">${esc(c.per || '')}</span></div>
      <div style="font-size:9.5px;color:#4C6078;line-height:1.45;margin-bottom:10px">${esc(c.sub)}</div>
      <div style="height:1px;background:#F0F2F5;margin-bottom:8px"></div>
      ${c.features.map((f) => bulletItem(esc(f), '#3D5166', st)).join('')}
    </div>
  </div>`;
}
