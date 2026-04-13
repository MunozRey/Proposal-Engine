export function PageCard({ label, html, zoom }) {
  const w = Math.round(595 * zoom);
  const h = Math.round(842 * zoom);
  return (
    <div className="page-wrap">
      <div className="page-lbl">{label}</div>
      <div className="page-scaler" style={{ width: w + 'px', height: h + 'px' }}>
        <div style={{ transform: `scale(${zoom})` }} dangerouslySetInnerHTML={{ __html: html }} />
      </div>
    </div>
  );
}
