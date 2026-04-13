import { NAVY, BLUE } from '../constants.js';

const TYPO_FIELDS = [
  { k: 'heading',   label: 'Section headings',      min: 8,  max: 18, step: 0.5 },
  { k: 'subhead',   label: 'Subheadings',           min: 6,  max: 14, step: 0.5 },
  { k: 'body',      label: 'Body text',             min: 5,  max: 12, step: 0.5 },
  { k: 'small',     label: 'Secondary text',        min: 4,  max: 10, step: 0.5 },
  { k: 'tableBody', label: 'Table/plan text',       min: 4,  max: 10, step: 0.5 },
  { k: 'note',      label: 'Footnotes',             min: 3.5,max: 8,  step: 0.5 },
  { k: 'micro',     label: 'Minimum labels',        min: 3,  max: 7,  step: 0.5 },
];

function ColorField({ label, value, fallback, onChange }) {
  const active = value || fallback;
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
      <input type="color" value={active} onChange={e => onChange(e.target.value)}
        style={{ width: '28px', height: '28px', border: '1.5px solid var(--border)', borderRadius: '5px', cursor: 'pointer', padding: '1px' }} />
      <div style={{ flex: 1 }}>
        <div className="field-label" style={{ marginBottom: '1px' }}>{label}</div>
        <div style={{ fontSize: '10px', color: 'var(--t-muted)', fontFamily: 'monospace' }}>{active}</div>
      </div>
      {value && (
        <button onClick={() => onChange('')} title="Restore default"
          style={{ background: 'none', border: 'none', fontSize: '10px', color: 'var(--t-muted)', cursor: 'pointer', padding: '2px 4px' }}>
          ↺
        </button>
      )}
    </div>
  );
}

export function StyleTab({ st, dispatch, allPages }) {
  const T = st.typo;
  const set = (k, v) => dispatch({ t: 'TYPO', k, v });
  const hidden = new Set(st.hiddenPages || []);

  return (
    <div>
      {/* ── Page Visibility ───────────────────────────── */}
      <div className="section-title"><span>Visible pages</span></div>
      <p style={{ fontSize: '10px', color: 'var(--t-muted)', marginBottom: '8px', lineHeight: '1.5' }}>
        Uncheck pages to hide them from the preview and the exported PDF.
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginBottom: '14px' }}>
        {(allPages || []).map(page => (
          <label key={page.id} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '11px', fontWeight: 600, color: 'var(--t-body)', cursor: 'pointer', padding: '4px 6px', borderRadius: '4px', background: hidden.has(page.id) ? 'transparent' : 'var(--blue-tint)' }}>
            <input type="checkbox" checked={!hidden.has(page.id)}
              onChange={() => dispatch({ t: 'TOGGLE_PAGE', k: page.id })}
              style={{ accentColor: 'var(--blue)', cursor: 'pointer' }} />
            <span style={{ opacity: hidden.has(page.id) ? 0.45 : 1 }}>{page.label}</span>
          </label>
        ))}
      </div>

      {/* ── Brand Colors ─────────────────────────────── */}
      <div className="section-title"><span>Brand colors</span></div>
      <p style={{ fontSize: '10px', color: 'var(--t-muted)', marginBottom: '10px', lineHeight: '1.5' }}>
        Customize the main PDF colors. Leave empty to use CreditCheck default colors.
      </p>
      <ColorField label="Primary color (navy)" value={st.brandNavy} fallback={NAVY}
        onChange={v => dispatch({ t: 'SET', k: 'brandNavy', v })} />
      <ColorField label="Accent color (blue)" value={st.brandBlue} fallback={BLUE}
        onChange={v => dispatch({ t: 'SET', k: 'brandBlue', v })} />

      {/* ── Footer ────────────────────────────────────── */}
      <div className="section-title"><span>Footer</span></div>
      <div className="field">
        <div className="field-label">Left text</div>
        <input type="text" value={st.footerLeft || ''} onChange={e => dispatch({ t: 'SET', k: 'footerLeft', v: e.target.value })} />
      </div>
      <div className="field">
        <div className="field-label">Right text</div>
        <input type="text" value={st.footerRight || ''} onChange={e => dispatch({ t: 'SET', k: 'footerRight', v: e.target.value })} />
      </div>

      {/* ── Typography ────────────────────────────────── */}
      <div className="section-title"><span>Typography — sizes (px)</span></div>
      <p style={{ fontSize: '10px', color: 'var(--t-muted)', marginBottom: '12px', lineHeight: '1.5' }}>
        Adjust the text sizes that appear on PDF pages. Changes apply to all proposals.
      </p>
      {TYPO_FIELDS.map(({ k, label, min, max, step }) => (
        <div key={k} className="field typo-field">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3px' }}>
            <div className="field-label" style={{ marginBottom: 0 }}>{label}</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <button className="typo-step-btn" onClick={() => set(k, Math.max(min, +(T[k] - step).toFixed(1)))}>−</button>
              <span className="typo-val">{T[k]}px</span>
              <button className="typo-step-btn" onClick={() => set(k, Math.min(max, +(T[k] + step).toFixed(1)))}>+</button>
            </div>
          </div>
          <input type="range" min={min} max={max} step={step} value={T[k]}
            onChange={e => set(k, e.target.value)}
            style={{ width: '100%', accentColor: 'var(--blue)', cursor: 'pointer' }} />
        </div>
      ))}

      {/* ── Reset ─────────────────────────────────────── */}
      <div className="section-title" style={{ marginTop: '16px' }}><span>Reset</span></div>
      <button className="btn-add" style={{ marginTop: '4px' }}
        onClick={() => {
          dispatch({ t: 'SET', k: 'typo', v: { heading: 18, subhead: 14, body: 12, small: 10, tableBody: 10, note: 8, micro: 7 } });
          dispatch({ t: 'SET', k: 'brandNavy', v: '' });
          dispatch({ t: 'SET', k: 'brandBlue', v: '' });
        }}>
        ↺ Restore default styles
      </button>
    </div>
  );
}
