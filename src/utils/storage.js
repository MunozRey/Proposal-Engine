const STORAGE_KEY = 'creditcheck_proposal_state';

/** Load saved state from localStorage, returns null if nothing saved */
export function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

/** Save state to localStorage */
export function saveState(state) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // localStorage full or unavailable — silently ignore
  }
}

/** Clear saved state */
export function clearState() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignore
  }
}

/** Debounced save — returns a function that saves after `ms` idle time */
export function createDebouncedSave(ms = 500) {
  let timer = null;
  return (state) => {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => saveState(state), ms);
  };
}
