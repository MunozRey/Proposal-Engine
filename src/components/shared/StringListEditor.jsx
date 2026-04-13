/**
 * Editable list of strings (features, notes, etc.)
 * @param {{ items: string[], onEdit: (i:number, v:string)=>void, onAdd: ()=>void, onDel: (i:number)=>void, addLabel?: string }} props
 */
export function StringListEditor({ items, onEdit, onAdd, onDel, addLabel = '+ Add' }) {
  return (
    <>
      {items.map((item, i) => (
        <div key={i} className="feat-item">
          <textarea rows={1} value={item} onChange={(e) => onEdit(i, e.target.value)} />
          <button
            className="btn-remove"
            style={{ position: 'static', marginTop: '4px' }}
            onClick={() => onDel(i)}
          >
            ✕
          </button>
        </div>
      ))}
      <button className="btn-add" onClick={onAdd}>
        {addLabel}
      </button>
    </>
  );
}
