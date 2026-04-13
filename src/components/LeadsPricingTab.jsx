import { useState } from 'react';
import { CPLEditor } from './leads/CPLEditor.jsx';
import { CPAEditor } from './leads/CPAEditor.jsx';
import { HybridEditor } from './leads/HybridEditor.jsx';

function Section({ title, open, onToggle, children }) {
  return (
    <div className="leads-section">
      <div className="leads-section-hdr" onClick={onToggle}>
        <span>{title}</span>
        <span className="leads-section-chevron">{open ? '▲' : '▼'}</span>
      </div>
      {open && <div className="leads-section-body">{children}</div>}
    </div>
  );
}

export function LeadsPricingTab({ st, dispatch }) {
  const isEs = st.language === 'es';
  const l = st.leads;
  const [open, setOpen] = useState({ cpl: true, cpa: false, hyb: false });
  const toggle = (k) => setOpen((o) => ({ ...o, [k]: !o[k] }));

  // Dispatch helpers — passed down to sub-editors
  const LS = (k, v) => dispatch({ t: 'LEADS_SET', k, v });
  const LAE = (arr, i, f, v) => dispatch({ t: 'LEADS_ARR_EDIT', arr, i, f, v });
  const LAA = (arr, item) => dispatch({ t: 'LEADS_ARR_ADD', arr, item });
  const LAD = (arr, i) => dispatch({ t: 'LEADS_ARR_DEL', arr, i });
  const LSE = (arr, i, v) => dispatch({ t: 'LEADS_STR_EDIT', arr, i, v });
  const LSA = (arr) => dispatch({ t: 'LEADS_STR_ADD', arr });
  const LSD = (arr, i) => dispatch({ t: 'LEADS_STR_DEL', arr, i });

  return (
    <div>
      <Section
        title={isEs ? 'CPL — Coste por Lead' : 'CPL — Cost per Lead'}
        open={open.cpl}
        onToggle={() => toggle('cpl')}
      >
        <CPLEditor
          l={l}
          LS={LS}
          LAE={LAE}
          LAA={LAA}
          LAD={LAD}
          LSE={LSE}
          LSA={LSA}
          LSD={LSD}
          isEs={isEs}
        />
      </Section>

      <Section
        title={isEs ? 'CPA — Coste por Adquisicion' : 'CPA — Cost per Acquisition'}
        open={open.cpa}
        onToggle={() => toggle('cpa')}
      >
        <CPAEditor
          l={l}
          LS={LS}
          LAE={LAE}
          LAA={LAA}
          LAD={LAD}
          LSE={LSE}
          LSA={LSA}
          LSD={LSD}
          isEs={isEs}
        />
      </Section>

      <Section
        title={isEs ? 'Hibrido — CPL + CPA' : 'Hybrid — CPL + CPA'}
        open={open.hyb}
        onToggle={() => toggle('hyb')}
      >
        <HybridEditor l={l} LS={LS} LSE={LSE} LSA={LSA} LSD={LSD} isEs={isEs} />
      </Section>
    </div>
  );
}
