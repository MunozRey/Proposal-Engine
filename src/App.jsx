import { useState, useRef, useCallback, useEffect, useMemo } from 'react';
import './App.css';
import { reducer } from './state/reducer.js';
import { INIT } from './state/initialState.js';
import { loadState, createDebouncedSave, clearState } from './utils/storage.js';
import { useUndoReducer } from './utils/history.js';
import { ClientTab } from './components/ClientTab.jsx';
import { ContentTab } from './components/ContentTab.jsx';
import { PricingTab } from './components/PricingTab.jsx';
import { LeadsContentTab } from './components/LeadsContentTab.jsx';
import { LeadsPricingTab } from './components/LeadsPricingTab.jsx';
import { StyleTab } from './components/StyleTab.jsx';
import { ProposalManager } from './components/ProposalManager.jsx';
import { PageCard } from './components/PageCard.jsx';
import { exportPDF } from './utils/exportPdf.js';
import { genPage1 } from './pages/genPage1.js';
import { genPage2 } from './pages/genPage2.js';
import { genPage3 } from './pages/genPage3.js';
import { genLeadsOverview } from './pages/leads/genLeadsOverview.js';
import { genLeadsCPL } from './pages/leads/genLeadsCPL.js';
import { genLeadsCPA } from './pages/leads/genLeadsCPA.js';
import { genLeadsHybrid } from './pages/leads/genLeadsHybrid.js';

const TABS_WL    = [['client','Client'],['content','Content'],['pricing','Pricing'],['style','Style'],['save','File']];
const TABS_LEADS = [['client','Client'],['content','Content'],['pricing','Pricing'],['style','Style'],['save','File']];
const TABS_COMBO = [['client','Client'],['content','Content'],['pricing','Pricing'],['leadsP','Leads Pricing'],['style','Style'],['save','File']];

const savedState = loadState();
const initialState = savedState ? { ...INIT, ...savedState } : INIT;
const debouncedSave = createDebouncedSave(500);

