// Hybrid model. CPL base (brand blue) + CPA bonus (navy + yellow accent).
// Uses only brand palette (navy/blue/yellow) for visual consistency with the rest
// of the proposal.

import { esc } from '../../utils/esc.js';
import {
  hdrStr,
  ftrStr,
  calcBoxStr,
  featureBoxStr,
  notesStr,
  getColors,
  FONTS,
  eyebrowStr,
  titleStr,
  leadStr,
} from '../../utils/pageHelpers.js';
import { t } from '../../i18n/translate.js';

export function genLeadsHybrid(st, pageNum = '04') {
  const { N, B, A } = getColors(st);
  const ACCENT = B; // hybrid eyebrow uses brand blue (CPL+CPA combined)
  const lang = st.language || 'en';
  const tt = (k, v) => t(lang, k, v);
  const l = st.leads || {};

  const intro = l.hybridIntro || tt('leadsHybrid.introDefault');

  return `
<div style="width:595px;height:842px;background:#FAFBFD;position:relative;overflow:hidden;font-family:${FONTS.SANS}">
  ${hdrStr(pageNum, tt('leadsHybrid.headerTitle'), st)}

  <div style="position:absolute;top:60px;left:42px;right:42px;font-family:inherit">
    ${eyebrowStr(tt('leadsHybrid.eyebrow'), ACCENT)}
    ${titleStr(tt('leadsHybrid.heading'), N, 22)}
    <div style="height:12px"></div>
    ${leadStr(intro, '#3D5166', 11)}

    <!-- two-component split: brand blue (CPL base) + brand navy (CPA bonus) -->
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-top:18px">
      <div style="background:${B};border-radius:12px;padding:16px 18px;color:#FFFFFF;font-family:${FONTS.SANS};box-shadow:0 6px 16px rgba(0,94,255,.18)">
        <div style="font-family:${FONTS.MONO};font-size:8.5px;font-weight:700;letter-spacing:0.14em;color:#FFFFFF;text-transform:uppercase;margin-bottom:8px;opacity:.92">${esc(tt('leadsHybrid.component1'))}</div>
        <div style="font-size:13px;font-weight:700;margin-bottom:8px;color:#FFFFFF">${esc(tt('leadsHybrid.component1Title'))}</div>
        <div style="font-family:${FONTS.SERIF};font-size:30px;font-weight:700;letter-spacing:-0.025em;line-height:1;color:#FFFFFF">${esc(l.hybridCPLPrice || '€8')}<span style="font-family:${FONTS.SANS};font-size:11px;font-weight:600;color:#FFFFFF;opacity:.95"> ${esc(tt('leadsHybrid.perLead'))}</span></div>
        <div style="font-size:9.5px;color:#FFFFFF;margin-top:10px;line-height:1.45;opacity:.92">${esc(tt('leadsHybrid.component1Desc'))}</div>
      </div>
      <div style="background:${N};border-radius:12px;padding:16px 18px;color:#FFFFFF;font-family:${FONTS.SANS};box-shadow:0 6px 16px rgba(10,18,100,.22)">
        <div style="font-family:${FONTS.MONO};font-size:8.5px;font-weight:700;letter-spacing:0.14em;color:${A};text-transform:uppercase;margin-bottom:8px">${esc(tt('leadsHybrid.component2'))}</div>
        <div style="font-size:13px;font-weight:700;margin-bottom:8px;color:#FFFFFF">${esc(tt('leadsHybrid.component2Title'))}</div>
        <div style="font-family:${FONTS.SERIF};font-size:30px;font-weight:700;letter-spacing:-0.025em;line-height:1;color:#FFFFFF">${esc(l.hybridCPAFee || '€50')}</div>
        <div style="font-size:9.5px;color:#FFFFFF;margin-top:10px;opacity:.92">+ <span style="color:${A};font-weight:800">${esc(l.hybridCPAComm || '0.5%')}</span> ${esc(tt('leadsHybrid.onFormalized'))}</div>
      </div>
    </div>

    <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-top:14px">
      ${calcBoxStr(l.hybridCalcTitle || tt('leadsHybrid.calcTitle'), l.hybridCalcText, st)}
      ${featureBoxStr(tt('leadsHybrid.featuresTitle'), l.hybridFeatures || [], st)}
    </div>

    ${notesStr(l.hybridNotes, st)}
  </div>

  ${ftrStr(st)}
</div>`;
}
