import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, Wallet, ArrowUpRight, RefreshCw, History } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getWalletSaldo } from "@/api/keuangan";
import { useAuthStore } from "@/store/authStore";
import LoadingState from "@/components/shared/LoadingState";
import ErrorState from "@/components/shared/ErrorState";
import { formatDateTime } from "@/utils/format";

const formatRupiah = (num: number) =>
  new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(num);

const WalletSaldo: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [showSaldo, setShowSaldo] = useState(true);

  const { data: walletResponse, isLoading, isError, refetch } = useQuery({
    queryKey: ["wallet-saldo", user?.id],
    queryFn: () => getWalletSaldo("faskes", user!.id),
    enabled: !!user?.id,
  });

  const wallet = walletResponse?.data;

  if (isLoading) return <LoadingState message="Memuat saldo..." />;

  if (isError || !wallet) {
    return (
      <ErrorState
        message="Gagal memuat data saldo wallet."
        onRetry={() => window.location.reload()}
      />
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 bg-gradient-to-br from-primary to-primary-hover rounded-card p-6 text-text-inverse relative overflow-hidden">
        <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/4" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/4" />

        <div className="relative">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <span className="bg-white/20 text-white rounded-full p-2.5 inline-flex items-center justify-center backdrop-blur-sm">
                <Wallet className="w-5 h-5" />
              </span>
              <div>
                <p className="text-sm font-semibold text-white/90">Saldo Wallet</p>
                <p className="text-[10px] text-white/60 font-medium">
                  Terakhir diperbarui: {formatDateTime(wallet.updated_at)}
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowSaldo(!showSaldo)}
              className="p-2 rounded-full hover:bg-white/10 text-white/70 hover:text-white transition-colors"
              title={showSaldo ? "Sembunyikan saldo" : "Tampilkan saldo"}
            >
              {showSaldo ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>

          <div className="mb-6">
            <p className="text-xs text-white/60 font-medium uppercase tracking-wider mb-2">
              Saldo Tersedia
            </p>
            <div className="flex items-center space-x-3">
              <p className="text-4xl font-bold tracking-tight">
                {showSaldo ? formatRupiah(wallet.saldo) : "••••••"}
              </p>
              <button
                onClick={() => refetch()}
                className="p-1.5 rounded-full hover:bg-white/10 text-white/50 hover:text-white transition-colors"
                title="Muat ulang"
              >
                <RefreshCw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => navigate("/keuangan/wallet/withdraw")}
              className="inline-flex items-center space-x-2 bg-white/20 hover:bg-white/30 text-white rounded-button px-4 py-2 text-sm font-semibold transition-colors backdrop-blur-sm"
            >
              <ArrowUpRight className="w-4 h-4" />
              <span>Ajukan Withdraw</span>
            </button>
            <button
              onClick={() => navigate("/keuangan/wallet/withdraw/riwayat")}
              className="inline-flex items-center space-x-2 bg-white/10 hover:bg-white/20 text-white/80 hover:text-white rounded-button px-4 py-2 text-sm font-semibold transition-colors backdrop-blur-sm"
            >
              <History className="w-4 h-4" />
              <span>Riwayat</span>
            </button>
          </div>
        </div>
      </div>

      <div className="bg-surface-muted rounded-card p-6">
        <h3 className="text-sm font-semibold text-text mb-4">Informasi Wallet</h3>
        <div className="space-y-3">
        
          <div className="flex items-center justify-between py-2 border-b border-surface/10">
            <span className="text-xs text-text-muted">Tipe Kepemilikan</span>
            <span className="text-xs font-medium text-text capitalize">{wallet.owner_type}</span>
          </div>
          <div className="flex items-center justify-between py-2 border-b border-surface/10">
            <span className="text-xs text-text-muted">Dibuat</span>
            <span className="text-xs text-text">{formatDateTime(wallet.created_at)}</span>
          </div>
          <div className="flex items-center justify-between py-2">
            <span className="text-xs text-text-muted">Diperbarui</span>
            <span className="text-xs text-text">{formatDateTime(wallet.updated_at)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WalletSaldo;