import {
  isValidEmail,
  passwordsMatch,
} from '../utils/validation';

import { useForgotPassword } from '../hooks/useForgotPassword';

import lockIcon from '../assets/imgs/lock.png';
import userIcon from '../assets/imgs/user.png';
import emailArt from '../assets/imgs/pop-ups-arts/email-art.jpg';

import Button from '../components/ui/Button';
import AuthFormField from '../components/auth/AuthFormField';
import PasswordField from '../components/auth/PasswordField';
import LoadingOverlay from '../components/ui/LoadingOverlay';
import PasswordRequirements from '../components/auth/PasswordRequirements';
import { FORGOT_OTP_INPUT } from '../styles/classNames';

const FORGOT_PANEL =
  'bg-white rounded-2xl flex flex-col items-center justify-center gap-2 p-12 relative flex ' +
  'shadow-[0_7px_10px_0_rgba(130,130,130,0.16)] w-[389px] max-w-full';

const ForgotPassword = () => {
  const {
    step,
    email,
    setEmail,
    emailError,
    setEmailError,
    codeDigits,
    newPassword,
    setNewPassword,
    confirmPassword,
    setConfirmPassword,
    passwordError,
    setPasswordError,
    confirmPasswordError,
    setConfirmPasswordError,
    isLoading,
    expiresLabel,
    passwordState,
    submitCode,
    submitEmail,
    submitNewPassword,
    goToLogin,
    handleCodeChange,
    handleCodeKeyDown,
  } = useForgotPassword();

  const panelClass = (loading: boolean) =>
    `${FORGOT_PANEL}${loading ? ' pb-[100px]' : ''}`;

  return (
    <div className="flex justify-center items-center min-h-screen p-4">
      {step === 1 && (
        <div id="enter-email-container" className={panelClass(isLoading)}>
          <div>
            <img src={emailArt} alt="Email image" width={193} />
          </div>
          <div className="text-center">
            <h3>Forgot Password?</h3>
            <p className="mb-0">Please enter your email to reset your password.</p>
          </div>
          <div className="my-4 w-full">
            <AuthFormField
              id="recovery-email"
              value={email}
              placeholder="Your email"
              icon={userIcon}
              iconAlt="User icon"
              error={emailError}
              onChange={event => setEmail(event.target.value)}
              onBlur={() => {
                email && !isValidEmail(email.trim())
                  ? setEmailError('Invalid email address.')
                  : setEmailError('');
              }}
            />
          </div>
          <Button
            id="confirm-mail-btn"
            variant="primary"
            className="mb-2"
            disabled={isLoading}
            onClick={() => void submitEmail()}
          >
            Confirm Mail
          </Button>
          <LoadingOverlay active={isLoading} />
        </div>
      )}

      {step === 2 && (
        <div id="code-container" className={panelClass(isLoading)}>
          <div>
            <img src={emailArt} alt="Email image" width={193} />
          </div>
          <div className="text-center">
            <h3>Enter code</h3>
            <p className="mb-0">
              Verification code send to:
              <span id="send-to-mail" className="font-medium ml-1">{email}</span>
            </p>
          </div>
          <div className="mt-4 mb-1 flex flex-row w-full gap-2 justify-center">
            {codeDigits.map((digit, index) => (
              <input
                id={`forgot-code-${index + 1}`}
                key={`forgot-code-${index + 1}`}
                type="text"
                className={`${FORGOT_OTP_INPUT} w-10 h-10`}
                maxLength={1}
                inputMode="numeric"
                pattern="[0-9]*"
                autoComplete="off"
                aria-label="Validation code"
                value={digit}
                onChange={event => handleCodeChange(index, event.target.value)}
                onKeyDown={event => handleCodeKeyDown(index, event)}
              />
            ))}
          </div>
          <p>
            Expires in:
            <span id="expires-in" className="font-medium ml-1">{expiresLabel}</span>
          </p>
          <Button
            id="confirm-send-code-btn"
            variant="primary"
            className="mb-2"
            disabled={isLoading}
            onClick={() => void submitCode()}
          >
            Confirm Code
          </Button>
          <LoadingOverlay active={isLoading} />
        </div>
      )}

      {step === 3 && (
        <div id="new-password-container" className={panelClass(isLoading)}>
          <div>
            <img src={emailArt} alt="Email image" width={193} />
          </div>
          <div className="text-center">
            <h3>New Password</h3>
            <p className="mb-0">Please enter your new Password.</p>
          </div>
          <div className="mt-4 flex flex-col w-full">
            <PasswordField
              id="new-password-redefine"
              value={newPassword}
              placeholder="New password"
              icon={lockIcon}
              error={passwordError}
              showRequirements
              onChange={setNewPassword}
              onBlurValidate={valid => {
                if(!valid && newPassword)
                  setPasswordError('Please enter a valid password.');
                else
                  setPasswordError('');
              }}
            />
            <div id="redefine-password-validations">
              <PasswordRequirements state={passwordState} visible={Boolean(newPassword)} />
            </div>
            <PasswordField
              id="confirm-password-redefine"
              value={confirmPassword}
              placeholder="Confirm password"
              icon={lockIcon}
              error={confirmPasswordError}
              onChange={value => {
                setConfirmPassword(value);
                if(!newPassword)
                  setConfirmPasswordError('Please fill in the first field.');
                else if(!passwordsMatch(newPassword, value))
                  setConfirmPasswordError('Passwords must match.');
                else
                  setConfirmPasswordError('');
              }}
              onKeyDown={event => {
                if(event.key === 'Enter') void submitNewPassword();
              }}
            />
          </div>
          <Button
            id="confirm-password-btn"
            variant="primary"
            className="mb-2"
            disabled={isLoading}
            onClick={() => void submitNewPassword()}
          >
            Confirm Password
          </Button>
          <LoadingOverlay active={isLoading} />
        </div>
      )}

      {step === 4 && (
        <div id="confirm-container" className={FORGOT_PANEL}>
          <div>
            <img src={emailArt} alt="Email image" width={193} />
          </div>
          <div className="text-center mb-4">
            <h3>Password Updated!</h3>
            <p className="mb-0">Please wait, you will be directed to the homepage</p>
          </div>
          <Button id="confirm-btn" variant="primary" className="mb-2" onClick={goToLogin}>
            Confirm
          </Button>
        </div>
      )}
    </div>
  );
};

export default ForgotPassword;
