import React from "react";
import {
  FileText,
  Calendar,
  Building2,
  User,
  Stethoscope,
  ShieldAlert,
  Star,
  Mail,
  Phone,
  CreditCard,
  GraduationCap,
  Briefcase,
  MapPin,
  Clock,
  Fingerprint,
  AlertTriangle,
  Microscope,
} from "lucide-react";
import type { RequestDokter } from "@/features/dokter/types";
import type { DokterDetail } from "@/features/dokter/types";

interface RequestDokterDetailCardProps {
  request: RequestDokter;
  dokter?: DokterDetail;
  isLoadingDokter: boolean;
}

const statusBadge: Record<string, { label: string; class: string }> = {
  pending: {
    label: "Menunggu",
    class: "bg-yellow-100 text-yellow-700 ring-1 ring-yellow-300/50",
  },
  accepted: {
    label: "Diterima",
    class: "bg-green-100 text-green-700 ring-1 ring-green-300/50",
  },
  rejected: {
    label: "Ditolak",
    class: "bg-red-100 text-red-700 ring-1 ring-red-300/50",
  },
};

const InfoRow: React.FC<{
  icon: React.ReactNode;
  label: string;
  value: string | React.ReactNode;
}> = ({ icon, label, value }) => (
  <div className="flex items-center py-3 px-4 odd:bg-white even:bg-surface-muted dark:odd:bg-dark-card dark:even:bg-dark-surface rounded-lg">
    <div className="flex items-center w-1/2 sm:w-2/5">
      <span className="text-text-muted shrink-0 mr-3">{icon}</span>
      <span className="text-xs font-semibold text-text-muted uppercase tracking-wider">
        {label}
      </span>
    </div>
    <div className="w-1/2 sm:w-3/5 text-sm font-medium text-text">
      {value || "-"}
    </div>
  </div>
);

const SubHeader: React.FC<{ icon: React.ReactNode; title: string }> = ({
  icon,
  title,
}) => (
  <div className="flex items-center space-x-2.5 mb-3">
    <span className="text-dark-bg dark:text-dark-text">{icon}</span>
    <h4 className="text-sm font-bold text-dark-bg dark:text-dark-text uppercase tracking-wider">
      {title}
    </h4>
  </div>
);

