import api from '@/lib/axios';
import type {
  MarginResponse,
  DiskonResponse,
  UpdateMarginPayload,
  UpdateDiskonPayload
} from '@/features/keuangan/types';

/**
 * GET /faskes/{id_faskes}/margin
 * Mengambil daftar margin faskes berdasarkan id_faskes.
 * 
 * @param id_faskes - ID Fasilitas Kesehatan
 * @returns Promise<MarginResponse>
 */
export const getMarginFaskes = async (id_faskes: string): Promise<MarginResponse> => {
  const response = await api.get<MarginResponse>(`/faskes/${id_faskes}/margin`);
  return response.data;
};

/**
 * POST /faskes/{id_faskes}/margin
 * Memperbarui data margin faskes.
 * 
 * @param id_faskes - ID Fasilitas Kesehatan
 * @param payload - Data margin yang akan diperbarui
 */
export const updateMarginFaskes = async (id_faskes: string, payload: UpdateMarginPayload): Promise<any> => {
  const response = await api.post(`/faskes/${id_faskes}/margin`, payload);
  return response.data;
};

/**
 * GET /faskes/{id_faskes}/diskon
 * Mengambil daftar diskon faskes berdasarkan id_faskes.
 * 
 * @param id_faskes - ID Fasilitas Kesehatan
 * @returns Promise<DiskonResponse>
 */
export const getDiskonFaskes = async (id_faskes: string): Promise<DiskonResponse> => {
  const response = await api.get<DiskonResponse>(`/faskes/${id_faskes}/diskon`);
  return response.data;
};

/**
 * POST /faskes/{id_faskes}/diskon
 * Memperbarui data diskon faskes.
 * 
 * @param id_faskes - ID Fasilitas Kesehatan
 * @param payload - Data diskon yang akan diperbarui
 */
export const updateDiskonFaskes = async (id_faskes: string, payload: UpdateDiskonPayload): Promise<any> => {
  const response = await api.post(`/faskes/${id_faskes}/diskon`, payload);
  return response.data;
};
