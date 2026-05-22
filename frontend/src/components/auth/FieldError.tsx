interface FieldErrorProps {
  message?: string
  inputId:  string
}

const FieldError = ({ message, inputId }: FieldErrorProps) => {
  if(!message) return null;

  return (
    <div className="input-error">
      <i className="fa-solid fa-circle-exclamation" />
      <label className="input-label" htmlFor={inputId}>
        {message}
      </label>
    </div>
  );
};

export default FieldError;
