// PagesTab — exposes editable fields for the "Why CreditCheck",
// "Next Steps / Close" and proposal-meta surfaces. Anything that the
// page generators read from state is editable here so the team never
// has to touch code to ship a new proposal.

export function PagesTab({ st, dispatch, t }) {
  const isEs = st.language === 'es';
  const metrics = st.metrics?.length
    ? st.metrics
    : [
        { value: '', label: '' },
        { value: '', label: '' },
        { value: '', label: '' },
        { value: '', label: '' },
      ];
  const valueProps = st.valueProps?.length
    ? st.valueProps
    : [
        { title: '', desc: '' },
        { title: '', desc: '' },
        { title: '', desc: '' },
      ];
  const closeSteps = st.closeSteps?.length
    ? st.closeSteps
    : [
        { title: '', desc: '' },
        { title: '', desc: '' },
        { title: '', desc: '' },
      ];

  const setMetric = (i, f, v) => {
    if (!st.metrics?.length) {
      // seed from defaults on first edit
      dispatch({ t: 'SET', k: 'metrics', v: metrics });
    }
    dispatch({ t: 'METRIC', i, f, v });
  };
  const setVP = (i, f, v) => {
    if (!st.valueProps?.length) dispatch({ t: 'SET', k: 'valueProps', v: valueProps });
    dispatch({ t: 'VALUEPROP', i, f, v });
  };
  const setStep = (i, f, v) => {
    if (!st.closeSteps?.length) dispatch({ t: 'SET', k: 'closeSteps', v: closeSteps });
    dispatch({ t: 'CLOSESTEP', i, f, v });
  };
  const setContact = (k, v) => dispatch({ t: 'CONTACT', k, v });

  return (
    <div>
      {/* Cover meta */}
      <div className="section-title">
        <span>{isEs ? 'Portada — meta' : 'Cover — meta'}</span>
      </div>
      <div className="field">
        <div className="field-label">{isEs ? 'Número de propuesta' : 'Proposal number'}</div>
        <input
          type="text"
          value={st.proposalNumber || ''}
          placeholder="CC-2026-0001"
          onChange={(e) => dispatch({ t: 'SET', k: 'proposalNumber', v: e.target.value })}
        />
      </div>

      {/* Why CC */}
      <div className="section-title">
        <span>{isEs ? 'Por qué CreditCheck' : 'Why CreditCheck'}</span>
      </div>
      <div className="field">
        <div className="field-label">{isEs ? 'Texto introductorio' : 'Intro text'}</div>
        <textarea
          rows={2}
          value={st.whyIntro || ''}
          placeholder={
            isEs
              ? 'Infraestructura de calificación crediticia construida sobre Open Banking…'
              : 'Credit qualification infrastructure built on Open Banking…'
          }
          onChange={(e) => dispatch({ t: 'SET', k: 'whyIntro', v: e.target.value })}
        />
      </div>
      <div className="field">
        <div className="field-label">{isEs ? 'Métricas hero (4)' : 'Hero metrics (4)'}</div>
        {metrics.slice(0, 4).map((m, i) => (
          <div key={i} style={{ display: 'flex', gap: 6, marginBottom: 6 }}>
            <input
              type="text"
              value={m.value}
              placeholder={['2,000+', '19', '<3s', '99.95%'][i] || 'value'}
              onChange={(e) => setMetric(i, 'value', e.target.value)}
              style={{ flex: '0 0 90px' }}
            />
            <input
              type="text"
              value={m.label}
              placeholder={
                isEs
                  ? ['Bancos en la UE', 'Países cubiertos', 'Latencia', 'Uptime'][i]
                  : ['Banks across EU', 'Countries covered', 'Latency', 'Uptime'][i]
              }
              onChange={(e) => setMetric(i, 'label', e.target.value)}
              style={{ flex: 1 }}
            />
          </div>
        ))}
      </div>
      <div className="field">
        <div className="field-label">{isEs ? 'Propuestas de valor (3)' : 'Value props (3)'}</div>
        {valueProps.slice(0, 3).map((p, i) => (
          <div key={i} style={{ display: 'flex', gap: 6, marginBottom: 6 }}>
            <input
              type="text"
              value={p.title}
              placeholder={
                isEs
                  ? ['Open Banking primero', 'Pensado para white-label', 'Pensado para leads'][i]
                  : ['Open Banking-first', 'Built for white-label', 'Built for leads'][i]
              }
              onChange={(e) => setVP(i, 'title', e.target.value)}
              style={{ flex: '0 0 38%' }}
            />
            <input
              type="text"
              value={p.desc}
              placeholder={isEs ? 'Descripción breve' : 'Short description'}
              onChange={(e) => setVP(i, 'desc', e.target.value)}
              style={{ flex: 1 }}
            />
          </div>
        ))}
      </div>

      {/* Close page */}
      <div className="section-title">
        <span>{isEs ? 'Cierre — siguientes pasos' : 'Close — next steps'}</span>
      </div>
      <div className="field">
        <div className="field-label">{isEs ? 'Pasos (3)' : 'Steps (3)'}</div>
        {closeSteps.slice(0, 3).map((s, i) => (
          <div key={i} style={{ display: 'flex', gap: 6, marginBottom: 6 }}>
            <input
              type="text"
              value={s.title}
              placeholder={
                isEs ? ['Firma', 'Onboarding', 'Go-live'][i] : ['Sign', 'Onboard', 'Go-live'][i]
              }
              onChange={(e) => setStep(i, 'title', e.target.value)}
              style={{ flex: '0 0 30%' }}
            />
            <input
              type="text"
              value={s.desc}
              placeholder={isEs ? 'Detalle del paso' : 'Step detail'}
              onChange={(e) => setStep(i, 'desc', e.target.value)}
              style={{ flex: 1 }}
            />
          </div>
        ))}
      </div>

      <div className="section-title">
        <span>{isEs ? 'Contacto comercial' : 'Sales contact'}</span>
      </div>
      <div className="field">
        <div className="field-label">{isEs ? 'Nombre' : 'Name'}</div>
        <input
          type="text"
          value={st.contact?.name || ''}
          placeholder="Sales · CreditCheck"
          onChange={(e) => setContact('name', e.target.value)}
        />
      </div>
      <div className="field">
        <div className="field-label">{isEs ? 'Rol' : 'Role'}</div>
        <input
          type="text"
          value={st.contact?.role || ''}
          placeholder={isEs ? 'Equipo comercial' : 'Sales team'}
          onChange={(e) => setContact('role', e.target.value)}
        />
      </div>
      <div className="field">
        <div className="field-label">Email</div>
        <input
          type="email"
          value={st.contact?.email || ''}
          placeholder="sales@creditchecker.io"
          onChange={(e) => setContact('email', e.target.value)}
        />
      </div>
      <div className="field">
        <div className="field-label">{isEs ? 'Teléfono' : 'Phone'}</div>
        <input
          type="text"
          value={st.contact?.phone || ''}
          placeholder="+34 …"
          onChange={(e) => setContact('phone', e.target.value)}
        />
      </div>
      <div className="field">
        <div className="field-label">{isEs ? 'Validez (texto)' : 'Validity (text)'}</div>
        <input
          type="text"
          value={st.validUntil || ''}
          placeholder={isEs ? '30 de junio de 2026' : 'June 30, 2026'}
          onChange={(e) => dispatch({ t: 'SET', k: 'validUntil', v: e.target.value })}
        />
      </div>

      {/* hint */}
      <p style={{ fontSize: 10, color: '#94A3B8', marginTop: 14, lineHeight: 1.5 }}>
        {isEs
          ? 'Todos los textos visibles en el PDF son editables. Si dejas un campo vacío se usa el valor por defecto del idioma activo.'
          : 'Every visible PDF string is editable. Leave a field empty to fall back to the active locale default.'}
      </p>
      {/* keep prop for future i18n calls */}
      <span style={{ display: 'none' }}>{t ? '' : ''}</span>
    </div>
  );
}
