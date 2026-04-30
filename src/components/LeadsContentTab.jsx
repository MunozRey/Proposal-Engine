export function LeadsContentTab({ st, dispatch, t }) {
  const l = st.leads;
  const D = (k, v) => dispatch({ t: 'LEADS_SET', k, v });

  return (
    <div>
      <div className="section-title">
        <span>{t('leads.contentTab.overview')}</span>
      </div>
      <div className="field">
        <div className="field-label">{t('leads.contentTab.generalIntro')}</div>
        <textarea
          rows={3}
          value={l.overviewIntro}
          placeholder={t('leads.contentTab.generalIntroPh')}
          onChange={(e) => D('overviewIntro', e.target.value)}
        />
      </div>

      <div className="section-title">
        <span>{t('leads.contentTab.modelIntros')}</span>
      </div>
      <div className="field">
        <div className="field-label">{t('leads.contentTab.cplIntro')}</div>
        <textarea rows={2} value={l.cplIntro} onChange={(e) => D('cplIntro', e.target.value)} />
      </div>
      <div className="field">
        <div className="field-label">{t('leads.contentTab.cpaIntro')}</div>
        <textarea rows={2} value={l.cpaIntro} onChange={(e) => D('cpaIntro', e.target.value)} />
      </div>
      <div className="field">
        <div className="field-label">{t('leads.contentTab.hybridIntro')}</div>
        <textarea
          rows={2}
          value={l.hybridIntro}
          onChange={(e) => D('hybridIntro', e.target.value)}
        />
      </div>
    </div>
  );
}
