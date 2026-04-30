// "Why CreditCheck" — hero metrics page. Big serif numbers,
// labels in body sans, optional supporting paragraph.

import { esc } from '../utils/esc.js';
import {
  hdrStr,
  ftrStr,
  getColors,
  FONTS,
  eyebrowStr,
  titleStr,
  leadStr,
  metricStr,
} from '../utils/pageHelpers.js';

const DEFAULT_METRICS_EN = [
  { value: '2,000+', label: 'Banks connected across the EU' },
  { value: '19', label: 'Countries covered out of the box' },
  { value: '<3s', label: 'Average end-to-end verification latency' },
  { value: '99.95%', label: 'Production uptime over the last 12 months' },
];

const DEFAULT_METRICS_ES = [
  { value: '2.000+', label: 'Bancos conectados en la UE' },
  { value: '19', label: 'Países cubiertos por defecto' },
  { value: '<3s', label: 'Latencia media de verificación end-to-end' },
  { value: '99,95%', label: 'Uptime de producción últimos 12 meses' },
];

const DEFAULT_PROPS_EN = [
  { title: 'Open Banking-first', desc: 'PSD2-grade verification, not self-reported data.' },
  { title: 'Built for white-label', desc: 'Branded screens, API-driven, sandbox + production.' },
  { title: 'Built for leads', desc: 'CPL, CPA and hybrid pricing — pick what fits your funnel.' },
];

const DEFAULT_PROPS_ES = [
  { title: 'Open Banking primero', desc: 'Verificación PSD2 real, no datos auto-declarados.' },
  { title: 'Pensado para white-label', desc: 'Pantallas con tu marca, API, sandbox + producción.' },
  { title: 'Pensado para leads', desc: 'CPL, CPA o híbrido — elige lo que encaja con tu funnel.' },
];

export function genWhyCC(st, pageNum = '03') {
  const { N } = getColors(st);
  const isEs = st.language === 'es';
  const metrics = st.metrics?.length ? st.metrics : isEs ? DEFAULT_METRICS_ES : DEFAULT_METRICS_EN;
  const props = st.valueProps?.length ? st.valueProps : isEs ? DEFAULT_PROPS_ES : DEFAULT_PROPS_EN;

  const intro =
    st.whyIntro ||
    (isEs
      ? 'Infraestructura de calificación crediticia construida sobre Open Banking, lista para integrarse en tu funnel sin sorpresas.'
      : 'Credit qualification infrastructure built on Open Banking, ready to drop into your funnel without surprises.');

  const accents = ['#005EFF', '#FFCC00', '#22D3A0', '#7C5CFF'];

  const metricsHtml = metrics
    .slice(0, 4)
    .map((m, i) => `<div>${metricStr(m.value, m.label, st, accents[i % accents.length])}</div>`)
    .join('');

  const propsHtml = props
    .slice(0, 3)
    .map(
      (p) => `
    <div style="background:#fff;border:1px solid #E6ECF3;border-radius:10px;padding:14px 16px;font-family:${FONTS.SANS}">
      <div style="font-family:${FONTS.SERIF};font-size:14px;font-weight:600;color:${N};letter-spacing:-0.01em;margin-bottom:6px">${esc(p.title)}</div>
      <div style="font-size:10px;color:#30465F;line-height:1.55">${esc(p.desc)}</div>
    </div>`
    )
    .join('');

  return `
<div style="width:595px;height:842px;background:linear-gradient(180deg, #FAFCFF 0%, #F5F8FF 100%);position:relative;overflow:hidden;font-family:${FONTS.SANS}">
  ${hdrStr(pageNum, isEs ? 'Por qué CreditCheck' : 'Why CreditCheck', st)}

  <div style="position:absolute;top:60px;left:42px;right:42px;font-family:inherit">
    ${eyebrowStr(isEs ? 'Por qué CreditCheck' : 'Why CreditCheck')}
    ${titleStr(isEs ? 'La infraestructura de las decisiones de crédito' : 'The infrastructure behind credit decisions', N, 22)}
    <div style="height:12px"></div>
    ${leadStr(intro, '#30465F', 11)}

    <div style="display:grid;grid-template-columns:1fr 1fr;gap:18px 32px;margin-top:28px">
      ${metricsHtml}
    </div>

    <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:10px;margin-top:32px">
      ${propsHtml}
    </div>
  </div>

  ${ftrStr(st)}
</div>`;
}
