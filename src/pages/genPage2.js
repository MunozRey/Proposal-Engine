// "How it works" page. Cleaner: airy step cards, eyebrow + serif title,
// feature grid sits at the bottom with the existing helper.

import { esc } from '../utils/esc.js';
import {
  hdrStr,
  ftrStr,
  getColors,
  FONTS,
  eyebrowStr,
  titleStr,
  leadStr,
  stepCardStr,
  featureGridStr,
} from '../utils/pageHelpers.js';

export function genPage2(st, pageNum = '01') {
  const { N } = getColors(st);
  const isEs = st.language === 'es';
  const headerLabel = isEs ? 'CreditCheck White-Label' : 'CreditCheck White-Label';

  const intro =
    st.introText ||
    (isEs
      ? `La solución se activa en el momento de la calificación crediticia dentro del flujo de ${st.clientName || 'tu empresa'}. El usuario completa el consentimiento de Open Banking en una pantalla con la marca del cliente.`
      : `The solution activates at the moment of credit qualification within the ${st.clientName || 'your company'} flow. The user completes the Open Banking consent on a client-branded screen.`);

  const stepsHtml = (st.steps || [])
    .map((s, i) => stepCardStr(s.num || String(i + 1).padStart(2, '0'), s.title, s.desc, st))
    .join('');

  const featuresTitle = isEs
    ? `Lo que ${esc(st.clientName || 'el cliente')} recibe en cada verificación`
    : `What ${esc(st.clientName || 'the client')} receives per verification`;

  return `
<div style="width:595px;height:842px;background:linear-gradient(180deg, #FAFCFF 0%, #F5F8FF 100%);position:relative;overflow:hidden;font-family:${FONTS.SANS}">
  ${hdrStr(pageNum, headerLabel, st)}

  <div style="position:absolute;top:60px;left:42px;right:42px;font-family:inherit">
    ${eyebrowStr(isEs ? 'Cómo funciona' : 'How it works')}
    ${titleStr(isEs ? 'Calificación crediticia, integrada en tu flujo' : 'Credit qualification, embedded in your flow', N, 22)}
    <div style="height:14px"></div>
    ${leadStr(intro, '#30465F', 11)}

    <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:10px;margin-top:22px">
      ${stepsHtml}
    </div>

    <div style="margin-top:20px">
      ${featureGridStr(featuresTitle, st.featuresL || [], st.featuresR || [], st)}
    </div>
  </div>

  ${ftrStr(st)}
</div>`;
}
