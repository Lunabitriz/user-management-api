import type { PasswordValidationState } from '../../utils/validation';

interface PasswordRequirementsProps {
  state:   PasswordValidationState
  visible: boolean
}

const requirementClass = (valid: boolean) =>
  valid ? 'text-[var(--validation-li-valid)]' : 'text-[var(--validation-li-default)]';

const PasswordRequirements = ({ state, visible }: PasswordRequirementsProps) => {
  if(!visible) return null;

  return (
    <ul
      className="p-0 mt-5 mb-0 max-h-[110px] overflow-hidden animate-fade list-none"
      aria-live="polite"
    >
      <li className={requirementClass(state.length)}>
        <i className="fa-solid fa-lock" /> At least 8 characters
      </li>
      <li className={requirementClass(state.number)}>
        <i className="fa-solid fa-lock" /> At least 1 number
      </li>
      <li className={requirementClass(state.uppercase)}>
        <i className="fa-solid fa-lock" /> At least 1 uppercase letter
      </li>
      <li className={requirementClass(state.symbol)}>
        <i className="fa-solid fa-lock" /> At least 1 symbol (e.g. !, @, #, $, %...)
      </li>
    </ul>
  );
};

export default PasswordRequirements;
