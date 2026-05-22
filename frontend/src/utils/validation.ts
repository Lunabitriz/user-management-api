export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const isValidEmail = (value: string): boolean =>
  EMAIL_REGEX.test(value);

export const isValidUserName = (value: string): boolean =>
  value.trim().length >= 6;

export interface PasswordValidationState {
  length:    boolean
  number:    boolean
  symbol:    boolean
  uppercase: boolean
}

export const getPasswordValidationState = (
  value: string
): PasswordValidationState => ({
  length:    value.length >= 8,
  number:    /\d/.test(value),
  uppercase: /[A-Z]/.test(value),
  symbol:    /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(value),
});

export const isPasswordValid = (value: string): boolean => {
  const state = getPasswordValidationState(value);

  return state.length && state.number && state.uppercase && state.symbol;
};

export const passwordsMatch = (
  password: string, confirmation: string
): boolean =>  Boolean(password) && password === confirmation;
