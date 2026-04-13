import { StringListEditor } from '../shared/StringListEditor.jsx';
import { CalcEditor } from '../shared/CalcEditor.jsx';

export function CPLEditor({ l, LS, LAE, LAA, LAD, LSE, LSA, LSD }) {
  return (
    <>
      <div className="leads-subsection-label">Lead types</div>
      {l.cplLeads.map((row, i) => (
        <div key={i} className="leads-row-card">
          <button className="btn-remove" onClick={() => LAD('cplLeads', i)}>✕</button>
          <div className="two-col" style={{ marginBottom: '4px' }}>
            <div>
              <div className="field-label">Type</div>
              <input type="text" value={row.type} onChange={e => LAE('cplLeads', i, 'type', e.target.value)} />
            </div>
            <div>
              <div className="field-label">Price</div>
              <input type="text" value={row.price} onChange={e => LAE('cplLeads', i, 'price', e.target.value)} />
            </div>
          </div>
          <div className="field-label">Description</div>
          <textarea rows={2} value={row.desc} onChange={e => LAE('cplLeads', i, 'desc', e.target.value)} />
        </div>
      ))}
      <button className="btn-add" onClick={() => LAA('cplLeads', { type: 'New type', price: '€0', desc: '' })}>
        + Add lead type
      </button>

      <div className="leads-subsection-label" style={{ marginTop: '10px' }}>Features (CPL pg.)</div>
      <StringListEditor items={l.cplFeatures}
        onEdit={(i, v) => LSE('cplFeatures', i, v)}
        onAdd={() => LSA('cplFeatures')}
        onDel={i => LSD('cplFeatures', i)}
        addLabel="+ Add feature" />

      <div className="leads-subsection-label" style={{ marginTop: '10px' }}>Calculation example</div>
      <CalcEditor title={l.cplCalcTitle} text={l.cplCalcText}
        onTitleChange={v => LS('cplCalcTitle', v)} onTextChange={v => LS('cplCalcText', v)} />

      <div className="leads-subsection-label">Footnotes (◆)</div>
      <StringListEditor items={l.cplNotes}
        onEdit={(i, v) => LSE('cplNotes', i, v)}
        onAdd={() => LSA('cplNotes')}
        onDel={i => LSD('cplNotes', i)}
        addLabel="+ Add note" />
    </>
  );
}
