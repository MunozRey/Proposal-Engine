export function LeadsContentTab({ st, dispatch }) {
  const isEs = st.language === 'es';
  const l = st.leads;
  const D = (k, v) => dispatch({ t: 'LEADS_SET', k, v });

  return (
    <div>
      <div className="section-title">
        <span>{isEs ? 'Portada' : 'Cover'}</span>
      </div>
      <div className="field">
        <div className="field-label">{isEs ? 'Etiqueta superior' : 'Badge label'}</div>
        <input
          type="text"
          value={st.coverBadge}
          placeholder={isEs ? 'PROPUESTA DE COLABORACION' : 'PARTNERSHIP PROPOSAL'}
          onChange={(e) => dispatch({ t: 'SET', k: 'coverBadge', v: e.target.value })}
        />
      </div>
      <div className="field">
        <div className="field-label">{isEs ? 'Linea 1 (blanco)' : 'Line 1 (white)'}</div>
        <input
          type="text"
          value={st.coverLine1}
          placeholder={isEs ? 'Propuesta para' : 'Proposal for'}
          onChange={(e) => dispatch({ t: 'SET', k: 'coverLine1', v: e.target.value })}
        />
      </div>
      <div className="field">
        <div className="field-label">{isEs ? 'Producto (azul)' : 'Product (blue)'}</div>
        <input
          type="text"
          value={st.productTitle}
          placeholder={isEs ? 'generación de leads verificados' : 'verified lead generation'}
          onChange={(e) => dispatch({ t: 'SET', k: 'productTitle', v: e.target.value })}
        />
      </div>

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
