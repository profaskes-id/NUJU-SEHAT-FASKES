import api from '@/lib/axios';
import type { LoginResponse } from '@/features/auth/types';

export const login = async (payload: any) => {
  const response = await api.post<LoginResponse>('/auth/login/web', payload);
  return response.data;
};

export const logout = async () => {
  await api.post('/auth/logout');
};
