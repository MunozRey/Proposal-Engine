export function ContentTab({ st, dispatch }) {
  const isEs = st.language === 'es';
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
          placeholder="PARTNERSHIP PROPOSAL"
          onChange={(e) => dispatch({ t: 'SET', k: 'coverBadge', v: e.target.value })}
        />
      </div>
      <div className="field">
        <div className="field-label">{isEs ? 'Linea 1 (blanco)' : 'Line 1 (white)'}</div>
        <input
          type="text"
          value={st.coverLine1}
          placeholder={isEs ? 'Plataforma para' : 'Platform for'}
          onChange={(e) => dispatch({ t: 'SET', k: 'coverLine1', v: e.target.value })}
        />
      </div>
      <div className="field">
        <div className="field-label">{isEs ? 'Linea 2 — azul' : 'Line 2 — blue'}</div>
        <input
          type="text"
          value={st.productTitle}
          onChange={(e) => dispatch({ t: 'SET', k: 'productTitle', v: e.target.value })}
        />
      </div>
      <div className="field">
        <div className="field-label">{isEs ? 'Linea 3 (blanco)' : 'Line 3 (white)'}</div>
        <input
          type="text"
          value={st.coverLine3}
          placeholder={isEs ? 'white-label para' : 'white-label for'}
          onChange={(e) => dispatch({ t: 'SET', k: 'coverLine3', v: e.target.value })}
        />
      </div>
      <div className="field">
        <div className="field-label">{isEs ? 'Texto intro (pag. 2)' : 'Intro text (pg. 2)'}</div>
        <textarea
          rows={3}
          value={st.introText}
          placeholder={isEs ? 'Dejar vacio para texto por defecto' : 'Leave empty for default text'}
          onChange={(e) => dispatch({ t: 'SET', k: 'introText', v: e.target.value })}
        />
      </div>

      <div className="section-title">
        <span>{isEs ? 'Pasos del proceso' : 'Process steps'}</span>
      </div>
      {st.steps.map((s, i) => (
        <div key={i} className="step-card">
          <button
            className="btn-remove"
            title={isEs ? 'Eliminar paso' : 'Remove step'}
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
        {isEs ? '+ Anadir paso' : '+ Add step'}
      </button>

      <div className="section-title" style={{ marginTop: '16px' }}>
        <span>{isEs ? 'Funcionalidades incluidas' : 'Features received'}</span>
      </div>
      <div className="feat-grid">
        <div>
          <div className="field-label">{isEs ? 'Columna izquierda' : 'Left column'}</div>
          {st.featuresL.map((f, i) => (
            <div key={i} className="feat-item">
              <textarea
                rows={2}
                value={f}
                onChange={(e) => dispatch({ t: 'FEAT', side: 'featuresL', i, v: e.target.value })}
              />
              <button
                className="btn-remove"
                title={isEs ? 'Eliminar' : 'Remove'}
                onClick={() => dispatch({ t: 'FEAT_DEL', side: 'featuresL', i })}
              >
                ✕
              </button>
            </div>
          ))}
          <button
            className="btn-add"
            onClick={() => dispatch({ t: 'FEAT_ADD', side: 'featuresL' })}
          >
            {isEs ? '+ Anadir' : '+ Add'}
          </button>
        </div>
        <div>
          <div className="field-label">{isEs ? 'Columna derecha' : 'Right column'}</div>
          {st.featuresR.map((f, i) => (
            <div key={i} className="feat-item">
              <textarea
                rows={2}
                value={f}
                onChange={(e) => dispatch({ t: 'FEAT', side: 'featuresR', i, v: e.target.value })}
              />
              <button
                className="btn-remove"
                title={isEs ? 'Eliminar' : 'Remove'}
                onClick={() => dispatch({ t: 'FEAT_DEL', side: 'featuresR', i })}
              >
                ✕
              </button>
            </div>
          ))}
          <button
            className="btn-add"
            onClick={() => dispatch({ t: 'FEAT_ADD', side: 'featuresR' })}
          >
            {isEs ? '+ Anadir' : '+ Add'}
          </button>
        </div>
      </div>
    </div>
  );
}
