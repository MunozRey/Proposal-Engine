import { NAVY, BLUE, TC, CC_LOGO } from '../constants.js';
import { esc } from './esc.js';

/**
 * Get effective brand colors from state (or fall back to defaults).
 * Call at the top of every generator: `const { N, B } = getColors(st);`
 */
export function getColors(st) {
  return {
    N: st?.brandNavy || NAVY,
    B: st?.brandBlue || BLUE,
  };
}

/* ── Logo ────────────────────────────────────────────────────── */
export function logoStr(key, h, st) {
  if (key === 'ccLogoUrl') {
    const src = st.ccLogoUrl || CC_LOGO;
    const w = h * (193 / 49); // matches Logo-white.svg viewBox
    return `<img src="${src}" style="height:${h}px;width:${w}px;object-fit:contain;display:block" crossorigin="anonymous">`;
  }
  if (st[key])
    return `<img src="${st[key]}" style="height:${h}px;object-fit:contain;display:block">`;
  return `<span style="font-size:${h * 0.7}px;font-weight:800;color:#fff">${esc(st.clientName)}</span>`;
}

/* ── Page Header (navy bar + logo + page num) ──────────────── */
export function hdrStr(num, lbl, st) {
  const { N, B } = getColors(st);
  return `
  <div style="position:absolute;top:0;left:0;right:0;height:46px;background:${N}"></div>
  <div style="position:absolute;top:0;left:0;right:0;height:3px;background:${B}"></div>
  <div style="position:absolute;top:8px;left:14px">${logoStr('ccLogoUrl', 26, st)}</div>
  <div style="position:absolute;top:9px;right:14px;text-align:right">
    <div style="font-size:9px;font-weight:800;color:${B}">${num}</div>
    <div style="font-size:6px;color:rgba(255,255,255,.45)">${lbl}</div>
  </div>`;
}

/* ── Bullet Item ─────────────────────────────────────────────── */
export function bulletItem(text, color, st) {
  const B = st?.brandBlue || BLUE;
  return `<div style="display:flex;gap:4px;margin-bottom:3px"><div style="width:6px;height:6px;border-radius:50%;background:${B};flex-shrink:0;margin-top:1px"></div><div style="font-size:6px;color:${color};line-height:1.4">${text}</div></div>`;
}

/* ── Page Footer (editable left + right) ─────────────────────── */
export function ftrStr(st) {
  const left = st?.footerLeft || 'Your Company · Confidential';
  const right = st?.footerRight || 'your-domain.com';
  return `<div style="position:absolute;bottom:6px;left:14px;right:14px;border-top:.5px solid #C8D8E8;padding-top:2px;display:flex;justify-content:space-between">
  <span style="font-size:5.5px;color:#9AAABB">${esc(left)}</span>
  <span style="font-size:5.5px;color:#9AAABB">${esc(right)}</span>
</div>`;
}

/* ══════════════════════════════════════════════════════════════
   DRY HELPERS — shared across multiple page generators
   ══════════════════════════════════════════════════════════════ */

/** 2-column feature grid inside a navy box */
export function featureGridStr(title, featuresL, featuresR, st) {
  const { N } = getColors(st);
  const fl = featuresL.map((f) => bulletItem(esc(f), '#fff', st)).join('');
  const fr = featuresR.map((f) => bulletItem(esc(f), '#90B8FF', st)).join('');
  return `<div style="background:${N};border-radius:4px;padding:8px 10px">
    <div style="font-size:${st.typo.body}px;font-weight:700;color:#fff;margin-bottom:6px">${esc(title)}</div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:0 8px"><div>${fl}</div><div>${fr}</div></div>
  </div>`;
}

/** Feature list inside a white box (single column) */
export function featureBoxStr(title, features, st) {
  const { N } = getColors(st);
  const items = features.map((f) => bulletItem(esc(f), TC, st)).join('');
  return `<div style="background:#fff;border-radius:4px;padding:8px 10px;border:.5px solid #C8D8E8">
    <div style="font-size:${st.typo.body}px;font-weight:700;color:${N};margin-bottom:6px">${esc(title)}</div>
    ${items}
  </div>`;
}

/** Calculation example box (navy background) */
export function calcBoxStr(title, text, st) {
  const { N } = getColors(st);
  const lines = (text || '')
    .split('\n')
    .map(
      (line) =>
        `<div style="font-size:${st.typo.small}px;color:#fff;line-height:1.8;${
          line.startsWith('Total') ? `font-weight:800;color:#90B8FF;margin-top:2px` : ''
        }${line.startsWith('  ') ? ';padding-left:8px' : ''}">${esc(line.trim())}</div>`
    )
    .join('');
  return `<div style="background:${N};border-radius:4px;padding:8px 10px">
    <div style="font-size:${st.typo.body}px;font-weight:700;color:#fff;margin-bottom:5px">\u25CE ${esc(title)}</div>
    ${lines}
  </div>`;
}

/** Diamond-bullet notes section */
export function notesStr(notes, st) {
  if (!notes || notes.length === 0) return '';
  const { B } = getColors(st);
  const items = notes
    .map(
      (n) =>
        `<div style="display:flex;gap:4px;margin-bottom:2px"><span style="color:${B};flex-shrink:0">\u25C6</span><span style="font-size:${st.typo.note}px;color:#4A5568;line-height:1.5">${esc(n)}</span></div>`
    )
    .join('');
  return `<div style="border-top:.5px solid #C8D8E8;padding-top:6px">${items}</div>`;
}

/** Generic table with navy header */
export function tableStr(headers, rows, st) {
  const { N } = getColors(st);
  const ths = headers
    .map(
      (h) =>
        `<th style="padding:5px 8px;font-size:${st.typo.small}px;font-weight:700;color:#fff;text-align:${h.align || 'left'};${h.width ? `width:${h.width}` : ''}">${esc(h.label)}</th>`
    )
    .join('');
  const trs = rows
    .map((cells, ri) => {
      const bg = ri % 2 === 0 ? '#fff' : '#F8FBFF';
      const tds = cells
        .map((c) => `<td style="padding:5px 8px;${c.style || ''}">${c.html}</td>`)
        .join('');
      return `<tr style="background:${bg}">${tds}</tr>`;
    })
    .join('');
  return `<table style="width:100%;border-collapse:collapse;border-radius:4px;overflow:hidden;box-shadow:0 1px 4px rgba(0,0,0,.06)">
    <thead><tr style="background:${N}">${ths}</tr></thead>
    <tbody>${trs}</tbody>
  </table>`;
}
