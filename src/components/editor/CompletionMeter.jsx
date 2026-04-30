export function CompletionMeter({ value = 0, total = 0, label }) {
  const pct = total > 0 ? Math.round((value / total) * 100) : 0;
  return (
    <div className="ed-meter" title={label || `${value} / ${total}`}>
      <span className="ed-meter-pct">{pct}%</span>
      <div className="ed-meter-track">
        <div className="ed-meter-fill" style={{ width: `${pct}%` }} />
      </div>
      <span className="ed-meter-count">
        {value}/{total}
      </span>
    </div>
  );
}
