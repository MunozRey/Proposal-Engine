import { useState, useRef } from 'react';
import { CC_LOGO } from '../constants.js';
import { fetchLogoFromDomain } from '../utils/logoFetch.js';

export function ClientTab({ st, dispatch, t }) {
  const isEs = st.language === 'es';
  const [logoUrl, setLogoUrl] = useState('');
  const [ccUrl, setCcUrl] = useState('');
  const [clientStatus, setClientStatus] = useState(null);
  const [ccStatus, setCcStatus] = useState(null);
  const [clientLoading, setClientLoading] = useState(false);
  const [ccLoading, setCcLoading] = useState(false);
  const cancelClient = useRef(null);
  const cancelCc = useRef(null);

  function handleLogo(key, file) {
    if (!file) return;
    const r = new FileReader();
    r.onload = (ev) => dispatch({ t: 'SET', k: key, v: ev.target.result });
    r.readAsDataURL(file);
  }

  function fetchClient() {
    if (cancelClient.current) cancelClient.current();
    cancelClient.current = fetchLogoFromDomain(
      logoUrl,
      'clientLogoUrl',
      dispatch,
      setClientStatus,
      setClientLoading,
      st.language
    );
  }

  function fetchCc() {
    if (cancelCc.current) cancelCc.current();
    cancelCc.current = fetchLogoFromDomain(
      ccUrl,
      'ccLogoUrl',
      dispatch,
      setCcStatus,
      setCcLoading,
      st.language
    );
  }

  return (
    <div>
      <div className="section-title">
        <span>{isEs ? 'Datos del cliente' : 'Client data'}</span>
      </div>
      <div className="field">
        <div className="field-label">
          {isEs ? 'Nombre del cliente' : 'Client name'} <span className="req">*</span>
        </div>
        <input
          type="text"
          value={st.clientName}
          placeholder={isEs ? 'Nombre de tu empresa' : 'Your company name'}
          className={!st.clientName.trim() ? 'input-warn' : ''}
          onChange={(e) => dispatch({ t: 'SET', k: 'clientName', v: e.target.value })}
        />
        {!st.clientName.trim() && (
          <div className="field-hint warn">{t('shared.requiredField')}</div>
        )}
      </div>

      <div className="field">
        <div className="field-label">{isEs ? 'Logo del cliente' : 'Client logo'}</div>
        <label className="upload-zone">
          <div className="upload-zone-icon">🖼</div>
          <div>
            <div className="upload-zone-txt">
              {isEs ? 'Subir logo del cliente' : 'Upload client logo'}
            </div>
            <div className="upload-zone-sub">PNG · SVG · JPG</div>
          </div>
          <input
            type="file"
            accept="image/*"
            style={{ display: 'none' }}
            onChange={(e) => handleLogo('clientLogoUrl', e.target.files[0])}
          />
        </label>
        <div style={{ marginTop: '6px' }}>
          <div className="field-label">{isEs ? 'o buscar por dominio' : 'or search by domain'}</div>
          <div className="logo-fetch">
            <input
              type="text"
              value={logoUrl}
              placeholder={isEs ? 'tu-dominio.com' : 'your-domain.com'}
              onChange={(e) => setLogoUrl(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') fetchClient();
              }}
            />
            <button className="logo-fetch-btn" disabled={clientLoading} onClick={fetchClient}>
              {clientLoading ? '...' : t('shared.search')}
            </button>
          </div>
          {clientStatus && (
            <div className={`logo-status ${clientStatus.ok ? 'ok' : 'err'}`}>
              {clientStatus.msg}
            </div>
          )}
        </div>
        {st.clientLogoUrl && (
          <div className="upload-preview">
            <img src={st.clientLogoUrl} alt="client logo" />
          </div>
        )}
      </div>

      <div className="field">
        <div className="field-label">
          {isEs ? 'Logo de CreditCheck (transparente)' : 'CreditCheck logo (transparent)'}
        </div>
        <label className="upload-zone">
          <div className="upload-zone-icon">©</div>
          <div>
            <div className="upload-zone-txt">
              {isEs ? 'Subir logo de CreditCheck' : 'Upload CreditCheck logo'}
            </div>
            <div className="upload-zone-sub">
              {isEs ? 'PNG con fondo transparente' : 'PNG with transparent background'}
            </div>
          </div>
          <input
            type="file"
            accept="image/*"
            style={{ display: 'none' }}
            onChange={(e) => handleLogo('ccLogoUrl', e.target.files[0])}
          />
        </label>
        <div style={{ marginTop: '6px' }}>
          <div className="field-label">{isEs ? 'o buscar por dominio' : 'or search by domain'}</div>
          <div className="logo-fetch">
            <input
              type="text"
              value={ccUrl}
              placeholder={isEs ? 'tu-marca.com' : 'your-brand.com'}
              onChange={(e) => setCcUrl(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') fetchCc();
              }}
            />
            <button className="logo-fetch-btn" disabled={ccLoading} onClick={fetchCc}>
              {ccLoading ? '...' : t('shared.search')}
            </button>
          </div>
          {ccStatus && (
            <div className={`logo-status ${ccStatus.ok ? 'ok' : 'err'}`}>{ccStatus.msg}</div>
          )}
        </div>
        <div className="upload-preview">
          <img
            src={st.ccLogoUrl || CC_LOGO}
            alt="CreditCheck logo"
            style={{ maxHeight: '28px', maxWidth: '100%', objectFit: 'contain' }}
          />
        </div>
      </div>

      <div className="field">
        <div className="field-label">{isEs ? 'Fecha' : 'Date'}</div>
        <input
          type="text"
          value={st.date}
          placeholder={isEs ? 'Marzo 2026' : 'March 2026'}
          onChange={(e) => dispatch({ t: 'SET', k: 'date', v: e.target.value })}
        />
      </div>
    </div>
  );
}
