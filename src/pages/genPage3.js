// Pricing page. Cleaner card hierarchy: recommended plan stands out via
// shadow + accent strip, others are restrained white cards. Tabular mono
// for prices. Less repetition than the previous version.

import { esc } from '../utils/esc.js';
import {
  hdrStr,
  ftrStr,
  getColors,
  FONTS,
  eyebrowStr,
  titleStr,
  leadStr,
  bulletItem,
} from '../utils/pageHelpers.js';

export function genPage3(st, pageNum = '02') {
  const { N, B, A } = getColors(st);
  const isEs = st.language === 'es';

  const plans = (st.plans || []).map((pl) => planCard(pl, st, isEs)).join('');

  const setupFeats = [
    (isEs ? 'Pantallas con marca de ' : 'Branded screens for ') +
      esc(st.clientName || (isEs ? 'cliente' : 'client')),
    isEs ? 'Producción + sandbox' : 'Production + sandbox',
    isEs ? 'API REST documentada' : 'Documented REST API',
    isEs ? 'Soporte durante la integración' : 'Integration support',
  ];

  return `
<div style="width:595px;height:842px;background:linear-gradient(180deg, #FAFCFF 0%, #F5F8FF 100%);position:relative;overflow:hidden;font-family:${FONTS.SANS}">
  ${hdrStr(pageNum, isEs ? 'Modelos de Precio' : 'Pricing Models', st)}

  <div style="position:absolute;top:60px;left:42px;right:42px;font-family:inherit">
    ${eyebrowStr(isEs ? 'Tarificación' : 'Pricing')}
    ${titleStr(isEs ? 'Implementación + suscripción mensual' : 'Implementation + monthly subscription', N, 22)}
    <div style="height:12px"></div>
    ${leadStr(
      isEs
        ? 'Una tarifa única de implementación más una suscripción mensual con verificaciones incluidas.'
        : 'A one-time implementation fee plus a monthly subscription that includes verifications.',
      '#3D5166',
      11
    )}

    <!-- setup card -->
    <div style="background:${N};border-radius:12px;padding:16px 20px;margin-top:18px;font-family:${FONTS.SANS};display:flex;justify-content:space-between;align-items:flex-start;gap:18px">
      <div style="flex:1;min-width:0">
        <div style="display:flex;align-items:center;gap:8px;margin-bottom:6px">
          <span style="width:5px;height:5px;border-radius:50%;background:${A}"></span>
          <span style="font-size:9px;color:rgba(255,255,255,.9);letter-spacing:0.1em;text-transform:uppercase;font-family:${FONTS.MONO};font-weight:700">${isEs ? 'Pago único' : 'One-time'}</span>
        </div>
        <div style="font-size:13px;font-weight:600;color:#fff;margin-bottom:10px;letter-spacing:-0.01em">${esc(isEs ? 'Desarrollo e implementación white-label' : 'White-label development and implementation')}</div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:0 16px">
          ${setupFeats.map((f) => bulletItem(f, '#FFFFFF', st)).join('')}
        </div>
      </div>
      <div style="text-align:right;flex-shrink:0">
        <div style="font-family:${FONTS.SERIF};font-size:26px;font-weight:600;color:#fff;letter-spacing:-0.02em;line-height:1">${esc(st.setupFee || (isEs ? 'A medida' : 'Custom'))}</div>
      </div>
    </div>

    <!-- subscription header -->
    <div style="margin-top:24px;display:flex;align-items:flex-end;justify-content:space-between;gap:12px">
      <div>
        <div style="font-family:${FONTS.MONO};font-size:8.5px;font-weight:600;letter-spacing:0.14em;color:${B};text-transform:uppercase;margin-bottom:4px">${isEs ? 'Suscripción SaaS' : 'SaaS subscription'}</div>
        <div style="font-family:${FONTS.SERIF};font-size:18px;font-weight:600;color:${N};letter-spacing:-0.015em;line-height:1.1">${isEs ? 'Cuatro planes mensuales' : 'Four monthly plans'}</div>
      </div>
    <div style="font-size:10px;color:#4C6078;line-height:1.45;max-width:240px;text-align:right">${isEs ? 'Verificaciones incluidas · Precio fijo por verificación adicional' : 'Verifications included · Fixed price per additional verification'}</div>
    </div>

    <!-- plans grid -->
    <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:10px;margin-top:14px">${plans}</div>

    <!-- footnote -->
    <div style="margin-top:14px;font-size:9.5px;color:#4C6078;line-height:1.5;font-style:italic">${isEs ? 'El plan Growth ofrece el mejor equilibrio coste/volumen para una fase piloto. Custom incluye condiciones negociadas.' : 'Growth offers the best cost/volume balance for a pilot. Custom includes negotiated terms.'}</div>
  </div>

  ${ftrStr(st)}
</div>`;
}

