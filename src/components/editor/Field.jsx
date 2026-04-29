import { useId, useRef, useState, useEffect } from 'react';
import { icon as svgIcon } from '../../design/icons.js';
import { validateField } from '../../utils/validators.js';

function StateBadge({ status }) {
  if (!status) return null;
  const map = {
    ok: { cls: 'ed-ok', icon: 'checkCircle' },
    warn: { cls: 'ed-warn', icon: 'sparkles' },
    err: { cls: 'ed-err', icon: 'xCircle' },
  };
  const conf = map[status];
  if (!conf) return null;
  return (
    <span
      className={`ed-field-state ${conf.cls}`}
      dangerouslySetInnerHTML={{ __html: svgIcon(conf.icon, { size: 12 }) }}
    />
  );
}

function FieldShell({ label, required, optional, helper, error, status, children }) {
  return (
    <div className={`ed-field${error ? ' ed-has-error' : ''}`}>
      {(label || helper) && (
        <div className="ed-field-label-row">
          {label && (
            <label className="ed-field-label">
              {label}
              {required && <span className="ed-required">*</span>}
              {optional && <span className="ed-optional">opt</span>}
            </label>
          )}
          <StateBadge status={status} />
        </div>
      )}
      {children}
      {error && <div className="ed-field-error">{error}</div>}
      {!error && helper && <div className="ed-field-helper">{helper}</div>}
    </div>
  );
}

function deriveStatus(value, rules, required) {
  if (!rules || rules.length === 0) {
    if (required) return value && String(value).trim() ? 'ok' : null;
    return null;
  }
  const result = validateField(value, rules);
  if (!result.ok) return 'err';
  if (value && String(value).trim()) return 'ok';
  return null;
}

export function FieldText({
  label,
  value = '',
  onChange,
  placeholder,
  required,
  optional,
  helper,
  rules,
  multiline,
  rows = 3,
  error: externalError,
  ...rest
}) {
  const id = useId();
  const result = rules ? validateField(value, rules) : null;
  const error = externalError || (!result?.ok && value ? result?.message : null);
  const status = error ? 'err' : deriveStatus(value, rules, required);

  return (
    <FieldShell
      label={label}
      required={required}
      optional={optional}
      helper={helper}
      error={error}
      status={status}
    >
      {multiline ? (
        <textarea
          id={id}
          className="ed-field-textarea"
          value={value}
          rows={rows}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          {...rest}
        />
      ) : (
        <input
          id={id}
          type="text"
          className="ed-field-input"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          {...rest}
        />
      )}
    </FieldShell>
  );
}

export function FieldNumber({
  label,
  value = '',
  onChange,
  placeholder,
  required,
  helper,
  rules,
  min,
  max,
  step,
  prefix,
  suffix,
  ...rest
}) {
  const id = useId();
  const result = rules ? validateField(value, rules) : null;
  const error = !result?.ok && value !== '' ? result?.message : null;
  const status = error ? 'err' : deriveStatus(value, rules, required);
  return (
    <FieldShell label={label} required={required} helper={helper} error={error} status={status}>
      <div style={{ position: 'relative' }}>
        {prefix && (
          <span
            style={{
              position: 'absolute',
              left: 10,
              top: '50%',
              transform: 'translateY(-50%)',
              fontSize: 12,
              color: 'var(--ed-text-subtle)',
              pointerEvents: 'none',
            }}
          >
            {prefix}
          </span>
        )}
        <input
          id={id}
          type="number"
          className="ed-field-input"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          min={min}
          max={max}
          step={step}
          style={prefix ? { paddingLeft: 22 } : suffix ? { paddingRight: 26 } : undefined}
          {...rest}
        />
        {suffix && (
          <span
            style={{
              position: 'absolute',
              right: 10,
              top: '50%',
              transform: 'translateY(-50%)',
              fontSize: 11,
              color: 'var(--ed-text-subtle)',
              pointerEvents: 'none',
            }}
          >
            {suffix}
          </span>
        )}
      </div>
    </FieldShell>
  );
}