function App() {
  const { st, dispatch, undo, redo, canUndo, canRedo } = useUndoReducer(reducer, initialState);
  const [tab, setTab] = useState('client');
  const formRef = useRef(null);
  const switchTab = useCallback(t => { setTab(t); if (formRef.current) formRef.current.scrollTop = 0; }, []);
  const [zoom, setZoom] = useState(0.55);
  const [collapsed, setCollapsed] = useState(false);
  const [autoFit, setAutoFit] = useState(true);
  const [exporting, setExporting] = useState(false);
  const [toast, setToast] = useState(null);
  const [lastExportJson, setLastExportJson] = useState(null);
  const [sidebarW, setSidebarW] = useState(310);
  const rightRef = useRef(null);
  const dragging = useRef(false);

  useEffect(() => { debouncedSave(st); }, [st]);

  const showToast = useCallback((msg, ms = 2500) => {
    setToast(msg);
    setTimeout(() => setToast(null), ms);
  }, []);

  const currentJson = useMemo(() => JSON.stringify(st), [st]);
  const hasUnsavedChanges = lastExportJson !== null && currentJson !== lastExportJson;

  const handleExport = useCallback(async () => {
    if (exporting) return;
    setExporting(true);
    try {
      await exportPDF(visiblePagesRef.current, st.clientName);
      setLastExportJson(JSON.stringify(st));
      showToast('✓ PDF exported');
    } finally { setExporting(false); }
  }, [exporting, st, showToast]);

  useEffect(() => {
    const handler = (e) => {
      const ctrl = e.ctrlKey || e.metaKey;
      if (!ctrl) return;
      if (e.key === 'z' || e.key === 'Z') {
        e.preventDefault();
        if (e.shiftKey) { if (canRedo) { redo(); showToast('↻ Redo'); } }
        else { if (canUndo) { undo(); showToast('↶ Undo'); } }
        return;
      }
      if (e.key === 'e' || e.key === 'E') { e.preventDefault(); handleExport(); }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [canUndo, canRedo, undo, redo, handleExport, showToast]);

  /* ── Sidebar resize drag ─────────────────────────── */
  const onDragStart = useCallback((e) => {
    e.preventDefault();
    dragging.current = true;
    const move = (ev) => {
      if (!dragging.current) return;
      const x = ev.clientX;
      setSidebarW(Math.max(240, Math.min(520, x)));
    };
    const up = () => { dragging.current = false; window.removeEventListener('mousemove', move); window.removeEventListener('mouseup', up); };
    window.addEventListener('mousemove', move);
    window.addEventListener('mouseup', up);
  }, []);

  const calcZoom = useCallback(() => {
    if (!rightRef.current || !autoFit) return;
    const w = rightRef.current.offsetWidth;
    const h = rightRef.current.offsetHeight;
    const byWidth = (w - 40) / 595;
    const byHeight = (h - 120) / 842;
    const fit = Math.min(byWidth, byHeight, 0.72);
    setZoom(parseFloat(Math.max(0.25, fit).toFixed(3)));
  }, [autoFit]);

  useEffect(() => {
    if (!rightRef.current) return;
    calcZoom();
    const obs = new ResizeObserver(calcZoom);
    obs.observe(rightRef.current);
    return () => obs.disconnect();
  }, [calcZoom]);

  useEffect(() => {
    const t = setTimeout(calcZoom, 250);
    return () => clearTimeout(t);
  }, [collapsed, calcZoom]);

  const handleTypeChange = (type) => { dispatch({ t: 'SET', k: 'proposalType', v: type }); setTab('client'); };
  const handleReset = () => {
    if (window.confirm('Reset all data to default values?')) {
      dispatch({ t: 'RESET' }); clearState(); setTab('client'); setLastExportJson(null);
      showToast('✓ Data reset');
    }
  };

  const pType = st.proposalType;
  const isLeads = pType === 'leads';
  const isCombo = pType === 'combo';
  const tabsDef = isCombo ? TABS_COMBO : isLeads ? TABS_LEADS : TABS_WL;
  const hidden = new Set(st.hiddenPages || []);

  /* ── Dynamic page numbering ──────────────────────── */
  const allPageDefs = useMemo(() => {
    if (pType === 'combo') {
      return [
        { id: 'cover',    baseLabel: 'Cover',            gen: () => genPage1(st) },
        { id: 'how',      baseLabel: 'How It Works',     gen: (n) => genPage2(st, n) },
        { id: 'pricing',  baseLabel: 'WL Pricing',       gen: (n) => genPage3(st, n) },
        { id: 'overview', baseLabel: 'Leads Overview',   gen: (n) => genLeadsOverview(st, n) },
        { id: 'cpl',      baseLabel: 'CPL Model',        gen: (n) => genLeadsCPL(st, n) },
        { id: 'cpa',      baseLabel: 'CPA Model',        gen: (n) => genLeadsCPA(st, n) },
        { id: 'hybrid',   baseLabel: 'Hybrid Model',     gen: (n) => genLeadsHybrid(st, n) },
      ];
    }
    if (pType === 'leads') {
      return [
        { id: 'cover',    baseLabel: 'Cover',            gen: () => genPage1(st) },
        { id: 'overview', baseLabel: 'Overview',         gen: (n) => genLeadsOverview(st, n) },
        { id: 'cpl',      baseLabel: 'CPL Model',        gen: (n) => genLeadsCPL(st, n) },
        { id: 'cpa',      baseLabel: 'CPA Model',        gen: (n) => genLeadsCPA(st, n) },
        { id: 'hybrid',   baseLabel: 'Hybrid Model',     gen: (n) => genLeadsHybrid(st, n) },
      ];
    }
    return [
      { id: 'cover',   baseLabel: 'Cover',            gen: () => genPage1(st) },
      { id: 'how',     baseLabel: 'How It Works',     gen: (n) => genPage2(st, n) },
      { id: 'pricing', baseLabel: 'Pricing',          gen: (n) => genPage3(st, n) },
    ];
  }, [st, pType]);

  // All pages with labels (for toggle list)
  const allPages = useMemo(() => {
    let idx = 0;
    return allPageDefs.map(p => {
      if (p.id === 'cover') return { id: p.id, label: p.baseLabel, html: p.gen() }; // baseLabel is already English
      idx++;
      const num = String(idx).padStart(2, '0');
      return { id: p.id, label: `Pg. ${idx + 1} — ${p.baseLabel}`, html: p.gen(num) };
    });
  }, [allPageDefs]);

  // Visible pages with RENUMBERED content
  const visiblePages = useMemo(() => {
    const visDefs = allPageDefs.filter(p => !hidden.has(p.id));
    let contentIdx = 0;
    return visDefs.map(p => {
      if (p.id === 'cover') return { id: p.id, label: 'Cover', html: p.gen() };
      contentIdx++;
      const num = String(contentIdx).padStart(2, '0');
      return { id: p.id, label: `Pg. ${contentIdx + 1} — ${p.baseLabel}`, html: p.gen(num) };
    });
  }, [allPageDefs, hidden]);

  const visiblePagesRef = useRef(visiblePages);
  visiblePagesRef.current = visiblePages;

  return (
    <>
      {collapsed && (
        <button className="sidebar-toggle-open" title="Open panel"
          onClick={() => setCollapsed(false)}>▶</button>
      )}
      {toast && <div className="toast" key={toast + Date.now()}>{toast}</div>}

      <div id="left" className={collapsed ? 'collapsed' : ''}
        style={collapsed ? {} : { width: sidebarW, minWidth: sidebarW }}>
        <div id="panel-header">
          <div id="panel-header-text">
            <h1>Proposal Generator</h1>
            <p>CreditCheck · {isCombo ? 'Combo' : isLeads ? 'Leads' : 'White-Label'}</p>
          </div>
          <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
            <button className="sidebar-toggle" title="Undo (Ctrl+Z)"
              style={{ opacity: canUndo ? 1 : 0.3 }}
              onClick={() => { if (canUndo) { undo(); showToast('↶ Undo'); } }}>↶</button>
            <button className="sidebar-toggle" title="Redo (Ctrl+Shift+Z)"
              style={{ opacity: canRedo ? 1 : 0.3 }}
              onClick={() => { if (canRedo) { redo(); showToast('↻ Redo'); } }}>↻</button>
            <button className="sidebar-toggle" title="Collapse panel"
              onClick={() => setCollapsed(true)}>◀</button>
          </div>
        </div>

        <div id="type-selector">
          <button className={`type-btn${pType === 'wl' ? ' active' : ''}`}
            onClick={() => handleTypeChange('wl')}>White-Label</button>
          <button className={`type-btn${pType === 'leads' ? ' active' : ''}`}
            onClick={() => handleTypeChange('leads')}>Leads</button>
          <button className={`type-btn${pType === 'combo' ? ' active' : ''}`}
            onClick={() => handleTypeChange('combo')}>Combo</button>
        </div>

        <div id="tabs">
          {tabsDef.map(([id, lbl]) => (
            <div key={id} className={`tab${tab === id ? ' active' : ''}`} onClick={() => switchTab(id)}>{lbl}</div>
          ))}
        </div>
        <div id="form-area" ref={formRef}>
          <div className="tab-content" key={tab}>
            {tab === 'client'  && <ClientTab st={st} dispatch={dispatch} />}
            {tab === 'content' && (isLeads ? <LeadsContentTab st={st} dispatch={dispatch} /> : <ContentTab st={st} dispatch={dispatch} />)}
            {tab === 'pricing' && (isLeads ? <LeadsPricingTab st={st} dispatch={dispatch} /> : <PricingTab st={st} dispatch={dispatch} />)}
            {tab === 'leadsP'  && <LeadsPricingTab st={st} dispatch={dispatch} />}
            {tab === 'style'   && <StyleTab st={st} dispatch={dispatch} allPages={allPages} />}
            {tab === 'save'    && <ProposalManager st={st} dispatch={dispatch} showToast={showToast} />}
          </div>
        </div>
        <div id="export-bar">
          <div id="zoom-bar">
            <span>Zoom</span>
            <input type="range" min="0.25" max="1.5" step="0.01" value={zoom}
              onChange={e => { setAutoFit(false); setZoom(parseFloat(e.target.value)); }} />
            <span className="zoom-val">{Math.round(zoom * 100)}%</span>
            <button title="Fit to width" onClick={() => { setAutoFit(true); calcZoom(); }}
              style={{ background: autoFit ? 'var(--blue)' : '#F0F2F5', border: 'none', borderRadius: '4px', padding: '3px 6px', fontSize: '10px', fontWeight: 700, color: autoFit ? '#fff' : '#7A8FA0', cursor: 'pointer', flexShrink: 0 }}>
              ⊡
            </button>
          </div>
          <button className={`export-btn${hasUnsavedChanges ? ' has-changes' : ''}`}
            disabled={exporting} onClick={handleExport}>
            {exporting ? '⏳ Generating PDF…' : '⬇ Export PDF'}
          </button>
          <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', alignItems: 'center' }}>
            <small>Ctrl+E · Downloads as .pdf</small>
            <button onClick={handleReset}
              style={{ background: 'none', border: 'none', fontSize: '9px', color: '#B0432A', cursor: 'pointer', fontWeight: 600, padding: 0 }}>
              ↺ Reset
            </button>
          </div>
        </div>
      </div>

      {/* Resize handle */}
      {!collapsed && <div className="sidebar-resize" onMouseDown={onDragStart} />}

      <div id="right" ref={rightRef}>
        <div id="preview-label">Real-Time Preview</div>
        <div id="pages">
          {visiblePages.map(p => (
            <PageCard key={p.id} label={p.label} html={p.html} zoom={zoom} />
          ))}
        </div>
      </div>
    </>
  );
}

export default App;
