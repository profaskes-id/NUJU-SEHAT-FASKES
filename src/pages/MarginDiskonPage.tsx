import React, { useState } from "react";
import { BadgePercent, Wallet } from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import PageHeader from "@/components/shared/PageHeader";
import LoadingState from "@/components/shared/LoadingState";
import ErrorState from "@/components/shared/ErrorState";
import { 
  useMarginFaskes, 
  useDiskonFaskes, 
  useUpdateMargin, 
  useUpdateDiskon 
} from "@/features/keuangan/hooks/useKeuangan";
import MarginTable from "@/features/keuangan/components/MarginTable";
import DiskonTable from "@/features/keuangan/components/DiskonTable";
import MarginEditModal from "@/features/keuangan/components/MarginEditModal";
import DiskonEditModal from "@/features/keuangan/components/DiskonEditModal";
import type { Margin, Diskon } from "@/features/keuangan/types";
import toast from "react-hot-toast";

type TabType = "margin" | "diskon";

/**
 * MarginDiskonPage - Halaman untuk mengelola margin keuntungan dan diskon faskes.
 */
const MarginDiskonPage: React.FC = () => {
  const { user } = useAuthStore();
  const [activeTab, setActiveTab] = useState<TabType>("margin");
  
  // Modal States
  const [selectedMargin, setSelectedMargin] = useState<Margin | null>(null);
  const [selectedDiskon, setSelectedDiskon] = useState<Diskon | null>(null);
  const [isMarginModalOpen, setIsMarginModalOpen] = useState(false);
  const [isDiskonModalOpen, setIsDiskonModalOpen] = useState(false);

  // Fetch data
  const { data: marginResponse, isLoading: isLoadingMargin, isError: isErrorMargin, refetch: refetchMargin } = useMarginFaskes(user?.id_faskes || "");
  const { data: diskonResponse, isLoading: isLoadingDiskon, isError: isErrorDiskon, refetch: refetchDiskon } = useDiskonFaskes(user?.id_faskes || "");

  // Mutations
  const updateMargin = useUpdateMargin(user?.id_faskes || "");
  const updateDiskon = useUpdateDiskon(user?.id_faskes || "");

  const handleEditMargin = (margin: Margin) => {
    setSelectedMargin(margin);
    setIsMarginModalOpen(true);
  };

  const handleEditDiskon = (diskon: Diskon) => {
    setSelectedDiskon(diskon);
    setIsDiskonModalOpen(true);
  };

  const onMarginSubmit = async (values: { nominal: number }) => {
    if (!selectedMargin) return;
    
    await toast.promise(
      updateMargin.mutateAsync({
        items: [{
          id_jenis_konsultasi: selectedMargin.id_jenis_konsultasi,
          nominal: values.nominal
        }]
      }),
      {
        loading: 'Memperbarui margin...',
        success: 'Margin berhasil diperbarui',
        error: 'Gagal memperbarui margin'
      }
    );
  };

  const onDiskonSubmit = async (values: any) => {
    if (!selectedDiskon) return;

    await toast.promise(
      updateDiskon.mutateAsync({
        items: [{
          id_jenis_konsultasi: selectedDiskon.id_jenis_konsultasi,
          ...values
        }]
      }),
      {
        loading: 'Memperbarui diskon...',
        success: 'Diskon berhasil diperbarui',
        error: 'Gagal memperbarui diskon'
      }
    );
  };

  return (
    <div className="min-h-screen bg-surface p-6 space-y-6">
      <PageHeader 
        icon={<BadgePercent className="w-5 h-5" />}
        title="Margin & Diskon"
        description="Kelola keuntungan faskes dan program promo aktif."
      />

      {/* Tab Navigation */}
      <div className="flex space-x-6 border-b border-surface-border">
        <button
          onClick={() => setActiveTab("margin")}
          className={`pb-4 text-sm font-medium transition-all ${
            activeTab === "margin" 
              ? "border-b-2 border-primary text-primary" 
              : "text-text-muted hover:text-text"
          }`}
        >
          Margin Keuntungan
        </button>
        <button
          onClick={() => setActiveTab("diskon")}
          className={`pb-4 text-sm font-medium transition-all ${
            activeTab === "diskon" 
              ? "border-b-2 border-primary text-primary" 
              : "text-text-muted hover:text-text"
          }`}
        >
          Program Diskon
        </button>
      </div>

      {/* Tab Content */}
      <div className="relative min-h-[400px]">
        {activeTab === "margin" && (
          <>
            {isLoadingMargin && <LoadingState message="Memuat data margin..." />}
            {isErrorMargin && <ErrorState message="Gagal mengambil data margin faskes." onRetry={() => refetchMargin()} />}
            {!isLoadingMargin && !isErrorMargin && marginResponse && (
              <div className="space-y-4">
                <div className="bg-primary-light/30 p-4 rounded-card border border-primary/20 flex items-center">
                  <Wallet className="w-5 h-5 text-primary mr-3" />
                  <p className="text-xs font-medium text-primary">
                    Margin ini akan ditambahkan ke harga dasar konsultasi dari setiap dokter.
                  </p>
                </div>
                <MarginTable data={marginResponse.data} onEdit={handleEditMargin} />
              </div>
            )}
          </>
        )}

        {activeTab === "diskon" && (
          <>
            {isLoadingDiskon && <LoadingState message="Memuat data diskon..." />}
            {isErrorDiskon && <ErrorState message="Gagal mengambil data diskon faskes." onRetry={() => refetchDiskon()} />}
            {!isLoadingDiskon && !isErrorDiskon && diskonResponse && (
              <DiskonTable data={diskonResponse.data} onEdit={handleEditDiskon} />
            )}
          </>
        )}
      </div>

      {/* Modals */}
      <MarginEditModal 
        isOpen={isMarginModalOpen}
        onClose={() => setIsMarginModalOpen(false)}
        margin={selectedMargin}
        onSubmit={onMarginSubmit}
      />
      <DiskonEditModal 
        isOpen={isDiskonModalOpen}
        onClose={() => setIsDiskonModalOpen(false)}
        diskon={selectedDiskon}
        onSubmit={onDiskonSubmit}
      />
    </div>
  );
};

export default MarginDiskonPage;
