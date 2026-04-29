export function Card({
  title,
  helper,
  icon,
  actions,
  children,
  flat,
  emphasis,
  className = '',
  ...rest
}) {
  const cls = ['ed-card', flat && 'ed-flat', emphasis && 'ed-emphasis', className]
    .filter(Boolean)
    .join(' ');
  return (
    <div className={cls} {...rest}>
      {(title || actions) && (
        <div className="ed-card-head">
          {title && (
            <div className="ed-card-title">
              {icon && <span dangerouslySetInnerHTML={{ __html: icon }} />}
              <span>{title}</span>
            </div>
          )}
          {actions && <div className="ed-card-actions">{actions}</div>}
        </div>
      )}
      {helper && <div className="ed-card-helper">{helper}</div>}
      {children}
    </div>
  );
}

export function SectionHeader({ eyebrow, title, subtitle, actions }) {
  return (
    <div className="ed-section-head">
      <div>
        {eyebrow && <div className="ed-eyebrow">{eyebrow}</div>}
        <div className="ed-title">{title}</div>
        {subtitle && <div className="ed-subtitle">{subtitle}</div>}
      </div>
      {actions && <div className="ed-section-actions">{actions}</div>}
    </div>
  );
}
