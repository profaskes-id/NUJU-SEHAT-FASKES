import React from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Building2,
  User,
  MapPin,
  ClipboardList,
  Edit,
  ShieldCheck,
  Phone,
  Mail,
  Fingerprint,
  Hash,
  BadgeCheck,
  Calendar,
} from "lucide-react";
import { getFaskesDetail } from "@/api/pengaturan";
import { useAuthStore } from "@/store/authStore";
import LoadingState from "@/components/shared/LoadingState";
import ErrorState from "@/components/shared/ErrorState";
import { formatDateTime } from "@/utils/format";

const InfoRow: React.FC<{
  icon: React.ReactNode;
  label: string;
  value: string | React.ReactNode;
}> = ({ icon, label, value }) => (
  <div className="flex items-center py-3 px-4 odd:bg-white even:bg-surface-muted dark:odd:bg-dark-card dark:even:bg-dark-surface rounded-lg">
    <div className="flex items-center w-1/2 sm:w-2/5">
      <span className="text-text-muted shrink-0 mr-3">{icon}</span>
      <span className="text-xs font-semibold text-text-muted uppercase tracking-wider">{label}</span>
    </div>
    <div className="w-1/2 sm:w-3/5 text-sm font-medium text-text">{value || "-"}</div>
  </div>
);

const SubHeader: React.FC<{ icon: React.ReactNode; title: string }> = ({ icon, title }) => (
  <div className="flex items-center space-x-2.5 mb-3">
    <span className="text-dark-bg dark:text-dark-text">{icon}</span>
    <h4 className="text-sm font-bold text-dark-bg dark:text-dark-text uppercase tracking-wider">{title}</h4>
  </div>
);

