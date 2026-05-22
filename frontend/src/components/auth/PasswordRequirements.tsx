import type { PasswordValidationState } from '../../utils/validation';

interface PasswordRequirementsProps {
  state:   PasswordValidationState
  visible: boolean
}

const PasswordRequirements = (
  { state, visible }: PasswordRequirementsProps
) => {
  if(!visible) return null;

  const itemClass = (valid: boolean) => (valid ? 'valid' : 'default');

  return (
    <ul id="validation" className="p-0 show" style={{ display: 'block' }}>
      <li id="lenght" className={itemClass(state.length)}>
        <i className="fa-solid fa-lock" /> At least 8 characters
      </li>

      <li id="number" className={itemClass(state.number)}>
        <i className="fa-solid fa-lock" /> At least 1 number
      </li>

      <li id="uppercase" className={itemClass(state.uppercase)}>
        <i className="fa-solid fa-lock" /> At least 1 uppercase letter
      </li>

      <li id="symbol" className={itemClass(state.symbol)}>
        <i className="fa-solid fa-lock" /> At least 1 symbol (e.g. !, @, #, $, %...)
      </li>
    </ul>
  );
};

export default PasswordRequirements;
