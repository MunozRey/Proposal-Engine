import { formatCombo } from '../../hooks/useShortcuts.js';
import { IconButton } from './IconButton.jsx';

export function ShortcutsHelp({ open, onClose, shortcuts, title = 'Keyboard shortcuts' }) {
  if (!open) return null;
  return (
    <div className="ed-cmdk-backdrop" onMouseDown={onClose}>
      <div className="ed-shortcuts" onMouseDown={(e) => e.stopPropagation()}>
        <div className="ed-shortcuts-head">
          <h3>{title}</h3>
          <IconButton iconName="xCircle" title="Close" onClick={onClose} />
        </div>
        <div className="ed-shortcuts-list">
          {shortcuts.map((s) => (
            <div key={s.label} className="ed-shortcuts-row">
              <span style={{ color: 'var(--ed-text-muted)' }}>{s.label}</span>
              <div className="ed-shortcuts-keys">
                {(Array.isArray(s.combo) ? s.combo : [s.combo]).map((c) => (
                  <span key={c} className="ed-kbd">
                    {formatCombo(c)}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
