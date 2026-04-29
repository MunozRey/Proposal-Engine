// Shared page primitives. Aligned with creditchecker.io brand:
//   navy #0A1264, blue #005EFF, yellow accent #FFCC00, IBM Plex Sans body,
//   IBM Plex Serif (Larken fallback) display.
// Goal: more whitespace, fewer 6px text, higher readability for both
// preview and PDF export.

import { NAVY, BLUE, TC } from '../constants.js';
import { esc } from './esc.js';
import { ccLogoSvg, ccMarkSvg } from '../design/ccLogo.js';

const SERIF = '"Larken", "IBM Plex Serif", Georgia, serif';
const SANS = '"IBM Plex Sans", "Inter", "Segoe UI", system-ui, sans-serif';
const MONO = '"IBM Plex Mono", "JetBrains Mono", ui-monospace, monospace';

/**
 * Effective brand colors.
 * Defaults follow the official creditchecker.io palette unless the user
 * has overridden them via state (st.brandNavy / st.brandBlue / st.brandAccent).
 */
export function getColors(st) {
  return {
    N: st?.brandNavy || NAVY,
    B: st?.brandBlue || BLUE,
    A: st?.brandAccent || '#FFCC00',
  };
}

/* ── Logo ─────────────────────────────────────────────────────── */
// `mode`:'light' renders the dark navy logo (for white backgrounds);
// `mode`:'dark' renders the white logo (for navy backgrounds);
// If the user uploaded a custom ccLogoUrl, we honour it on dark surfaces only
// (their custom upload is typically white/transparent and would disappear on light).
export function logoStr(key, h, st, mode = 'dark') {
  if (key === 'ccLogoUrl') {
    if (mode === 'dark' && st.ccLogoUrl) {
      const w = h * (193 / 49);
      return `<img src="${st.ccLogoUrl}" style="height:${h}px;width:${w}px;object-fit:contain;display:block" crossorigin="anonymous">`;
    }
    const color = mode === 'dark' ? '#FFFFFF' : st.brandNavy || NAVY;
    return ccLogoSvg({ color, height: h });
  }
  if (st[key])
    return `<img src="${st[key]}" style="height:${h}px;object-fit:contain;display:block">`;
  const textColor = mode === 'dark' ? '#fff' : st.brandNavy || NAVY;
  return `<span style="font-size:${h * 0.62}px;font-weight:700;color:${textColor};font-family:${SERIF};letter-spacing:-0.01em">${esc(st.clientName || '')}</span>`;
}

// Just the geometric mark (no wordmark). Useful for compact placements.
export function logoMark(h, st, mode = 'light') {
  const color = mode === 'dark' ? '#FFFFFF' : st.brandNavy || NAVY;
  return ccMarkSvg({ color, size: h });
}

/* ── Header (thin, minimal, mono page number) ─────────────── */
// `mode` lets the caller force dark/light; default 'light' (dark logo on white pages).
export function hdrStr(num, lbl, st, mode = 'light') {
  const { N, B } = getColors(st);
  return `
  <div style="position:absolute;top:0;left:0;right:0;height:36px;background:transparent;display:flex;align-items:center;justify-content:space-between;padding:0 22px;font-family:${SANS}">
    <div style="display:flex;align-items:center;gap:10px">${logoStr('ccLogoUrl', 18, st, mode)}</div>
    <div style="display:flex;align-items:center;gap:10px;font-family:${MONO}">
      <span style="font-size:9px;color:${mode === 'dark' ? 'rgba(255,255,255,.55)' : '#3D5166'};letter-spacing:0.06em;text-transform:uppercase">${esc(lbl)}</span>
      <span style="width:3px;height:3px;border-radius:50%;background:${B}"></span>
      <span style="font-size:9px;font-weight:600;color:${mode === 'dark' ? '#fff' : N}">${num}</span>
    </div>
  </div>
  <div style="position:absolute;top:36px;left:22px;right:22px;height:.5px;background:${mode === 'dark' ? 'rgba(255,255,255,.12)' : '#E6ECF3'}"></div>`;
}

/* ── Footer (3-cell, mono micro) ──────────────────────────── */
export function ftrStr(st) {
  const left = st?.footerLeft || 'CreditCheck · Confidential';
  const right = st?.footerRight || 'creditchecker.io';
  const center = st?.footerCenter || '';
  return `
  <div style="position:absolute;bottom:0;left:22px;right:22px;height:24px;border-top:.5px solid #E6ECF3;display:flex;align-items:center;justify-content:space-between;font-family:${MONO};font-size:7px;color:#94A3B8;letter-spacing:0.04em">
    <span>${esc(left)}</span>
    <span style="opacity:.7">${esc(center)}</span>
    <span>${esc(right)}</span>
  </div>`;
}

