import { NAVY, BLUE } from '../constants.js';

export function PricingTab({ st, dispatch, t }) {
  return (
    <div>
      <div className="section-title">
        <span>{t('pricingTab.setupCost')}</span>
      </div>
      <div className="field">
        <div className="field-label">{t('pricingTab.implementationPrice')}</div>
        <input
          type="text"
          value={st.setupFee}
          placeholder="EUR 1.000"
          onChange={(e) => dispatch({ t: 'SET', k: 'setupFee', v: e.target.value })}
        />
      </div>
      <div className="section-title">
        <span>{t('pricingTab.saasPlans')}</span>
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
              {t('pricingTab.recommended')}
            </label>
          </div>
          <div className="two-col">
            <div>
              <div className="field-label">{t('pricingTab.price')}</div>
              <input
                type="text"
                value={pl.price}
                onChange={(e) => dispatch({ t: 'PLAN', i, f: 'price', v: e.target.value })}
              />
            </div>
            <div>
              <div className="field-label">{t('pricingTab.verifications')}</div>
              <input
                type="text"
                value={pl.verifs}
                onChange={(e) => dispatch({ t: 'PLAN', i, f: 'verifs', v: e.target.value })}
              />
            </div>
            <div>
              <div className="field-label">{t('pricingTab.avgCost')}</div>
              <input
                type="text"
                value={pl.avg}
                onChange={(e) => dispatch({ t: 'PLAN', i, f: 'avg', v: e.target.value })}
              />
            </div>
            <div>
              <div className="field-label">{t('pricingTab.extraVerif')}</div>
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
