import api from '@/lib/axios';
import type { FaskesDetailResponse } from '@/features/pengaturan/types';

export const getFaskesDetail = async (
  id_faskes: string,
): Promise<FaskesDetailResponse> => {
  const response = await api.get<FaskesDetailResponse>(`/faskes/${id_faskes}`);
  return response.data;
};