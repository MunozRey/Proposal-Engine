import { StringListEditor } from '../shared/StringListEditor.jsx';
import { CalcEditor } from '../shared/CalcEditor.jsx';

export function CPAEditor({ l, LS, LAE, LAA, LAD, LSE, LSA, LSD }) {
  return (
    <>
      <div className="leads-subsection-label">Amount tiers</div>
      {l.cpaTramos.map((row, i) => (
        <div key={i} className="leads-row-card">
          <button className="btn-remove" onClick={() => LAD('cpaTramos', i)}>✕</button>
          <div className="two-col">
            <div>
              <div className="field-label">Amount</div>
              <input type="text" value={row.importe} onChange={e => LAE('cpaTramos', i, 'importe', e.target.value)} />
            </div>
            <div>
              <div className="field-label">Fixed fee</div>
              <input type="text" value={row.fee} onChange={e => LAE('cpaTramos', i, 'fee', e.target.value)} />
            </div>
          </div>
        </div>
      ))}
      <button className="btn-add" onClick={() => LAA('cpaTramos', { importe: 'New tier', fee: '€0' })}>
        + Add tier
      </button>

      <div className="leads-subsection-label" style={{ marginTop: '10px' }}>Additional commission</div>
      <div className="two-col field">
        <div>
          <div className="field-label">Percentage</div>
          <input type="text" value={l.cpaCommission} onChange={e => LS('cpaCommission', e.target.value)} />
        </div>
        <div>
          <div className="field-label">Calculation base</div>
          <input type="text" value={l.cpaCommissionBase} onChange={e => LS('cpaCommissionBase', e.target.value)} />
        </div>
      </div>

      <div className="leads-subsection-label">Features (CPA pg.)</div>
      <StringListEditor items={l.cpaFeatures}
        onEdit={(i, v) => LSE('cpaFeatures', i, v)}
        onAdd={() => LSA('cpaFeatures')}
        onDel={i => LSD('cpaFeatures', i)}
        addLabel="+ Add feature" />

      <div className="leads-subsection-label" style={{ marginTop: '10px' }}>Calculation example</div>
      <CalcEditor title={l.cpaCalcTitle} text={l.cpaCalcText}
        onTitleChange={v => LS('cpaCalcTitle', v)} onTextChange={v => LS('cpaCalcText', v)} />

      <div className="leads-subsection-label">Footnotes (◆)</div>
      <StringListEditor items={l.cpaNotes}
        onEdit={(i, v) => LSE('cpaNotes', i, v)}
        onAdd={() => LSA('cpaNotes')}
        onDel={i => LSD('cpaNotes', i)}
        addLabel="+ Add note" />
    </>
  );
}