export function FieldSelect({ label, value, onChange, options = [], required, helper }) {
  return (
    <FieldShell label={label} required={required} helper={helper}>
      <select
        className="ed-field-select"
        value={value ?? ''}
        onChange={(e) => onChange(e.target.value)}
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </FieldShell>
  );
}

export function FieldColor({ label, value = '#000000', onChange, helper, optional }) {
  const safe = /^#[0-9A-Fa-f]{3,8}$/.test(value) ? value : '#000000';
  return (
    <FieldShell label={label} helper={helper} optional={optional}>
      <div className="ed-color-field">
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          spellCheck={false}
          maxLength={9}
        />
        <div className="ed-color-swatch">
          <div className="ed-color-swatch-fill" style={{ background: safe }} />
          <input
            type="color"
            value={safe.length === 7 ? safe : '#000000'}
            onChange={(e) => onChange(e.target.value)}
          />
        </div>
      </div>
    </FieldShell>
  );
}

export function FieldImage({ label, value, onChange, helper, optional, accept = 'image/*' }) {
  const fileRef = useRef(null);
  const [dragOver, setDragOver] = useState(false);

  const handleFiles = (files) => {
    const f = files?.[0];
    if (!f) return;
    const reader = new FileReader();
    reader.onload = () => onChange(reader.result);
    reader.readAsDataURL(f);
  };

  const onDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    handleFiles(e.dataTransfer.files);
  };

  // Paste support: works only when the field is focused. Wire the ref via the wrapper click.
  useEffect(() => {
    const handler = (e) => {
      if (!fileRef.current?.matches?.(':focus-within')) return;
      const items = [...(e.clipboardData?.items || [])];
      for (const item of items) {
        if (item.type.startsWith('image/')) {
          const file = item.getAsFile();
          if (file) {
            handleFiles([file]);
            e.preventDefault();
            return;
          }
        }
      }
    };
    window.addEventListener('paste', handler);
    return () => window.removeEventListener('paste', handler);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onChange]);

  return (
    <FieldShell label={label} helper={helper} optional={optional}>
      <div
        ref={fileRef}
        className={`ed-image-field${dragOver ? ' ed-drag-over' : ''}`}
        onClick={() => fileRef.current?.querySelector('input[type=file]')?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={onDrop}
        tabIndex={0}
      >
        <div className="ed-image-thumb">
          {value ? (
            <img src={value} alt="" />
          ) : (
            <span dangerouslySetInnerHTML={{ __html: svgIcon('fileSearch', { size: 18 }) }} />
          )}
        </div>
        <div className="ed-image-info">
          <div className="ed-img-title">{value ? 'Image attached' : 'Drop, paste or click'}</div>
          <div className="ed-img-subtitle">
            {value ? 'Click to replace · drag a new file' : 'PNG · SVG · JPG'}
          </div>
        </div>
        {value && (
          <div className="ed-image-actions" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              className="ed-icon-btn"
              title="Remove"
              onClick={() => onChange('')}
              dangerouslySetInnerHTML={{ __html: svgIcon('xCircle', { size: 14 }) }}
            />
          </div>
        )}
        <input
          type="file"
          accept={accept}
          style={{ display: 'none' }}
          onChange={(e) => handleFiles(e.target.files)}
        />
      </div>
    </FieldShell>
  );
}

export function FieldUrl({ label, value, onChange, helper, ...rest }) {
  return (
    <FieldText
      label={label}
      value={value}
      onChange={onChange}
      placeholder="https://example.com"
      helper={helper}
      {...rest}
    />
  );
}

export function FieldEmail({ label, value, onChange, helper, ...rest }) {
  return (
    <FieldText
      label={label}
      value={value}
      onChange={onChange}
      placeholder="name@example.com"
      helper={helper}
      {...rest}
    />
  );
}

export function FieldRow({ children }) {
  return <div className="ed-field-row">{children}</div>;
}
