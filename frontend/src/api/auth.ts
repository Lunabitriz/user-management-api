import type { 
  AuthPayload, 
  UserProfile, 
  RegisterPayload, 
  LoginCredentials, 
} from '../types/api';
import { apiRequest } from './client';

export const authApi = {

  login: (credentials: LoginCredentials) =>
    apiRequest<AuthPayload>('/auth/login', {
      method: 'POST',
      body: credentials,
    }),

  register: (payload: RegisterPayload) =>
    apiRequest<UserProfile>('/user', {
      method: 'POST',
      body: payload,
    }),
};
