import { useState, useRef, useCallback, useEffect } from 'react';
import { icon as svgIcon } from '../../design/icons.js';
import { listLocales } from '../../i18n/translate.js';
import { IconButton } from './IconButton.jsx';
import { SaveIndicator } from './SaveIndicator.jsx';
import { CompletionMeter } from './CompletionMeter.jsx';
import { formatCombo } from '../../hooks/useShortcuts.js';

const SECTION_ICONS = {
  client: 'landmark',
  content: 'fileSearch',
  pricing: 'lineChart',
  leadsP: 'lineChart',
  style: 'sparkles',
  save: 'download',
};

export function EditorShell({
  // Branding
  appTitle,
  proposalTypeLabel,
  proposalName,
  // Lang
  lang,
  onLangChange,
  // Type selector
  proposalType,
  onProposalTypeChange,
  proposalTypeLabels,
  // Tabs
  tab,
  setTab,
  tabsDef,
  tabLabels,
  tabCompletion = {},
  // Sections (tab content)
  children,
  // Top bar actions
  onCommandPalette,
  onShortcuts,
  onSettings,
  saveStatus,
  saveLabel,
  // Undo / Redo
  canUndo,
  canRedo,
  onUndo,
  onRedo,
  // Bottom bar
  zoom,
  onZoomChange,
  autoFit,
  onFit,
  onExport,
  onExportHtml,
  onExportDocx,
  onPrint,
  exporting,
  exportingHtml,
  exportingDocx,
  exportLabel,
  exportHtmlLabel,
  exportDocxLabel,
  printLabel,
  hasUnsavedChanges,
  onReset,
  resetLabel,
  generatingLabel,
  generatingHtmlLabel,
  generatingDocxLabel,
  totalFields,
  completedFields,
  // Bottom bar section labels
  progressLabel = 'Progreso',
  fieldsLabel = 'campos',
  zoomLabel = 'Zoom',
  autoFitLabel = 'Auto',
  manualLabel = 'Manual',
  autoFitHint,
  exportSectionLabel = 'Exportar',
  unsavedHint,
  completeStatusLabel = 'Completado',
  partialStatusLabel = 'En progreso',
  emptyStatusLabel = 'Sin rellenar',
  // Collapse
  collapsed,
  onCollapse,
  width,
  // Locale
  searchPlaceholder,
  undoTitle,
  redoTitle,
  shortcutsTitle,
  languageTitle,
  collapseTitle,
  fitLabel,
}) {
  const cmdHint = formatCombo('mod+k');
  const localeMenuRef = useRef(null);
  const [localeMenuOpen, setLocaleMenuOpen] = useState(false);

  const closeMenu = useCallback(() => setLocaleMenuOpen(false), []);

  return (
    <div
      id="ed-shell"
      className={collapsed ? 'ed-collapsed' : ''}
      style={collapsed ? {} : { width, minWidth: width, maxWidth: width }}
    >
      <div className="ed-topbar">
        <div className="ed-topbar-brand">
          <img
            className="ed-topbar-logo"
            src="/proposal-engine-logo.svg"
            alt="Proposal Engine"
            width="28"
            height="28"
          />
          <div className="ed-topbar-title">
            <span className="ed-app-name">{appTitle}</span>
            <span className="ed-app-tag">
              {proposalTypeLabel}
              {proposalName ? ` · ${proposalName}` : ''}
            </span>
          </div>
        </div>
        <div className="ed-topbar-actions">
          <SaveIndicator status={saveStatus} label={saveLabel} />
          <span className="ed-topbar-divider" aria-hidden="true" />
          <IconButton
            iconName="undo"
            title={`${undoTitle} (${formatCombo('mod+z')})`}
            onClick={onUndo}
            disabled={!canUndo}
            size={14}
          />
          <IconButton
            iconName="redo"
            title={`${redoTitle} (${formatCombo('mod+shift+z')})`}
            onClick={onRedo}
            disabled={!canRedo}
            size={14}
          />
          <span className="ed-topbar-divider" aria-hidden="true" />
          <IconButton
            iconName="key"
            title={`${shortcutsTitle} (${formatCombo('mod+/')})`}
            onClick={onShortcuts}
            size={14}
          />
          <div style={{ position: 'relative' }} ref={localeMenuRef}>
            <IconButton
              iconName="globe"
              title={languageTitle}
              onClick={() => (onSettings ? onSettings() : setLocaleMenuOpen((v) => !v))}
              size={14}
              data-locale-trigger="true"
            />
          </div>
          <IconButton iconName="panelLeft" title={collapseTitle} onClick={onCollapse} size={14} />
        </div>
      </div>

      <button className="ed-search" onClick={onCommandPalette} type="button">
        <span dangerouslySetInnerHTML={{ __html: svgIcon('search', { size: 14 }) }} />
        <span>{searchPlaceholder}</span>
        <span className="ed-search-kbd">{cmdHint}</span>
      </button>

      <div className="ed-segmented">
        {Object.entries(proposalTypeLabels).map(([key, label]) => (
          <button
            key={key}
            type="button"
            className={`ed-segmented-btn${proposalType === key ? ' ed-active' : ''}`}
            onClick={() => onProposalTypeChange(key)}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="ed-tabs" style={{ gridTemplateColumns: `repeat(${tabsDef.length}, 1fr)` }}>
        {tabsDef.map((id) => {
          const completion = tabCompletion[id];
          const isActive = tab === id;
          const progressTitle =
            completion === 1
              ? completeStatusLabel
              : completion === 0
                ? emptyStatusLabel
                : partialStatusLabel;
          return (
            <button
              key={id}
              type="button"
              className={`ed-tab${isActive ? ' ed-active' : ''}`}
              onClick={() => setTab(id)}
              title={`${tabLabels[id]} · ${progressTitle}`}
            >
              <span
                dangerouslySetInnerHTML={{
                  __html: svgIcon(SECTION_ICONS[id] || 'fileSearch', {
                    size: 16,
                    color: isActive ? 'currentColor' : 'currentColor',
                  }),
                }}
              />
              <span>{tabLabels[id]}</span>
              {completion !== undefined && (
                <span
                  className={`ed-tab-progress ${
                    completion === 1 ? 'ed-complete' : completion === 0 ? 'ed-empty' : ''
                  }`}
                  aria-label={progressTitle}
                />
              )}
            </button>
          );
        })}
      </div>

      <div className="ed-body">{children}</div>

      <div className="ed-bottombar">
        <div className="ed-bb-section">
          <div className="ed-bb-label">
            <span>{progressLabel}</span>
            <span className="ed-bb-label-help">
              {completedFields} / {totalFields} {fieldsLabel}
            </span>
          </div>
          <CompletionMeter value={completedFields} total={totalFields} />
        </div>

        <div className="ed-bb-section">
          <div className="ed-bb-label">
            <span>{zoomLabel}</span>
            <span className="ed-bb-label-help">{autoFit ? autoFitLabel : manualLabel}</span>
          </div>
          <div className="ed-zoom-row">
            <input
              type="range"
              min="0.25"
              max="1.5"
              step="0.01"
              value={zoom}
              onChange={(e) => onZoomChange(parseFloat(e.target.value))}
              aria-label={zoomLabel}
            />
            <span className="ed-zoom-pct">{Math.round(zoom * 100)}%</span>
            <button
              type="button"
              className={`ed-fit-btn${autoFit ? ' ed-active' : ''}`}
              onClick={onFit}
              title={autoFitHint}
            >
              {fitLabel}
            </button>
          </div>
        </div>

        <div className="ed-bb-section">
          <div className="ed-bb-label">
            <span>{exportSectionLabel}</span>
            {hasUnsavedChanges && (
              <span className="ed-bb-label-help" style={{ color: 'var(--ed-warning-deep)' }}>
                {unsavedHint}
              </span>
            )}
          </div>
          <div className="ed-export-grid">
            <button
              type="button"
              className={`ed-export-btn${hasUnsavedChanges ? ' ed-has-changes' : ''}`}
              disabled={exporting}
              onClick={onExport}
              title={`${exportLabel} · ${formatCombo('mod+e')}`}
            >
              <span
                dangerouslySetInnerHTML={{
                  __html: svgIcon('download', { size: 16, color: '#fff' }),
                }}
              />
              {exporting ? generatingLabel : exportLabel}
            </button>
            <button
              type="button"
              className="ed-export-btn ed-export-btn-alt"
              disabled={exportingHtml}
              onClick={onExportHtml}
              title={`${exportHtmlLabel} · ${formatCombo('mod+shift+e')}`}
            >
              {exportingHtml ? generatingHtmlLabel : exportHtmlLabel}
            </button>
            <button
              type="button"
              className="ed-export-btn ed-export-btn-alt"
              disabled={exportingDocx}
              onClick={onExportDocx}
              title={`${exportDocxLabel} · ${formatCombo('mod+alt+e')}`}
            >
              {exportingDocx ? generatingDocxLabel : exportDocxLabel}
            </button>
            <button
              type="button"
              className="ed-export-btn ed-export-btn-alt"
              onClick={onPrint}
              title={`${printLabel} · ${formatCombo('mod+p')}`}
            >
              {printLabel}
            </button>
          </div>
        </div>

        <div className="ed-bottombar-meta">
          <button
            type="button"
            className="ed-bottombar-meta-shortcuts"
            onClick={onShortcuts}
            title={shortcutsTitle}
            style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: 0 }}
          >
            <span className="ed-kbd">{formatCombo('mod+/')}</span>
            <span>{shortcutsTitle}</span>
          </button>
          <button
            type="button"
            className="ed-btn ed-btn-ghost ed-btn-sm"
            onClick={onReset}
            style={{ color: 'var(--ed-danger-deep)' }}
            title={resetLabel}
          >
            ↺ {resetLabel}
          </button>
        </div>
      </div>

      <LocaleMenu
        open={localeMenuOpen}
        onClose={closeMenu}
        lang={lang}
        onLangChange={(v) => {
          onLangChange(v);
          closeMenu();
        }}
      />
    </div>
  );
}

function LocaleMenu({ open, onClose, lang, onLangChange }) {
  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    const onClick = (e) => {
      if (!e.target.closest('.ed-menu') && !e.target.closest('[data-locale-trigger="true"]')) {
        onClose();
      }
    };
    window.addEventListener('keydown', onKey);
    window.addEventListener('mousedown', onClick);
    return () => {
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('mousedown', onClick);
    };
  }, [open, onClose]);

  if (!open) return null;
  return (
    <div className="ed-menu" style={{ top: 50, right: 12, minWidth: 200 }} data-locale-menu="true">
      {listLocales().map((loc) => (
        <button
          key={loc.code}
          type="button"
          className="ed-menu-item"
          onClick={() => onLangChange(loc.code)}
          style={{ fontWeight: loc.code === lang ? 700 : 500 }}
        >
          <span style={{ fontSize: 14 }}>{loc.flag}</span>
          <span>{loc.nativeName}</span>
          {loc.code === lang && <span style={{ marginLeft: 'auto' }}>✓</span>}
        </button>
      ))}
    </div>
  );
}
