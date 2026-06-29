import api from '@/lib/axios';
import type {
  MarginResponse,
  DiskonResponse,
  UpdateMarginPayload,
  UpdateDiskonPayload,
  WalletResponse,
  WalletTransactionResponse,
  WithdrawPayload,
  RekeningTersimpanResponse,
  CreateRekeningTersimpanPayload,
  WithdrawRequestSavedPayload,
  WithdrawRequestNewPayload,
  WithdrawRequestListResponse,
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

export const getWalletSaldo = async (
  ownerType: string,
  ownerId: number,
): Promise<WalletResponse> => {
  const response = await api.get<WalletResponse>('/wallet/saldo', {
    params: { owner_type: ownerType, owner_id: ownerId },
  });
  return response.data;
};

export const getWalletTransactions = async (
  ownerType: string,
  ownerId: number,
): Promise<WalletTransactionResponse> => {
  const response = await api.get<WalletTransactionResponse>('/wallet/transactions', {
    params: { owner_type: ownerType, owner_id: ownerId },
  });
  return response.data;
};

export const submitWithdraw = async (payload: WithdrawPayload): Promise<any> => {
  const response = await api.post('/wallet/withdraw', payload);
  return response.data;
};

export const getRekeningTersimpan = async (apiUserId: number): Promise<RekeningTersimpanResponse> => {
  const response = await api.get<RekeningTersimpanResponse>('/rekening-tersimpan', {
    params: { api_user_id: apiUserId },
  });
  return response.data;
};

export const createRekeningTersimpan = async (payload: CreateRekeningTersimpanPayload): Promise<any> => {
  const response = await api.post('/rekening-tersimpan', payload);
  return response.data;
};

export const createWithdrawRequest = async (
  payload: WithdrawRequestSavedPayload | WithdrawRequestNewPayload,
): Promise<any> => {
  const response = await api.post('/withdraw-request/create', payload);
  return response.data;
};

export const getWithdrawRequestList = async (idUser: number): Promise<WithdrawRequestListResponse> => {
  const response = await api.get<WithdrawRequestListResponse>('/withdraw-request/index', {
    params: { id_user: idUser },
  });
  return response.data;
};

export const verifyPin = async (payload: { id_user: number; nomor_pin: string }): Promise<any> => {
  const response = await api.post('/auth/pin/verify', payload);
  return response.data;
};
