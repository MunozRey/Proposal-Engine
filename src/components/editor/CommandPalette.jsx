import { useState, useEffect, useMemo, useRef } from 'react';
import { icon as svgIcon } from '../../design/icons.js';
import { formatCombo } from '../../hooks/useShortcuts.js';

/**
 * Generic command palette (Ctrl/Cmd+K).
 *
 * commands: Array<{
 *   id, label, hint?, icon?, section?, combo?, run: () => void, keywords?: string
 * }>
 */
export function CommandPalette(props) {
  if (!props.open) return null;
  // Remount on each opening so internal state resets cleanly without a useEffect.
  return <PaletteBody key={props.open ? 'on' : 'off'} {...props} />;
}

function PaletteBody({ onClose, commands, placeholder = 'Type a command…' }) {
  const [query, setQuery] = useState('');
  const [activeIdx, setActiveIdx] = useState(0);
  const inputRef = useRef(null);
  const listRef = useRef(null);

  useEffect(() => {
    const id = requestAnimationFrame(() => inputRef.current?.focus());
    return () => cancelAnimationFrame(id);
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return commands;
    return commands.filter((c) => {
      const hay = `${c.label} ${c.keywords || ''} ${c.section || ''}`.toLowerCase();
      return hay.includes(q);
    });
  }, [query, commands]);

  const grouped = useMemo(() => {
    const map = new Map();
    for (const c of filtered) {
      const key = c.section || 'General';
      if (!map.has(key)) map.set(key, []);
      map.get(key).push(c);
    }
    return [...map.entries()];
  }, [filtered]);

  // Derive a clamped index during render so the list doesn't blow up when filtering shrinks it.
  const idx = activeIdx >= filtered.length ? 0 : activeIdx;
  const activeId = filtered[idx]?.id;

  // Scroll active into view
  useEffect(() => {
    if (!listRef.current) return;
    const el = listRef.current.querySelector(`[data-cmd-id="${activeId}"]`);
    el?.scrollIntoView({ block: 'nearest' });
  }, [activeId]);

  const onKey = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIdx((i) => (i + 1) % Math.max(1, filtered.length));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIdx((i) => (i - 1 + Math.max(1, filtered.length)) % Math.max(1, filtered.length));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const cmd = filtered[idx];
      if (cmd) {
        cmd.run();
        onClose();
      }
    } else if (e.key === 'Escape') {
      e.preventDefault();
      onClose();
    }
  };

  return (
    <div className="ed-cmdk-backdrop" onMouseDown={onClose}>
      <div className="ed-cmdk" onMouseDown={(e) => e.stopPropagation()} onKeyDown={onKey}>
        <div className="ed-cmdk-input-wrap">
          <span dangerouslySetInnerHTML={{ __html: svgIcon('fileSearch', { size: 18 }) }} />
          <input
            ref={inputRef}
            className="ed-cmdk-input"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setActiveIdx(0);
            }}
            placeholder={placeholder}
          />
          <span className="ed-kbd">ESC</span>
        </div>
        <div className="ed-cmdk-list" ref={listRef}>
          {filtered.length === 0 && <div className="ed-cmdk-empty">No results</div>}
          {grouped.map(([section, items]) => (
            <div key={section}>
              <div className="ed-cmdk-section-label">{section}</div>
              {items.map((c) => (
                <div
                  key={c.id}
                  data-cmd-id={c.id}
                  className={`ed-cmdk-item${c.id === activeId ? ' ed-active' : ''}`}
                  onMouseEnter={() => setActiveIdx(filtered.findIndex((x) => x.id === c.id))}
                  onClick={() => {
                    c.run();
                    onClose();
                  }}
                >
                  <span
                    className="ed-cmdk-item-icon"
                    dangerouslySetInnerHTML={{
                      __html: svgIcon(c.icon || 'arrowRight', { size: 16 }),
                    }}
                  />
                  <span className="ed-cmdk-item-label">{c.label}</span>
                  {c.combo && <span className="ed-cmdk-item-hint">{formatCombo(c.combo)}</span>}
                  {!c.combo && c.hint && <span className="ed-cmdk-item-hint">{c.hint}</span>}
                </div>
              ))}
            </div>
          ))}
        </div>
        <div className="ed-cmdk-foot">
          <span className="ed-kbd">↑↓</span>
          <span>Navigate</span>
          <span className="ed-kbd">↵</span>
          <span>Run</span>
          <span style={{ marginLeft: 'auto' }}>{filtered.length} commands</span>
        </div>
      </div>
    </div>
  );
}
