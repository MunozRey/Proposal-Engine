import { icon as svgIcon } from '../../design/icons.js';

export function IconButton({
  iconName,
  onClick,
  title,
  disabled,
  primary,
  size = 16,
  children,
  className = '',
  ...rest
}) {
  return (
    <button
      type="button"
      className={`ed-icon-btn${primary ? ' ed-primary' : ''} ${className}`.trim()}
      title={title}
      onClick={onClick}
      disabled={disabled}
      aria-label={title}
      {...rest}
    >
      {iconName ? (
        <span dangerouslySetInnerHTML={{ __html: svgIcon(iconName, { size }) }} />
      ) : (
        children
      )}
    </button>
  );
}
