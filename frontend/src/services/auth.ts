import api from './api';
import { LoginRequest, RegisterRequest, AuthResponse } from '@/types';

export const authService = {
  login: async (req: LoginRequest): Promise<AuthResponse> => {
    const { data } = await api.post<AuthResponse>('/api/auth/login', req);
    localStorage.setItem('am_token', data.token);
    return data;
  },

  register: async (req: RegisterRequest): Promise<AuthResponse> => {
    const { data } = await api.post<AuthResponse>('/api/auth/register', req);
    localStorage.setItem('am_token', data.token);
    return data;
  },

  logout: () => {
    localStorage.removeItem('am_token');
    window.location.href = '/login';
  },

  getToken: () => localStorage.getItem('am_token'),
  isLoggedIn: () => !!localStorage.getItem('am_token'),
};
