import { storage } from '../utils/storage';
import type { ApiResponse } from '../types/api';

const API_BASE = import.meta.env.VITE_API_URL ?? '';

type RequestOptions = Omit<RequestInit, 'body'> & {
  body?: unknown
  auth?: boolean
}

let onUnauthorized: (() => void) | null = null;

export const setUnauthorizedHandler = (handler: () => void) => {
  onUnauthorized = handler;
};

const buildHeaders = (auth: boolean, extra?: HeadersInit): HeadersInit => {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if(auth) {
    const token = storage.getAccessToken();
    
    if(token)
      headers.Authorization = `Bearer ${token}`;
  }

  return { ...headers, ...(extra as Record<string, string> | undefined) };
};

export const apiRequest = async <T>(
  path:    string,
  options: RequestOptions = {},
): Promise<ApiResponse<T>> => {

  const { 
    auth = false, 
    body, 
    headers, 
    ...rest 
  } = options;

  const response = await fetch(`${API_BASE}${path}`, {
    ...rest,
    headers: buildHeaders(auth, headers),
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  if(response.status === 401 && auth) {
    storage.clearSession();
    onUnauthorized?.();

    throw new Error('Sessão expirada');
  }

  const payload = await response.json() as ApiResponse<T>;
  return payload;
};

export const apiRequestForm = async <T>(
  path:     string,
  formData: FormData,
): Promise<ApiResponse<T>> => {

  const token = storage.getAccessToken();
  const headers: Record<string, string> = {};

  if(token)
    headers.Authorization = `Bearer ${token}`;

  const response = await fetch(`${API_BASE}${path}`, {
    method: 'POST',
    headers,
    body: formData,
  });

  if(response.status === 401) {
    storage.clearSession();
    onUnauthorized?.();
    
    throw new Error('Sessão expirada');
  }

  return response.json() as Promise<ApiResponse<T>>;
};