const RequestDokterDetailCard: React.FC<RequestDokterDetailCardProps> = ({
  request,
  dokter,
  isLoadingDokter,
}) => {
  const badge = statusBadge[request.status.toLowerCase()] || {
    label: request.status,
    class: "bg-gray-100 text-gray-600 ring-1 ring-gray-300/50",
  };

  return (
    <div className="space-y-5 max-w-5xl mx-auto">
      {/* Card: Informasi Pengajuan */}
      <div className="bg-surface-muted dark:bg-dark-card rounded-xl border border-surface-border/40 overflow-hidden">
        <div className="px-5 py-4 border-b border-surface-border/40 flex items-center space-x-3 bg-dark-surface">
          <FileText className="w-5 h-5 text-white" />
          <h3 className="text-base font-bold text-white">
            Informasi Pengajuan
          </h3>
        </div>
        <div className="divide-y divide-surface-border/30">
          <InfoRow
            icon={<User className="w-4 h-4" />}
            label="Nama Dokter"
            value={request.nama_dokter}
          />
          <InfoRow
            icon={<Fingerprint className="w-4 h-4" />}
            label="Nomor SIP"
            value={
              <code className="bg-surface dark:bg-dark-surface px-2 py-0.5 rounded border border-surface-border text-xs font-mono">
                {request.nomor_sip || "-"}
              </code>
            }
          />
          <InfoRow
            icon={<Building2 className="w-4 h-4" />}
            label="Faskes Tujuan"
            value={request.nama_faskes}
          />
          <InfoRow
            icon={<Calendar className="w-4 h-4" />}
            label="Tanggal Pengajuan"
            value={request.created_at}
          />
          <InfoRow
            icon={<Calendar className="w-4 h-4" />}
            label="Diterima Pada"
            value={
              request.accepted_at || (
                <span className="text-text-muted/50 italic text-xs">
                  Belum diterima
                </span>
              )
            }
          />
          <InfoRow
            icon={<Stethoscope className="w-4 h-4" />}
            label="Status"
            value={
              <span
                className={`inline-block rounded-full px-3 py-0.5 text-[10px] font-bold uppercase tracking-wider ${badge.class}`}
              >
                {badge.label}
              </span>
            }
          />
        </div>
      </div>

      {/* Card: Profil Dokter */}
      <div className="bg-surface-muted dark:bg-dark-card rounded-xl border border-surface-border/40 overflow-hidden">
        <div className="px-5 py-4 border-b border-surface-border/40 flex items-center space-x-3 bg-dark-surface">
          <User className="w-5 h-5 text-white dark:text-dark-text" />
          <h3 className="text-base font-bold text-white">Profil Dokter</h3>
        </div>

        {isLoadingDokter ? (
          <div className="flex items-center justify-center py-16">
            <div className="w-8 h-8 border-[3px] border-dark-bg/20 border-t-dark-bg rounded-full animate-spin" />
            <span className="ml-3 text-sm font-medium text-text-muted">
              Memuat data dokter...
            </span>
          </div>
        ) : dokter ? (
          <div className="divide-y divide-surface-border/30">
            {/* Profile Header */}
            <div className="flex items-center space-x-4 px-5 py-5">
              <div className="w-14 h-14 rounded-full bg-dark-bg/10 dark:bg-dark-surface flex items-center justify-center shrink-0">
                <User className="w-7 h-7 text-dark-bg dark:text-dark-text" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-lg font-bold text-text truncate">
                  {dokter.nama_dokter}
                </h4>
                <p className="text-sm text-dark-bg dark:text-dark-text">
                  {dokter.tipe_dokter === "spesialis"
                    ? `Spesialis ${dokter.spesialis_dokter || ""}`
                    : dokter.tipe_dokter || "Dokter Umum"}
                </p>
                <div className="flex flex-wrap items-center gap-1.5 mt-1.5">
                  <span className="rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase bg-blue-100 text-blue-700">
                    {dokter.jenis_kelamin === "L" ? "Laki-laki" : "Perempuan"}
                  </span>
                  {dokter.is_suspend === 1 && (
                    <span className="rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase bg-red-100 text-red-700 flex items-center">
                      <ShieldAlert className="w-3 h-3 mr-0.5" /> Suspend
                    </span>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-4 shrink-0 pl-4 border-l border-surface-border/40">
                <div className="text-center">
                  <p className="text-[10px] text-text-muted uppercase font-bold">
                    Rating
                  </p>
                  <div className="flex items-center text-yellow-500 font-bold mt-0.5">
                    <Star className="w-3.5 h-3.5 fill-yellow-500 mr-0.5" />
                    {dokter.rating_dokter || "0.0"}
                  </div>
                </div>
                <div className="text-center">
                  <p className="text-[10px] text-text-muted uppercase font-bold">
                    Pengalaman
                  </p>
                  <div className="flex items-center text-text font-bold mt-0.5">
                    <Briefcase className="w-3.5 h-3.5 mr-0.5 text-text-muted" />
                    {dokter.tahun_pengalaman || 0} Thn
                  </div>
                </div>
              </div>
            </div>

            {/* Data Pribadi & Profesional */}
            <div className="px-5 py-4">
              <SubHeader
                icon={<User className="w-4 h-4" />}
                title="Data Pribadi & Profesional"
              />
              <div className="rounded-lg overflow-hidden border border-surface-border/30 divide-y divide-surface-border/30">
                <InfoRow
                  icon={<CreditCard className="w-4 h-4" />}
                  label="NIK"
                  value={dokter.nomor_nik}
                />
                <InfoRow
                  icon={<Calendar className="w-4 h-4" />}
                  label="Tanggal Lahir"
                  value={dokter.tanggal_lahir}
                />
                <InfoRow
                  icon={<GraduationCap className="w-4 h-4" />}
                  label="Lulusan"
                  value={dokter.lulusan}
                />
                <InfoRow
                  icon={<Microscope className="w-4 h-4" />}
                  label="Spesialisasi"
                  value={dokter.spesialis_dokter || "-"}
                />

                <InfoRow
                  icon={<Fingerprint className="w-4 h-4" />}
                  label="STR"
                  value={dokter.str_dokter || "-"}
                />
              </div>
            </div>

            {/* Kontak */}
            <div className="px-5 py-4">
              <SubHeader icon={<Phone className="w-4 h-4" />} title="Kontak" />
              <div className="rounded-lg overflow-hidden border border-surface-border/30 divide-y divide-surface-border/30">
                <InfoRow
                  icon={<Mail className="w-4 h-4" />}
                  label="Email"
                  value={dokter.email_dokter}
                />
                <InfoRow
                  icon={<Phone className="w-4 h-4" />}
                  label="Nomor HP"
                  value={dokter.nomor_hp_dokter}
                />
              </div>
            </div>

            {/* Alamat */}
            <div className="px-5 py-4">
              <SubHeader icon={<MapPin className="w-4 h-4" />} title="Alamat" />
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="rounded-lg overflow-hidden border border-surface-border/30 divide-y divide-surface-border/30">
                  <div className="px-4 py-2.5 bg-white dark:bg-dark-card text-xs font-bold text-text-muted uppercase tracking-wider">
                    Domisili
                  </div>
                  <InfoRow
                    icon={<MapPin className="w-4 h-4" />}
                    label="Alamat"
                    value={dokter.alamat_domisili}
                  />
                  <InfoRow
                    icon={<MapPin className="w-4 h-4" />}
                    label="Provinsi"
                    value={dokter.provinsi_domisili_nama}
                  />
                  <InfoRow
                    icon={<MapPin className="w-4 h-4" />}
                    label="Kab/Kota"
                    value={dokter.kab_kota_domisili_nama}
                  />
                  <InfoRow
                    icon={<MapPin className="w-4 h-4" />}
                    label="Kecamatan"
                    value={dokter.kecamatan_domisili_nama}
                  />
                  <InfoRow
                    icon={<MapPin className="w-4 h-4" />}
                    label="Desa"
                    value={dokter.desa_domisili_nama}
                  />
                </div>

                {dokter.is_identitas_domisili_same === 1 ? (
                  <div className="flex items-start p-5 bg-dark-bg/5 dark:bg-dark-surface rounded-lg border border-dark-bg/10">
                    <ShieldAlert className="w-5 h-5 text-dark-bg dark:text-dark-text shrink-0 mt-0.5 mr-3" />
                    <div>
                      <p className="text-sm font-bold text-dark-bg dark:text-dark-text">
                        Alamat Identitas Sama
                      </p>
                      <p className="text-xs text-dark-bg/60 dark:text-dark-text/60 mt-0.5">
                        Alamat KTP identik dengan alamat domisili.
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="rounded-lg overflow-hidden border border-surface-border/30 divide-y divide-surface-border/30">
                    <div className="px-4 py-2.5 bg-white dark:bg-dark-card text-xs font-bold text-text-muted uppercase tracking-wider">
                      Identitas (KTP)
                    </div>
                    <InfoRow
                      icon={<MapPin className="w-4 h-4" />}
                      label="Alamat"
                      value={dokter.alamat_identitas}
                    />
                    <InfoRow
                      icon={<MapPin className="w-4 h-4" />}
                      label="Provinsi"
                      value={dokter.provinsi_identitas_nama}
                    />
                    <InfoRow
                      icon={<MapPin className="w-4 h-4" />}
                      label="Kab/Kota"
                      value={dokter.kab_kota_identitas_nama}
                    />
                    <InfoRow
                      icon={<MapPin className="w-4 h-4" />}
                      label="Kecamatan"
                      value={dokter.kecamatan_identitas_nama}
                    />
                    <InfoRow
                      icon={<MapPin className="w-4 h-4" />}
                      label="Desa"
                      value={dokter.desa_identitas_nama}
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Suspend Info */}
            {dokter.is_suspend === 1 && (
              <div className="px-5 py-4">
                <SubHeader
                  icon={<AlertTriangle className="w-4 h-4" />}
                  title="Informasi Suspend"
                />
                <div className="rounded-lg overflow-hidden border border-red-200/60 dark:border-red-800/40 divide-y divide-red-200/30 dark:divide-red-800/30 bg-red-50 dark:bg-red-950/30">
                  <InfoRow
                    icon={<AlertTriangle className="w-4 h-4" />}
                    label="Alasan"
                    value={dokter.alasan_suspend || "-"}
                  />
                  <InfoRow
                    icon={<Calendar className="w-4 h-4" />}
                    label="Tanggal Suspend"
                    value={dokter.suspend_at || "-"}
                  />
                  <InfoRow
                    icon={<User className="w-4 h-4" />}
                    label="Oleh"
                    value={dokter.suspend_by || "-"}
                  />
                </div>
              </div>
            )}

            {/* Metadata */}
            <div className="flex flex-wrap items-center justify-between gap-2 px-5 py-3">
              <span className="text-[10px] text-text-muted flex items-center">
                <Clock className="w-3 h-3 mr-1" /> Dibuat:{" "}
                {dokter.created_at || "-"}
              </span>
              {dokter.updated_at && (
                <span className="text-[10px] text-text-muted flex items-center">
                  <Clock className="w-3 h-3 mr-1" /> Diperbarui:{" "}
                  {dokter.updated_at}
                </span>
              )}
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <User className="w-10 h-10 text-text-muted/30 mx-auto mb-2" />
            <p className="text-sm text-text-muted italic">
              Data dokter tidak tersedia.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RequestDokterDetailCard;
