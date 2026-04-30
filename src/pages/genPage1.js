// Cover page: strong CreditCheck identity, no duplicate "Prepared for".
//   - Big white wordmark top-left + yellow accent stripe on left edge
//   - Two-line serif title (line 3 was redundant)
//   - Glassmorphism client card directly under the title
//   - One info row at the bottom (Date + Proposal nº)
//   - Big geometric mark watermark (lower-right) for brand presence

import { esc } from '../utils/esc.js';
import { getColors, FONTS, logoStr, logoMark } from '../utils/pageHelpers.js';
import { t } from '../i18n/translate.js';

export function genPage1(st) {
  const { N, B, A } = getColors(st);
  const primaryText = '#0F1E30';
  const secondaryText = 'rgba(15,30,48,.72)';
  const subtleText = 'rgba(15,30,48,.55)';
  const watermarkOpacity = '.08';
  const logoMode = 'light';
  const lang = st.language || 'en';
  const tt = (k, v) => t(lang, k, v);
  const dateLabel = tt('cover.date');
  const proposalLabel = tt('cover.proposalNo');
  const proposalNumber =
    st.proposalNumber ||
    `CC-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 9999) + 1).padStart(4, '0')}`;

  return `
<div style="width:595px;height:842px;position:relative;overflow:hidden;font-family:${FONTS.SANS};color:${primaryText};--cc-cover-label:${secondaryText};--cc-cover-value:${primaryText};background:linear-gradient(165deg, #F8FAFF 0%, #F1F5FF 52%, #EEF3FF 100%)">

  <!-- Structural brand shape -->
  <div style="position:absolute;top:-100px;right:-120px;width:420px;height:980px;background:linear-gradient(180deg, ${N} 0%, #111D7D 100%);transform:rotate(11deg);opacity:.95;pointer-events:none"></div>
  <div style="position:absolute;top:-70px;right:30px;width:280px;height:920px;background:linear-gradient(180deg, rgba(255,255,255,.2) 0%, rgba(255,255,255,.05) 100%);transform:rotate(11deg);pointer-events:none"></div>
  <div style="position:absolute;bottom:-140px;left:-80px;width:360px;height:360px;border-radius:50%;background:radial-gradient(circle, ${A}22 0%, transparent 70%);filter:blur(10px);pointer-events:none"></div>

  <!-- Big watermark mark (lower-right, brand presence) -->
  <div style="position:absolute;right:-100px;bottom:30px;opacity:${watermarkOpacity};pointer-events:none;transform:rotate(-10deg)">${logoMark(360, st, logoMode)}</div>

  <!-- Yellow accent stripe (left edge) -->
  <div style="position:absolute;top:0;bottom:0;left:0;width:4px;background:${A}"></div>

  <!-- Top: full CC wordmark + confidential mark -->
  <div style="position:absolute;top:46px;left:42px;right:42px;display:flex;align-items:center;justify-content:space-between">
    <div>${logoStr('ccLogoUrl', 34, st, logoMode)}</div>
  </div>

  <!-- Mid block intentionally empty (clean cover) -->
  <div style="position:absolute;top:208px;left:42px;right:188px">
  </div>

  <!-- Bottom strip: date + proposal nº -->
  <div style="position:absolute;left:42px;right:42px;bottom:78px;display:flex;justify-content:space-between;align-items:flex-end;background:#FFFFFF;border:1px solid rgba(10,18,100,.12);border-radius:12px;padding:16px 18px;box-shadow:0 10px 20px rgba(10,18,100,.06)">
    ${cellStr(dateLabel, st.date || formatToday(lang))}
    ${cellStr(proposalLabel, proposalNumber, true)}
  </div>

  <!-- Footer micro -->
  <div style="position:absolute;left:42px;right:42px;bottom:26px;display:flex;justify-content:space-between;align-items:center;font-family:${FONTS.MONO};font-size:8px;color:${subtleText};letter-spacing:0.08em">
    <span>${esc(st.footerLeft || 'CreditCheck · Confidential')}</span>
    <span>${esc(st.footerRight || 'creditchecker.io')}</span>
  </div>
</div>`;
}

function cellStr(label, value, alignRight = false) {
  return `
  <div style="text-align:${alignRight ? 'right' : 'left'}">
    <div style="font-family:${FONTS.MONO};font-size:8px;color:var(--cc-cover-label, rgba(255,255,255,.55));letter-spacing:0.18em;text-transform:uppercase;margin-bottom:6px">${esc(label)}</div>
    <div style="font-family:${FONTS.SANS};font-size:12px;color:var(--cc-cover-value, #fff);font-weight:500;letter-spacing:-0.005em">${esc(value)}</div>
  </div>`;
}

function formatToday(lang) {
  return new Intl.DateTimeFormat(lang, {
    month: 'long',
    year: 'numeric',
  }).format(new Date());
}
