import { useQuery } from '@tanstack/react-query';
import { getDokterById } from '@/api/dokter';

/**
 * Hook untuk mengambil detail dokter berdasarkan ID.
 * Menggunakan TanStack Query untuk management server state.
 * 
 * @param id - ID Dokter yang ingin diambil detailnya.
 * @returns Object yang berisi data dokter, status loading, dan status error.
 */
export const useDokterDetail = (id: string) => {
  return useQuery({
    queryKey: ['dokter', 'detail', id],
    queryFn: () => getDokterById(id),
    enabled: !!id,
  });
};
