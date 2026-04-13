/**
 * Calc example editor — title + multiline text
 * @param {{ title: string, text: string, onTitleChange: (v:string)=>void, onTextChange: (v:string)=>void }} props
 */
export function CalcEditor({ title, text, onTitleChange, onTextChange, isEs = false }) {
  return (
    <>
      <div className="field">
        <div className="field-label">{isEs ? 'Titulo' : 'Title'}</div>
        <input type="text" value={title} onChange={(e) => onTitleChange(e.target.value)} />
      </div>
      <div className="field">
        <div className="field-label">
          {isEs ? 'Texto (saltos de linea con Enter)' : 'Text (line breaks with Enter)'}
        </div>
        <textarea rows={4} value={text} onChange={(e) => onTextChange(e.target.value)} />
      </div>
    </>
  );
}
