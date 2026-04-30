import { StringListEditor } from '../shared/StringListEditor.jsx';
import { CalcEditor } from '../shared/CalcEditor.jsx';

export function CPAEditor({ l, LS, LAE, LAA, LAD, LSE, LSA, LSD, t }) {
  return (
    <>
      <div className="leads-subsection-label">{t('leads.cpa.tiers')}</div>
      {l.cpaTramos.map((row, i) => (
        <div key={i} className="leads-row-card">
          <button className="btn-remove" onClick={() => LAD('cpaTramos', i)}>
            ✕
          </button>
          <div className="two-col">
            <div>
              <div className="field-label">{t('leads.cpa.amount')}</div>
              <input
                type="text"
                value={row.importe}
                onChange={(e) => LAE('cpaTramos', i, 'importe', e.target.value)}
              />
            </div>
            <div>
              <div className="field-label">{t('leads.cpa.fixedFee')}</div>
              <input
                type="text"
                value={row.fee}
                onChange={(e) => LAE('cpaTramos', i, 'fee', e.target.value)}
              />
            </div>
          </div>
        </div>
      ))}
      <button
        className="btn-add"
        onClick={() => LAA('cpaTramos', { importe: t('leads.cpa.newTier'), fee: '€0' })}
      >
        {t('leads.cpa.addTier')}
      </button>

      <div className="leads-subsection-label" style={{ marginTop: '10px' }}>
        {t('leads.cpa.commission')}
      </div>
      <div className="two-col field">
        <div>
          <div className="field-label">{t('leads.cpa.percentage')}</div>
          <input
            type="text"
            value={l.cpaCommission}
            onChange={(e) => LS('cpaCommission', e.target.value)}
          />
        </div>
        <div>
          <div className="field-label">{t('leads.cpa.calcBase')}</div>
          <input
            type="text"
            value={l.cpaCommissionBase}
            onChange={(e) => LS('cpaCommissionBase', e.target.value)}
          />
        </div>
      </div>

      <div className="leads-subsection-label">{t('leads.cpa.features')}</div>
      <StringListEditor
        items={l.cpaFeatures}
        onEdit={(i, v) => LSE('cpaFeatures', i, v)}
        onAdd={() => LSA('cpaFeatures')}
        onDel={(i) => LSD('cpaFeatures', i)}
        addLabel={t('shared.addFeatureBtn')}
      />

      <div className="leads-subsection-label" style={{ marginTop: '10px' }}>
        {t('leads.cpa.calcExample')}
      </div>
      <CalcEditor
        title={l.cpaCalcTitle}
        text={l.cpaCalcText}
        onTitleChange={(v) => LS('cpaCalcTitle', v)}
        onTextChange={(v) => LS('cpaCalcText', v)}
        t={t}
      />

      <div className="leads-subsection-label">{t('leads.cpa.notes')}</div>
      <StringListEditor
        items={l.cpaNotes}
        onEdit={(i, v) => LSE('cpaNotes', i, v)}
        onAdd={() => LSA('cpaNotes')}
        onDel={(i) => LSD('cpaNotes', i)}
        addLabel={t('shared.addNoteBtn')}
      />
    </>
  );
}