function planCard(pl, st, isEs) {
  const { N, B, A } = getColors(st);
  const rec = !!pl.rec;
  const recNeedsDarkText = rec && isLightColor(N);
  // High-contrast palette for the recommended (navy) card.
  // All values use full white #fff; only secondary labels are slightly muted.
  const bg = rec ? N : '#fff';
  const valueColor = rec ? (recNeedsDarkText ? '#0F1E30' : '#FFFFFF') : N;
  const labelColor = rec ? (recNeedsDarkText ? '#0F1E30' : '#FFFFFF') : '#6B7B92';
  const dimColor = rec ? (recNeedsDarkText ? 'rgba(15,30,48,.92)' : '#FFFFFF') : '#5B6F86';
  const border = rec ? (recNeedsDarkText ? 'rgba(15,30,48,.18)' : 'transparent') : '#E6ECF3';
  const divider = rec
    ? recNeedsDarkText
      ? 'rgba(15,30,48,.16)'
      : 'rgba(255,255,255,.16)'
    : '#F0F2F5';
  const accentBg = rec ? (recNeedsDarkText ? 'rgba(15,30,48,.08)' : A) : `${B}14`;
  const accentText = rec ? (recNeedsDarkText ? '#0F1E30' : N) : B;

  const recPill = rec
    ? `<div style="position:absolute;top:-10px;left:50%;transform:translateX(-50%);background:${A};color:#0F1E30;font-family:${FONTS.SANS};font-size:8.5px;font-weight:700;letter-spacing:0.08em;padding:4px 11px;border-radius:9999px;text-transform:uppercase;white-space:nowrap;box-shadow:0 4px 10px rgba(255,204,0,.45)">★ ${esc(isEs ? 'Recomendado' : 'Most popular')}</div>`
    : '';

  return `
  <div style="position:relative;background:${bg};border:1px solid ${border};border-radius:12px;padding:20px 14px 16px;text-align:center;font-family:${FONTS.SANS};${rec ? 'box-shadow:0 14px 32px rgba(10,18,100,.22)' : ''}">
    ${recPill}
    <div style="font-family:${FONTS.MONO};font-size:10px;font-weight:900;color:${labelColor};letter-spacing:0.12em;text-transform:uppercase;margin-bottom:12px">${esc(pl.name || '')}</div>
    <div style="font-family:${FONTS.SERIF};font-size:26px;font-weight:700;color:${valueColor};letter-spacing:-0.025em;line-height:1">${esc(pl.price || '')}</div>
    <div style="font-size:11px;color:${labelColor};margin-top:3px;font-family:${FONTS.SANS};font-weight:800">${esc(pl.per || '')}</div>

    <div style="height:1px;background:${divider};margin:14px 0 12px"></div>

    <div style="display:inline-flex;align-items:center;gap:5px;padding:3px 10px;background:${accentBg};border-radius:9999px;margin-bottom:6px">
      <span style="width:4px;height:4px;border-radius:50%;background:${accentText}"></span>
      <span style="font-family:${FONTS.MONO};font-size:10px;font-weight:700;color:${accentText}">${esc(pl.verifs || '')}</span>
    </div>
    <div style="font-size:10.5px;color:${dimColor};margin-bottom:14px;font-weight:800">${esc(isEs ? 'verif./mes' : 'verif./mo')}</div>

    <div style="font-family:${FONTS.SANS};font-size:9.5px;color:${dimColor};text-transform:uppercase;letter-spacing:0.06em;margin-bottom:3px;font-weight:900">${esc(isEs ? 'Coste medio' : 'Avg. cost')}</div>
    <div style="font-family:${FONTS.MONO};font-size:13px;font-weight:700;color:${valueColor};margin-bottom:12px;font-variant-numeric:tabular-nums">${esc(pl.avg || '')}</div>

    <div style="font-family:${FONTS.SANS};font-size:9.5px;color:${dimColor};text-transform:uppercase;letter-spacing:0.06em;margin-bottom:3px;font-weight:900">${esc(isEs ? 'Verif. extra' : 'Extra verif.')}</div>
    <div style="font-family:${FONTS.MONO};font-size:11px;font-weight:700;color:${valueColor};font-variant-numeric:tabular-nums">${esc(pl.extra || '')}</div>
  </div>`;
}

function isLightColor(hex) {
  const m = /^#([0-9a-f]{6})$/i.exec(hex || '');
  if (!m) return false;
  const n = parseInt(m[1], 16);
  const r = (n >> 16) & 255;
  const g = (n >> 8) & 255;
  const b = n & 255;
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.62;
}
