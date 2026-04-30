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

export function ProposalManager({ st, dispatch, showToast, t }) {
  const [proposals, setProposals] = useState(loadProposals);
  const [saveName, setSaveName] = useState('');
  const names = Object.keys(proposals).sort();
  const dateLocale = st.language === 'es' ? 'es' : st.language || 'en';

  // Sync from localStorage in case another tab changed it
  useEffect(() => {
    setProposals(loadProposals());
  }, []);

  const proposalDefault = t('manager.proposalDefault');
  const labelFor = (state) =>
    state.proposalType === 'leads'
      ? 'Leads'
      : state.proposalType === 'combo'
        ? t('manager.combo')
        : 'WL';
  const defaultName = `${st.clientName || proposalDefault} · ${st.proposalType === 'leads' ? 'Leads' : 'WL'}`;

  const handleSave = () => {
    const name = saveName.trim() || defaultName;
    const updated = { ...proposals, [name]: { ...st, _savedAt: new Date().toISOString() } };
    saveProposals(updated);
    setProposals(updated);
    setSaveName('');
    showToast?.(`✓ ${t('manager.toastSaved')}: "${name}"`);
  };

  const handleLoad = (name) => {
    const saved = proposals[name];
    if (!saved) return;
    const { _savedAt, ...state } = saved;
    dispatch({ t: 'LOAD', v: state });
    showToast?.(`✓ ${t('manager.toastLoaded')}: "${name}"`);
  };

  const handleDelete = (name) => {
    if (!window.confirm(`${t('manager.deleteConfirm')} "${name}"?`)) return;
    const { [name]: _, ...rest } = proposals;
    saveProposals(rest);
    setProposals(rest);
    showToast?.(`✓ ${t('manager.toastDeleted')}: "${name}"`);
  };

  return (
    <div>
      <div className="section-title">
        <span>{t('manager.saveProposal')}</span>
      </div>
      <div style={{ display: 'flex', gap: '6px', marginBottom: '10px' }}>
        <input
          type="text"
          value={saveName}
          placeholder={defaultName}
          onChange={(e) => setSaveName(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleSave();
          }}
          style={{ flex: 1 }}
        />
        <button className="logo-fetch-btn" onClick={handleSave}>
          {t('manager.save')}
        </button>
      </div>

      {names.length > 0 && (
        <>
          <div className="section-title">
            <span>
              {t('manager.savedProposals')} ({names.length})
            </span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {names.map((name) => {
              const p = proposals[name];
              const date = p._savedAt ? new Date(p._savedAt).toLocaleDateString(dateLocale) : '';
              const type = labelFor(p);
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
                    {t('manager.load')}
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
