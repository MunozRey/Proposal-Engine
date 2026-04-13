import { GREY, TC } from '../../constants.js';
import { esc } from '../../utils/esc.js';
import {
  hdrStr,
  ftrStr,
  calcBoxStr,
  featureBoxStr,
  notesStr,
  getColors,
} from '../../utils/pageHelpers.js';

export function genLeadsHybrid(st, pageNum = '04') {
  const { N, B } = getColors(st);
  const isEs = st.language === 'es';
  const T = st.typo;
  const l = st.leads;
  const CT = 64;

  const intro =
    l.hybridIntro ||
    (isEs
      ? 'Combinacion de CPL base reducido mas bonus CPA al formalizar. Cubre coste de adquisicion y premia conversion real.'
      : 'Combination of reduced base CPL plus CPA bonus upon formalization. Covers acquisition costs and rewards real conversion.');

  return `<div style="width:595px;height:842px;background:${GREY};position:relative;overflow:hidden;font-family:'Segoe UI',system-ui,sans-serif">
  ${hdrStr(pageNum, isEs ? 'Modelo Hibrido' : 'Hybrid Model', st)}
  <div style="position:absolute;top:${CT}px;left:14px;right:14px;font-family:inherit">
    <div style="font-size:${T.heading}px;font-weight:800;color:${N}">${pageNum}  ${isEs ? 'Modelo Hibrido — CPL + CPA' : 'Hybrid Model — CPL + CPA'}</div>
    <div style="height:1.5px;background:${B};margin:4px 0 7px"></div>
    <div style="font-size:${T.body}px;color:${TC};line-height:1.6;margin-bottom:9px">${esc(intro)}</div>

    <div style="font-size:${T.subhead}px;font-weight:800;color:${N};margin-bottom:7px">${isEs ? 'Composicion del modelo' : 'Model composition'}</div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:6px;margin-bottom:9px">
      <div style="background:${B};border-radius:4px;padding:9px 10px">
        <div style="font-size:${T.micro}px;font-weight:700;color:rgba(255,255,255,.7);letter-spacing:.06em;margin-bottom:3px">${isEs ? 'COMPONENTE 1' : 'COMPONENT 1'}</div>
        <div style="font-size:${T.body}px;font-weight:700;color:#fff;margin-bottom:2px">${isEs ? 'CPL Base' : 'Base CPL'}</div>
        <div style="font-size:14px;font-weight:800;color:#fff;line-height:1;margin-bottom:3px">${esc(l.hybridCPLPrice || '€8')}<span style="font-size:${T.small}px;font-weight:400;color:rgba(255,255,255,.7)"> / lead</span></div>
        <div style="font-size:${T.small}px;color:rgba(255,255,255,.75);line-height:1.4">${isEs ? 'Fee fijo en el momento de la entrega del lead verificado' : 'Fixed fee at the moment of verified lead delivery'}</div>
      </div>
      <div style="background:${N};border-radius:4px;padding:9px 10px">
        <div style="font-size:${T.micro}px;font-weight:700;color:rgba(255,255,255,.5);letter-spacing:.06em;margin-bottom:3px">${isEs ? 'COMPONENTE 2' : 'COMPONENT 2'}</div>
        <div style="font-size:${T.body}px;font-weight:700;color:#fff;margin-bottom:2px">${isEs ? 'Bonus CPA' : 'CPA Bonus'}</div>
        <div style="font-size:14px;font-weight:800;color:${B};line-height:1;margin-bottom:1px">${esc(l.hybridCPAFee || '€50')}</div>
        <div style="font-size:${T.small}px;color:rgba(255,255,255,.5);margin-bottom:3px">${isEs ? 'fee fijo al formalizar' : 'fixed fee upon formalization'}</div>
        <div style="font-size:11px;font-weight:800;color:#90B8FF;line-height:1;margin-bottom:1px">+ ${esc(l.hybridCPAComm || '0.5%')}</div>
        <div style="font-size:${T.small}px;color:rgba(255,255,255,.5)">${isEs ? 'comision sobre importe' : 'commission on amount'}</div>
      </div>
    </div>

    <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:9px">
      ${calcBoxStr(l.hybridCalcTitle || (isEs ? 'Ejemplo de calculo' : 'Calculation example'), l.hybridCalcText, st)}
      ${featureBoxStr(isEs ? 'Ventajas del modelo hibrido' : 'Hybrid model advantages', l.hybridFeatures, st)}
    </div>

    ${notesStr(l.hybridNotes, st)}
  </div>
  ${ftrStr(st)}</div>`;
}
