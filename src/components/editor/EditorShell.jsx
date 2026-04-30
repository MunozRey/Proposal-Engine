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
  pages: 'badgeCheck',
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
  exporting,
  exportLabel,
  hasUnsavedChanges,
  onReset,
  resetLabel,
  generatingLabel,
  ctrlEHint,
  totalFields,
  completedFields,
  // Collapse
  collapsed,
  onCollapse,
  width,
  // Locale
  searchPlaceholder,
}) {
  const cmdHint = formatCombo('mod+k');
  const localeMenuRef = useRef(null);
  const [localeMenuOpen, setLocaleMenuOpen] = useState(false);

  const closeMenu = useCallback(() => setLocaleMenuOpen(false), []);

  return (
    <div
      id="ed-shell"
      className={collapsed ? 'ed-collapsed' : ''}
      style={collapsed ? {} : { width, minWidth: width }}
    >
      <div className="ed-topbar">
        <div className="ed-topbar-brand">
          <div className="ed-topbar-logo">CC</div>
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
          <IconButton
            iconName="undo"
            title={`Undo ${formatCombo('mod+z')}`}
            onClick={onUndo}
            disabled={!canUndo}
            size={14}
          />
          <IconButton
            iconName="redo"
            title={`Redo ${formatCombo('mod+shift+z')}`}
            onClick={onRedo}
            disabled={!canRedo}
            size={14}
          />
          <IconButton
            iconName="key"
            title={`Shortcuts ${formatCombo('mod+/')}`}
            onClick={onShortcuts}
            size={14}
          />
          <div style={{ position: 'relative' }} ref={localeMenuRef}>
            <IconButton
              iconName="globe"
              title="Language"
              onClick={() => (onSettings ? onSettings() : setLocaleMenuOpen((v) => !v))}
              size={14}
            />
          </div>
          <IconButton iconName="panelLeft" title="Collapse panel" onClick={onCollapse} size={14} />
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
          return (
            <button
              key={id}
              type="button"
              className={`ed-tab${isActive ? ' ed-active' : ''}`}
              onClick={() => setTab(id)}
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
                />
              )}
            </button>
          );
        })}
      </div>

      <div className="ed-body">{children}</div>

      <div className="ed-bottombar">
        <CompletionMeter value={completedFields} total={totalFields} />
        <div className="ed-zoom-row">
          <span dangerouslySetInnerHTML={{ __html: svgIcon('lineChart', { size: 12 }) }} />
          <input
            type="range"
            min="0.25"
            max="1.5"
            step="0.01"
            value={zoom}
            onChange={(e) => onZoomChange(parseFloat(e.target.value))}
          />
          <span className="ed-zoom-pct">{Math.round(zoom * 100)}%</span>
          <button
            type="button"
            className={`ed-fit-btn${autoFit ? ' ed-active' : ''}`}
            onClick={onFit}
          >
            Fit
          </button>
        </div>
        <button
          type="button"
          className={`ed-export-btn${hasUnsavedChanges ? ' ed-has-changes' : ''}`}
          disabled={exporting}
          onClick={onExport}
        >
          <span
            dangerouslySetInnerHTML={{
              __html: svgIcon('download', { size: 16, color: '#fff' }),
            }}
          />
          {exporting ? generatingLabel : exportLabel}
        </button>
        <div className="ed-bottombar-meta">
          <span>
            <span className="ed-kbd">{formatCombo('mod+e')}</span> {ctrlEHint}
          </span>
          <button
            type="button"
            className="ed-btn ed-btn-ghost ed-btn-sm"
            onClick={onReset}
            style={{ color: 'var(--ed-danger)' }}
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
      if (!e.target.closest('.ed-menu') && !e.target.closest('[title="Language"]')) {
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
    <div className="ed-menu" style={{ top: 50, right: 12, minWidth: 200 }}>
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
