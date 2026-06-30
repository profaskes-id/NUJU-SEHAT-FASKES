import { useQuery } from '@tanstack/react-query';
import { getRequestDokterById } from '@/api/dokter';

export const useRequestDokterDetail = (id: string) => {
  return useQuery({
    queryKey: ['request-dokter', 'detail', id],
    queryFn: () => getRequestDokterById(id),
    enabled: !!id,
  });
};