const LabelBadge: React.FC<{
  val: string;
  trueLabel?: string;
  falseLabel?: string;
  trueClass?: string;
  falseClass?: string;
}> = ({
  val,
  trueLabel = "Iya",
  falseLabel = "Tidak",
  trueClass = "bg-green-100 text-green-700",
  falseClass = "bg-gray-100 text-gray-500",
}) => (
  <span
    className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
      val === "Iya" ? trueClass : falseClass
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
    <div className="space-y-5 max-w-5xl mx-auto">
      {/* Header */}
      <div className="bg-gradient-to-r from-dark-bg to-dark-surface rounded-xl overflow-hidden">
        <div className="px-6 py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4 min-w-0">
              <div className="w-12 h-12 rounded-full bg-white/20 text-white flex items-center justify-center text-lg font-bold shrink-0">
                {d.nama_faskes.charAt(0)}
              </div>
              <div className="min-w-0 text-white">
                <h2 className="text-lg font-bold truncate">{d.nama_faskes}</h2>
                <p className="text-sm text-white/80 truncate">{d.nama_pimpinan}</p>
              </div>
            </div>
            <button className="inline-flex items-center space-x-1.5 bg-white/20 hover:bg-white/30 text-white rounded-button px-3 py-1.5 text-xs font-semibold transition-colors backdrop-blur-sm shrink-0">
              <Edit className="w-3.5 h-3.5" />
              <span>Edit</span>
            </button>
          </div>
        </div>
        <div className="px-6 py-3 bg-white/5 flex items-center flex-wrap gap-2 border-t border-white/10">
          <span className={`inline-flex items-center space-x-1 rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase ${d.is_aktif === "Iya" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${d.is_aktif === "Iya" ? "bg-green-600" : "bg-red-600"}`} />
            <span>{d.is_aktif === "Iya" ? "Aktif" : "Tidak Aktif"}</span>
          </span>
          {reviewBadge()}
        </div>
      </div>

      {/* Informasi Umum */}
      <div className="bg-surface-muted dark:bg-dark-card rounded-xl border border-surface-border/40 overflow-hidden">
        <div className="px-5 py-3 border-b border-surface-border/40">
          <SubHeader icon={<Building2 className="w-4 h-4" />} title="Informasi Umum" />
        </div>
        <div className="px-5 pb-4">
          <div className="rounded-lg overflow-hidden border border-surface-border/30 divide-y divide-surface-border/30">
            <InfoRow icon={<Building2 className="w-4 h-4" />} label="Jenis Faskes" value={d.jenis_faskes?.nama} />
            <InfoRow icon={<ClipboardList className="w-4 h-4" />} label="Badan Usaha" value={d.jenis_badan_usaha?.nama} />
            <InfoRow icon={<Hash className="w-4 h-4" />} label="Nama Badan Usaha" value={d.nama_badan_usaha} />
            <InfoRow icon={<BadgeCheck className="w-4 h-4" />} label="Klinik" value={<LabelBadge val={d.is_klinik} />} />
            <InfoRow icon={<ShieldCheck className="w-4 h-4" />} label="Pelanggan Profaskes" value={<LabelBadge val={d.is_pelanggan_profaskes} />} />
            <InfoRow icon={<ClipboardList className="w-4 h-4" />} label="Tingkat Pelayanan" value={d.tingkat_pelayanan} />
          </div>
        </div>
      </div>

      {/* Legal & Penanggung Jawab */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="bg-surface-muted dark:bg-dark-card rounded-xl border border-surface-border/40 overflow-hidden">
          <div className="px-5 py-3 border-b border-surface-border/40">
            <SubHeader icon={<ClipboardList className="w-4 h-4" />} title="Legal" />
          </div>
          <div className="px-5 pb-4">
            <div className="rounded-lg overflow-hidden border border-surface-border/30 divide-y divide-surface-border/30">
              <InfoRow icon={<Fingerprint className="w-4 h-4" />} label="Nomor Izin" value={d.nomor_izin} />
              <InfoRow icon={<Hash className="w-4 h-4" />} label="NPWP" value={d.nomor_npwp_perusahaan} />
              <InfoRow icon={<BadgeCheck className="w-4 h-4" />} label="Status Review" value={reviewBadge()} />
              <InfoRow icon={<ClipboardList className="w-4 h-4" />} label="Catatan Review" value={d.catatan_review} />
            </div>
          </div>
        </div>

        <div className="bg-surface-muted dark:bg-dark-card rounded-xl border border-surface-border/40 overflow-hidden">
          <div className="px-5 py-3 border-b border-surface-border/40">
            <SubHeader icon={<User className="w-4 h-4" />} title="Penanggung Jawab" />
          </div>
          <div className="px-5 pb-4">
            <div className="rounded-lg overflow-hidden border border-surface-border/30 divide-y divide-surface-border/30">
              <InfoRow icon={<User className="w-4 h-4" />} label="Nama" value={d.nama_penanggung_jawab} />
              <InfoRow icon={<Mail className="w-4 h-4" />} label="Email" value={d.email_penanggung_jawab} />
              <InfoRow icon={<Phone className="w-4 h-4" />} label="No. HP" value={d.nomor_hp_penanggung_jawab} />
            </div>
          </div>
        </div>
      </div>

      {/* Alamat */}
      <div className="bg-surface-muted dark:bg-dark-card rounded-xl border border-surface-border/40 overflow-hidden">
        <div className="px-5 py-3 border-b border-surface-border/40">
          <SubHeader icon={<MapPin className="w-4 h-4" />} title="Alamat" />
        </div>
        <div className="px-5 pb-4">
          <div className="rounded-lg overflow-hidden border border-surface-border/30 divide-y divide-surface-border/30">
            <InfoRow icon={<MapPin className="w-4 h-4" />} label="Alamat" value={d.alamat_faskes} />
            <InfoRow icon={<MapPin className="w-4 h-4" />} label="Provinsi" value={d.provinsi?.nama_prop} />
            <InfoRow icon={<MapPin className="w-4 h-4" />} label="Kab/Kota" value={d.kab_kota?.nama_kab} />
            <InfoRow icon={<MapPin className="w-4 h-4" />} label="Kecamatan" value={d.kecamatan?.nama_kec} />
          </div>
        </div>
      </div>

      {/* Metadata */}
      <div className="bg-surface-muted dark:bg-dark-card rounded-xl border border-surface-border/40 px-5 py-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="text-[10px] text-text-muted flex items-center">
            <Calendar className="w-3 h-3 mr-1" /> Dibuat: {formatDateTime(d.created_at)}
          </span>
          <span className="text-[10px] text-text-muted flex items-center">
            <Calendar className="w-3 h-3 mr-1" /> Diperbarui: {formatDateTime(d.updated_at)}
          </span>
          <span className="text-[10px] text-text-muted flex items-center">
            <User className="w-3 h-3 mr-1" /> Oleh: {d.updated_by || "-"}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ProfileFaskes;
