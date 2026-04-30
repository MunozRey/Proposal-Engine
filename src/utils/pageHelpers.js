// Shared page primitives. Aligned with creditchecker.io brand:
//   navy #0A1264, blue #005EFF, yellow accent #FFCC00, IBM Plex Sans body,
//   IBM Plex Serif (Larken fallback) display.
// Goal: more whitespace, fewer 6px text, higher readability for both
// preview and PDF export.

import { NAVY, BLUE, TC } from '../constants.js';
import { esc } from './esc.js';
import { ccLogoSvg, ccMarkSvg } from '../design/ccLogo.js';

// Use SINGLE quotes for font names so the resulting string can be embedded
// inside a double-quoted inline style attribute without breaking the HTML parser.
// (Previous double quotes caused style="...font-family:"IBM Plex Sans"..." to
// terminate prematurely, dropping every CSS rule after font-family.)
const SERIF = "'Larken', 'IBM Plex Serif', Georgia, serif";
const SANS = "'IBM Plex Sans', 'Inter', 'Segoe UI', system-ui, sans-serif";
const MONO = "'IBM Plex Mono', 'JetBrains Mono', ui-monospace, monospace";

/**
 * Effective brand colors.
 * Defaults follow the official creditchecker.io palette unless the user
 * has overridden them via state (st.brandNavy / st.brandBlue / st.brandAccent).
 */
export function getColors() {
  return {
    N: NAVY,
    B: BLUE,
    A: '#FFCC00',
  };
}

/* ── Logo ─────────────────────────────────────────────────────── */
// `mode`:'light' renders the dark navy logo (for white backgrounds);
// `mode`:'dark' renders the white logo (for navy backgrounds);
// If the user uploaded a custom ccLogoUrl, we honour it on dark surfaces only
// (their custom upload is typically white/transparent and would disappear on light).
export function logoStr(key, h, st, mode = 'dark') {
  if (key === 'ccLogoUrl') {
    const color = mode === 'dark' ? '#FFFFFF' : NAVY;
    return ccLogoSvg({ color, height: h });
  }
  if (st[key])
    return `<img src="${st[key]}" style="height:${h}px;object-fit:contain;display:block">`;
  const textColor = mode === 'dark' ? '#fff' : NAVY;
  return `<span style="font-size:${h * 0.62}px;font-weight:700;color:${textColor};font-family:${SERIF};letter-spacing:-0.01em">${esc(st.clientName || '')}</span>`;
}

// Just the geometric mark (no wordmark). Useful for compact placements.
export function logoMark(h, _st, mode = 'light') {
  const color = mode === 'dark' ? '#FFFFFF' : NAVY;
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
export function ftrStr() {
  const left = 'CreditCheck · Confidential';
  const right = 'creditchecker.io';
  const center = '';
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

/* ── Price pill (used in pricing tables: consistent across CPL/CPA/Hybrid) ── */
// Always white-on-navy or white-on-blue so values stay readable and on-brand.
// `tone`: 'blue' (default), 'navy', 'soft' (white card with navy text)
export function pricePillStr(value, st, tone = 'blue') {
  const { N, B } = getColors(st);
  const palette = {
    blue: { bg: B, color: '#FFFFFF', border: B },
    navy: { bg: N, color: '#FFFFFF', border: N },
    soft: { bg: '#FFFFFF', color: N, border: '#D5DDE7' },
  };
  const p = palette[tone] || palette.blue;
  return `<span style="display:inline-block;background:${p.bg};color:${p.color};font-family:${MONO};font-size:11px;font-weight:700;padding:4px 10px;border-radius:6px;border:1px solid ${p.border};letter-spacing:0.01em;font-variant-numeric:tabular-nums">${esc(value)}</span>`;
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
  const { N, A } = getColors(st);
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
      // Total line gets the brand yellow accent for the value, so the
      // bottom-line number pops without breaking brand discipline.
      const valueColor = isTotal ? A : '#FFFFFF';
      return `
      <div style="display:flex;justify-content:space-between;align-items:baseline;gap:8px;padding:3px 0;${isTotal ? 'margin-top:8px;border-top:1px solid rgba(255,255,255,.22);padding-top:8px;' : ''}padding-left:${indent}px">
        <span style="font-family:${SANS};font-size:9.5px;color:#FFFFFF;font-weight:${isTotal ? '700' : '600'};letter-spacing:-0.005em">${esc(left)}</span>
        <span style="font-family:${MONO};font-size:${isTotal ? '13' : '10.5'}px;color:${valueColor};font-weight:${isTotal ? '800' : '700'};font-variant-numeric:tabular-nums">${esc(right)}</span>
      </div>`;
    })
    .join('');
  return `
  <div style="background:${N};border-radius:10px;padding:14px 16px;font-family:${SANS}">
    <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:10px">
      <div style="font-size:10.5px;font-weight:700;color:#FFFFFF;letter-spacing:-0.005em">${esc(title)}</div>
      ${pillStr(st.language === 'es' ? 'Ejemplo' : 'Example', { bg: 'rgba(255,204,0,.18)', color: A })}
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
        `<th style="padding:11px 12px;font-family:${SANS};font-size:10px;font-weight:700;color:#FFFFFF;text-align:${h.align || 'left'};letter-spacing:0.08em;text-transform:uppercase;${h.width ? `width:${h.width};` : ''}">${esc(h.label)}</th>`
    )
    .join('');
  const trs = rows
    .map((cells, ri) => {
      const bg = ri % 2 === 0 ? '#FFFFFF' : '#F5F7FB';
      const tds = cells
        .map(
          (c) =>
            `<td style="padding:9px 12px;font-family:${SANS};font-size:10.5px;color:${TC};${c.style || ''}">${c.html}</td>`
        )
        .join('');
      return `<tr style="background:${bg};border-bottom:.5px solid #E6ECF3">${tds}</tr>`;
    })
    .join('');
  return `
  <table style="width:100%;border-collapse:separate;border-spacing:0;border-radius:10px;overflow:hidden;border:1px solid #D5DDE7">
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
