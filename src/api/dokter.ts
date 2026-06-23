import api from '@/lib/axios';
import type {
  DokterResponse,
  DokterDetailResponse,
  InviteDokterListResponse,
  CreateInviteDokterPayload,
  CreateInviteDokterResponse,
  RequestDokterListResponse,
  ApproveRejectResponse,
} from '@/features/dokter/types';

export const getDokterByFaskes = async (id_faskes: string): Promise<DokterResponse> => {
  const response = await api.get<DokterResponse>(`/faskes/${id_faskes}/dokter`);
  return response.data;
};

export const getDokterById = async (id: string): Promise<DokterDetailResponse> => {
  const response = await api.get<DokterDetailResponse>(`/dokter/${id}`);
  return response.data;
};

export const getInviteDokter = async (
  id_faskes: string,
  params?: { page?: number; limit?: number },
): Promise<InviteDokterListResponse> => {
  const response = await api.get<InviteDokterListResponse>('/invite-dokter', {
    params: { id_faskes, ...params },
  });
  return response.data;
};

export const createInviteDokter = async (
  payload: CreateInviteDokterPayload,
): Promise<CreateInviteDokterResponse> => {
  const response = await api.post<CreateInviteDokterResponse>('/invite-dokter', payload);
  return response.data;
};

export const getRequestDokter = async (
  id_faskes: string,
  params?: { page?: number; limit?: number },
): Promise<RequestDokterListResponse> => {
  const response = await api.get<RequestDokterListResponse>('/request-dokter', {
    params: { id_faskes, ...params },
  });
  return response.data;
};

export const approveRequestDokter = async (
  id_faskes: string,
  id_request_dokter: string,
): Promise<ApproveRejectResponse> => {
  const response = await api.post<ApproveRejectResponse>(
    `/request-dokter/${id_request_dokter}/approve`,
    { id_faskes },
  );
  return response.data;
};

export const rejectRequestDokter = async (
  id_faskes: string,
  id_request_dokter: string,
): Promise<ApproveRejectResponse> => {
  const response = await api.post<ApproveRejectResponse>(
    `/request-dokter/${id_request_dokter}/reject`,
    { id_faskes },
  );
  return response.data;
};
