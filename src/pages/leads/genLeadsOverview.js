import { GREY, TC } from '../../constants.js';
import { esc } from '../../utils/esc.js';
import { hdrStr, bulletItem, ftrStr, getColors } from '../../utils/pageHelpers.js';

export function genLeadsOverview(st, pageNum = '01') {
  const { N, B } = getColors(st);
  const T = st.typo;
  const l = st.leads;
  const CT = 64;

  const intro = l.overviewIntro || `CreditCheck captures and delivers verified leads via Open Banking for ${st.clientName || 'the client'}.`;

  const cplPrice = `${l.cplLeads[0]?.price || '€12'} – ${l.cplLeads[1]?.price || '€20'}`;
  const cpaPrice = `${l.cpaTramos[0]?.fee || '€30'} – ${l.cpaTramos.slice(-1)[0]?.fee || '€150'}`;

  const cards = [
    { label: 'CPL', name: 'Cost Per Lead', price: cplPrice + ' / lead', sub: 'fixed fee per delivered lead', accent: B, features: l.cplFeatures.slice(0, 3) },
    { label: 'CPA', name: 'Cost Per Acquisition', price: cpaPrice, sub: `tiered fee + ${l.cpaCommission || '1.5%'} commission`, accent: '#1A3A6B', features: l.cpaFeatures.slice(0, 3) },
    { label: 'HYBRID', name: 'Base CPL + CPA Bonus', price: `${l.hybridCPLPrice || '€8'} + bonus`, sub: `reduced CPL + ${l.hybridCPAFee || '€50'} CPA bonus`, accent: '#2A4D8F', features: l.hybridFeatures.slice(0, 3) },
  ];

  const cardHtml = cards.map(c => `
    <div style="background:#fff;border-radius:4px;overflow:hidden;border:.5px solid #C8D8E8;box-shadow:0 1px 4px rgba(0,0,0,.06)">
      <div style="background:${c.accent};padding:5px 8px;display:flex;align-items:baseline;gap:5px">
        <span style="font-size:7.5px;font-weight:800;color:#fff;letter-spacing:.05em">${c.label}</span>
        <span style="font-size:${T.micro}px;color:rgba(255,255,255,.65);font-weight:400">${c.name}</span>
      </div>
      <div style="padding:7px 8px">
        <div style="font-size:11px;font-weight:800;color:${c.accent};line-height:1;margin-bottom:1px">${c.price}</div>
        <div style="font-size:${T.micro}px;color:#718096;margin-bottom:6px;line-height:1.4">${c.sub}</div>
        ${c.features.map(f => bulletItem(esc(f), TC, st)).join('')}
      </div>
    </div>`).join('');

  const commonFeats = [
    'Lead with 100% completed Open Banking',
    'Monthly net income verified',
    'Effort ratio and DTI calculated',
    'Contact details and IBAN validated',
  ];

  return `<div style="width:595px;height:842px;background:${GREY};position:relative;overflow:hidden;font-family:'Segoe UI',system-ui,sans-serif">
  ${hdrStr(pageNum, 'Leads Proposal', st)}
  <div style="position:absolute;top:${CT}px;left:14px;right:14px;font-family:inherit">
    <div style="font-size:${T.heading}px;font-weight:800;color:${N}">${pageNum}  Verified Leads Proposal</div>
    <div style="height:1.5px;background:${B};margin:4px 0 7px"></div>
    <div style="font-size:${T.body}px;color:${TC};line-height:1.6;margin-bottom:10px">${esc(intro)}</div>
    <div style="font-size:${T.subhead}px;font-weight:800;color:${N};margin-bottom:7px">Available collaboration models</div>
    <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:7px;margin-bottom:10px">${cardHtml}</div>
    <div style="background:${N};border-radius:4px;padding:8px 10px">
      <div style="font-size:${T.body}px;font-weight:700;color:#fff;margin-bottom:6px">What each lead includes — verified via Open Banking</div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:0 8px">
        <div>${commonFeats.slice(0, 2).map(f => bulletItem(esc(f), '#fff', st)).join('')}</div>
        <div>${commonFeats.slice(2).map(f => bulletItem(esc(f), '#90B8FF', st)).join('')}</div>
      </div>
    </div>
  </div>
  ${ftrStr(st)}</div>`;
}
