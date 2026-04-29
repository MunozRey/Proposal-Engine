import { useState, useRef, useCallback, useEffect, useMemo } from 'react';
import './App.css';
import './components/editor/editor.css';
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
import { PagesTab } from './components/PagesTab.jsx';
import { PageCard } from './components/PageCard.jsx';
import { exportPDF } from './utils/exportPdf.js';
import { genPage1 } from './pages/genPage1.js';
import { genPage2 } from './pages/genPage2.js';
import { genPage3 } from './pages/genPage3.js';
import { genLeadsOverview } from './pages/leads/genLeadsOverview.js';
import { genLeadsCPL } from './pages/leads/genLeadsCPL.js';
import { genLeadsCPA } from './pages/leads/genLeadsCPA.js';
import { genLeadsHybrid } from './pages/leads/genLeadsHybrid.js';
import { genWhyCC } from './pages/genWhyCC.js';
import { genClose } from './pages/genClose.js';
import { t, listLocales, normalizeLang } from './i18n/translate.js';
import { EditorShell } from './components/editor/EditorShell.jsx';
import { CommandPalette } from './components/editor/CommandPalette.jsx';
import { ShortcutsHelp } from './components/editor/ShortcutsHelp.jsx';
import { useShortcuts } from './hooks/useShortcuts.js';
import { icon as svgIcon } from './design/icons.js';

const TABS_WL = ['client', 'content', 'pricing', 'pages', 'style', 'save'];
const TABS_LEADS = ['client', 'content', 'pricing', 'pages', 'style', 'save'];
const TABS_COMBO = ['client', 'content', 'pricing', 'leadsP', 'pages', 'style', 'save'];

const savedState = loadState();
const initialState = savedState ? { ...INIT, ...savedState } : INIT;
const debouncedSave = createDebouncedSave(500);

