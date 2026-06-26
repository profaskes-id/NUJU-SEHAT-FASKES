import React from "react";
import { ArrowLeft, ArrowUpRight, Building2, Check, X, Clock, AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";
import { useWithdrawRequestList } from "@/features/keuangan/hooks/useRekeningTersimpan";
import LoadingState from "@/components/shared/LoadingState";
import ErrorState from "@/components/shared/ErrorState";
import { formatDateTime } from "@/utils/format";

const formatRupiah = (num: number) =>
  new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(num);

const statusBadge: Record<string, { label: string; class: string }> = {
  pending: { label: "Pending", class: "bg-yellow-100 text-yellow-700" },
  approved: { label: "Disetujui", class: "bg-green-100 text-green-700" },
  rejected: { label: "Ditolak", class: "bg-red-100 text-red-700" },
};

const statusIcon: Record<string, React.ReactNode> = {
  pending: <Clock className="w-3 h-3" />,
  approved: <Check className="w-3 h-3" />,
  rejected: <X className="w-3 h-3" />,
};

const RiwayatWithdraw: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();

  const { data, isLoading, isError, refetch } = useWithdrawRequestList(user?.id);

  const items = data?.data?.items ?? [];

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <button
          onClick={() => navigate("/keuangan/wallet")}
          className="p-2 rounded-full hover:bg-surface-muted text-text-muted hover:text-text transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="flex items-center space-x-3">
          <span className="bg-dark-bg text-white rounded-full p-2.5 inline-flex items-center justify-center shadow-sm">
            <ArrowUpRight className="w-5 h-5" />
          </span>
          <div>
            <h1 className="text-2xl font-bold text-text leading-tight">Pengajuan Withdraw</h1>
            <p className="text-sm text-text-muted mt-0.5">Riwayat pengajuan penarikan saldo Anda</p>
          </div>
        </div>
      </div>

      <div className="bg-surface-muted rounded-card overflow-hidden">
        <div className="px-6 py-4 border-b border-surface/10 flex items-center space-x-3">
          <span className="bg-dark-bg text-white rounded-full p-2.5 inline-flex items-center justify-center">
            <ArrowUpRight className="w-4 h-4" />
          </span>
          <h3 className="text-base font-semibold text-text">Riwayat Pengajuan</h3>
        </div>

        <div className="overflow-x-auto min-h-[200px]">
          {isLoading && <LoadingState message="Memuat riwayat withdraw..." />}

          {isError && (
            <div className="p-6">
              <ErrorState message="Gagal memuat riwayat withdraw." onRetry={refetch} />
            </div>
          )}

          {!isLoading && !isError && (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface text-text-muted text-[10px] uppercase tracking-wider">
                  <th className="px-6 py-4 font-bold">Tanggal</th>
                  <th className="px-6 py-4 font-bold">Pemohon</th>
                  <th className="px-6 py-4 font-bold">Bank</th>
                  <th className="px-6 py-4 font-bold">No. Rekening</th>
                  <th className="px-6 py-4 font-bold">Jumlah</th>
                  <th className="px-6 py-4 font-bold">Status</th>
                </tr>
              </thead>
              <tbody>
                {items.length > 0 ? (
                  items.map((item) => {
                    const badge = statusBadge[item.status] || { label: item.status, class: "bg-gray-100 text-gray-700" };
                    return (
                      <tr key={item.id_withdraw_requests} className="hover:bg-surface transition-colors">
                        <td className="px-6 py-4 border-b border-surface/10 text-sm text-text">
                          {formatDateTime(item.requested_at)}
                        </td>
                        <td className="px-6 py-4 border-b border-surface/10 text-sm text-text">
                          {item.nama_pemohon}
                        </td>
                        <td className="px-6 py-4 border-b border-surface/10 text-sm text-text">
                          <div className="flex items-center space-x-1.5">
                            <Building2 className="w-3.5 h-3.5 text-text-muted" />
                            <span>{item.nama_bank}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 border-b border-surface/10 text-sm text-text-muted">
                          {item.nomor_rekening}
                        </td>
                        <td className="px-6 py-4 border-b border-surface/10 text-sm font-semibold text-text">
                          {formatRupiah(item.amount)}
                        </td>
                        <td className="px-6 py-4 border-b border-surface/10">
                          <span className={`inline-flex items-center space-x-1 rounded-full px-2 py-0.5 text-xs font-medium ${badge.class}`}>
                            {statusIcon[item.status] || <AlertCircle className="w-3 h-3" />}
                            <span>{badge.label}</span>
                          </span>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-text-muted italic">
                      Belum ada pengajuan withdraw.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default RiwayatWithdraw;
