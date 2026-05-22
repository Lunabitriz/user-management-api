import type { 
  ReactNode,
  FocusEvent, 
  ChangeEvent, 
  KeyboardEvent, 
} from 'react';
import FieldError from './FieldError';

interface AuthFormFieldProps {
  id:           string
  type?:        string
  value:        string
  placeholder:  string
  icon:         string
  error?:       string
  iconAlt:      string
  inputClass?:  string
  autoComplete?: string
  onBlur?:      (event: FocusEvent<HTMLInputElement>) => void
  onFocus?:     (event: FocusEvent<HTMLInputElement>) => void
  onChange:     (event: ChangeEvent<HTMLInputElement>) => void
  onKeyDown?:   (event: KeyboardEvent<HTMLInputElement>) => void
  children?:    ReactNode
  containerId?: string
}

const AuthFormField = ({
  id,
  type = 'text',
  value,
  placeholder,
  icon,
  error,
  iconAlt,
  inputClass = 'input-login',
  autoComplete,
  onBlur,
  onFocus,
  onChange,
  onKeyDown,
  children,
  containerId,
}: AuthFormFieldProps) => (

  <div id={containerId} className="input-item relative">
    <FieldError message={error} inputId={id} />
    <input
      id={id}
      type={type}
      value={value}
      className={inputClass}
      placeholder={placeholder}
      autoComplete={autoComplete}
      onBlur={onBlur}
      onFocus={onFocus}
      onChange={onChange}
      onKeyDown={onKeyDown}
    />

    <img className="input-icon" src={icon} alt={iconAlt} />
    {children}
  </div>
);

export default AuthFormField;
