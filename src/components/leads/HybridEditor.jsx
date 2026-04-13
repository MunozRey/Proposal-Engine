import { StringListEditor } from '../shared/StringListEditor.jsx';
import { CalcEditor } from '../shared/CalcEditor.jsx';

export function HybridEditor({ l, LS, LSE, LSA, LSD, isEs }) {
  return (
    <>
      <div className="leads-subsection-label">
        {isEs ? 'Precio del modelo hibrido' : 'Hybrid model pricing'}
      </div>
      <div className="two-col field">
        <div>
          <div className="field-label">{isEs ? 'CPL base' : 'Base CPL'}</div>
          <input
            type="text"
            value={l.hybridCPLPrice}
            onChange={(e) => LS('hybridCPLPrice', e.target.value)}
          />
        </div>
        <div>
          <div className="field-label">{isEs ? 'Bonus CPA fijo' : 'Fixed CPA bonus'}</div>
          <input
            type="text"
            value={l.hybridCPAFee}
            onChange={(e) => LS('hybridCPAFee', e.target.value)}
          />
        </div>
      </div>
      <div className="field">
        <div className="field-label">{isEs ? 'Comision CPA (%)' : 'CPA commission (%)'}</div>
        <input
          type="text"
          value={l.hybridCPAComm}
          onChange={(e) => LS('hybridCPAComm', e.target.value)}
        />
      </div>

      <div className="leads-subsection-label">
        {isEs ? 'Funcionalidades (pag. hibrido)' : 'Features (Hybrid pg.)'}
      </div>
      <StringListEditor
        items={l.hybridFeatures}
        onEdit={(i, v) => LSE('hybridFeatures', i, v)}
        onAdd={() => LSA('hybridFeatures')}
        onDel={(i) => LSD('hybridFeatures', i)}
        addLabel={isEs ? '+ Anadir funcionalidad' : '+ Add feature'}
      />

      <div className="leads-subsection-label" style={{ marginTop: '10px' }}>
        {isEs ? 'Ejemplo de calculo' : 'Calculation example'}
      </div>
      <CalcEditor
        title={l.hybridCalcTitle}
        text={l.hybridCalcText}
        onTitleChange={(v) => LS('hybridCalcTitle', v)}
        onTextChange={(v) => LS('hybridCalcText', v)}
        isEs={isEs}
      />

      <div className="leads-subsection-label">{isEs ? 'Notas (◆)' : 'Footnotes (◆)'}</div>
      <StringListEditor
        items={l.hybridNotes}
        onEdit={(i, v) => LSE('hybridNotes', i, v)}
        onAdd={() => LSA('hybridNotes')}
        onDel={(i) => LSD('hybridNotes', i)}
        addLabel={isEs ? '+ Anadir nota' : '+ Add note'}
      />
    </>
  );
}
