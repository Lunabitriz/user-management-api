import {
  isValidEmail,
  isValidUserName,
  passwordsMatch,
} from '../utils/validation';

import { useEffect, useState } from 'react';
import type { KeyboardEvent, SubmitEvent } from 'react';

import { Link } from 'react-router-dom';
import { storage } from '../utils/storage';
import { useAuth } from '../context/AuthContext';

import userIcon from '../assets/imgs/user.png';
import lockIcon from '../assets/imgs/lock.png';
import emailIcon from '../assets/imgs/email.png';

import florestCoverLg from '../assets/imgs/florest-cover-imgs/florest-cover-5.png';
import florestCoverMd from '../assets/imgs/florest-cover-imgs/florest-cover-md.png';
import florestCoverMobile from '../assets/imgs/florest-cover-imgs/florest-cover-mobile.png';

import Button from '../components/ui/Button';
import AuthFormField from '../components/auth/AuthFormField';
import PasswordField from '../components/auth/PasswordField';

type AuthMode = 'login' | 'register';

const LoginPage = () => {
  const { login, register, isLoading } = useAuth();

  const [mode, setMode] = useState<AuthMode>('login');
  const [rememberMe, setRememberMe] = useState(false);

  const [loginEmail,    setLoginEmail]    = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  const [registerName,     setRegisterName]     = useState('');
  const [registerEmail,    setRegisterEmail]    = useState('');
  const [registerConfirm,  setRegisterConfirm]  = useState('');
  const [registerPassword, setRegisterPassword] = useState('');

  const [emailError,           setEmailError]           = useState('');
  const [passwordError,        setPasswordError]        = useState('');
  const [userNameError,        setUserNameError]        = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');

  useEffect(() => {
    storage.clearRecoveryState();

    if(storage.getRememberMe() === 'active') {
      const savedEmail = storage.getUserEmail();

      if(savedEmail) {
        setLoginEmail(savedEmail);
        setRememberMe(true);
      }
    }
  }, []);

  const switchMode = (next: AuthMode) => {
    setMode(next);
    setEmailError('');
    setUserNameError('');
    setPasswordError('');
    setConfirmPasswordError('');

    if(next === 'login') {
      setRegisterName('');
      setRegisterEmail('');
      setRegisterConfirm('');
      setRegisterPassword('');
    } else {
      setLoginPassword('');
      setRememberMe(false);
    }
  };

  const handleLogin = async (event?: SubmitEvent<HTMLFormElement>) => {
    event?.preventDefault();
    await login({ email: loginEmail.trim(), password: loginPassword }, rememberMe);
  };

  const handleRegister = async (event?: SubmitEvent<HTMLFormElement>) => {
    event?.preventDefault();

    const inputsMissing = !registerEmail || !registerName || !registerPassword || !registerConfirm;
    const mismatch = registerPassword !== registerConfirm;

    if(inputsMissing || mismatch) return;

    await register({
      name: registerName.trim(),
      email: registerEmail.trim(),
      password: registerPassword,
    });
  };

  const handleEnterLogin = (event: KeyboardEvent<HTMLInputElement>) => {
    if(event.key === 'Enter')
      void handleLogin();
  };

  const formPanelClass = (active: boolean) =>
    active
      ? 'flex flex-col gap-9 min-w-[360px] w-[360px] max-[720px]:gap-11 max-[720px]:p-11 max-[720px]:rounded-xl max-[720px]:bg-white max-[720px]:shadow-[0_0_10px_rgba(53,53,53,0.43)]'
      : 'hidden';

  return (
    <div className="flex justify-between items-center relative w-full max-w-[1250px] rounded-3xl overflow-hidden bg-white m-0 shadow-main-container max-[720px]:w-full max-[720px]:h-[700px] max-[720px]:items-center max-[720px]:justify-center max-[480px]:p-5">
      <div className="w-full p-3 text-app-text max-w-96 ml-[168px] z-[2] h-fit text-[1.02rem] max-lg:ml-[100px] max-lg:px-0 max-lg:min-w-[300px] max-[720px]:mx-0 max-[720px]:w-full max-[480px]:min-w-0">
        <div className={formPanelClass(mode === 'login')}>
          <div className="text-center">
            <h2 className="font-bold mb-3 text-[2.5rem]">Login</h2>
            <p className="mb-0">Please enter your login details in log in.</p>
          </div>

          <form className="flex flex-col gap-6" onSubmit={handleLogin}>
            <div className="flex flex-col gap-6 w-full">
              <AuthFormField
                id="login-email"
                icon={userIcon}
                value={loginEmail}
                iconAlt="User icon"
                autoComplete="username"
                placeholder="Your email"
                onChange={event => setLoginEmail(event.target.value)}
              />
              <PasswordField
                id="login-password"
                icon={lockIcon}
                value={loginPassword}
                placeholder="Your password"
                onChange={setLoginPassword}
                onKeyDown={handleEnterLogin}
              />
            </div>

            <div className="flex justify-between">
              <div className="flex gap-1.5 items-center">
                <input
                  id="remember-me"
                  type="checkbox"
                  checked={rememberMe}
                  className="accent-[#F5903D] focus:shadow-none cursor-pointer"
                  onChange={event => setRememberMe(event.target.checked)}
                />
                <label htmlFor="remember-me" className="cursor-pointer font-medium text-app-muted">
                  Remember-me
                </label>
              </div>

              <Link
                to="/forgot-password"
                className="font-medium text-primary bg-transparent -mt-6 self-end hover:text-primary-hover hover:scale-[1.01] transition-all duration-200"
              >
                Forgot password?
              </Link>
            </div>

            <Button id="submit-login" type="submit" variant="primary" className="mb-2" disabled={isLoading}>
              Login
            </Button>
          </form>

          <div className="flex justify-center gap-2">
            <p className="mb-0">Don’t have an account?</p>
            <Button
              type="button"
              id="register-toggle-btn"
              variant="ghost"
              onClick={() => switchMode('register')}
            >
              Sign up
            </Button>
          </div>
        </div>

        <div className={formPanelClass(mode === 'register')}>
          <div className="text-center">
            <h2 className="font-bold mb-3 text-[2.5rem]">Register</h2>
            <p className="mb-0">Create your account to get started!</p>
          </div>

          <form className="flex flex-col gap-6" onSubmit={handleRegister}>
            <div className="flex flex-col gap-6">
              <AuthFormField
                id="register-user-name"
                icon={userIcon}
                value={registerName}
                error={userNameError}
                iconAlt="User icon"
                placeholder="Username"
                onChange={event => setRegisterName(event.target.value)}
                onBlur={() => {
                  registerName && !isValidUserName(registerName)
                    ? setUserNameError('Minimum of 6 characters.')
                    : setUserNameError('');
                }}
              />
              <AuthFormField
                id="register-email"
                type="email"
                value={registerEmail}
                placeholder="Enter your email"
                icon={emailIcon}
                iconAlt="Email icon"
                error={emailError}
                onChange={event => setRegisterEmail(event.target.value)}
                onBlur={() => {
                  registerEmail && !isValidEmail(registerEmail)
                    ? setEmailError('Invalid email address.')
                    : setEmailError('');
                }}
              />
              <PasswordField
                id="register-password"
                value={registerPassword}
                placeholder="Create a password"
                icon={lockIcon}
                error={passwordError}
                showRequirements
                onChange={setRegisterPassword}
                onBlurValidate={valid => {
                  !valid && registerPassword
                    ? setPasswordError('Please enter a valid password.')
                    : setPasswordError('');
                }}
              />
              <PasswordField
                id="confirm-register-password"
                icon={lockIcon}
                value={registerConfirm}
                error={confirmPasswordError}
                placeholder="Confirm password"
                onChange={value => {
                  setRegisterConfirm(value);
                  !registerPassword
                    ? setConfirmPasswordError('Please fill in the first field.')
                    : setConfirmPasswordError('');
                  !passwordsMatch(registerPassword, value)
                    ? setConfirmPasswordError('Passwords must match.')
                    : setConfirmPasswordError('');
                }}
                onKeyDown={event => {
                  event.key === 'Enter' && void handleRegister();
                }}
              />
            </div>

            <Button id="submit-register" type="submit" variant="primary" disabled={isLoading}>
              Create Account
            </Button>
          </form>

          <div className="flex justify-center gap-1">
            <p className="mb-0">Already have an account?</p>
            <Button
              id="login-toggle-btn"
              type="button"
              variant="ghost"
              onClick={() => switchMode('login')}
            >
              Log in
            </Button>
          </div>
        </div>
      </div>

      <div className="relative shrink-0">
        <img
          src={florestCoverLg}
          alt="Forest cover"
          className="hidden lg:block max-lg:hidden"
        />
        <img
          src={florestCoverMd}
          alt="Forest cover"
          className="hidden md:block lg:hidden object-cover translate-x-[14%] max-[720px]:hidden"
        />
        <img
          src={florestCoverMobile}
          alt="Forest cover"
          className="absolute top-0 w-full min-h-[150px] md:hidden block"
        />
      </div>
    </div>
  );
};

export default LoginPage;
