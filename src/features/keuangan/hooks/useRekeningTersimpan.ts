import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getRekeningTersimpan, createRekeningTersimpan, createWithdrawRequest, getWithdrawRequestList } from "@/api/keuangan";
import type {
  CreateRekeningTersimpanPayload,
  WithdrawRequestSavedPayload,
  WithdrawRequestNewPayload,
} from "@/features/keuangan/types";

export const useRekeningTersimpan = (apiUserId: number | undefined) => {
  return useQuery({
    queryKey: ["rekening-tersimpan", apiUserId],
    queryFn: () => getRekeningTersimpan(apiUserId!),
    enabled: !!apiUserId,
  });
};

export const useCreateRekeningTersimpan = (apiUserId: number | undefined) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: Omit<CreateRekeningTersimpanPayload, "api_user_id">) =>
      createRekeningTersimpan({ api_user_id: apiUserId!, ...payload }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["rekening-tersimpan", apiUserId] });
    },
  });
};

export const useCreateWithdrawRequest = (apiUserId: number | undefined) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: WithdrawRequestSavedPayload | WithdrawRequestNewPayload) =>
      createWithdrawRequest(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["wallet-saldo", apiUserId] });
    },
  });
};

export const useWithdrawRequestList = (idUser: number | undefined) => {
  return useQuery({
    queryKey: ["withdraw-request-list", idUser],
    queryFn: () => getWithdrawRequestList(idUser!),
    enabled: !!idUser,
  });
};