/* ── Eyebrow (small uppercase label above titles) ─────────── */
export function eyebrowStr(text, color) {
  return `<div style="font-family:${MONO};font-size:8.5px;font-weight:600;letter-spacing:0.14em;color:${color || '#005EFF'};text-transform:uppercase;margin-bottom:6px">${esc(text)}</div>`;
}

/* ── Section title (display serif, like creditchecker hero) ─ */
export function titleStr(text, color, size = 22) {
  return `<div style="font-family:${SERIF};font-size:${size}px;font-weight:600;color:${color || NAVY};letter-spacing:-0.02em;line-height:1.1">${esc(text)}</div>`;
}

/* ── Lead paragraph (body) ──────────────────────────────── */
export function leadStr(text, color, size) {
  return `<p style="font-family:${SANS};font-size:${size || 11}px;color:${color || TC};line-height:1.6;margin:0">${esc(text)}</p>`;
}

/* ── Pill / Badge ────────────────────────────────────────── */
export function pillStr(text, { bg = '#005EFF', color = '#fff', dot } = {}) {
  return `<span style="display:inline-flex;align-items:center;gap:5px;background:${bg};color:${color};font-family:${SANS};font-size:8px;font-weight:600;letter-spacing:0.08em;padding:3px 9px;border-radius:9999px;text-transform:uppercase">${
    dot ? `<span style="width:5px;height:5px;border-radius:50%;background:${dot}"></span>` : ''
  }${esc(text)}</span>`;
}

/* ── Bullet (clean check-style) ─────────────────────────── */
export function bulletItem(text, color, st) {
  const { B } = getColors(st);
  return `<div style="display:flex;gap:7px;margin-bottom:5px;align-items:flex-start;font-family:${SANS}">
    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="${B}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink:0;margin-top:1px"><path d="M20 6 9 17l-5-5"/></svg>
    <span style="font-size:9px;color:${color};line-height:1.55">${text}</span>
  </div>`;
}

/* ── Step Card (numbered card with title + description) ─── */
export function stepCardStr(num, title, desc, st, accent) {
  const { N, B } = getColors(st);
  const accentColor = accent || B;
  return `
  <div style="background:#fff;border:1px solid #E6ECF3;border-radius:8px;padding:12px;display:flex;gap:12px;font-family:${SANS}">
    <div style="width:26px;height:26px;border-radius:50%;background:${accentColor}14;color:${accentColor};font-family:${MONO};font-size:11px;font-weight:600;display:flex;align-items:center;justify-content:center;flex-shrink:0;border:1px solid ${accentColor}33">${num}</div>
    <div style="flex:1;min-width:0">
      <div style="font-size:11px;font-weight:600;color:${N};margin-bottom:3px;letter-spacing:-0.005em">${esc(title)}</div>
      <div style="font-size:9px;color:#4A5568;line-height:1.5">${esc(desc)}</div>
    </div>
  </div>`;
}

/* ── Feature grid (cleaner navy box with breathing room) ── */
export function featureGridStr(title, featuresL, featuresR, st) {
  const { N, B } = getColors(st);
  const fl = featuresL.map((f) => bulletItem(esc(f), '#fff', st)).join('');
  const fr = featuresR.map((f) => bulletItem(esc(f), 'rgba(255,255,255,.78)', st)).join('');
  return `
  <div style="background:${N};border-radius:10px;padding:14px 16px;font-family:${SANS}">
    <div style="display:flex;align-items:center;gap:8px;margin-bottom:10px">
      <span style="width:6px;height:6px;border-radius:50%;background:${B}"></span>
      <span style="font-size:10px;font-weight:600;color:#fff;letter-spacing:-0.005em">${esc(title)}</span>
    </div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:0 18px">
      <div>${fl}</div>
      <div>${fr}</div>
    </div>
  </div>`;
}

/* ── Feature box (single column, subtle white card) ─────── */
export function featureBoxStr(title, features, st) {
  const { N } = getColors(st);
  const items = features.map((f) => bulletItem(esc(f), TC, st)).join('');
  return `
  <div style="background:#fff;border:1px solid #E6ECF3;border-radius:10px;padding:14px 16px;font-family:${SANS}">
    <div style="font-size:10px;font-weight:600;color:${N};margin-bottom:9px;letter-spacing:-0.005em">${esc(title)}</div>
    ${items}
  </div>`;
}

