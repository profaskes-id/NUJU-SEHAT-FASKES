import React from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Building2,
  User,
  MapPin,
  ClipboardList,
  Edit,
} from "lucide-react";
import { getFaskesDetail } from "@/api/pengaturan";
import { useAuthStore } from "@/store/authStore";
import LoadingState from "@/components/shared/LoadingState";
import ErrorState from "@/components/shared/ErrorState";
import { formatDateTime } from "@/utils/format";

interface InfoRowProps {
  label: string;
  value: React.ReactNode;
}

const InfoRow: React.FC<InfoRowProps> = ({ label, value }) => (
  <div className="flex items-center justify-between py-2 border-b border-surface/10 last:border-b-0">
    <span className="text-xs text-text-muted">{label}</span>
    <span className="text-sm text-text font-medium text-right">{value || "-"}</span>
  </div>
);

const LabelBadge: React.FC<{ val: string; trueLabel?: string; falseLabel?: string }> = ({
  val,
  trueLabel = "Iya",
  falseLabel = "Tidak",
}) => (
  <span
    className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
      val === "Iya" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"
    }`}
  >
    {val === "Iya" ? trueLabel : falseLabel}
  </span>
);

const ProfileFaskes: React.FC = () => {
  const { user } = useAuthStore();

  const { data: response, isLoading, isError } = useQuery({
    queryKey: ["faskes-detail", user?.id_faskes],
    queryFn: () => getFaskesDetail(user?.id_faskes || ""),
    enabled: !!user?.id_faskes,
  });

  if (isLoading) return <LoadingState message="Memuat profil faskes..." />;

  if (isError || !response?.data) {
    return (
      <ErrorState
        message="Gagal memuat data profil faskes."
        onRetry={() => window.location.reload()}
      />
    );
  }

  const d = response.data;

  const reviewBadge = () => {
    const map: Record<string, { label: string; class: string }> = {
      approved: { label: "Disetujui", class: "bg-green-100 text-green-700" },
      pending: { label: "Menunggu", class: "bg-yellow-100 text-yellow-700" },
      rejected: { label: "Ditolak", class: "bg-red-100 text-red-700" },
    };
    const b = map[d.status_review] || { label: d.status_review, class: "bg-gray-100 text-gray-600" };
    return (
      <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ${b.class}`}>
        {b.label}
      </span>
    );
  };

  return (
    <div className="space-y-4">
      <div className="bg-surface-muted rounded-card overflow-hidden">
        <div className="bg-gradient-to-r from-primary to-primary-hover px-6 py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-14 h-14 rounded-full bg-white/20 text-white flex items-center justify-center text-xl font-bold">
                {d.nama_faskes.charAt(0)}
              </div>
              <div className="text-white">
                <h2 className="text-lg font-bold">{d.nama_faskes}</h2>
                <p className="text-sm text-white/80">{d.nama_pimpinan}</p>
              </div>
            </div>
            <button className="inline-flex items-center space-x-1.5 bg-white/20 hover:bg-white/30 text-white rounded-button px-3 py-1.5 text-xs font-semibold transition-colors backdrop-blur-sm">
              <Edit className="w-3.5 h-3.5" />
              <span>Edit</span>
            </button>
          </div>
        </div>
        <div className="px-6 py-3 flex items-center space-x-3 bg-surface">
          <span className={`inline-flex items-center space-x-1 rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase ${d.is_aktif === "Iya" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${d.is_aktif === "Iya" ? "bg-green-600" : "bg-red-600"}`} />
            <span>{d.is_aktif === "Iya" ? "Aktif" : "Tidak Aktif"}</span>
          </span>
          {reviewBadge()}
        </div>
      </div>

      <div className="bg-surface-muted rounded-card divide-y divide-surface/10">
        <div className="px-6 py-3 flex items-center space-x-3">
          <Building2 className="w-4 h-4 text-text-muted" />
          <h3 className="text-sm font-semibold text-text">Informasi Umum</h3>
        </div>
        <div className="px-6 py-2">
          <InfoRow label="Jenis Faskes" value={d.jenis_faskes?.nama} />
          <InfoRow label="Badan Usaha" value={d.jenis_badan_usaha?.nama} />
          <InfoRow label="Nama Badan Usaha" value={d.nama_badan_usaha} />
          <InfoRow label="Klinik" value={<LabelBadge val={d.is_klinik} />} />
          <InfoRow label="Pelanggan Profaskes" value={<LabelBadge val={d.is_pelanggan_profaskes} />} />
          <InfoRow label="Tingkat Pelayanan" value={d.tingkat_pelayanan} />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-surface-muted rounded-card divide-y divide-surface/10">
          <div className="px-6 py-3 flex items-center space-x-3">
            <ClipboardList className="w-4 h-4 text-text-muted" />
            <h3 className="text-sm font-semibold text-text">Legal</h3>
          </div>
          <div className="px-6 py-2">
            <InfoRow label="Nomor Izin" value={d.nomor_izin} />
            <InfoRow label="NPWP" value={d.nomor_npwp_perusahaan} />
            <InfoRow label="Status Review" value={d.status_review} />
            <InfoRow label="Catatan Review" value={d.catatan_review} />
          </div>
        </div>

        <div className="bg-surface-muted rounded-card divide-y divide-surface/10">
          <div className="px-6 py-3 flex items-center space-x-3">
            <User className="w-4 h-4 text-text-muted" />
            <h3 className="text-sm font-semibold text-text">Penanggung Jawab</h3>
          </div>
          <div className="px-6 py-2">
            <InfoRow label="Nama" value={d.nama_penanggung_jawab} />
            <InfoRow label="Email" value={<span className="text-primary">{d.email_penanggung_jawab}</span>} />
            <InfoRow label="No. HP" value={d.nomor_hp_penanggung_jawab} />
          </div>
        </div>
      </div>

      <div className="bg-surface-muted rounded-card divide-y divide-surface/10">
        <div className="px-6 py-3 flex items-center space-x-3">
          <MapPin className="w-4 h-4 text-text-muted" />
          <h3 className="text-sm font-semibold text-text">Alamat</h3>
        </div>
        <div className="px-6 py-2">
          <InfoRow label="Alamat" value={d.alamat_faskes} />
          <InfoRow label="Provinsi" value={d.provinsi?.nama_prop} />
          <InfoRow label="Kab/Kota" value={d.kab_kota?.nama_kab} />
          <InfoRow label="Kecamatan" value={d.kecamatan?.nama_kec} />
        </div>
      </div>

      <div className="bg-surface-muted rounded-card px-6 py-3 flex items-center justify-between text-xs text-text-muted">
        <span>Dibuat: {formatDateTime(d.created_at)}</span>
        <span>Diperbarui: {formatDateTime(d.updated_at)}</span>
        <span>Oleh: {d.updated_by || "-"}</span>
      </div>
    </div>
  );
};

export default ProfileFaskes;