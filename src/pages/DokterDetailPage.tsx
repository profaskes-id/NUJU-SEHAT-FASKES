import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ChevronLeft, Stethoscope } from "lucide-react";
import { useDokterDetail } from "@/features/dokter/hooks/useDokterDetail";
import DokterDetailCard from "@/features/dokter/components/DokterDetailCard";
import LoadingState from "@/components/shared/LoadingState";
import ErrorState from "@/components/shared/ErrorState";
import PageHeader from "@/components/shared/PageHeader";

/**
 * DokterDetailPage - Halaman untuk menampilkan detail lengkap seorang dokter.
 * Merakit komponen dari features/dokter.
 */
const DokterDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  /**
   * Mengambil data detail dokter menggunakan custom hook.
   */
  const { data: response, isLoading, isError } = useDokterDetail(id || "");

  const handleBack = () => {
    navigate("/dokter");
  };

  return (
    <div className="min-h-screen bg-surface p-6 space-y-6">
      {/* Header Page */}
      <PageHeader 
        icon={<Stethoscope className="w-5 h-5" />}
        title="Detail Dokter"
        description="Lihat informasi mendalam profil dokter."
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

      {/* Main Content Area */}
      <div className="relative min-h-[400px]">
        {isLoading && <LoadingState message="Mengambil data dokter..." />}
        
        {isError && (
          <ErrorState 
            message="Terjadi kesalahan saat mengambil detail dokter. Silakan periksa koneksi internet Anda atau coba lagi nanti."
            onRetry={handleBack}
            retryText="Kembali ke Daftar"
          />
        )}

        {!isLoading && !isError && response?.data && (
          <DokterDetailCard dokter={response.data} />
        )}
      </div>
    </div>
  );
};

export default DokterDetailPage;