/* ── Calc card (mono numbers, clean layout) ─────────────── */
export function calcBoxStr(title, text, st) {
  const { N, B } = getColors(st);
  const lines = (text || '')
    .split('\n')
    .map((raw) => {
      const line = raw.trim();
      const isTotal = /^total/i.test(line);
      const indent = raw.startsWith('  ') ? 10 : 0;
      // Try to split "label   value" by 2+ spaces or last space-number group
      const m =
        line.match(/^(.*?)\s{2,}(.+)$/) || line.match(/^(.+?)\s+([+-]?[€$£¥0-9.,%]+\s*\w*)$/);
      const left = m ? m[1] : line;
      const right = m ? m[2] : '';
      return `
      <div style="display:flex;justify-content:space-between;align-items:baseline;gap:8px;padding:3px 0;${isTotal ? `margin-top:6px;border-top:.5px solid rgba(255,255,255,.18);padding-top:7px` : ''};padding-left:${indent}px">
        <span style="font-family:${SANS};font-size:9px;color:${isTotal ? '#fff' : 'rgba(255,255,255,.72)'};font-weight:${isTotal ? '600' : '400'}">${esc(left)}</span>
        <span style="font-family:${MONO};font-size:${isTotal ? '12' : '9'}px;color:${isTotal ? B : '#fff'};font-weight:${isTotal ? '700' : '500'};font-variant-numeric:tabular-nums">${esc(right)}</span>
      </div>`;
    })
    .join('');
  return `
  <div style="background:${N};border-radius:10px;padding:14px 16px;font-family:${SANS}">
    <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:8px">
      <div style="font-size:10px;font-weight:600;color:#fff;letter-spacing:-0.005em">${esc(title)}</div>
      ${pillStr(st.language === 'es' ? 'Ejemplo' : 'Example', { bg: 'rgba(255,255,255,.12)', color: '#fff' })}
    </div>
    ${lines}
  </div>`;
}

/* ── Notes (soft footnote block) ──────────────────────── */
export function notesStr(notes, st) {
  if (!notes || notes.length === 0) return '';
  const { B } = getColors(st);
  const items = notes
    .map(
      (n) => `
      <div style="display:flex;gap:7px;margin-bottom:4px;font-family:${SANS}">
        <span style="color:${B};flex-shrink:0;font-size:9px;line-height:1">•</span>
        <span style="font-size:8.5px;color:#6B7B92;line-height:1.55">${esc(n)}</span>
      </div>`
    )
    .join('');
  return `<div style="border-top:.5px solid #E6ECF3;padding-top:8px;margin-top:6px">${items}</div>`;
}

/* ── Table (cleaner with airy padding and check icons) ── */
export function tableStr(headers, rows, st) {
  const { N } = getColors(st);
  const ths = headers
    .map(
      (h) =>
        `<th style="padding:10px 12px;font-family:${SANS};font-size:9px;font-weight:600;color:#fff;text-align:${h.align || 'left'};letter-spacing:0.04em;text-transform:uppercase;${h.width ? `width:${h.width}` : ''}">${esc(h.label)}</th>`
    )
    .join('');
  const trs = rows
    .map((cells, ri) => {
      const bg = ri % 2 === 0 ? '#fff' : '#FAFBFD';
      const tds = cells
        .map(
          (c) =>
            `<td style="padding:8px 12px;font-family:${SANS};font-size:10px;color:${TC};${c.style || ''}">${c.html}</td>`
        )
        .join('');
      return `<tr style="background:${bg};border-bottom:.5px solid #F0F2F5">${tds}</tr>`;
    })
    .join('');
  return `
  <table style="width:100%;border-collapse:separate;border-spacing:0;border-radius:10px;overflow:hidden;border:1px solid #E6ECF3">
    <thead><tr style="background:${N}">${ths}</tr></thead>
    <tbody>${trs}</tbody>
  </table>`;
}

/* ── Metric (display number + label, for hero stats) ──── */
export function metricStr(value, label, st, accent) {
  const { N, B } = getColors(st);
  const accentColor = accent || B;
  return `
  <div style="font-family:${SANS}">
    <div style="font-family:${SERIF};font-size:34px;font-weight:600;color:${N};letter-spacing:-0.025em;line-height:1;margin-bottom:6px">
      <span>${esc(value)}</span>
      <span style="display:inline-block;width:5px;height:5px;border-radius:50%;background:${accentColor};margin-left:4px;vertical-align:middle"></span>
    </div>
    <div style="font-size:9px;color:#6B7B92;line-height:1.4;letter-spacing:0.01em">${esc(label)}</div>
  </div>`;
}

/* ── Page wrapper (helper) ─────────────────────────────── */
export const FONTS = { SERIF, SANS, MONO };
