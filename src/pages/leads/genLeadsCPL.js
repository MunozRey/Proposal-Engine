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
  pricePillStr,
} from '../../utils/pageHelpers.js';
import { t } from '../../i18n/translate.js';

export function genLeadsCPL(st, pageNum = '02') {
  const { N, B } = getColors(st);
  const ACCENT = B; // CPL accent = brand blue
  const lang = st.language || 'en';
  const tt = (k, v) => t(lang, k, v);
  const l = st.leads || {};

  const intro = l.cplIntro || tt('leadsCPL.introDefault');

  const table = tableStr(
    [
      { label: tt('leadsCPL.colLeadType'), width: '32%' },
      { label: tt('leadsCPL.colPrice'), align: 'center', width: '18%' },
      { label: tt('leadsCPL.colIncludes') },
    ],
    (l.cplLeads || []).map((row) => [
      {
        html: `<span style="font-weight:600;color:${N}">${esc(row.type)}</span>`,
      },
      {
        html: pricePillStr(row.price, st, 'blue'),
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
  ${hdrStr(pageNum, tt('leadsCPL.headerTitle'), st)}

  <div style="position:absolute;top:60px;left:42px;right:42px;font-family:inherit">
    ${eyebrowStr(tt('leadsCPL.eyebrow'), ACCENT)}
    ${titleStr(tt('leadsCPL.heading'), N, 22)}
    <div style="height:12px"></div>
    ${leadStr(intro, '#3D5166', 11)}

    <div style="margin-top:18px">${table}</div>

    <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-top:14px">
      ${calcBoxStr(l.cplCalcTitle || tt('leadsCPL.calcTitle'), l.cplCalcText, st)}
      ${featureBoxStr(tt('leadsCPL.featuresTitle'), l.cplFeatures || [], st)}
    </div>

    ${notesStr(l.cplNotes, st)}
  </div>

  ${ftrStr(st)}
</div>`;
}
