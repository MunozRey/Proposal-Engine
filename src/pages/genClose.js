// Closing page. Three-step timeline, contact card, validity, accept-via-mail CTA,
// signature placeholders. Designed to make signing feel close at hand.

import { esc } from '../utils/esc.js';
import { hdrStr, ftrStr, getColors, FONTS, eyebrowStr, titleStr } from '../utils/pageHelpers.js';

const DEFAULT_STEPS_EN = [
  {
    title: 'Sign',
    desc: 'Accept this proposal via email — we counter-sign within one business day.',
  },
  { title: 'Onboard', desc: 'Kickoff call, sandbox access and shared Slack channel within 48h.' },
  {
    title: 'Go-live',
    desc: 'Production verification within ~2 weeks, depending on your QA cycle.',
  },
];

const DEFAULT_STEPS_ES = [
  { title: 'Firma', desc: 'Acepta la propuesta por email — contrafirmamos en un día laborable.' },
  { title: 'Onboarding', desc: 'Kickoff, acceso a sandbox y canal Slack compartido en 48h.' },
  { title: 'Go-live', desc: 'Verificación en producción en ~2 semanas, según tu ciclo de QA.' },
];

export function genClose(st, pageNum = '99') {
  const { N, B, A } = getColors(st);
  const isEs = st.language === 'es';

  const steps = st.closeSteps?.length ? st.closeSteps : isEs ? DEFAULT_STEPS_ES : DEFAULT_STEPS_EN;

  const contact = st.contact || {};
  const contactName = contact.name || 'Sales · CreditCheck';
  const contactRole = contact.role || (isEs ? 'Equipo comercial' : 'Sales team');
  const contactEmail = contact.email || 'sales@creditchecker.io';
  const contactPhone = contact.phone || '';

  const validUntil = st.validUntil || formatValidity(isEs);
  const subject = `${isEs ? 'Aceptar propuesta' : 'Accept proposal'} — ${st.clientName || ''}`;
  const ctaHref = `mailto:${encodeURIComponent(contactEmail)}?subject=${encodeURIComponent(subject)}`;

  const stepsHtml = steps
    .map(
      (s, i) => `
    <div style="display:flex;gap:14px;align-items:flex-start;padding:12px 0;${i < steps.length - 1 ? 'border-bottom:.5px solid #E6ECF3' : ''}">
      <div style="width:26px;height:26px;border-radius:50%;background:${B}14;color:${B};font-family:${FONTS.MONO};font-size:11px;font-weight:600;display:flex;align-items:center;justify-content:center;flex-shrink:0">${String(i + 1).padStart(2, '0')}</div>
      <div style="flex:1;min-width:0">
        <div style="font-family:${FONTS.SERIF};font-size:14px;font-weight:600;color:${N};letter-spacing:-0.005em;line-height:1.2">${esc(s.title)}</div>
        <div style="font-size:10px;color:#3D5166;line-height:1.5;margin-top:3px">${esc(s.desc)}</div>
      </div>
    </div>`
    )
    .join('');

  return `
<div style="width:595px;height:842px;background:#FAFBFD;position:relative;overflow:hidden;font-family:${FONTS.SANS}">
  ${hdrStr(pageNum, isEs ? 'Siguientes pasos' : 'Next steps', st)}

  <div style="position:absolute;top:60px;left:42px;right:42px;font-family:inherit">
    ${eyebrowStr(isEs ? 'Siguientes pasos' : 'Next steps')}
    ${titleStr(isEs ? 'Listos cuando tú lo estés' : 'Ready when you are', N, 22)}

    <div style="display:grid;grid-template-columns:1.4fr 1fr;gap:24px;margin-top:22px">
      <!-- Steps timeline -->
      <div style="background:#fff;border:1px solid #E6ECF3;border-radius:12px;padding:6px 18px">
        ${stepsHtml}
      </div>

      <!-- Contact card -->
      <div style="background:${N};border-radius:12px;padding:16px 18px;color:#fff;font-family:${FONTS.SANS}">
        <div style="display:flex;align-items:center;gap:8px;margin-bottom:10px">
          <span style="width:5px;height:5px;border-radius:50%;background:${A}"></span>
          <span style="font-family:${FONTS.MONO};font-size:9px;color:rgba(255,255,255,.65);letter-spacing:0.12em;text-transform:uppercase">${isEs ? 'Tu contacto' : 'Your contact'}</span>
        </div>
        <div style="font-family:${FONTS.SERIF};font-size:18px;font-weight:600;letter-spacing:-0.01em;margin-bottom:3px">${esc(contactName)}</div>
        <div style="font-size:9.5px;color:rgba(255,255,255,.65);margin-bottom:14px">${esc(contactRole)}</div>
        <div style="font-family:${FONTS.MONO};font-size:9.5px;color:#fff;letter-spacing:-0.005em;margin-bottom:4px">${esc(contactEmail)}</div>
        ${contactPhone ? `<div style="font-family:${FONTS.MONO};font-size:9.5px;color:rgba(255,255,255,.7);letter-spacing:-0.005em">${esc(contactPhone)}</div>` : ''}
      </div>
    </div>

    <!-- Validity -->
    <div style="display:flex;align-items:center;justify-content:space-between;background:${A}1A;border:1px solid ${A}44;border-radius:10px;padding:11px 16px;margin-top:18px">
      <div style="display:flex;align-items:center;gap:8px">
        <span style="width:7px;height:7px;border-radius:50%;background:${A};box-shadow:0 0 8px ${A}"></span>
        <span style="font-size:10.5px;color:#3D5166">${isEs ? 'Esta propuesta es válida hasta' : 'This proposal is valid until'}</span>
      </div>
      <span style="font-family:${FONTS.MONO};font-size:11px;font-weight:600;color:${N};letter-spacing:-0.005em">${esc(validUntil)}</span>
    </div>

    <!-- CTA -->
    <a href="${ctaHref}" style="display:flex;align-items:center;justify-content:center;gap:10px;background:${B};color:#fff;text-decoration:none;font-family:${FONTS.SANS};font-size:13px;font-weight:600;letter-spacing:-0.005em;padding:14px 22px;border-radius:9999px;margin-top:16px;box-shadow:0 12px 32px ${B}44">
      <span>${isEs ? 'Aceptar propuesta' : 'Accept proposal'}</span>
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
    </a>

    <!-- Signature placeholders -->
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:24px;margin-top:30px">
      ${signatureCell(isEs ? 'Firma del cliente' : 'Client signature', st.clientName || '—')}
      ${signatureCell('CreditCheck', isEs ? 'Equipo comercial' : 'Sales team')}
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
    <div style="font-size:10.5px;color:#3D5166;font-weight:500;margin-top:2px">${esc(name)}</div>
  </div>`;
}

function formatValidity(isEs) {
  const d = new Date();
  d.setDate(d.getDate() + 30);
  return new Intl.DateTimeFormat(isEs ? 'es' : 'en', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(d);
}
