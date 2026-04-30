// Closing page. Three-step timeline, contact card, validity, accept-via-mail CTA,
// signature placeholders. Designed to make signing feel close at hand.

import { esc } from '../utils/esc.js';
import { hdrStr, ftrStr, getColors, FONTS, eyebrowStr, titleStr } from '../utils/pageHelpers.js';
import { t } from '../i18n/translate.js';

export function genClose(st, pageNum = '99') {
  const { N, B, A } = getColors(st);
  const lang = st.language || 'en';
  const tt = (k, v) => t(lang, k, v);

  const defaultSteps = [
    { title: tt('pageClose.defaultStep1Title'), desc: tt('pageClose.defaultStep1Desc') },
    { title: tt('pageClose.defaultStep2Title'), desc: tt('pageClose.defaultStep2Desc') },
    { title: tt('pageClose.defaultStep3Title'), desc: tt('pageClose.defaultStep3Desc') },
  ];
  const steps = st.closeSteps?.length ? st.closeSteps : defaultSteps;

  const contact = st.contact || {};
  const contactName = contact.name || 'Sales · CreditCheck';
  const contactRole = contact.role || tt('pageClose.salesTeam');
  const contactEmail = contact.email || 'sales@creditchecker.io';
  const contactPhone = contact.phone || '';

  const validUntil = st.validUntil || formatValidity(lang);
  const subject = `${tt('pageClose.subject')} · ${st.clientName || ''}`;
  const ctaHref = `mailto:${encodeURIComponent(contactEmail)}?subject=${encodeURIComponent(subject)}`;

  const stepsHtml = steps
    .map(
      (s, i) => `
    <div style="display:flex;gap:14px;align-items:flex-start;padding:12px 0;${i < steps.length - 1 ? 'border-bottom:.5px solid #E6ECF3' : ''}">
      <div style="width:26px;height:26px;border-radius:50%;background:${B}14;color:${B};font-family:${FONTS.MONO};font-size:11px;font-weight:600;display:flex;align-items:center;justify-content:center;flex-shrink:0">${String(i + 1).padStart(2, '0')}</div>
      <div style="flex:1;min-width:0">
        <div style="font-family:${FONTS.SERIF};font-size:14px;font-weight:600;color:${N};letter-spacing:-0.005em;line-height:1.2">${esc(s.title)}</div>
        <div style="font-size:10px;color:#30465F;line-height:1.5;margin-top:3px">${esc(s.desc)}</div>
      </div>
    </div>`
    )
    .join('');

  return `
<div style="width:595px;height:842px;background:linear-gradient(180deg, #FAFCFF 0%, #F5F8FF 100%);position:relative;overflow:hidden;font-family:${FONTS.SANS}">
  ${hdrStr(pageNum, tt('pageClose.headerTitle'), st)}

  <div style="position:absolute;top:60px;left:42px;right:42px;font-family:inherit">
    ${eyebrowStr(tt('pageClose.eyebrow'))}
    ${titleStr(tt('pageClose.heading'), N, 22)}

    <div style="display:grid;grid-template-columns:1.4fr 1fr;gap:24px;margin-top:22px">
      <!-- Steps timeline -->
      <div style="background:#fff;border:1px solid #E6ECF3;border-radius:12px;padding:6px 18px">
        ${stepsHtml}
      </div>

      <!-- Contact card -->
      <div style="background:${N};border-radius:12px;padding:16px 18px;color:#fff;font-family:${FONTS.SANS}">
        <div style="display:flex;align-items:center;gap:8px;margin-bottom:10px">
          <span style="width:5px;height:5px;border-radius:50%;background:${A}"></span>
          <span style="font-family:${FONTS.MONO};font-size:9px;color:rgba(255,255,255,.9);letter-spacing:0.12em;text-transform:uppercase;font-weight:700">${esc(tt('pageClose.contactLabel'))}</span>
        </div>
        <div style="font-family:${FONTS.SERIF};font-size:18px;font-weight:600;letter-spacing:-0.01em;margin-bottom:3px">${esc(contactName)}</div>
        <div style="font-size:9.5px;color:rgba(255,255,255,.92);margin-bottom:14px;font-weight:600">${esc(contactRole)}</div>
        <div style="font-family:${FONTS.MONO};font-size:9.5px;color:#fff;letter-spacing:-0.005em;margin-bottom:4px">${esc(contactEmail)}</div>
        ${contactPhone ? `<div style="font-family:${FONTS.MONO};font-size:9.5px;color:#FFFFFF;letter-spacing:-0.005em">${esc(contactPhone)}</div>` : ''}
      </div>
    </div>

    <!-- Validity -->
    <div style="display:flex;align-items:center;justify-content:space-between;background:${A}1A;border:1px solid ${A}44;border-radius:10px;padding:11px 16px;margin-top:18px">
      <div style="display:flex;align-items:center;gap:8px">
        <span style="width:7px;height:7px;border-radius:50%;background:${A};box-shadow:0 0 8px ${A}"></span>
        <span style="font-size:10.5px;color:#30465F">${esc(tt('pageClose.validityLabel'))}</span>
      </div>
      <span style="font-family:${FONTS.MONO};font-size:11px;font-weight:600;color:${N};letter-spacing:-0.005em">${esc(validUntil)}</span>
    </div>

    <!-- CTA -->
    <a href="${ctaHref}" style="display:flex;align-items:center;justify-content:center;gap:10px;background:${B};color:#fff;text-decoration:none;font-family:${FONTS.SANS};font-size:13px;font-weight:600;letter-spacing:-0.005em;padding:14px 22px;border-radius:9999px;margin-top:16px;box-shadow:0 12px 32px ${B}44">
      <span>${esc(tt('pageClose.cta'))}</span>
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
    </a>

    <!-- Signature placeholders -->
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:24px;margin-top:30px">
      ${signatureCell(tt('pageClose.signatureClient'), st.clientName || '')}
      ${signatureCell('CreditCheck', tt('pageClose.salesTeam'))}
    </div>
  </div>

  ${ftrStr(st)}
</div>`;
}

function signatureCell(role, name) {
  return `
  <div style="font-family:${FONTS.SANS}">
    <div style="height:48px;border-bottom:1px dashed #C0CCDB;margin-bottom:8px"></div>
    <div style="font-family:${FONTS.MONO};font-size:8.5px;color:#94A3B8;letter-spacing:0.1em;text-transform:uppercase">${esc(role)}</div>
    <div style="font-size:10.5px;color:#30465F;font-weight:500;margin-top:2px">${esc(name)}</div>
  </div>`;
}

function formatValidity(lang) {
  const d = new Date();
  d.setDate(d.getDate() + 30);
  return new Intl.DateTimeFormat(lang, {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(d);
}
