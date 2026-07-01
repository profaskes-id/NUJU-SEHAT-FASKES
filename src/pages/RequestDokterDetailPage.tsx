import React, { useState } from "react";
import { useParams, useSearchParams, useNavigate } from "react-router-dom";
import { ChevronLeft, FileText, Check, X, AlertTriangle } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useRequestDokterDetail } from "@/features/dokter/hooks/useRequestDokterDetail";
import { useDokterDetail } from "@/features/dokter/hooks/useDokterDetail";
import { respondRequestDokter } from "@/api/dokter";
import RequestDokterDetailCard from "@/features/dokter/components/RequestDokterDetailCard";
import LoadingState from "@/components/shared/LoadingState";
import ErrorState from "@/components/shared/ErrorState";
import PageHeader from "@/components/shared/PageHeader";
import Modal from "@/components/ui/Modal";

const RequestDokterDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const idDokter = searchParams.get("id_dokter") || "";
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [showAcceptConfirm, setShowAcceptConfirm] = useState(false);
  const [showRejectConfirm, setShowRejectConfirm] = useState(false);

  const {
    data: requestResponse,
    isLoading: isLoadingRequest,
    isError: isErrorRequest,
    refetch: refetchRequest,
  } = useRequestDokterDetail(id || "");

  const { data: dokterResponse, isLoading: isLoadingDokter } =
    useDokterDetail(idDokter);

  const isPending = requestResponse?.data?.status?.toLowerCase() === "pending";

  const rejectMutation = useMutation({
    mutationFn: () =>
      respondRequestDokter(id || "", { status: "rejected", is_aktif: 0 }),
    onSuccess: (data) => {
      toast.success(data.message || "Request ditolak");
      queryClient.invalidateQueries({ queryKey: ["request-dokter"] });
      refetchRequest();
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Gagal menolak request");
    },
  });

  const acceptMutation = useMutation({
    mutationFn: () => {
      const payload = {
        status: "accepted" as const,
        is_aktif: 1,
        tanggal_mulai_praktek: requestResponse?.data?.tgl_berlaku_sip ?? "",
        tanggal_expired_praktek: requestResponse?.data?.tgl_berakhir_sip ?? "",
        tipe_dokter: dokterResponse?.data?.tipe_dokter ?? "umum",
      };
      console.log("Payload accept:", payload);
      return respondRequestDokter(id || "", payload);
    },
    onSuccess: (data) => {
      toast.success(data.message || "Request berhasil diterima");
      queryClient.invalidateQueries({ queryKey: ["request-dokter"] });
      refetchRequest();
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Gagal menerima request");
    },
  });

  const handleBack = () => navigate("/dokter/request");

  const isLoading = isLoadingRequest;
  const isError = isErrorRequest;

  return (
    <div className="min-h-screen bg-surface p-6 space-y-6">
      <PageHeader
        icon={<FileText className="w-5 h-5" />}
        title="Detail Request Dokter"
        description="Informasi lengkap permintaan bergabung dokter."
        backButton={
          <button
            onClick={handleBack}
            className="p-2.5 rounded-full bg-surface-muted hover:bg-surface-border transition-colors text-text-muted mr-2"
            title="Kembali"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
        }
      />
      {!isLoading && !isError && requestResponse?.data && (
        <>
          {isPending && (
            <div className="flex items-center space-x-3 mb-5 px-0">
              <button
                onClick={() => setShowAcceptConfirm(true)}
                className="inline-flex items-center space-x-2 px-4 py-2 rounded-button bg-green-600 hover:bg-green-700 text-white text-sm font-medium transition-colors"
              >
                <Check className="w-4 h-4" />
                <span>Terima</span>
              </button>
              <button
                onClick={() => setShowRejectConfirm(true)}
                disabled={rejectMutation.isPending}
                className="inline-flex items-center space-x-2 px-4 py-2 rounded-button bg-red-500 hover:bg-red-600 text-white text-sm font-medium transition-colors disabled:opacity-50"
              >
                {rejectMutation.isPending ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <X className="w-4 h-4" />
                )}
                <span>Tolak</span>
              </button>
            </div>
          )}
          <RequestDokterDetailCard
            request={requestResponse.data}
            dokter={dokterResponse?.data}
            isLoadingDokter={isLoadingDokter}
          />
        </>
      )}
      <div className="relative min-h-[400px]">
        {isLoading && <LoadingState message="Mengambil detail request..." />}

        {isError && (
          <ErrorState
            message="Terjadi kesalahan saat mengambil detail request."
            onRetry={handleBack}
            retryText="Kembali ke Daftar"
          />
        )}
      </div>

      <Modal
        isOpen={showAcceptConfirm}
        onClose={() => setShowAcceptConfirm(false)}
        title="Konfirmasi Terima"
      >
        <div className="text-center">
          <span className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-green-100 text-green-600 mb-4">
            <Check className="w-7 h-7" />
          </span>
          <p className="text-sm text-text-muted mb-2">
            Apakah Anda yakin ingin menerima pengajuan dokter{" "}
            <span className="font-semibold text-text">{requestResponse?.data?.nama_dokter}</span>?
          </p>
          <p className="text-xs text-text-muted/70 mb-6">
            Tanggal praktek akan otomatis mengikuti data SIP yang diajukan.
          </p>
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setShowAcceptConfirm(false)}
              className="flex-1 px-4 py-2 rounded-button bg-surface-muted hover:bg-surface-border text-text text-sm font-medium transition-colors"
            >
              Batal
            </button>
            <button
              onClick={() => {
                acceptMutation.mutate();
                setShowAcceptConfirm(false);
              }}
              disabled={acceptMutation.isPending}
              className="flex-1 px-4 py-2 rounded-button bg-green-600 hover:bg-green-700 text-white text-sm font-medium transition-colors disabled:opacity-50 flex items-center justify-center"
            >
              {acceptMutation.isPending ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                "Ya, Terima"
              )}
            </button>
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={showRejectConfirm}
        onClose={() => setShowRejectConfirm(false)}
        title="Konfirmasi Tolak"
      >
        <div className="text-center">
          <span className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-red-100 text-red-600 mb-4">
            <AlertTriangle className="w-7 h-7" />
          </span>
          <p className="text-sm text-text-muted mb-6">
            Apakah Anda yakin ingin menolak pengajuan dokter{" "}
            <span className="font-semibold text-text">{requestResponse?.data?.nama_dokter}</span>?
            Tindakan ini tidak dapat dibatalkan.
          </p>
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setShowRejectConfirm(false)}
              className="flex-1 px-4 py-2 rounded-button bg-surface-muted hover:bg-surface-border text-text text-sm font-medium transition-colors"
            >
              Batal
            </button>
            <button
              onClick={() => {
                rejectMutation.mutate();
                setShowRejectConfirm(false);
              }}
              className="flex-1 px-4 py-2 rounded-button bg-red-500 hover:bg-red-600 text-white text-sm font-medium transition-colors"
            >
              Ya, Tolak
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default RequestDokterDetailPage;
