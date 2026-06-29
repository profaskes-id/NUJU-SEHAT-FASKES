import api from '@/lib/axios';
import type { LoginResponse } from '@/features/auth/types';

export const login = async (payload: any) => {
  const response = await api.post<LoginResponse>('/auth/login/web', payload);
  return response.data;
};

export const logout = async () => {
  await api.post('/auth/logout');
};

export const getMe = async () => {
  const response = await api.get<LoginResponse>('/auth/me');
  return response.data;
};

export const createPin = async (payload: { id_user: number; nomor_pin: string }): Promise<any> => {
  const response = await api.post('/auth/pin/create', payload);
  return response.data;
};
