import {
  isValidEmail,
  passwordsMatch,
  isPasswordValid,
  getPasswordValidationState,
} from '../utils/validation';

import { userApi } from '../api/user';
import { useNavigate } from 'react-router-dom';
import { useNotification } from '../context/NotificationContext';
import { useCallback, useEffect, useRef, useState } from 'react';


const TIMER_MINUTES = 10;

export const useForgotPassword = () => {
  const navigate = useNavigate();
  const { notify } = useNotification();

  const [step,            setStep]            = useState(1);
  const [email,           setEmail]           = useState('');
  const [newPassword,     setNewPassword]     = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [codeDigits,      setCodeDigits]      = useState<string[]>(['', '', '', '']);
  
  const [isLoading,    setIsLoading]    = useState(false);
  const [expiresLabel, setExpiresLabel] = useState('10:00');

  const [emailError,           setEmailError]           = useState('');
  const [passwordError,        setPasswordError]        = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const clearTimer = useCallback(() => {
    if(timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const startTimer = useCallback(() => {
    clearTimer();

    let sec = 59;
    let min = TIMER_MINUTES - 1;

    const tick = () => {
      if(min <= 0) {
        setExpiresLabel('Expired!');
        notify('Code expired! Redirecting to login...', 'warning');

        clearTimer();
        setTimeout(() => navigate('/'), 1600);
        return;
      }

      const secLabel = sec >= 10 ? String(sec) : `0${sec}`;

      setExpiresLabel(`${min}:${secLabel}`);
      
      sec--;

      if(sec < 0) {
        sec = 59;
        min--;
      }
    };

    tick();
    timerRef.current = setInterval(tick, 1000);
  }, [clearTimer, navigate, notify]);

  useEffect(() => () => clearTimer(), [clearTimer]);

  const submitEmail = useCallback(async () => {
    const normalized = email.trim().toLowerCase();

    if(!isValidEmail(normalized)) {
      setEmailError('Invalid email address.');
      return;
    }

    setIsLoading(true);
    try {
      const response = await userApi.forgotPassword({ email: normalized });

      if(response.message.toLowerCase().includes('not found')) {
        notify('No account found with this email. Please try again.', 'warning');
        return;
      }

      setEmail(normalized);
      setStep(2);

      notify('Email sent successfully!', 'success');
      startTimer();
    } catch {
      notify('Database access error!', 'danger');
    } finally {
      setIsLoading(false);
    }
  }, [email, notify, startTimer]);

  const submitCode = useCallback(async () => {
    const code = codeDigits.join('');

    if(code.length < 4) {
      notify('Please fill in all fields correctly.', 'danger');
      return;
    }

    setIsLoading(true);

    try {
      const response = await userApi.verifyCode({ email, code });

      if(!response.message.toLowerCase().includes('success')) {
        notify('Invalid code. Check your email and try again.', 'danger');
        return;
      }

      clearTimer();
      setStep(3);
      notify('Code verified successfully!', 'success');
    } catch {
      notify('Database access error!', 'danger');
    } finally {
      setIsLoading(false);
    }
  }, [codeDigits, clearTimer, email, notify]);

  const submitNewPassword = useCallback(async () => {
    if(!isPasswordValid(newPassword)) {
      setPasswordError('Please enter a valid password.');
      return;
    }

    if(!passwordsMatch(newPassword, confirmPassword)) {
      setConfirmPasswordError('Passwords must match.');
      return;
    }

    setIsLoading(true);

    try {
      const response = await userApi.redefinePassword({
        email,
        password: newPassword,
      });

      if(!response.message.toLowerCase().includes('success')) {
        notify('Error redefine password! Enter valid data', 'warning');
        return;
      }

      setStep(4);
      notify('Password reset successfully! Redirecting to login...', 'success');
    } catch {
      notify('Database access error!', 'danger');
    } finally {
      setIsLoading(false);
    }
  }, [confirmPassword, email, newPassword, notify]);

  const goToLogin = useCallback(() => {
    navigate('/');
  }, [navigate]);

  const handleCodeChange = useCallback((index: number, value: string) => {
    const digit = value.replace(/\D/g, '').slice(-1);

    setCodeDigits(prev => {
      const next = [...prev];
      next[index] = digit;
    
      return next;
    });

    if(digit && index < 3) {
      const nextInput = document.getElementById(`forgot-code-${index + 2}`) as HTMLInputElement | null;
      nextInput?.focus();
    }

    if(index === 3 && digit)
      void submitCode();
  }, [submitCode]);

  const handleCodeKeyDown = useCallback((
    index: number,
    event: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if(event.key === 'Backspace' && !codeDigits[index] && index > 0) {
      const prevInput = document.getElementById(`forgot-code-${index}`) as HTMLInputElement | null;

      prevInput?.focus();

      setCodeDigits(prev => {
        const next = [...prev];
        next[index - 1] = '';

        return next;
      });
    }
  }, [codeDigits]);

  const passwordState = getPasswordValidationState(newPassword);

  return {
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
    
    passwordState,
    expiresLabel,
    isLoading,
    
    submitEmail,
    submitCode,
    submitNewPassword,

    goToLogin,
    handleCodeChange,
    handleCodeKeyDown,
  };
};
