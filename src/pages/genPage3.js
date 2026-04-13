import { GREY, TC } from '../constants.js';
import { esc } from '../utils/esc.js';
import { hdrStr, bulletItem, ftrStr, getColors } from '../utils/pageHelpers.js';

export function genPage3(st, pageNum = '02') {
  const { N, B } = getColors(st);
  const isEs = st.language === 'es';
  const T = st.typo;
  const CT = 64;

  const plans = st.plans
    .map(
      (pl) => `
    <div style="background:${pl.rec ? N : '#fff'};border-radius:3px;padding:7px 5px;text-align:center;border:${pl.rec ? 'none' : '.5px solid #C8D8E8'}">
      ${pl.rec ? `<div style="background:${B};border-radius:2px;padding:1.5px 0;font-size:${T.micro}px;font-weight:800;color:#fff;margin-bottom:3px">${isEs ? 'RECOMENDADO' : 'RECOMMENDED'}</div>` : ''}
      <div style="font-size:${T.tableBody}px;font-weight:800;color:${pl.rec ? '#90B8FF' : N};margin-bottom:2px">${esc(pl.name)}</div>
      <div style="font-size:${pl.name === 'Custom' ? T.subhead : 13}px;font-weight:800;color:${pl.rec ? B : N};line-height:1">${esc(pl.price)}<span style="font-size:${T.note}px;font-weight:400;color:${pl.rec ? '#9AAABB' : '#718096'}">${esc(pl.per)}</span></div>
      <div style="font-size:11px;font-weight:800;color:${B};margin:3px 0 1px">${esc(pl.verifs)}</div>
      <div style="font-size:${T.micro}px;color:${pl.rec ? '#9AAABB' : '#718096'};margin-bottom:3px">${isEs ? 'verif./mes' : 'verif./month'}</div>
      <div style="height:.5px;background:${pl.rec ? 'rgba(255,255,255,.1)' : '#DDE6EF'};margin-bottom:3px"></div>
      <div style="font-size:${T.micro}px;color:${pl.rec ? '#9AAABB' : '#718096'}">${isEs ? 'coste medio/verif.' : 'avg. cost/verif.'}</div>
      <div style="font-size:${T.body}px;font-weight:800;color:${pl.rec ? '#fff' : TC};margin-bottom:2px">${esc(pl.avg)}</div>
      <div style="font-size:${T.micro}px;color:${pl.rec ? '#9AAABB' : '#718096'}">${isEs ? 'verif. extra' : 'extra verif.'}</div>
      <div style="font-size:${T.tableBody}px;font-weight:800;color:${pl.rec ? '#fff' : TC}">${esc(pl.extra)}</div>
    </div>`
    )
    .join('');

  const feats = [
    (isEs ? 'Pantallas de verificacion con marca de ' : 'Verification screens branded as ') +
      esc(st.clientName || (isEs ? 'cliente' : 'client')),
    isEs ? 'Entorno de produccion y sandbox' : 'Production environment and sandbox',
    isEs
      ? 'API REST documentada y widget de integracion'
      : 'Documented REST API and integration widget',
    isEs ? 'Soporte tecnico durante la integracion' : 'Technical support during integration',
  ];

  return `<div style="width:595px;height:842px;background:${GREY};position:relative;overflow:hidden;font-family:'Segoe UI',system-ui,sans-serif">
  ${hdrStr(pageNum, isEs ? 'Modelos de Precio' : 'Pricing Models', st)}
  <div style="position:absolute;top:${CT}px;left:14px;right:14px;font-family:inherit">
    <div style="font-size:${T.heading}px;font-weight:800;color:${N}">${pageNum}  ${isEs ? 'Modelos de Precio' : 'Pricing Models'}</div>
    <div style="height:1.5px;background:${B};margin:4px 0 8px"></div>
    <div style="background:${N};border-radius:4px;padding:9px 10px;margin-bottom:9px">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:4px">
        <div style="font-size:${T.body}px;font-weight:800;color:#fff">${isEs ? 'Desarrollo e implementacion white-label' : 'White-label development and implementation'}</div>
        <div style="background:${B};border-radius:2px;padding:2px 7px;font-size:${T.tableBody}px;font-weight:800;color:#fff">${esc(st.setupFee)}</div>
      </div>
      <div style="font-size:${T.small}px;color:#9AAABB;margin-bottom:6px">${isEs ? 'Pago unico · Personalizacion completa · Entorno de produccion listo' : 'One-time payment · Full customization · Production environment ready'}</div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:3px 8px">
        ${feats.map((f, i) => bulletItem(f, i % 2 === 1 ? '#90B8FF' : '#fff', st)).join('')}
      </div>
    </div>
    <div style="font-size:${T.subhead}px;font-weight:800;color:${N};margin-bottom:2px">${isEs ? 'Suscripcion SaaS mensual' : 'Monthly SaaS subscription'}</div>
    <div style="font-size:${T.small}px;color:#4A5568;margin-bottom:8px">${isEs ? 'Verificaciones incluidas · Precio fijo por verificacion adicional' : 'Verifications included · Fixed price per additional verification'}</div>
    <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:4px">${plans}</div>
    <div style="font-size:${T.note}px;color:#4A5568;font-style:italic;margin-top:7px;line-height:1.5">${isEs ? 'El plan Growth ofrece el mejor equilibrio coste/volumen para una fase piloto. Custom incluye condiciones negociadas.' : 'The Growth plan offers the best cost/volume balance for a pilot phase. Custom includes negotiated terms.'}</div>
  </div>
  ${ftrStr(st)}</div>`;
}
