import { NAVY, BLUE } from '../constants.js';

export function PricingTab({ st, dispatch }) {
  const isEs = st.language === 'es';
  return (
    <div>
      <div className="section-title">
        <span>{isEs ? 'Coste de setup' : 'Setup Fee'}</span>
      </div>
      <div className="field">
        <div className="field-label">
          {isEs ? 'Precio de implementacion' : 'Implementation price'}
        </div>
        <input
          type="text"
          value={st.setupFee}
          placeholder="EUR 1.000"
          onChange={(e) => dispatch({ t: 'SET', k: 'setupFee', v: e.target.value })}
        />
      </div>
      <div className="section-title">
        <span>{isEs ? 'Planes SaaS' : 'SaaS Plans'}</span>
      </div>
      {st.plans.map((pl, i) => (
        <div key={i} className={`plan-card${pl.rec ? ' rec' : ''}`}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '8px',
            }}
          >
            <div className="plan-name" style={{ color: pl.rec ? BLUE : NAVY }}>
              {pl.name}
            </div>
            <label
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                fontSize: '10px',
                color: '#7A8FA0',
                cursor: 'pointer',
              }}
            >
              <input
                type="radio"
                name="recommended-plan"
                checked={pl.rec}
                onChange={() => dispatch({ t: 'PLAN', i, f: 'rec', v: true })}
              />{' '}
              {isEs ? 'Recomendado' : 'Recommended'}
            </label>
          </div>
          <div className="two-col">
            <div>
              <div className="field-label">{isEs ? 'Precio' : 'Price'}</div>
              <input
                type="text"
                value={pl.price}
                onChange={(e) => dispatch({ t: 'PLAN', i, f: 'price', v: e.target.value })}
              />
            </div>
            <div>
              <div className="field-label">{isEs ? 'Verificaciones' : 'Verifications'}</div>
              <input
                type="text"
                value={pl.verifs}
                onChange={(e) => dispatch({ t: 'PLAN', i, f: 'verifs', v: e.target.value })}
              />
            </div>
            <div>
              <div className="field-label">{isEs ? 'Coste medio' : 'Avg. cost'}</div>
              <input
                type="text"
                value={pl.avg}
                onChange={(e) => dispatch({ t: 'PLAN', i, f: 'avg', v: e.target.value })}
              />
            </div>
            <div>
              <div className="field-label">{isEs ? 'Verif. extra' : 'Extra verif.'}</div>
              <input
                type="text"
                value={pl.extra}
                onChange={(e) => dispatch({ t: 'PLAN', i, f: 'extra', v: e.target.value })}
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
