import {
  useMemo,
  useState,
  useEffect,
  useContext,
  useCallback,
  createContext,
  type ReactNode,
} from 'react';
import { useNavigate } from 'react-router-dom';
import type { 
  AuthUser, 
  RegisterPayload,
  LoginCredentials, 
} from '../types/api';

import { authApi } from '../api/auth';
import { storage } from '../utils/storage';
import { setUnauthorizedHandler } from '../api/client';
import { useNotification } from './NotificationContext';


interface AuthContextValue {
  user:            AuthUser | null
  isLoading:       boolean
  isAuthenticated: boolean
  register:        (payload: RegisterPayload) => Promise<boolean>
  logout:          (options?: { keepRememberedEmail?: boolean }) => void
  login:           (credentials: LoginCredentials, rememberMe: boolean) => Promise<boolean>
}

const AuthContext = createContext<AuthContextValue | null>(null);

const mapStoredUser = (): AuthUser | null => {
  const id    = storage.getUserId();
  const name  = storage.getUserName();
  const email = storage.getUserEmail();

  if(!id || !name || !email)
    return null;

  return {
    id: Number(id),
    name,
    email,
    profileImage: storage.getUserPhoto(),
  };
};

export const AuthProvider = (
  { children }: { children: ReactNode }
) => {

  const navigate = useNavigate();

  const { notify } = useNotification();

  const [isLoading, setLoading] = useState(false);
  const [user, setUser] = useState<AuthUser | null>(mapStoredUser);

  const logout = useCallback((options?: { keepRememberedEmail?: boolean }) => {
    const keepEmail = options?.keepRememberedEmail ?? (storage.getRememberMe() === 'active');

    storage.clearSession(keepEmail);
    
    setUser(null);
    navigate('/');
  }, [navigate]);

  useEffect(() => {
    setUnauthorizedHandler(() => {
      notify('Session expired. Please log in again.', 'warning');
      logout();
    });
  }, [logout, notify]);

  const persistAuth = useCallback((
    authData: { user: AuthUser; access_token: string },
    rememberMe: boolean,
  ) => {
    storage.persistSession({
      accessToken:  authData.access_token,
      userId:       authData.user.id,
      userName:     authData.user.name,
      userEmail:    authData.user.email,
      rememberMe,
      profileImage: authData.user.profileImage,
    });
    setUser(authData.user);
  }, []);

  const login = useCallback(async (
    credentials: LoginCredentials, rememberMe: boolean
  ) => {

    setLoading(true);

    try {
      const response = await authApi.login(credentials);

      if(!response.data) {
        notify(response.message || 'Login failed! Please check your credentials', 'warning');
        return false;
      }

      persistAuth(response.data, rememberMe);
      notify('Login successful!', 'success');
      navigate('/account');

      return true;
    } catch {
      notify('Database access error!', 'danger');
      return false;
    } finally {
      setLoading(false);
    }
  }, [navigate, notify, persistAuth]);

  const register = useCallback(async (payload: RegisterPayload) => {
    setLoading(true);
    
    try {
      const created = await authApi.register(payload);

      if(!created.data) {
        notify(created.message || 'Failed to create account.', 'danger');
        return false;
      }

      notify('Account created successfully. Signing you in...', 'success');

      return login(
        { email: payload.email, password: payload.password },
        false,
      );
    } catch {
      notify('Database access error!', 'danger');
      return false;
    } finally {
      setLoading(false);
    }
  }, [login, notify]);

  const value = useMemo(() => ({
    user,
    isLoading,
    isAuthenticated: Boolean(user && storage.getAccessToken()),
    login,
    logout,
    register,
  }), [user, isLoading, login, register, logout]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  
  if(!context)
    throw new Error('useAuth deve ser usado dentro de AuthProvider');

  return context;
};
