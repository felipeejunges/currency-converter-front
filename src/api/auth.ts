import api from './axios';
import { AuthResponse, LoginRequest, RegisterRequest, RegisterResponse } from '../types';

export const authApi = {
  login: async (credentials: LoginRequest): Promise<AuthResponse> => {
    const response = await api.post('/api/v1/login', credentials);
    return response.data;
  },

  register: async (userData: RegisterRequest): Promise<RegisterResponse> => {
    const response = await api.post('/api/v1/register', userData);
    return response.data;
  },

  logout: async (): Promise<{ message: string }> => {
    const response = await api.delete('/api/v1/logout');
    return response.data;
  },
}; 