import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  getMarginFaskes, 
  getDiskonFaskes, 
  updateMarginFaskes, 
  updateDiskonFaskes 
} from '@/api/keuangan';
import type { UpdateMarginPayload, UpdateDiskonPayload } from '../types';

/**
 * Hook untuk mengambil data margin faskes.
 */
export const useMarginFaskes = (id_faskes: string) => {
  return useQuery({
    queryKey: ['keuangan', 'margin', id_faskes],
    queryFn: () => getMarginFaskes(id_faskes),
    enabled: !!id_faskes,
  });
};

/**
 * Hook untuk memperbarui data margin faskes.
 */
export const useUpdateMargin = (id_faskes: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: UpdateMarginPayload) => updateMarginFaskes(id_faskes, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['keuangan', 'margin', id_faskes] });
    },
  });
};

/**
 * Hook untuk mengambil data diskon faskes.
 */
export const useDiskonFaskes = (id_faskes: string) => {
  return useQuery({
    queryKey: ['keuangan', 'diskon', id_faskes],
    queryFn: () => getDiskonFaskes(id_faskes),
    enabled: !!id_faskes,
  });
};

/**
 * Hook untuk memperbarui data diskon faskes.
 */
export const useUpdateDiskon = (id_faskes: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: UpdateDiskonPayload) => updateDiskonFaskes(id_faskes, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['keuangan', 'diskon', id_faskes] });
    },
  });
};
