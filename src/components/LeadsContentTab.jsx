export function LeadsContentTab({ st, dispatch }) {
  const l = st.leads;
  const D = (k, v) => dispatch({ t: 'LEADS_SET', k, v });

  return (
    <div>
      <div className="section-title"><span>Cover</span></div>
      <div className="field">
        <div className="field-label">Badge label</div>
        <input type="text" value={st.coverBadge} placeholder="PARTNERSHIP PROPOSAL"
          onChange={e => dispatch({ t: 'SET', k: 'coverBadge', v: e.target.value })} />
      </div>
      <div className="field">
        <div className="field-label">Line 1 (white)</div>
        <input type="text" value={st.coverLine1} placeholder="Proposal for"
          onChange={e => dispatch({ t: 'SET', k: 'coverLine1', v: e.target.value })} />
      </div>
      <div className="field">
        <div className="field-label">Line 2 — blue</div>
        <input type="text" value={st.productTitle} placeholder="verified lead generation"
          onChange={e => dispatch({ t: 'SET', k: 'productTitle', v: e.target.value })} />
      </div>
      <div className="field">
        <div className="field-label">Line 3 (white)</div>
        <input type="text" value={st.coverLine3} placeholder="for"
          onChange={e => dispatch({ t: 'SET', k: 'coverLine3', v: e.target.value })} />
      </div>

      <div className="section-title"><span>Pg. 2 — Overview</span></div>
      <div className="field">
        <div className="field-label">General intro text</div>
        <textarea rows={3} value={l.overviewIntro} placeholder="General description of the leads proposal…"
          onChange={e => D('overviewIntro', e.target.value)} />
      </div>

      <div className="section-title"><span>Intro texts per model</span></div>
      <div className="field">
        <div className="field-label">CPL intro (pg. 3)</div>
        <textarea rows={2} value={l.cplIntro}
          onChange={e => D('cplIntro', e.target.value)} />
      </div>
      <div className="field">
        <div className="field-label">CPA intro (pg. 4)</div>
        <textarea rows={2} value={l.cpaIntro}
          onChange={e => D('cpaIntro', e.target.value)} />
      </div>
      <div className="field">
        <div className="field-label">Hybrid intro (pg. 5)</div>
        <textarea rows={2} value={l.hybridIntro}
          onChange={e => D('hybridIntro', e.target.value)} />
      </div>
    </div>
  );
}
