import { useEffect } from 'react';

const isMac =
  typeof navigator !== 'undefined' &&
  /Mac|iPhone|iPad|iPod/.test(navigator.platform || navigator.userAgent || '');

/** Match a single combo string against an event. Combo format: "mod+k", "mod+shift+z". */
function matches(event, combo) {
  if (!combo) return false;
  const parts = combo
    .toLowerCase()
    .split('+')
    .map((p) => p.trim());
  const key = parts[parts.length - 1];
  const mods = new Set(parts.slice(0, -1));
  const ctrl = isMac ? event.metaKey : event.ctrlKey;
  if (mods.has('mod') && !ctrl) return false;
  if (mods.has('shift') && !event.shiftKey) return false;
  if (mods.has('alt') && !event.altKey) return false;
  if (!mods.has('shift') && event.shiftKey) return false;
  // ignore alt/ctrl mismatches when not requested
  if (!mods.has('mod') && ctrl) return false;
  return event.key.toLowerCase() === key;
}

function shouldIgnore(target) {
  if (!target) return false;
  const tag = (target.tagName || '').toLowerCase();
  if (tag === 'input' || tag === 'textarea' || tag === 'select') return true;
  if (target.isContentEditable) return true;
  return false;
}

/**
 * Register a list of shortcuts.
 * @param {Array<{combo: string|string[], handler: (e: KeyboardEvent) => void, allowInInputs?: boolean, description?: string}>} shortcuts
 * @param {Array} deps
 */
export function useShortcuts(shortcuts, deps = []) {
  useEffect(() => {
    const onKey = (e) => {
      for (const s of shortcuts) {
        const combos = Array.isArray(s.combo) ? s.combo : [s.combo];
        for (const combo of combos) {
          if (!matches(e, combo)) continue;
          if (!s.allowInInputs && shouldIgnore(e.target)) continue;
          e.preventDefault();
          s.handler(e);
          return;
        }
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}

export const MOD = isMac ? '⌘' : 'Ctrl';
export const SHIFT = isMac ? '⇧' : 'Shift';
export const ALT = isMac ? '⌥' : 'Alt';

export function formatCombo(combo) {
  return combo
    .split('+')
    .map((p) => {
      const k = p.trim().toLowerCase();
      if (k === 'mod') return MOD;
      if (k === 'shift') return SHIFT;
      if (k === 'alt') return ALT;
      if (k.length === 1) return k.toUpperCase();
      return k.charAt(0).toUpperCase() + k.slice(1);
    })
    .join(isMac ? '' : '+');
}