function App() {
  const { st, dispatch, undo, redo, canUndo, canRedo } = useUndoReducer(reducer, initialState);
  const lang = normalizeLang(st.language);
  const [tab, setTab] = useState('client');
  const formRef = useRef(null);
  const switchTab = useCallback((next) => {
    setTab(next);
    if (formRef.current) formRef.current.scrollTop = 0;
  }, []);
  const [zoom, setZoom] = useState(0.55);
  const [collapsed, setCollapsed] = useState(false);
  const [autoFit, setAutoFit] = useState(true);
  const [exporting, setExporting] = useState(false);
  const [toast, setToast] = useState(null);
  const [lastExportJson, setLastExportJson] = useState(null);
  const [sidebarW, setSidebarW] = useState(360);
  const [cmdOpen, setCmdOpen] = useState(false);
  const [shortcutsOpen, setShortcutsOpen] = useState(false);
  const [saveStatus, setSaveStatus] = useState('saved');
  const rightRef = useRef(null);
  const dragging = useRef(false);

  useEffect(() => {
    setSaveStatus('saving');
    debouncedSave(st);
    const id = setTimeout(() => setSaveStatus('saved'), 600);
    return () => clearTimeout(id);
  }, [st]);

  // Pre-load Larken weights so the cover and titles render in serif from the
  // first paint instead of swapping mid-export and breaking html2canvas captures.
  useEffect(() => {
    if (typeof document === 'undefined' || !document.fonts) return;
    Promise.all([
      document.fonts.load('400 16px Larken'),
      document.fonts.load('500 16px Larken'),
      document.fonts.load('700 16px Larken'),
    ]).catch(() => {});
  }, []);

  const showToast = useCallback((msg, ms = 2200) => {
    setToast(msg);
    setTimeout(() => setToast(null), ms);
  }, []);

  const currentJson = useMemo(() => JSON.stringify(st), [st]);
  const hasUnsavedChanges = lastExportJson !== null && currentJson !== lastExportJson;

  const handleExport = useCallback(async () => {
    if (exporting) return;
    setExporting(true);
    try {
      await exportPDF(visiblePagesRef.current, st.clientName, lang);
      setLastExportJson(JSON.stringify(st));
      showToast(`✓ ${t(lang, 'app.toastExported')}`);
    } finally {
      setExporting(false);
    }
  }, [exporting, st, showToast, lang]);

  /* ── Sidebar resize drag ─────────────────────────── */
  const onDragStart = useCallback((e) => {
    e.preventDefault();
    dragging.current = true;
    const move = (ev) => {
      if (!dragging.current) return;
      const x = ev.clientX;
      setSidebarW(Math.max(280, Math.min(560, x)));
    };
    const up = () => {
      dragging.current = false;
      window.removeEventListener('mousemove', move);
      window.removeEventListener('mouseup', up);
    };
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
    const id = setTimeout(calcZoom, 250);
    return () => clearTimeout(id);
  }, [collapsed, calcZoom]);

  const handleTypeChange = useCallback(
    (type) => {
      dispatch({ t: 'SET', k: 'proposalType', v: type });
      setTab('client');
    },
    [dispatch]
  );
  const handleReset = useCallback(() => {
    if (window.confirm(t(lang, 'app.resetConfirm'))) {
      dispatch({ t: 'RESET' });
      clearState();
      setTab('client');
      setLastExportJson(null);
      showToast(`✓ ${t(lang, 'app.toastReset')}`);
    }
  }, [dispatch, lang, showToast]);

  const pType = st.proposalType;
  const isLeads = pType === 'leads';
  const isCombo = pType === 'combo';
  const tabsDef = isCombo ? TABS_COMBO : isLeads ? TABS_LEADS : TABS_WL;

  /* ── Tab labels via i18n ─────────────────────────── */
  const tabLabels = useMemo(
    () => ({
      client: t(lang, 'tabs.client'),
      content: t(lang, 'tabs.content'),
      pricing: t(lang, 'tabs.pricing'),
      leadsP: t(lang, 'tabs.leadsPricing'),
      pages: t(lang, 'tabs.pages'),
      style: t(lang, 'tabs.style'),
      save: t(lang, 'tabs.save'),
    }),
    [lang]
  );

  /* ── Completion estimation per tab (for the dot badge) ── */
  const tabCompletion = useMemo(() => {
    const safe = (v) => (v && String(v).trim() !== '' ? 1 : 0);
    const clientFilled = safe(st.clientName);
    const contentFilled =
      safe(st.coverLine1) +
      safe(st.productTitle) +
      safe(st.steps?.[0]?.title) +
      safe(st.steps?.[1]?.title) +
      safe(st.steps?.[2]?.title);
    const pricingFilled = (st.pricingPlans || []).filter((p) => p.title && p.price).length;
    return {
      client: clientFilled ? 1 : 0,
      content: contentFilled >= 4 ? 1 : contentFilled >= 1 ? 0.5 : 0,
      pricing: pricingFilled >= 3 ? 1 : pricingFilled >= 1 ? 0.5 : 0,
      leadsP: 0.5,
      style: 0.5,
      save: 1,
    };
  }, [st]);

  const completedFields = useMemo(() => {
    let n = 0;
    if (st.clientName) n++;
    if (st.coverLine1) n++;
    if (st.productTitle) n++;
    if (st.date) n++;
    if (st.clientLogoUrl) n++;
    if (st.ccLogoUrl) n++;
    if (st.steps?.[0]?.title) n++;
    if (st.steps?.[1]?.title) n++;
    if (st.steps?.[2]?.title) n++;
    if ((st.pricingPlans || []).filter((p) => p.title).length >= 3) n++;
    if (st.brandNavy && st.brandBlue) n++;
    return n;
  }, [st]);
  const totalFields = 12;

  /* ── Dynamic page numbering ──────────────────────── */
  const allPageDefs = useMemo(() => {
    const whyCC = {
      id: 'whyCC',
      baseLabel: t(lang, 'pageTitles.whyCC'),
      gen: (n) => genWhyCC(st, n),
    };
    const closing = {
      id: 'close',
      baseLabel: t(lang, 'pageTitles.close'),
      gen: (n) => genClose(st, n),
    };
    if (pType === 'combo') {
      return [
        { id: 'cover', baseLabel: t(lang, 'pageTitles.cover'), gen: () => genPage1(st) },
        whyCC,
        { id: 'how', baseLabel: t(lang, 'pageTitles.howItWorks'), gen: (n) => genPage2(st, n) },
        { id: 'pricing', baseLabel: t(lang, 'pageTitles.wlPricing'), gen: (n) => genPage3(st, n) },
        {
          id: 'overview',
          baseLabel: t(lang, 'pageTitles.leadsOverview'),
          gen: (n) => genLeadsOverview(st, n),
        },
        { id: 'cpl', baseLabel: t(lang, 'pageTitles.cplModel'), gen: (n) => genLeadsCPL(st, n) },
        { id: 'cpa', baseLabel: t(lang, 'pageTitles.cpaModel'), gen: (n) => genLeadsCPA(st, n) },
        {
          id: 'hybrid',
          baseLabel: t(lang, 'pageTitles.hybridModel'),
          gen: (n) => genLeadsHybrid(st, n),
        },
        closing,
      ];
    }
    if (pType === 'leads') {
      return [
        { id: 'cover', baseLabel: t(lang, 'pageTitles.cover'), gen: () => genPage1(st) },
        whyCC,
        {
          id: 'overview',
          baseLabel: t(lang, 'pageTitles.overview'),
          gen: (n) => genLeadsOverview(st, n),
        },
        { id: 'cpl', baseLabel: t(lang, 'pageTitles.cplModel'), gen: (n) => genLeadsCPL(st, n) },
        { id: 'cpa', baseLabel: t(lang, 'pageTitles.cpaModel'), gen: (n) => genLeadsCPA(st, n) },
        {
          id: 'hybrid',
          baseLabel: t(lang, 'pageTitles.hybridModel'),
          gen: (n) => genLeadsHybrid(st, n),
        },
        closing,
      ];
    }
    return [
      { id: 'cover', baseLabel: t(lang, 'pageTitles.cover'), gen: () => genPage1(st) },
      whyCC,
      { id: 'how', baseLabel: t(lang, 'pageTitles.howItWorks'), gen: (n) => genPage2(st, n) },
      { id: 'pricing', baseLabel: t(lang, 'pageTitles.pricing'), gen: (n) => genPage3(st, n) },
      closing,
    ];
  }, [st, pType, lang]);

  const allPages = useMemo(() => {
    let idx = 0;
    return allPageDefs.map((p) => {
      if (p.id === 'cover') return { id: p.id, label: p.baseLabel, html: p.gen() };
      idx++;
      const num = String(idx).padStart(2, '0');
      return {
        id: p.id,
        label: `${lang === 'en' ? 'Pg.' : 'Pag.'} ${idx + 1} — ${p.baseLabel}`,
        html: p.gen(num),
      };
    });
  }, [allPageDefs, lang]);

  const visiblePages = useMemo(() => {
    const hidden = new Set(st.hiddenPages || []);
    const visDefs = allPageDefs.filter((p) => !hidden.has(p.id));
    let contentIdx = 0;
    return visDefs.map((p) => {
      if (p.id === 'cover') return { id: p.id, label: t(lang, 'pageTitles.cover'), html: p.gen() };
      contentIdx++;
      const num = String(contentIdx).padStart(2, '0');
      return {
        id: p.id,
        label: `${lang === 'en' ? 'Pg.' : 'Pag.'} ${contentIdx + 1} — ${p.baseLabel}`,
        html: p.gen(num),
      };
    });
  }, [allPageDefs, st.hiddenPages, lang]);

  const visiblePagesRef = useRef(visiblePages);
  visiblePagesRef.current = visiblePages;

  /* ── Keyboard shortcuts ─────────────────────────── */
  useShortcuts(
    [
      {
        combo: 'mod+z',
        handler: () => {
          if (canUndo) {
            undo();
            showToast(`↶ ${t(lang, 'app.toastUndo')}`);
          }
        },
      },
      {
        combo: ['mod+shift+z', 'mod+y'],
        handler: () => {
          if (canRedo) {
            redo();
            showToast(`↻ ${t(lang, 'app.toastRedo')}`);
          }
        },
      },
      { combo: 'mod+e', handler: () => handleExport() },
      { combo: 'mod+k', handler: () => setCmdOpen(true), allowInInputs: true },
      { combo: 'mod+/', handler: () => setShortcutsOpen(true), allowInInputs: true },
      {
        combo: 'escape',
        handler: () => {
          setCmdOpen(false);
          setShortcutsOpen(false);
        },
        allowInInputs: true,
      },
    ],
    [canUndo, canRedo, undo, redo, handleExport, lang]
  );

  /* ── Command palette commands ───────────────────── */
  const commands = useMemo(() => {
    const items = [];
    items.push(
      {
        id: 'export',
        label: t(lang, 'app.exportPdf'),
        icon: 'download',
        section: 'Actions',
        combo: 'mod+e',
        run: () => handleExport(),
      },
      {
        id: 'undo',
        label: t(lang, 'app.undo'),
        icon: 'arrowRight',
        section: 'Actions',
        combo: 'mod+z',
        run: () => canUndo && undo(),
      },
      {
        id: 'redo',
        label: t(lang, 'app.redo'),
        icon: 'arrowRight',
        section: 'Actions',
        combo: 'mod+shift+z',
        run: () => canRedo && redo(),
      },
      {
        id: 'reset',
        label: t(lang, 'app.reset'),
        icon: 'xCircle',
        section: 'Actions',
        run: () => handleReset(),
      },
      {
        id: 'shortcuts',
        label: t(lang, 'app.keyboardShortcuts'),
        icon: 'key',
        section: 'Help',
        combo: 'mod+/',
        run: () => setShortcutsOpen(true),
      },
      {
        id: 'collapse',
        label: collapsed ? t(lang, 'app.openPanel') : t(lang, 'app.collapse'),
        icon: 'arrowRight',
        section: 'View',
        run: () => setCollapsed((c) => !c),
      }
    );
    tabsDef.forEach((id) => {
      items.push({
        id: `goto-${id}`,
        label: `${t(lang, 'shared.search')}: ${tabLabels[id]}`,
        icon: 'fileSearch',
        section: 'Navigate',
        run: () => switchTab(id),
      });
    });
    listLocales().forEach((loc) => {
      items.push({
        id: `lang-${loc.code}`,
        label: `${loc.flag} ${loc.nativeName}`,
        icon: 'globe',
        section: t(lang, 'languageLabel'),
        run: () => dispatch({ t: 'LOCALIZE_TEMPLATE', v: loc.code }),
      });
    });
    return items;
  }, [
    lang,
    tabsDef,
    tabLabels,
    collapsed,
    canUndo,
    canRedo,
    undo,
    redo,
    handleExport,
    handleReset,
    dispatch,
    switchTab,
  ]);

  /* ── Shortcuts list (for help modal) ─────────────── */
  const shortcutsList = useMemo(
    () => [
      { label: t(lang, 'app.exportPdf'), combo: 'mod+e' },
      { label: t(lang, 'app.undo'), combo: 'mod+z' },
      { label: t(lang, 'app.redo'), combo: ['mod+shift+z', 'mod+y'] },
      { label: t(lang, 'app.commandPalette'), combo: 'mod+k' },
      { label: t(lang, 'app.keyboardShortcuts'), combo: 'mod+/' },
    ],
    [lang]
  );

  const proposalTypeLabels = {
    wl: t(lang, 'proposalType.wl'),
    leads: t(lang, 'proposalType.leads'),
    combo: t(lang, 'proposalType.combo'),
  };
  const currentTypeLabel = isCombo
    ? proposalTypeLabels.combo
    : isLeads
      ? proposalTypeLabels.leads
      : proposalTypeLabels.wl;

  return (
    <>
      {collapsed && (
        <button
          className="ed-open-btn"
          title={t(lang, 'app.openPanel')}
          onClick={() => setCollapsed(false)}
          dangerouslySetInnerHTML={{ __html: svgIcon('arrowRight', { size: 18, color: '#fff' }) }}
        />
      )}
      {toast && (
        <div className="ed-toast" key={toast + Date.now()}>
          {toast}
        </div>
      )}

      <EditorShell
        appTitle={t(lang, 'app.title')}
        proposalTypeLabel={currentTypeLabel}
        proposalName={st.clientName}
        lang={lang}
        onLangChange={(v) => dispatch({ t: 'LOCALIZE_TEMPLATE', v })}
        proposalType={pType}
        onProposalTypeChange={handleTypeChange}
        proposalTypeLabels={proposalTypeLabels}
        tab={tab}
        setTab={switchTab}
        tabsDef={tabsDef}
        tabLabels={tabLabels}
        tabCompletion={tabCompletion}
        onCommandPalette={() => setCmdOpen(true)}
        onShortcuts={() => setShortcutsOpen(true)}
        saveStatus={saveStatus}
        saveLabel={
          saveStatus === 'saving'
            ? t(lang, 'app.saving')
            : hasUnsavedChanges
              ? t(lang, 'app.unsaved')
              : t(lang, 'app.saved')
        }
        canUndo={canUndo}
        canRedo={canRedo}
        onUndo={() => {
          if (canUndo) {
            undo();
            showToast(`↶ ${t(lang, 'app.toastUndo')}`);
          }
        }}
        onRedo={() => {
          if (canRedo) {
            redo();
            showToast(`↻ ${t(lang, 'app.toastRedo')}`);
          }
        }}
        zoom={zoom}
        onZoomChange={(v) => {
          setAutoFit(false);
          setZoom(v);
        }}
        autoFit={autoFit}
        onFit={() => {
          setAutoFit(true);
          calcZoom();
        }}
        onExport={handleExport}
        exporting={exporting}
        exportLabel={t(lang, 'app.exportPdf')}
        generatingLabel={t(lang, 'app.generating')}
        ctrlEHint={t(lang, 'app.downloadsAsPdf')}
        hasUnsavedChanges={hasUnsavedChanges}
        onReset={handleReset}
        resetLabel={t(lang, 'app.reset')}
        completedFields={completedFields}
        totalFields={totalFields}
        collapsed={collapsed}
        onCollapse={() => setCollapsed(true)}
        width={sidebarW}
        searchPlaceholder={t(lang, 'app.searchPlaceholder', { shortcut: 'Ctrl+K' })}
      >
        <div ref={formRef} key={tab}>
          {tab === 'client' && <ClientTab st={st} dispatch={dispatch} t={(k) => t(lang, k)} />}
          {tab === 'content' &&
            (isLeads ? (
              <LeadsContentTab st={st} dispatch={dispatch} t={(k) => t(lang, k)} />
            ) : (
              <ContentTab st={st} dispatch={dispatch} t={(k) => t(lang, k)} />
            ))}
          {tab === 'pricing' &&
            (isLeads ? (
              <LeadsPricingTab st={st} dispatch={dispatch} t={(k) => t(lang, k)} />
            ) : (
              <PricingTab st={st} dispatch={dispatch} t={(k) => t(lang, k)} />
            ))}
          {tab === 'leadsP' && (
            <LeadsPricingTab st={st} dispatch={dispatch} t={(k) => t(lang, k)} />
          )}
          {tab === 'pages' && <PagesTab st={st} dispatch={dispatch} t={(k) => t(lang, k)} />}
          {tab === 'style' && (
            <StyleTab st={st} dispatch={dispatch} allPages={allPages} t={(k) => t(lang, k)} />
          )}
          {tab === 'save' && (
            <ProposalManager
              st={st}
              dispatch={dispatch}
              showToast={showToast}
              t={(k) => t(lang, k)}
            />
          )}
        </div>
      </EditorShell>

      {!collapsed && <div className="ed-resize" onMouseDown={onDragStart} />}

      <div id="right" ref={rightRef}>
        <div id="preview-label">{t(lang, 'app.preview')}</div>
        <div id="pages">
          {visiblePages.map((p) => (
            <PageCard key={p.id} label={p.label} html={p.html} zoom={zoom} />
          ))}
        </div>
      </div>

      <CommandPalette
        open={cmdOpen}
        onClose={() => setCmdOpen(false)}
        commands={commands}
        placeholder={t(lang, 'app.searchPlaceholder', { shortcut: 'Ctrl+K' })}
      />
      <ShortcutsHelp
        open={shortcutsOpen}
        onClose={() => setShortcutsOpen(false)}
        shortcuts={shortcutsList}
        title={t(lang, 'app.keyboardShortcuts')}
      />
    </>
  );
}

export default App;
