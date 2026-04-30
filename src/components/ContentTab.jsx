export function ContentTab({ st, dispatch, t }) {
  return (
    <div>
      <div className="field">
        <div className="field-label">{t('contentTab.introText')}</div>
        <textarea
          rows={3}
          value={st.introText}
          placeholder={t('contentTab.introPh')}
          onChange={(e) => dispatch({ t: 'SET', k: 'introText', v: e.target.value })}
        />
      </div>

      <div className="section-title">
        <span>{t('contentTab.processSteps')}</span>
      </div>
      {st.steps.map((s, i) => (
        <div key={i} className="step-card">
          <button
            className="btn-remove"
            title={t('contentTab.removeStep')}
            onClick={() => dispatch({ t: 'STEP_DEL', i })}
          >
            ✕
          </button>
          <div className="step-head">
            <div className="step-num">{s.num}</div>
            <input
              type="text"
              value={s.title}
              style={{ fontSize: '11px' }}
              onChange={(e) => dispatch({ t: 'STEP', i, f: 'title', v: e.target.value })}
            />
          </div>
          <textarea
            rows={2}
            value={s.desc}
            onChange={(e) => dispatch({ t: 'STEP', i, f: 'desc', v: e.target.value })}
          />
        </div>
      ))}
      <button className="btn-add" onClick={() => dispatch({ t: 'STEP_ADD' })}>
        {t('contentTab.addStep')}
      </button>

      <div className="section-title" style={{ marginTop: '16px' }}>
        <span>{t('contentTab.featuresIncluded')}</span>
      </div>
      <div className="field-hint" style={{ marginBottom: '8px' }}>
        {t('contentTab.featuresHint')}
      </div>

      <div className="feat-subhead">
        <span>{t('contentTab.leftCol')}</span>
        <span className="feat-count">{st.featuresL.length}</span>
      </div>
      {st.featuresL.map((f, i) => (
        <div key={`L-${i}`} className="feat-item">
          <textarea
            rows={2}
            value={f}
            onChange={(e) => dispatch({ t: 'FEAT', side: 'featuresL', i, v: e.target.value })}
          />
          <button
            className="btn-remove"
            title={t('contentTab.removeFeature')}
            onClick={() => dispatch({ t: 'FEAT_DEL', side: 'featuresL', i })}
          >
            ✕
          </button>
        </div>
      ))}
      <button className="btn-add" onClick={() => dispatch({ t: 'FEAT_ADD', side: 'featuresL' })}>
        {t('contentTab.addLeft')}
      </button>

      <div className="feat-subhead" style={{ marginTop: '12px' }}>
        <span>{t('contentTab.rightCol')}</span>
        <span className="feat-count">{st.featuresR.length}</span>
      </div>
      {st.featuresR.map((f, i) => (
        <div key={`R-${i}`} className="feat-item">
          <textarea
            rows={2}
            value={f}
            onChange={(e) => dispatch({ t: 'FEAT', side: 'featuresR', i, v: e.target.value })}
          />
          <button
            className="btn-remove"
            title={t('contentTab.removeFeature')}
            onClick={() => dispatch({ t: 'FEAT_DEL', side: 'featuresR', i })}
          >
            ✕
          </button>
        </div>
      ))}
      <button className="btn-add" onClick={() => dispatch({ t: 'FEAT_ADD', side: 'featuresR' })}>
        {t('contentTab.addRight')}
      </button>
    </div>
  );
}
