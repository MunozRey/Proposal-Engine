// Cover page — strong CreditCheck identity, no duplicate "Prepared for".
//   • Big white wordmark top-left + yellow accent stripe on left edge
//   • Two-line serif title (was three — line 3 was redundant)
//   • Glassmorphism client card directly under the title
//   • One info row at the bottom (Date · Proposal nº)
//   • Big geometric mark watermark (lower-right) for brand presence

import { esc } from '../utils/esc.js';
import { getColors, FONTS, pillStr, logoStr, logoMark } from '../utils/pageHelpers.js';

export function genPage1(st) {
  const { N, B, A } = getColors(st);
  const isEs = st.language === 'es';
  const isLeads = st.proposalType === 'leads';
  const badge = st.coverBadge || (isEs ? 'PROPUESTA DE COLABORACIÓN' : 'PARTNERSHIP PROPOSAL');
  const line1 =
    st.coverLine1 ||
    (isLeads
      ? isEs
        ? 'Propuesta de leads verificados para'
        : 'Verified lead generation for'
      : isEs
        ? 'Plataforma white-label para'
        : 'White-label platform for');
  const product = st.productTitle || (isEs ? 'tu producto o servicio' : 'your product or service');
  const dateLabel = isEs ? 'Fecha' : 'Date';
  const proposalLabel = isEs ? 'Propuesta nº' : 'Proposal nº';
  const proposalNumber =
    st.proposalNumber ||
    `CC-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 9999) + 1).padStart(4, '0')}`;

  return `
<div style="width:595px;height:842px;position:relative;overflow:hidden;font-family:${FONTS.SANS};color:#fff;background:linear-gradient(155deg, ${N} 0%, ${darken(N)} 55%, #04062B 100%)">

  <!-- Soft mesh blurs -->
  <div style="position:absolute;top:-220px;right:-240px;width:680px;height:680px;border-radius:50%;background:radial-gradient(circle, ${B}40 0%, transparent 65%);filter:blur(50px);pointer-events:none"></div>
  <div style="position:absolute;bottom:-280px;left:-180px;width:620px;height:620px;border-radius:50%;background:radial-gradient(circle, ${A}30 0%, transparent 70%);filter:blur(54px);pointer-events:none"></div>

  <!-- Subtle grid overlay -->
  <div style="position:absolute;inset:0;background-image:linear-gradient(rgba(255,255,255,.035) 1px, transparent 1px),linear-gradient(90deg, rgba(255,255,255,.035) 1px, transparent 1px);background-size:48px 48px;pointer-events:none"></div>

  <!-- Big watermark mark (lower-right, brand presence) -->
  <div style="position:absolute;right:-110px;bottom:-40px;opacity:.10;pointer-events:none;transform:rotate(-14deg)">${logoMark(460, st, 'dark')}</div>

  <!-- Yellow accent stripe (left edge) -->
  <div style="position:absolute;top:0;bottom:0;left:0;width:4px;background:${A}"></div>

  <!-- Top: full CC wordmark + confidential mark -->
  <div style="position:absolute;top:46px;left:42px;right:42px;display:flex;align-items:center;justify-content:space-between">
    <div>${logoStr('ccLogoUrl', 34, st, 'dark')}</div>
    <div style="display:flex;align-items:center;gap:7px;font-family:${FONTS.MONO};font-size:9px;letter-spacing:0.18em;color:rgba(255,255,255,.62);background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.12);padding:5px 11px;border-radius:9999px;backdrop-filter:blur(8px)">
      <span style="width:6px;height:6px;border-radius:50%;background:${A};box-shadow:0 0 14px ${A}aa"></span>
      <span>${esc(isEs ? 'CONFIDENCIAL' : 'CONFIDENTIAL')}</span>
    </div>
  </div>

  <!-- Mid block: pill → 2-line title → glass client card -->
  <div style="position:absolute;top:230px;left:42px;right:80px">
    <div style="margin-bottom:22px">${pillStr(badge, { bg: 'rgba(255,255,255,.12)', color: '#fff', dot: A })}</div>

    <div style="font-family:${FONTS.SERIF};font-size:50px;font-weight:500;line-height:1.04;letter-spacing:-0.025em;color:#fff;margin-bottom:6px">${esc(line1)}</div>
    <div style="font-family:${FONTS.SERIF};font-size:50px;font-weight:500;line-height:1.04;letter-spacing:-0.025em;color:${B};margin-bottom:38px">${esc(product)}</div>

    ${
      st.clientLogoUrl
        ? `<div style="display:inline-flex;align-items:center;gap:14px;background:rgba(255,255,255,.10);border:1px solid rgba(255,255,255,.18);border-radius:14px;padding:14px 22px;backdrop-filter:blur(12px)">
             <span style="font-family:${FONTS.MONO};font-size:9px;color:rgba(255,255,255,.65);letter-spacing:0.14em;text-transform:uppercase">${isEs ? 'Para' : 'For'}</span>
             <span style="width:1px;height:18px;background:rgba(255,255,255,.18)"></span>
             ${logoStr('clientLogoUrl', 28, st)}
           </div>`
        : st.clientName
          ? `<div style="display:inline-flex;align-items:center;gap:14px;background:rgba(255,255,255,.10);border:1px solid rgba(255,255,255,.18);border-radius:14px;padding:12px 22px;backdrop-filter:blur(12px)">
               <span style="font-family:${FONTS.MONO};font-size:9px;color:rgba(255,255,255,.65);letter-spacing:0.14em;text-transform:uppercase">${isEs ? 'Para' : 'For'}</span>
               <span style="width:1px;height:18px;background:rgba(255,255,255,.18)"></span>
               <span style="font-family:${FONTS.SERIF};font-size:22px;font-weight:600;color:#fff;letter-spacing:-0.015em">${esc(st.clientName)}</span>
             </div>`
          : `<div style="display:inline-flex;align-items:center;gap:10px;background:rgba(255,255,255,.06);border:1px dashed rgba(255,255,255,.20);border-radius:14px;padding:12px 22px">
               <span style="font-family:${FONTS.MONO};font-size:9px;color:rgba(255,255,255,.55);letter-spacing:0.14em;text-transform:uppercase">${isEs ? 'Cliente pendiente' : 'Client pending'}</span>
             </div>`
    }
  </div>

  <!-- Bottom strip: date + proposal nº -->
  <div style="position:absolute;left:42px;right:42px;bottom:80px;display:flex;justify-content:space-between;align-items:flex-end;border-top:.5px solid rgba(255,255,255,.20);padding-top:22px">
    ${cellStr(dateLabel, st.date || formatToday(isEs))}
    ${cellStr(proposalLabel, proposalNumber, true)}
  </div>

  <!-- Footer micro -->
  <div style="position:absolute;left:42px;right:42px;bottom:26px;display:flex;justify-content:space-between;align-items:center;font-family:${FONTS.MONO};font-size:8px;color:rgba(255,255,255,.42);letter-spacing:0.08em">
    <span>${esc(st.footerLeft || 'CreditCheck · Confidential')}</span>
    <span>${esc(st.footerRight || 'creditchecker.io')}</span>
  </div>
</div>`;
}

function cellStr(label, value, alignRight = false) {
  return `
  <div style="text-align:${alignRight ? 'right' : 'left'}">
    <div style="font-family:${FONTS.MONO};font-size:8px;color:rgba(255,255,255,.55);letter-spacing:0.18em;text-transform:uppercase;margin-bottom:6px">${esc(label)}</div>
    <div style="font-family:${FONTS.SANS};font-size:12px;color:#fff;font-weight:500;letter-spacing:-0.005em">${esc(value)}</div>
  </div>`;
}

function darken(hex) {
  const m = /^#([0-9a-f]{6})$/i.exec(hex || '');
  if (!m) return '#0A1264';
  const n = parseInt(m[1], 16);
  return `#${[(n >> 16) & 255, (n >> 8) & 255, n & 255]
    .map((v) =>
      Math.round(v * 0.55)
        .toString(16)
        .padStart(2, '0')
    )
    .join('')}`;
}

function formatToday(isEs) {
  return new Intl.DateTimeFormat(isEs ? 'es' : 'en', {
    month: 'long',
    year: 'numeric',
  }).format(new Date());
}
