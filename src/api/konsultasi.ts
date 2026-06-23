import api from '@/lib/axios';
import type { BookingListResponse, BookingDetailResponse } from '@/features/konsultasi/types';

export const getBookingList = async (
  id_faskes: string,
  params?: {
    status?: string;
    dokter?: string;
    search?: string;
    tanggal_mulai?: string;
    tanggal_selesai?: string;
    page?: number;
    limit?: number;
  },
): Promise<BookingListResponse> => {
  const response = await api.get<BookingListResponse>(`/faskes/${id_faskes}/booking`, {
    params,
  });
  return response.data;
};

export const getBookingDetail = async (
  id_booking: string,
): Promise<BookingDetailResponse> => {
  const response = await api.get<BookingDetailResponse>(`/faskes/booking/${id_booking}`);
  return response.data;
};