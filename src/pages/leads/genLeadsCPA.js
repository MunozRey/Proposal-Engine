import { GREY, TC } from '../../constants.js';
import { esc } from '../../utils/esc.js';
import { hdrStr, ftrStr, tableStr, calcBoxStr, featureBoxStr, notesStr, getColors } from '../../utils/pageHelpers.js';

export function genLeadsCPA(st, pageNum = '03') {
  const { N, B } = getColors(st);
  const T = st.typo;
  const l = st.leads;
  const CT = 64;

  const intro = l.cpaIntro || 'No cost until loan formalization. Fixed tiered fee by amount plus commission on the approved amount.';

  const table = tableStr(
    [{ label: 'Loan amount', width: '40%' }, { label: 'Fixed fee', align: 'center', width: '20%' }, { label: '+ Commission', align: 'center' }],
    l.cpaTramos.map(row => [
      { html: `<span style="font-size:${T.tableBody}px;color:${TC};font-weight:500">${esc(row.importe)}</span>` },
      { html: `<span style="background:${N};color:#fff;border-radius:3px;padding:2px 7px;font-size:${T.tableBody}px;font-weight:800">${esc(row.fee)}</span>`, style: `text-align:center` },
      { html: `<span style="font-size:${T.small}px;color:#718096">+ ${esc(l.cpaCommission || '1.5%')} on ${esc(l.cpaCommissionBase || 'amount')}</span>`, style: `text-align:center` },
    ]),
    st
  );

  return `<div style="width:595px;height:842px;background:${GREY};position:relative;overflow:hidden;font-family:'Segoe UI',system-ui,sans-serif">
  ${hdrStr(pageNum, 'CPA Model', st)}
  <div style="position:absolute;top:${CT}px;left:14px;right:14px;font-family:inherit">
    <div style="font-size:${T.heading}px;font-weight:800;color:${N}">${pageNum}  CPA Model — Cost per Acquisition</div>
    <div style="height:1.5px;background:${B};margin:4px 0 7px"></div>
    <div style="font-size:${T.body}px;color:${TC};line-height:1.6;margin-bottom:9px">${esc(intro)}</div>

    <div style="font-size:${T.subhead}px;font-weight:800;color:${N};margin-bottom:5px">Fee per formalized amount tier</div>
    <div style="margin-bottom:9px">${table}</div>

    <div style="background:${B};border-radius:4px;padding:6px 10px;margin-bottom:9px;display:flex;align-items:center;gap:8px">
      <div style="font-size:${T.body}px;font-weight:700;color:#fff">Additional commission:</div>
      <div style="font-size:${T.subhead}px;font-weight:800;color:#fff">${esc(l.cpaCommission || '1.5%')}</div>
      <div style="font-size:${T.small}px;color:rgba(255,255,255,.7)">on the ${esc(l.cpaCommissionBase || 'approved amount')}</div>
    </div>

    <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:9px">
      ${calcBoxStr(l.cpaCalcTitle || 'Calculation example', l.cpaCalcText, st)}
      ${featureBoxStr('CPA model advantages', l.cpaFeatures, st)}
    </div>

    ${notesStr(l.cpaNotes, st)}
  </div>
  ${ftrStr(st)}</div>`;
}
