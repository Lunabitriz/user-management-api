import type {
  UserProfile,
  VerifyCodePayload,
  UpdateUserPayload,
  ForgotPasswordPayload,
  RedefinePasswordPayload,
} from '../types/api';
import { apiRequest, apiRequestForm } from './client';

export const userApi = {

  getById: (id: number) =>
    apiRequest<UserProfile>(`/user/${id}`, {
      method: 'GET',
      auth: true,
    }),

  update: (payload: UpdateUserPayload) =>
    apiRequest<UserProfile>('/user', {
      method: 'PUT',
      body: payload,
      auth: true,
    }),

  delete: (id: number) =>
    apiRequest<null>(`/user/${id}`, {
      method: 'DELETE',
      auth: true,
    }),

  uploadPhoto: (userId: number, file: File) => {
    const formData = new FormData();

    formData.append('foto', file);
    formData.append('id', String(userId));

    return apiRequestForm<UserProfile>('/user/upload-foto', formData);
  },

  forgotPassword: (payload: ForgotPasswordPayload) =>
    apiRequest<null>('/user/forgot-password', {
      method: 'POST',
      body: payload,
    }),

  verifyCode: (payload: VerifyCodePayload) =>
    apiRequest<null>('/user/verify-send-code', {
      method: 'POST',
      body: payload,
    }),

  redefinePassword: (payload: RedefinePasswordPayload) =>
    apiRequest<null>('/user/redefine-password', {
      method: 'PUT',
      body: payload,
    }),
};
