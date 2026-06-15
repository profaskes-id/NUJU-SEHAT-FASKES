import api from '@/lib/axios';
import type { DokterResponse, DokterDetailResponse } from '@/features/dokter/types';

/**
 * GET /faskes/{id}/dokter
 * Mengambil daftar dokter berdasarkan id_faskes.
 * 
 * @param id_faskes - ID Fasilitas Kesehatan
 * @returns Promise<DokterResponse>
 */
export const getDokterByFaskes = async (id_faskes: string): Promise<DokterResponse> => {
  const response = await api.get<DokterResponse>(`/faskes/${id_faskes}/dokter`);
  return response.data;
};

/**
 * GET /dokter/{id}
 * Mengambil detail dokter berdasarkan id_dokter.
 * 
 * @param id - ID Dokter
 * @returns Promise<DokterDetailResponse>
 */
export const getDokterById = async (id: string): Promise<DokterDetailResponse> => {
  const response = await api.get<DokterDetailResponse>(`/dokter/${id}`);
  return response.data;
};
