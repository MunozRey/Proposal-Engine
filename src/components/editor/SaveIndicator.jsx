export function SaveIndicator({ status, label }) {
  // status: 'saved' | 'saving' | 'unsaved'
  return (
    <span className={`ed-save-state ed-${status}`} title={label}>
      <span className="ed-save-dot" />
      <span>{label}</span>
    </span>
  );
}
