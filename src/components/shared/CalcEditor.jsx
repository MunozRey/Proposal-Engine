/**
 * Calc example editor: title + multiline text
 * @param {{ title: string, text: string, onTitleChange: (v:string)=>void, onTextChange: (v:string)=>void, t: (k:string)=>string }} props
 */
export function CalcEditor({ title, text, onTitleChange, onTextChange, t }) {
  // Fall back to a no-op-ish shim if t isn't passed in (keeps old call sites safe).
  const tt = t || ((k) => k);
  return (
    <>
      <div className="field">
        <div className="field-label">{tt('calc.title')}</div>
        <input type="text" value={title} onChange={(e) => onTitleChange(e.target.value)} />
      </div>
      <div className="field">
        <div className="field-label">{tt('calc.text')}</div>
        <textarea rows={4} value={text} onChange={(e) => onTextChange(e.target.value)} />
      </div>
    </>
  );
}
