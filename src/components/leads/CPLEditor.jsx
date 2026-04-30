import { StringListEditor } from '../shared/StringListEditor.jsx';
import { CalcEditor } from '../shared/CalcEditor.jsx';

export function CPLEditor({ l, LS, LAE, LAA, LAD, LSE, LSA, LSD, t }) {
  return (
    <>
      <div className="leads-subsection-label">{t('leads.cpl.leadTypes')}</div>
      {l.cplLeads.map((row, i) => (
        <div key={i} className="leads-row-card">
          <button className="btn-remove" onClick={() => LAD('cplLeads', i)}>
            ✕
          </button>
          <div className="two-col" style={{ marginBottom: '4px' }}>
            <div>
              <div className="field-label">{t('leads.cpl.type')}</div>
              <input
                type="text"
                value={row.type}
                onChange={(e) => LAE('cplLeads', i, 'type', e.target.value)}
              />
            </div>
            <div>
              <div className="field-label">{t('leads.cpl.price')}</div>
              <input
                type="text"
                value={row.price}
                onChange={(e) => LAE('cplLeads', i, 'price', e.target.value)}
              />
            </div>
          </div>
          <div className="field-label">{t('leads.cpl.description')}</div>
          <textarea
            rows={2}
            value={row.desc}
            onChange={(e) => LAE('cplLeads', i, 'desc', e.target.value)}
          />
        </div>
      ))}
      <button
        className="btn-add"
        onClick={() => LAA('cplLeads', { type: t('leads.cpl.newType'), price: '€0', desc: '' })}
      >
        {t('leads.cpl.addType')}
      </button>

      <div className="leads-subsection-label" style={{ marginTop: '10px' }}>
        {t('leads.cpl.features')}
      </div>
      <StringListEditor
        items={l.cplFeatures}
        onEdit={(i, v) => LSE('cplFeatures', i, v)}
        onAdd={() => LSA('cplFeatures')}
        onDel={(i) => LSD('cplFeatures', i)}
        addLabel={t('shared.addFeatureBtn')}
      />

      <div className="leads-subsection-label" style={{ marginTop: '10px' }}>
        {t('leads.cpl.calcExample')}
      </div>
      <CalcEditor
        title={l.cplCalcTitle}
        text={l.cplCalcText}
        onTitleChange={(v) => LS('cplCalcTitle', v)}
        onTextChange={(v) => LS('cplCalcText', v)}
        t={t}
      />

      <div className="leads-subsection-label">{t('leads.cpl.notes')}</div>
      <StringListEditor
        items={l.cplNotes}
        onEdit={(i, v) => LSE('cplNotes', i, v)}
        onAdd={() => LSA('cplNotes')}
        onDel={(i) => LSD('cplNotes', i)}
        addLabel={t('shared.addNoteBtn')}
      />
    </>
  );
}
