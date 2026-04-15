import './Button.css';

interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'outline' | 'action' | 'link';
  onClick?: () => void;
  className?: string;
  style?: React.CSSProperties;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
}

const Button = ({
  children,
  variant = 'primary',
  onClick,
  className = '',
  style,
  type = 'button',
  disabled
}: ButtonProps) => {
  const baseClass = variant === 'link' ? 'btn-link' : variant === 'outline' ? 'btn-outline' : variant === 'action' ? 'btn-action' : 'btn-primary';

  return (
    <button
      type={type}
      className={`${baseClass} ${className}`}
      onClick={onClick}
      style={style}
      disabled={disabled}
      aria-label={typeof children === 'string' ? children : undefined}
    >
      {children}
    </button>
  );
};

export default Button;
