// CPL model. Cleaner: blue accent (CPL = blue), spacious table,
// calc card + feature card side-by-side at the bottom.

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

const ACCENT = '#005EFF';

export function genLeadsCPL(st, pageNum = '02') {
  const { N } = getColors(st);
  const isEs = st.language === 'es';
  const l = st.leads || {};

  const intro =
    l.cplIntro ||
    (isEs
      ? 'Fee fijo por lead entregado con Open Banking completado. Precio predecible sin riesgo de conversión.'
      : 'Fixed fee per delivered lead with completed Open Banking. Predictable pricing with no conversion risk.');

  const table = tableStr(
    [
      { label: isEs ? 'Tipo de lead' : 'Lead type', width: '32%' },
      { label: isEs ? 'Precio' : 'Price', align: 'center', width: '18%' },
      { label: isEs ? 'Incluye' : 'Includes' },
    ],
    (l.cplLeads || []).map((row) => [
      {
        html: `<span style="font-weight:600;color:${N}">${esc(row.type)}</span>`,
      },
      {
        html: `<span style="display:inline-block;background:${ACCENT};color:#fff;font-family:${FONTS.MONO};font-size:11px;font-weight:600;padding:3px 10px;border-radius:6px">${esc(row.price)}</span>`,
        style: 'text-align:center',
      },
      {
        html: `<span style="color:#3D5166;line-height:1.4">${esc(row.desc)}</span>`,
      },
    ]),
    st
  );

  return `
<div style="width:595px;height:842px;background:#FAFBFD;position:relative;overflow:hidden;font-family:${FONTS.SANS}">
  ${hdrStr(pageNum, isEs ? 'Modelo CPL' : 'CPL Model', st)}

  <div style="position:absolute;top:60px;left:42px;right:42px;font-family:inherit">
    ${eyebrowStr(isEs ? 'Coste por Lead' : 'Cost per Lead', ACCENT)}
    ${titleStr(isEs ? 'Modelo CPL — fee fijo por lead' : 'CPL Model — fixed fee per lead', N, 22)}
    <div style="height:12px"></div>
    ${leadStr(intro, '#3D5166', 11)}

    <div style="margin-top:18px">${table}</div>

    <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-top:14px">
      ${calcBoxStr(l.cplCalcTitle || (isEs ? 'Ejemplo de cálculo' : 'Calculation example'), l.cplCalcText, st)}
      ${featureBoxStr(isEs ? 'Qué incluye cada lead' : 'What each lead includes', l.cplFeatures || [], st)}
    </div>

    ${notesStr(l.cplNotes, st)}
  </div>

  ${ftrStr(st)}
</div>`;
}
