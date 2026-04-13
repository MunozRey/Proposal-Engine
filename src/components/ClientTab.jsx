import { useState, useRef } from 'react';
import { NAVY, BLUE, CC_LOGO } from '../constants.js';
import { fetchLogoFromDomain } from '../utils/logoFetch.js';

export function ClientTab({ st, dispatch }) {
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
    r.onload = ev => dispatch({ t: 'SET', k: key, v: ev.target.result });
    r.readAsDataURL(file);
  }

  function fetchClient() {
    if (cancelClient.current) cancelClient.current();
    cancelClient.current = fetchLogoFromDomain(logoUrl, 'clientLogoUrl', dispatch, setClientStatus, setClientLoading);
  }

  function fetchCc() {
    if (cancelCc.current) cancelCc.current();
    cancelCc.current = fetchLogoFromDomain(ccUrl, 'ccLogoUrl', dispatch, setCcStatus, setCcLoading);
  }

  return (
    <div>
      <div className="section-title"><span>Client data</span></div>
      <div className="field">
        <div className="field-label">Client name <span className="req">*</span></div>
        <input type="text" value={st.clientName} placeholder="Ebury"
          className={!st.clientName.trim() ? 'input-warn' : ''}
          onChange={e => dispatch({ t: 'SET', k: 'clientName', v: e.target.value })} />
        {!st.clientName.trim() && <div className="field-hint warn">Required field for the proposal</div>}
      </div>

      <div className="field">
        <div className="field-label">Client logo</div>
        <label className="upload-zone">
          <div className="upload-zone-icon">🖼</div>
          <div><div className="upload-zone-txt">Upload client logo</div><div className="upload-zone-sub">PNG · SVG · JPG</div></div>
          <input type="file" accept="image/*" style={{ display: 'none' }} onChange={e => handleLogo('clientLogoUrl', e.target.files[0])} />
        </label>
        <div style={{ marginTop: '6px' }}>
          <div className="field-label">or search by domain</div>
          <div className="logo-fetch">
            <input type="text" value={logoUrl} placeholder="ebury.com"
              onChange={e => setLogoUrl(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') fetchClient(); }} />
            <button className="logo-fetch-btn" disabled={clientLoading} onClick={fetchClient}>
              {clientLoading ? '...' : 'Search'}
            </button>
          </div>
          {clientStatus && <div className={`logo-status ${clientStatus.ok ? 'ok' : 'err'}`}>{clientStatus.msg}</div>}
        </div>
        {st.clientLogoUrl && <div className="upload-preview"><img src={st.clientLogoUrl} alt="client logo" /></div>}
      </div>

      <div className="field">
        <div className="field-label">CreditCheck logo (transparent)</div>
        <label className="upload-zone">
          <div className="upload-zone-icon">©</div>
          <div><div className="upload-zone-txt">Upload CreditCheck logo</div><div className="upload-zone-sub">PNG with transparent background</div></div>
          <input type="file" accept="image/*" style={{ display: 'none' }} onChange={e => handleLogo('ccLogoUrl', e.target.files[0])} />
        </label>
        <div style={{ marginTop: '6px' }}>
          <div className="field-label">or search by domain</div>
          <div className="logo-fetch">
            <input type="text" value={ccUrl} placeholder="creditchecker.io"
              onChange={e => setCcUrl(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') fetchCc(); }} />
            <button className="logo-fetch-btn" disabled={ccLoading} onClick={fetchCc}>
              {ccLoading ? '...' : 'Search'}
            </button>
          </div>
          {ccStatus && <div className={`logo-status ${ccStatus.ok ? 'ok' : 'err'}`}>{ccStatus.msg}</div>}
        </div>
        <div className="upload-preview">
          <img src={st.ccLogoUrl || CC_LOGO} alt="CreditCheck logo" style={{ maxHeight: '28px', maxWidth: '100%', objectFit: 'contain' }} />
        </div>
      </div>

      <div className="field">
        <div className="field-label">Date</div>
        <input type="text" value={st.date} placeholder="March 2026"
          onChange={e => dispatch({ t: 'SET', k: 'date', v: e.target.value })} />
      </div>
    </div>
  );
}
