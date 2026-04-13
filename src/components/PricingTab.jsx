import { NAVY, BLUE } from '../constants.js';

export function PricingTab({ st, dispatch }) {
  return (
    <div>
      <div className="section-title"><span>Setup Fee</span></div>
      <div className="field">
        <div className="field-label">Implementation price</div>
        <input type="text" value={st.setupFee} placeholder="EUR 1.000"
          onChange={e => dispatch({ t: 'SET', k: 'setupFee', v: e.target.value })} />
      </div>
      <div className="section-title"><span>SaaS Plans</span></div>
      {st.plans.map((pl, i) => (
        <div key={i} className={`plan-card${pl.rec ? ' rec' : ''}`}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <div className="plan-name" style={{ color: pl.rec ? BLUE : NAVY }}>{pl.name}</div>
            <label style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '10px', color: '#7A8FA0', cursor: 'pointer' }}>
              <input type="checkbox" checked={pl.rec}
                onChange={e => dispatch({ t: 'PLAN', i, f: 'rec', v: e.target.checked })} /> Recommended
            </label>
          </div>
          <div className="two-col">
            <div><div className="field-label">Price</div>
              <input type="text" value={pl.price} onChange={e => dispatch({ t: 'PLAN', i, f: 'price', v: e.target.value })} /></div>
            <div><div className="field-label">Verifications</div>
              <input type="text" value={pl.verifs} onChange={e => dispatch({ t: 'PLAN', i, f: 'verifs', v: e.target.value })} /></div>
            <div><div className="field-label">Avg. cost</div>
              <input type="text" value={pl.avg} onChange={e => dispatch({ t: 'PLAN', i, f: 'avg', v: e.target.value })} /></div>
            <div><div className="field-label">Extra verif.</div>
              <input type="text" value={pl.extra} onChange={e => dispatch({ t: 'PLAN', i, f: 'extra', v: e.target.value })} /></div>
          </div>
        </div>
      ))}
    </div>
  );
}
