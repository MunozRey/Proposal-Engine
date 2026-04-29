// CPA model. Mint accent (CPA = green-mint = "approved/converted").
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
} from '../../utils/pageHelpers.js';

const ACCENT = '#22D3A0';

export function genLeadsCPA(st, pageNum = '03') {
  const { N } = getColors(st);
  const isEs = st.language === 'es';
  const l = st.leads || {};

  const intro =
    l.cpaIntro ||
    (isEs
      ? 'Sin coste hasta la formalización del préstamo. Fee fijo por tramos más comisión sobre el importe aprobado.'
      : 'No cost until loan formalization. Tiered fixed fee by amount plus commission on approved amount.');

  const table = tableStr(
    [
      { label: isEs ? 'Importe del préstamo' : 'Loan amount', width: '42%' },
      { label: isEs ? 'Fee fijo' : 'Fixed fee', align: 'center', width: '22%' },
      { label: isEs ? '+ Comisión' : '+ Commission', align: 'center' },
    ],
    (l.cpaTramos || []).map((row) => [
      { html: `<span style="font-weight:500;color:#3D5166">${esc(row.importe)}</span>` },
      {
        html: `<span style="display:inline-block;background:${N};color:#fff;font-family:${FONTS.MONO};font-size:11px;font-weight:600;padding:3px 10px;border-radius:6px">${esc(row.fee)}</span>`,
        style: 'text-align:center',
      },
      {
        html: `<span style="color:#6B7B92">+ ${esc(l.cpaCommission || '1.5%')} ${isEs ? 'sobre' : 'on'} ${esc(l.cpaCommissionBase || (isEs ? 'importe' : 'amount'))}</span>`,
        style: 'text-align:center',
      },
    ]),
    st
  );

  return `
<div style="width:595px;height:842px;background:#FAFBFD;position:relative;overflow:hidden;font-family:${FONTS.SANS}">
  ${hdrStr(pageNum, isEs ? 'Modelo CPA' : 'CPA Model', st)}

  <div style="position:absolute;top:60px;left:42px;right:42px;font-family:inherit">
    ${eyebrowStr(isEs ? 'Coste por Adquisición' : 'Cost per Acquisition', ACCENT)}
    ${titleStr(isEs ? 'Modelo CPA — pago por conversión' : 'CPA Model — pay on conversion', N, 22)}
    <div style="height:12px"></div>
    ${leadStr(intro, '#3D5166', 11)}

    <div style="margin-top:18px">${table}</div>

    <!-- commission strip -->
    <div style="background:${ACCENT}14;border:1px solid ${ACCENT}33;border-radius:10px;padding:12px 16px;margin-top:12px;display:flex;align-items:center;gap:14px">
      <div style="display:flex;align-items:center;gap:6px;flex:1">
        <span style="width:6px;height:6px;border-radius:50%;background:${ACCENT}"></span>
        <span style="font-size:10px;color:#3D5166;font-weight:500">${isEs ? 'Comisión adicional sobre importe aprobado' : 'Additional commission on approved amount'}</span>
      </div>
      <div style="font-family:${FONTS.SERIF};font-size:22px;font-weight:600;color:${N};letter-spacing:-0.02em">${esc(l.cpaCommission || '1.5%')}</div>
    </div>

    <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-top:14px">
      ${calcBoxStr(l.cpaCalcTitle || (isEs ? 'Ejemplo de cálculo' : 'Calculation example'), l.cpaCalcText, st)}
      ${featureBoxStr(isEs ? 'Ventajas del modelo CPA' : 'CPA model advantages', l.cpaFeatures || [], st)}
    </div>

    ${notesStr(l.cpaNotes, st)}
  </div>

  ${ftrStr(st)}
</div>`;
}
