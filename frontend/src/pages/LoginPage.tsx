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

import AuthFormField from '../components/auth/AuthFormField';
import PasswordField from '../components/auth/PasswordField';

type AuthMode = 'login' | 'register'

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

  return (
    <div id="main-container" className="flex justify-between items-center relative w-full rounded-3xl overflow-hidden bg-white m-0">
      <div id="auth-forms" className="w-full p-3">
        <div
          id="login-container"
          className={mode === 'login' ? 'active' : 'hidden'}
        >
          <div className="header-form text-center">
            <h2 className="font-bold mb-3" style={{ fontSize: '2.5rem' }}>Login</h2>
            <p className="mb-0">Please enter your login details in log in.</p>
          </div>

          <form className="flex flex-col gap-6" onSubmit={handleLogin}>
            <div id="login-inputs-container" className="flex flex-col gap-6 w-full">
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

            <div className="more-actions flex justify-between">
              <div className="remember-me-container flex" style={{ gap: 5 }}>
                <input
                  id="remember-me"
                  type="checkbox"
                  checked={rememberMe}
                  onChange={event => setRememberMe(event.target.checked)}
                />
                <label htmlFor="remember-me" id="remember-me-label">Remember-me</label>
              </div>

              <Link id="forgot-password" to="/forgot-password">Forgot password?</Link>
            </div>

            <button id="submit-login" type="submit" className="mb-2" disabled={isLoading}>
              Login
            </button>
          </form>

          <div className="toggle-form-text flex justify-center gap-2">
            <p className="mb-0">Don’t have an account?</p>
            <button
              type="button"
              id="register-toggle-btn"
              className="btn-auth-form"
              onClick={() => switchMode('register')}
            >
              Sign up
            </button>
          </div>
        </div>

        <div
          id="register-container"
          className={mode === 'register' ? 'active' : 'hidden'}
        >
          <div className="header-form text-center">
            <h2 className="font-bold mb-3" style={{ fontSize: '2.5rem' }}>Register</h2>
            <p className="mb-0">Create your account to get started!</p>
          </div>

          <form onSubmit={handleRegister}>
            <div id="register-inputs-container" className="flex flex-col gap-6">
              <AuthFormField
                id="register-user-name"
                icon={userIcon}
                value={registerName}
                error={userNameError}
                iconAlt="User icon"
                placeholder="Username"
                inputClass="input-register"
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
                inputClass="input-register"
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
                inputClass="input-register"
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
                inputClass="input-register"
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

            <button id="submit-register" type="submit" className="m-0" disabled={isLoading}>
              Create Account
            </button>
          </form>

          <div className="toggle-form-text flex justify-center gap-1">
            <p className="mb-0">Already have an account?</p>
            <button
              id="login-toggle-btn"
              type="button"
              className="btn-auth-form"
              onClick={() => switchMode('login')}
            >
              Log in
            </button>
          </div>
        </div>
      </div>

      <div id="cover-img">
        <img id="florest-cover-lg" src={florestCoverLg} alt="florest" />
        <img id="florest-cover-md" src={florestCoverMd} alt="florest" />
        <img id="florest-cover-mobile" src={florestCoverMobile} alt="florest" />
      </div>
    </div>
  );
};

export default LoginPage;
