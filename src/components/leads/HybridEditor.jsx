import { StringListEditor } from '../shared/StringListEditor.jsx';
import { CalcEditor } from '../shared/CalcEditor.jsx';

export function HybridEditor({ l, LS, LSE, LSA, LSD, t }) {
  return (
    <>
      <div className="leads-subsection-label">{t('leads.hybrid.pricing')}</div>
      <div className="two-col field">
        <div>
          <div className="field-label">{t('leads.hybrid.baseCpl')}</div>
          <input
            type="text"
            value={l.hybridCPLPrice}
            onChange={(e) => LS('hybridCPLPrice', e.target.value)}
          />
        </div>
        <div>
          <div className="field-label">{t('leads.hybrid.cpaBonus')}</div>
          <input
            type="text"
            value={l.hybridCPAFee}
            onChange={(e) => LS('hybridCPAFee', e.target.value)}
          />
        </div>
      </div>
      <div className="field">
        <div className="field-label">{t('leads.hybrid.cpaCommission')}</div>
        <input
          type="text"
          value={l.hybridCPAComm}
          onChange={(e) => LS('hybridCPAComm', e.target.value)}
        />
      </div>

      <div className="leads-subsection-label">{t('leads.hybrid.features')}</div>
      <StringListEditor
        items={l.hybridFeatures}
        onEdit={(i, v) => LSE('hybridFeatures', i, v)}
        onAdd={() => LSA('hybridFeatures')}
        onDel={(i) => LSD('hybridFeatures', i)}
        addLabel={t('shared.addFeatureBtn')}
      />

      <div className="leads-subsection-label" style={{ marginTop: '10px' }}>
        {t('leads.hybrid.calcExample')}
      </div>
      <CalcEditor
        title={l.hybridCalcTitle}
        text={l.hybridCalcText}
        onTitleChange={(v) => LS('hybridCalcTitle', v)}
        onTextChange={(v) => LS('hybridCalcText', v)}
        t={t}
      />

      <div className="leads-subsection-label">{t('leads.hybrid.notes')}</div>
      <StringListEditor
        items={l.hybridNotes}
        onEdit={(i, v) => LSE('hybridNotes', i, v)}
        onAdd={() => LSA('hybridNotes')}
        onDel={(i) => LSD('hybridNotes', i)}
        addLabel={t('shared.addNoteBtn')}
      />
    </>
  );
}
