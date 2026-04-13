import { StringListEditor } from '../shared/StringListEditor.jsx';
import { CalcEditor } from '../shared/CalcEditor.jsx';

export function CPLEditor({ l, LS, LAE, LAA, LAD, LSE, LSA, LSD, isEs }) {
  return (
    <>
      <div className="leads-subsection-label">{isEs ? 'Tipos de lead' : 'Lead types'}</div>
      {l.cplLeads.map((row, i) => (
        <div key={i} className="leads-row-card">
          <button className="btn-remove" onClick={() => LAD('cplLeads', i)}>
            ✕
          </button>
          <div className="two-col" style={{ marginBottom: '4px' }}>
            <div>
              <div className="field-label">{isEs ? 'Tipo' : 'Type'}</div>
              <input
                type="text"
                value={row.type}
                onChange={(e) => LAE('cplLeads', i, 'type', e.target.value)}
              />
            </div>
            <div>
              <div className="field-label">{isEs ? 'Precio' : 'Price'}</div>
              <input
                type="text"
                value={row.price}
                onChange={(e) => LAE('cplLeads', i, 'price', e.target.value)}
              />
            </div>
          </div>
          <div className="field-label">{isEs ? 'Descripcion' : 'Description'}</div>
          <textarea
            rows={2}
            value={row.desc}
            onChange={(e) => LAE('cplLeads', i, 'desc', e.target.value)}
          />
        </div>
      ))}
      <button
        className="btn-add"
        onClick={() =>
          LAA('cplLeads', { type: isEs ? 'Nuevo tipo' : 'New type', price: '€0', desc: '' })
        }
      >
        {isEs ? '+ Anadir tipo de lead' : '+ Add lead type'}
      </button>

      <div className="leads-subsection-label" style={{ marginTop: '10px' }}>
        {isEs ? 'Funcionalidades (pag. CPL)' : 'Features (CPL pg.)'}
      </div>
      <StringListEditor
        items={l.cplFeatures}
        onEdit={(i, v) => LSE('cplFeatures', i, v)}
        onAdd={() => LSA('cplFeatures')}
        onDel={(i) => LSD('cplFeatures', i)}
        addLabel={isEs ? '+ Anadir funcionalidad' : '+ Add feature'}
      />

      <div className="leads-subsection-label" style={{ marginTop: '10px' }}>
        {isEs ? 'Ejemplo de calculo' : 'Calculation example'}
      </div>
      <CalcEditor
        title={l.cplCalcTitle}
        text={l.cplCalcText}
        onTitleChange={(v) => LS('cplCalcTitle', v)}
        onTextChange={(v) => LS('cplCalcText', v)}
        isEs={isEs}
      />

      <div className="leads-subsection-label">{isEs ? 'Notas (◆)' : 'Footnotes (◆)'}</div>
      <StringListEditor
        items={l.cplNotes}
        onEdit={(i, v) => LSE('cplNotes', i, v)}
        onAdd={() => LSA('cplNotes')}
        onDel={(i) => LSD('cplNotes', i)}
        addLabel={isEs ? '+ Anadir nota' : '+ Add note'}
      />
    </>
  );
}
