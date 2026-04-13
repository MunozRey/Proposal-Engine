import { GREY, TC } from '../constants.js';
import { esc } from '../utils/esc.js';
import { hdrStr, featureGridStr, ftrStr, getColors } from '../utils/pageHelpers.js';

export function genPage2(st, pageNum = '01') {
  const { N, B } = getColors(st);
  const T = st.typo;
  const CT = 64;
  const intro = st.introText || `CreditCheck activates at the moment of credit qualification within the ${st.clientName || 'Ebury'} flow. The user completes the Open Banking consent on a screen branded for the client, with no reference to Clovr Labs.`;

  const steps = st.steps.map(s => `
    <div style="background:#fff;border-radius:3px;margin-bottom:5px;display:flex;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,.06)">
      <div style="width:3px;background:${B};flex-shrink:0"></div>
      <div style="width:22px;background:${B};display:flex;align-items:center;justify-content:center;flex-shrink:0">
        <div style="width:13px;height:13px;border-radius:50%;background:rgba(255,255,255,.22);display:flex;align-items:center;justify-content:center;font-size:${T.micro}px;font-weight:800;color:#fff">${s.num}</div>
      </div>
      <div style="padding:6px 8px">
        <div style="font-size:${T.body}px;font-weight:700;color:${N};margin-bottom:2px">${esc(s.title)}</div>
        <div style="font-size:${T.small}px;color:${TC};line-height:1.5">${esc(s.desc)}</div>
      </div>
    </div>`).join('');

  return `<div style="width:595px;height:842px;background:${GREY};position:relative;overflow:hidden;font-family:'Segoe UI',system-ui,sans-serif">
  ${hdrStr(pageNum, 'CreditCheck White-Label', st)}
  <div style="position:absolute;top:${CT}px;left:14px;right:14px;font-family:inherit">
    <div style="font-size:${T.heading}px;font-weight:800;color:${N}">${pageNum}  CreditCheck White-Label</div>
    <div style="height:1.5px;background:${B};margin:4px 0 7px"></div>
    <div style="font-size:${T.body}px;color:${TC};line-height:1.6;margin-bottom:9px">${esc(intro)}</div>
    <div style="font-size:${T.subhead}px;font-weight:800;color:${N};margin-bottom:7px">How it works</div>
    ${steps}
    ${featureGridStr(`What ${esc(st.clientName || 'the client')} receives in each verification`, st.featuresL, st.featuresR, st)}
  </div>
  ${ftrStr(st)}</div>`;
}
