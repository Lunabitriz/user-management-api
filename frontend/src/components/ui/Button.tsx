import type { ButtonHTMLAttributes, ReactNode } from 'react';

type ButtonVariant =
  | 'primary'
  | 'ghost'
  | 'surface'
  | 'settings'
  | 'settings-dark'
  | 'popup-cancel';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?:   ButtonVariant
  children:   ReactNode
  className?: string
}

const VARIANT_CLASSES: Record<ButtonVariant, string> = {
  primary:
    'w-full py-2.5 text-base font-medium rounded-lg bg-primary text-white ' +
    'hover:bg-primary-hover disabled:opacity-60 transition-colors',
  ghost:
    'font-medium text-primary bg-transparent border-0 p-0 w-fit ' +
    'hover:text-primary-hover hover:scale-[1.01] transition-all duration-200',
  surface:
    'w-full px-4 py-2 rounded-lg border text-[var(--text-color)] bg-[var(--bg-btn)] ' +
    'border-[var(--border-btn)] hover:bg-transparent transition-all duration-300',
  settings:
    'px-4 py-2 rounded-lg border border-[#cdcdcd] bg-[#eee] text-[var(--text-color)] ' +
    'hover:bg-transparent transition-all duration-300',
  'settings-dark':
    'px-4 py-2 rounded-lg bg-[#484848] text-white border border-[#484848] ' +
    'hover:opacity-90 transition-opacity',
  'popup-cancel':
    'w-full py-2 rounded-lg border border-[#cdcdcd] bg-[#eee] text-[var(--text-color)] ' +
    'hover:bg-transparent transition-all duration-300',
};

const Button = ({
  children,
  className = '',
  variant   = 'surface',
  type      = 'button',
  ...rest
}: ButtonProps) => (
  <button
    type={type}
    className={`${VARIANT_CLASSES[variant]} ${className}`.trim()}
    {...rest}
  >
    {children}
  </button>
);

export default Button;
