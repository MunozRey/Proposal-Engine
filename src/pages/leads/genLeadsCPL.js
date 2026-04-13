import { GREY, TC } from '../../constants.js';
import { esc } from '../../utils/esc.js';
import { hdrStr, ftrStr, tableStr, calcBoxStr, featureBoxStr, notesStr, getColors } from '../../utils/pageHelpers.js';

export function genLeadsCPL(st, pageNum = '02') {
  const { N, B } = getColors(st);
  const T = st.typo;
  const l = st.leads;
  const CT = 64;

  const intro = l.cplIntro || 'Fixed fee per lead delivered with completed Open Banking. Predictable pricing with no conversion risk.';

  const table = tableStr(
    [{ label: 'Lead type', width: '30%' }, { label: 'Price', align: 'center', width: '15%' }, { label: 'Includes' }],
    l.cplLeads.map(row => [
      { html: `<span style="font-size:${T.tableBody}px;font-weight:700;color:${N}">${esc(row.type)}</span>` },
      { html: `<span style="background:${B};color:#fff;border-radius:3px;padding:2px 7px;font-size:${T.subhead}px;font-weight:800">${esc(row.price)}</span>`, style: `text-align:center` },
      { html: `<span style="font-size:${T.small}px;color:${TC};line-height:1.4">${esc(row.desc)}</span>` },
    ]),
    st
  );

  return `<div style="width:595px;height:842px;background:${GREY};position:relative;overflow:hidden;font-family:'Segoe UI',system-ui,sans-serif">
  ${hdrStr(pageNum, 'CPL Model', st)}
  <div style="position:absolute;top:${CT}px;left:14px;right:14px;font-family:inherit">
    <div style="font-size:${T.heading}px;font-weight:800;color:${N}">${pageNum}  CPL Model — Cost per Lead</div>
    <div style="height:1.5px;background:${B};margin:4px 0 7px"></div>
    <div style="font-size:${T.body}px;color:${TC};line-height:1.6;margin-bottom:9px">${esc(intro)}</div>

    <div style="font-size:${T.subhead}px;font-weight:800;color:${N};margin-bottom:5px">Lead types and pricing</div>
    <div style="margin-bottom:9px">${table}</div>

    <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:9px">
      ${calcBoxStr(l.cplCalcTitle || 'Calculation example', l.cplCalcText, st)}
      ${featureBoxStr('What each lead includes', l.cplFeatures, st)}
    </div>

    ${notesStr(l.cplNotes, st)}
  </div>
  ${ftrStr(st)}</div>`;
}
