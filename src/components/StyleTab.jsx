export function StyleTab({ st, dispatch, allPages, t }) {
  const hidden = new Set(st.hiddenPages || []);

  return (
    <div>
      {/* ── Page Visibility ───────────────────────────── */}
      <div className="section-title">
        <span>{t('shared.visiblePages')}</span>
      </div>
      <p
        style={{
          fontSize: '10px',
          color: 'var(--t-muted)',
          marginBottom: '8px',
          lineHeight: '1.5',
        }}
      >
        {t('shared.visiblePagesHint')}
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginBottom: '14px' }}>
        {(allPages || []).map((page) => (
          <label
            key={page.id}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '11px',
              fontWeight: 600,
              color: 'var(--t-body)',
              cursor: 'pointer',
              padding: '4px 6px',
              borderRadius: '4px',
              background: hidden.has(page.id) ? 'transparent' : 'var(--blue-tint)',
            }}
          >
            <input
              type="checkbox"
              checked={!hidden.has(page.id)}
              onChange={() => dispatch({ t: 'TOGGLE_PAGE', k: page.id })}
              style={{ accentColor: 'var(--blue)', cursor: 'pointer' }}
            />
            <span style={{ opacity: hidden.has(page.id) ? 0.45 : 1 }}>{page.label}</span>
          </label>
        ))}
      </div>

      {/* ── Footer ────────────────────────────────────── */}
      <div className="section-title">
        <span>{t('shared.footer')}</span>
      </div>
      <div className="field">
        <div className="field-label">{t('shared.leftText')}</div>
        <input
          type="text"
          value={st.footerLeft || ''}
          onChange={(e) => dispatch({ t: 'SET', k: 'footerLeft', v: e.target.value })}
        />
      </div>
      <div className="field">
        <div className="field-label">{t('shared.rightText')}</div>
        <input
          type="text"
          value={st.footerRight || ''}
          onChange={(e) => dispatch({ t: 'SET', k: 'footerRight', v: e.target.value })}
        />
      </div>
    </div>
  );
}
