import {
  useState,
  type FocusEvent,
  type ChangeEvent,
  type KeyboardEvent,
} from 'react';
import {
  isPasswordValid,
  getPasswordValidationState,
} from '../../utils/validation';

import AuthFormField from './AuthFormField';
import eyeFillIcon from '../../assets/imgs/eye-fill.svg';
import PasswordRequirements from './PasswordRequirements';
import eyeSlashFillIcon from '../../assets/imgs/eye-slash-fill.svg';

interface PasswordFieldProps {
  id:              string
  value:           string
  placeholder:     string
  icon:            string
  error?:          string
  inputClass?:     string
  showRequirements?: boolean
  onChange:        (value: string) => void
  onKeyDown?:      (event: KeyboardEvent<HTMLInputElement>) => void
  onBlurValidate?: (isValid: boolean) => void
}

const PasswordField = ({
  id,
  icon,
  error,
  value,
  placeholder,
  inputClass = '',
  showRequirements = false,
  onChange,
  onKeyDown,
  onBlurValidate,
}: PasswordFieldProps) => {
  const [visible, setVisible] = useState(false);
  const [focused, setFocused] = useState(false);

  const validationState     = getPasswordValidationState(value);
  const requirementsVisible = showRequirements && focused;

  const handleBlur = (event: FocusEvent<HTMLInputElement>) => {
    setFocused(false);
    onBlurValidate?.(isPasswordValid(event.target.value));
  };

  return (
    <AuthFormField
      id={id}
      containerId={`${id}-container`}
      type={visible ? 'text' : 'password'}
      value={value}
      icon={icon}
      error={error}
      inputClass={inputClass}
      placeholder={placeholder}
      autoComplete="off"
      iconAlt="Lock icon"
      onBlur={handleBlur}
      onKeyDown={onKeyDown}
      onFocus={() => setFocused(true)}
      onChange={(event: ChangeEvent<HTMLInputElement>) => onChange(event.target.value)}
    >
      <button
        type="button"
        aria-label={visible ? 'Hide password' : 'Show password'}
        className="absolute top-[14px] right-2.5 z-[5] p-0 border-0 bg-transparent cursor-pointer"
        onClick={() => setVisible(prev => !prev)}
      >
        <img
          src={visible ? eyeFillIcon : eyeSlashFillIcon}
          alt=""
          className="w-[18px] h-[18px]"
        />
      </button>

      {showRequirements && (
        <PasswordRequirements state={validationState} visible={requirementsVisible} />
      )}
    </AuthFormField>
  );
};

export default PasswordField;
