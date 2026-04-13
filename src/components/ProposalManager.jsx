import { useState, useEffect } from 'react';

const PROPOSALS_KEY = 'creditcheck_saved_proposals';

function loadProposals() {
  try {
    return JSON.parse(localStorage.getItem(PROPOSALS_KEY) || '{}');
  } catch {
    return {};
  }
}
function saveProposals(map) {
  try {
    localStorage.setItem(PROPOSALS_KEY, JSON.stringify(map));
  } catch {
    /* full */
  }
}

export function ProposalManager({ st, dispatch, showToast }) {
  const isEs = st.language === 'es';
  const [proposals, setProposals] = useState(loadProposals);
  const [saveName, setSaveName] = useState('');
  const names = Object.keys(proposals).sort();

  // Sync from localStorage in case another tab changed it
  useEffect(() => {
    setProposals(loadProposals());
  }, []);

  const handleSave = () => {
    const name =
      saveName.trim() ||
      `${st.clientName || (isEs ? 'Propuesta' : 'Proposal')} — ${st.proposalType === 'leads' ? 'Leads' : 'WL'}`;
    const updated = { ...proposals, [name]: { ...st, _savedAt: new Date().toISOString() } };
    saveProposals(updated);
    setProposals(updated);
    setSaveName('');
    showToast?.(`✓ ${isEs ? 'Guardado' : 'Saved'}: "${name}"`);
  };

  const handleLoad = (name) => {
    const saved = proposals[name];
    if (!saved) return;
    const { _savedAt, ...state } = saved;
    dispatch({ t: 'LOAD', v: state });
    showToast?.(`✓ ${isEs ? 'Cargado' : 'Loaded'}: "${name}"`);
  };

  const handleDelete = (name) => {
    if (!window.confirm(`${isEs ? 'Eliminar' : 'Delete'} "${name}"?`)) return;
    const { [name]: _, ...rest } = proposals;
    saveProposals(rest);
    setProposals(rest);
    showToast?.(`✓ ${isEs ? 'Eliminado' : 'Deleted'}: "${name}"`);
  };

  return (
    <div>
      <div className="section-title">
        <span>{isEs ? 'Guardar propuesta' : 'Save proposal'}</span>
      </div>
      <div style={{ display: 'flex', gap: '6px', marginBottom: '10px' }}>
        <input
          type="text"
          value={saveName}
          placeholder={`${st.clientName || (isEs ? 'Propuesta' : 'Proposal')} — ${st.proposalType === 'leads' ? 'Leads' : 'WL'}`}
          onChange={(e) => setSaveName(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleSave();
          }}
          style={{ flex: 1 }}
        />
        <button className="logo-fetch-btn" onClick={handleSave}>
          {isEs ? 'Guardar' : 'Save'}
        </button>
      </div>

      {names.length > 0 && (
        <>
          <div className="section-title">
            <span>
              {isEs ? 'Propuestas guardadas' : 'Saved proposals'} ({names.length})
            </span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {names.map((name) => {
              const p = proposals[name];
              const date = p._savedAt
                ? new Date(p._savedAt).toLocaleDateString(isEs ? 'es' : 'en')
                : '';
              const type =
                p.proposalType === 'leads'
                  ? 'Leads'
                  : p.proposalType === 'combo'
                    ? isEs
                      ? 'Combinado'
                      : 'Combo'
                    : 'WL';
              return (
                <div
                  key={name}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '6px 8px',
                    borderRadius: '5px',
                    background: 'var(--bg-subtle)',
                    border: '1px solid var(--border-lt)',
                  }}
                >
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div
                      style={{
                        fontSize: '11px',
                        fontWeight: 700,
                        color: 'var(--t-strong)',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {name}
                    </div>
                    <div style={{ fontSize: '9px', color: 'var(--t-muted)' }}>
                      {type} · {p.clientName} · {date}
                    </div>
                  </div>
                  <button
                    onClick={() => handleLoad(name)}
                    style={{
                      background: 'var(--blue)',
                      color: '#fff',
                      border: 'none',
                      borderRadius: '4px',
                      padding: '3px 8px',
                      fontSize: '9px',
                      fontWeight: 700,
                      cursor: 'pointer',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {isEs ? 'Cargar' : 'Load'}
                  </button>
                  <button
                    onClick={() => handleDelete(name)}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#B0432A',
                      fontSize: '13px',
                      cursor: 'pointer',
                      padding: '0 2px',
                      lineHeight: 1,
                    }}
                  >
                    ✕
                  </button>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
