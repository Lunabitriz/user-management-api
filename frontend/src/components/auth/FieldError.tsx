import { FIELD_ERROR } from '../../styles/classNames';

interface FieldErrorProps {
  message?: string
  inputId:  string
  edit?:    boolean
}

const FieldError = ({ message, inputId, edit = false }: FieldErrorProps) => {
  if(!message) return null;

  return (
    <div className={edit ? `${FIELD_ERROR} left-2 text-[0.8rem]` : FIELD_ERROR}>
      <i className="fa-solid fa-circle-exclamation" />
      <label className="ml-0.5" htmlFor={inputId}>
        {message}
      </label>
    </div>
  );
};

export default FieldError;
