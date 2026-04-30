// "How it works" page. Cleaner: airy step cards, eyebrow + serif title,
// feature grid sits at the bottom with the existing helper.

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
import { t } from '../i18n/translate.js';

export function genPage2(st, pageNum = '01') {
  const { N } = getColors(st);
  const lang = st.language || 'en';
  const tt = (k, v) => t(lang, k, v);
  const headerLabel = tt('pageHow.headerLabel');

  const introClient = st.clientName || tt('pageHow.introClientFallback');
  const intro = st.introText || tt('pageHow.introDefault', { client: introClient });

  const stepsHtml = (st.steps || [])
    .map((s, i) => stepCardStr(s.num || String(i + 1).padStart(2, '0'), s.title, s.desc, st))
    .join('');

  const featuresClient = st.clientName || tt('pageHow.featuresClientFallback');
  // featureGridStr() escapes the title internally via esc(), so we pass plain text.
  const featuresTitle = tt('pageHow.featuresTitle', { client: featuresClient });

  return `
<div style="width:595px;height:842px;background:linear-gradient(180deg, #FAFCFF 0%, #F5F8FF 100%);position:relative;overflow:hidden;font-family:${FONTS.SANS}">
  ${hdrStr(pageNum, headerLabel, st)}

  <div style="position:absolute;top:60px;left:42px;right:42px;font-family:inherit">
    ${eyebrowStr(tt('pageHow.eyebrow'))}
    ${titleStr(tt('pageHow.title'), N, 22)}
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
