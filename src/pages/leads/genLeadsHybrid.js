// Hybrid model. Violet accent (Hybrid). Two components shown side-by-side
// with clear labelling, then calc + features.

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

const ACCENT = '#7C5CFF';

export function genLeadsHybrid(st, pageNum = '04') {
  const { N } = getColors(st);
  const isEs = st.language === 'es';
  const l = st.leads || {};

  const intro =
    l.hybridIntro ||
    (isEs
      ? 'Combinación de CPL base reducido más bonus CPA al formalizar. Cubre coste de adquisición y premia la conversión real.'
      : 'Combination of reduced base CPL plus CPA bonus upon formalization. Covers acquisition costs and rewards real conversion.');

  return `
<div style="width:595px;height:842px;background:#FAFBFD;position:relative;overflow:hidden;font-family:${FONTS.SANS}">
  ${hdrStr(pageNum, isEs ? 'Modelo Híbrido' : 'Hybrid Model', st)}

  <div style="position:absolute;top:60px;left:42px;right:42px;font-family:inherit">
    ${eyebrowStr(isEs ? 'CPL + CPA' : 'CPL + CPA', ACCENT)}
    ${titleStr(isEs ? 'Modelo Híbrido — adquisición + conversión' : 'Hybrid Model — acquisition + conversion', N, 22)}
    <div style="height:12px"></div>
    ${leadStr(intro, '#3D5166', 11)}

    <!-- two-component split -->
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-top:18px">
      <div style="background:${ACCENT};border-radius:12px;padding:16px 18px;color:#fff;font-family:${FONTS.SANS}">
        <div style="font-family:${FONTS.MONO};font-size:8.5px;font-weight:600;letter-spacing:0.12em;color:rgba(255,255,255,.7);text-transform:uppercase;margin-bottom:8px">${isEs ? 'Componente 1' : 'Component 1'}</div>
        <div style="font-size:13px;font-weight:600;margin-bottom:6px">${isEs ? 'CPL base reducido' : 'Reduced base CPL'}</div>
        <div style="font-family:${FONTS.SERIF};font-size:30px;font-weight:600;letter-spacing:-0.025em;line-height:1">${esc(l.hybridCPLPrice || '€8')}<span style="font-family:${FONTS.SANS};font-size:11px;font-weight:400;color:rgba(255,255,255,.7)"> / lead</span></div>
        <div style="font-size:9.5px;color:rgba(255,255,255,.78);margin-top:8px;line-height:1.45">${isEs ? 'Fee fijo en el momento de la entrega del lead verificado.' : 'Fixed fee at the moment of verified lead delivery.'}</div>
      </div>
      <div style="background:${N};border-radius:12px;padding:16px 18px;color:#fff;font-family:${FONTS.SANS}">
        <div style="font-family:${FONTS.MONO};font-size:8.5px;font-weight:600;letter-spacing:0.12em;color:rgba(255,255,255,.65);text-transform:uppercase;margin-bottom:8px">${isEs ? 'Componente 2' : 'Component 2'}</div>
        <div style="font-size:13px;font-weight:600;margin-bottom:6px">${isEs ? 'Bonus CPA al formalizar' : 'CPA bonus on close'}</div>
        <div style="font-family:${FONTS.SERIF};font-size:30px;font-weight:600;letter-spacing:-0.025em;line-height:1">${esc(l.hybridCPAFee || '€50')}</div>
        <div style="font-size:9.5px;color:rgba(255,255,255,.65);margin-top:6px">+ <span style="color:${ACCENT};font-weight:600">${esc(l.hybridCPAComm || '0.5%')}</span> ${isEs ? 'sobre importe formalizado' : 'on formalized amount'}</div>
      </div>
    </div>

    <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-top:14px">
      ${calcBoxStr(l.hybridCalcTitle || (isEs ? 'Ejemplo de cálculo' : 'Calculation example'), l.hybridCalcText, st)}
      ${featureBoxStr(isEs ? 'Ventajas del modelo híbrido' : 'Hybrid model advantages', l.hybridFeatures || [], st)}
    </div>

    ${notesStr(l.hybridNotes, st)}
  </div>

  ${ftrStr(st)}
</div>`;
}
