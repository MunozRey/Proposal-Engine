export function LeadsContentTab({ st, dispatch }) {
  const isEs = st.language === 'es';
  const l = st.leads;
  const D = (k, v) => dispatch({ t: 'LEADS_SET', k, v });

  return (
    <div>
      <div className="section-title">
        <span>{isEs ? 'Pag. 2 — Resumen' : 'Pg. 2 — Overview'}</span>
      </div>
      <div className="field">
        <div className="field-label">
          {isEs ? 'Texto general de introduccion' : 'General intro text'}
        </div>
        <textarea
          rows={3}
          value={l.overviewIntro}
          placeholder={
            isEs
              ? 'Descripcion general de la propuesta de leads…'
              : 'General description of the leads proposal…'
          }
          onChange={(e) => D('overviewIntro', e.target.value)}
        />
      </div>

      <div className="section-title">
        <span>{isEs ? 'Textos intro por modelo' : 'Intro texts per model'}</span>
      </div>
      <div className="field">
        <div className="field-label">{isEs ? 'Intro CPL (pag. 3)' : 'CPL intro (pg. 3)'}</div>
        <textarea rows={2} value={l.cplIntro} onChange={(e) => D('cplIntro', e.target.value)} />
      </div>
      <div className="field">
        <div className="field-label">{isEs ? 'Intro CPA (pag. 4)' : 'CPA intro (pg. 4)'}</div>
        <textarea rows={2} value={l.cpaIntro} onChange={(e) => D('cpaIntro', e.target.value)} />
      </div>
      <div className="field">
        <div className="field-label">
          {isEs ? 'Intro hibrido (pag. 5)' : 'Hybrid intro (pg. 5)'}
        </div>
        <textarea
          rows={2}
          value={l.hybridIntro}
          onChange={(e) => D('hybridIntro', e.target.value)}
        />
      </div>
    </div>
  );
}
