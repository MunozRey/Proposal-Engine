import { esc } from '../utils/esc.js';
import { logoStr, getColors } from '../utils/pageHelpers.js';

export function genPage1(st) {
  const { N, B } = getColors(st);
  const isLeads = st.proposalType === 'leads';
  const badge = st.coverBadge || 'PARTNERSHIP PROPOSAL';
  const line1 = st.coverLine1 || (isLeads ? 'Proposal for' : 'Platform for');
  const line3 = st.coverLine3 || (isLeads ? 'for' : 'white-label for');

  return `<div style="width:595px;height:842px;background:${N};position:relative;overflow:hidden;font-family:'Segoe UI',system-ui,sans-serif">
  <div style="position:absolute;top:0;left:0;right:0;height:3px;background:${B}"></div>
  <div style="position:absolute;right:-80px;bottom:-60px;width:380px;height:380px;border-radius:50%;background:rgba(255,255,255,.025)"></div>
  <div style="position:absolute;left:-60px;top:-40px;width:260px;height:260px;border-radius:50%;background:rgba(255,255,255,.025)"></div>
  <div style="position:absolute;top:12px;left:14px">${logoStr('ccLogoUrl', 28, st)}</div>
  <div style="position:absolute;top:12px;right:14px;font-size:6.5px;color:rgba(255,255,255,.35);letter-spacing:.08em;font-family:inherit">CONFIDENTIAL</div>
  <div style="position:absolute;top:362px;left:14px;background:${B};border-radius:3px;padding:3px 8px;font-size:6.5px;font-weight:800;color:#fff;letter-spacing:.07em;font-family:inherit">${esc(badge)}</div>
  <div style="position:absolute;top:386px;left:14px;font-family:inherit">
    <div style="font-size:18px;font-weight:800;color:#fff;line-height:1.15">${line1}</div>
    <div style="font-size:18px;font-weight:800;color:${B};line-height:1.15">${esc(st.productTitle || 'calificación crediticia')}</div>
    <div style="font-size:18px;font-weight:800;color:#fff;line-height:1.15">${line3}</div>
  </div>
  <div style="position:absolute;top:496px;left:14px;background:rgba(14,36,72,.85);border-radius:4px;padding:6px 12px">${logoStr('clientLogoUrl', 24, st)}</div>
  <div style="position:absolute;top:548px;left:14px;right:14px;border-top:.5px solid rgba(255,255,255,.1)"></div>
  <div style="position:absolute;top:556px;left:14px;font-size:7px;color:rgba(255,255,255,.45);font-family:inherit">${esc(st.date)} · Clovr Labs S.L.</div>
  <div style="position:absolute;bottom:28px;left:14px;right:14px;background:rgba(9,24,50,.9);border-radius:5px;padding:10px 14px">${logoStr('ccLogoUrl', 32, st)}</div>
  <div style="position:absolute;bottom:8px;left:14px;right:14px;display:flex;justify-content:space-between;font-family:inherit">
    <span style="font-size:5.5px;color:rgba(255,255,255,.18)">${esc(st.footerLeft || 'CreditCheck · Clovr Labs S.L. · Confidential')}</span>
    <span style="font-size:5.5px;color:rgba(255,255,255,.18)">${esc(st.footerRight || 'creditchecker.io')}</span>
  </div></div>`;
}
