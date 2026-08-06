import './Button.css';
import Spinner from './Spinner.jsx';

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  icon = null,
  as = 'button',
  ...rest
}) {
  const Comp = as;
  return (
    <Comp
      className={`btn btn-${variant} btn-${size} ${loading ? 'btn-loading' : ''}`}
      disabled={disabled || loading}
      {...rest}
    >
      <span className="btn-content">
        {loading && <Spinner size={14} />}
        {!loading && icon}
        <span>{children}</span>
      </span>
    </Comp>
  );
}
