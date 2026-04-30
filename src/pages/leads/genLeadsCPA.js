// CPA model. Yellow accent (CPA = paid-on-conversion premium feel).
// Tiered fee table + commission strip + side-by-side calc/features.

import { esc } from '../../utils/esc.js';
import {
  hdrStr,
  ftrStr,
  tableStr,
  calcBoxStr,
  featureBoxStr,
  notesStr,
  getColors,
  FONTS,
  eyebrowStr,
  titleStr,
  leadStr,
  pricePillStr,
} from '../../utils/pageHelpers.js';
import { t } from '../../i18n/translate.js';

export function genLeadsCPA(st, pageNum = '03') {
  const { N, A } = getColors(st);
  // CPA accent = brand yellow (paid-on-conversion → premium feel).
  const ACCENT = A;
  const lang = st.language || 'en';
  const tt = (k, v) => t(lang, k, v);
  const l = st.leads || {};

  const intro = l.cpaIntro || tt('leadsCPA.introDefault');
  const commissionPct = l.cpaCommission || '1.5%';
  const commissionBase = l.cpaCommissionBase || tt('leadsCPA.commissionBaseFallback');

  const table = tableStr(
    [
      { label: tt('leadsCPA.colLoanAmount'), width: '42%' },
      { label: tt('leadsCPA.colFixedFee'), align: 'center', width: '22%' },
      { label: tt('leadsCPA.colCommission'), align: 'center' },
    ],
    (l.cpaTramos || []).map((row) => [
      { html: `<span style="font-weight:600;color:${N}">${esc(row.importe)}</span>` },
      {
        html: pricePillStr(row.fee, st, 'navy'),
        style: 'text-align:center',
      },
      {
        html: `<span style="color:#30465F;font-weight:600">+ ${esc(commissionPct)} ${esc(tt('leadsCPA.commissionOn'))} ${esc(commissionBase)}</span>`,
        style: 'text-align:center',
      },
    ]),
    st
  );

  return `
<div style="width:595px;height:842px;background:#FAFBFD;position:relative;overflow:hidden;font-family:${FONTS.SANS}">
  ${hdrStr(pageNum, tt('leadsCPA.headerTitle'), st)}

  <div style="position:absolute;top:60px;left:42px;right:42px;font-family:inherit">
    ${eyebrowStr(tt('leadsCPA.eyebrow'), ACCENT)}
    ${titleStr(tt('leadsCPA.heading'), N, 22)}
    <div style="height:12px"></div>
    ${leadStr(intro, '#3D5166', 11)}

    <div style="margin-top:18px">${table}</div>

    <!-- commission strip -->
    <div style="background:${N};border-radius:10px;padding:12px 16px;margin-top:12px;display:flex;align-items:center;gap:14px">
      <div style="display:flex;align-items:center;gap:8px;flex:1">
        <span style="width:6px;height:6px;border-radius:50%;background:${ACCENT}"></span>
        <span style="font-size:10px;color:#FFFFFF;font-weight:500;letter-spacing:0.005em">${esc(tt('leadsCPA.commissionStripLabel'))}</span>
      </div>
      <div style="font-family:${FONTS.SERIF};font-size:22px;font-weight:700;color:${ACCENT};letter-spacing:-0.02em">${esc(commissionPct)}</div>
    </div>

    <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-top:14px">
      ${calcBoxStr(l.cpaCalcTitle || tt('leadsCPA.calcTitle'), l.cpaCalcText, st)}
      ${featureBoxStr(tt('leadsCPA.featuresTitle'), l.cpaFeatures || [], st)}
    </div>

    ${notesStr(l.cpaNotes, st)}
  </div>

  ${ftrStr(st)}
</div>`;
}
