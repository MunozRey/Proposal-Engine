export function CompletionMeter({ value = 0, total = 0, label }) {
  const pct = total > 0 ? Math.round((value / total) * 100) : 0;
  return (
    <div className="ed-meter" title={label || `${value} / ${total}`}>
      <span style={{ color: 'var(--ed-text)', fontWeight: 700 }}>{pct}%</span>
      <div className="ed-meter-track">
        <div className="ed-meter-fill" style={{ width: `${pct}%` }} />
      </div>
      <span style={{ fontVariantNumeric: 'tabular-nums' }}>
        {value}/{total}
      </span>
    </div>
  );
}
