import React from "react";
import { 
  Stethoscope, 
  ShieldAlert, 
  Star, 
  Calendar, 
  FileText, 
  User,
  Mail,
  Phone,
  CreditCard,
  GraduationCap,
  Briefcase,
  MapPin,
  Clock
} from "lucide-react";
import type { DokterDetail } from "../types";

interface DokterDetailCardProps {
  dokter: DokterDetail;
}

/**
 * Komponen reusable untuk menampilkan item detail dengan label dan value.
 */
const DetailItem: React.FC<{ icon: React.ReactNode; label: string; value: string | React.ReactNode }> = ({ 
  icon, 
  label, 
  value 
}) => (
  <div className="flex items-start space-x-3 p-3 bg-surface rounded-card border border-surface-border">
    <div className="bg-dark-bg text-white rounded-full p-2 inline-flex items-center justify-center shrink-0">
      {icon}
    </div>
    <div className="flex-1 min-w-0">
      <p className="text-[10px] text-text-muted uppercase font-bold tracking-wider">{label}</p>
      <div className="text-sm font-semibold text-text mt-0.5 break-words">{value || "-"}</div>
    </div>
  </div>
);

/**
 * DokterDetailCard - Menampilkan profil lengkap dokter dengan data terbaru dari API.
 * 
 * @param dokter - Data objek dokter detail
 */
const DokterDetailCard: React.FC<DokterDetailCardProps> = ({ dokter }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      
      {/* Kolom Kiri: Profile Summary (4 cols) */}
      <div className="lg:col-span-4 space-y-6">
        <div className="bg-surface-muted dark:bg-dark-card rounded-card p-6 flex flex-col items-center text-center">
          <div className="w-32 h-32 rounded-full bg-primary-light flex items-center justify-center mb-4 overflow-hidden border-4 border-surface shadow-sm">
            <User className="w-16 h-16 text-primary" />
          </div>
          <h2 className="text-xl font-bold text-text leading-tight">{dokter.nama_dokter}</h2>
          <p className="text-primary font-medium text-sm mt-1">{dokter.tipe_dokter || "Dokter Umum"}</p>
          
          <div className="mt-4 flex items-center justify-center space-x-2">
            <span
              className={`rounded-full px-3 py-1 text-[10px] font-bold uppercase ${
                dokter.status_praktek === 1
                  ? "bg-green-100 text-green-700"
                  : "bg-gray-100 text-gray-600"
              }`}
            >
              {dokter.status_praktek === 1 ? "Aktif" : "Tidak Aktif"}
            </span>
            {dokter.is_suspend === 1 && (
              <span className="bg-red-100 text-red-700 rounded-full px-3 py-1 text-[10px] font-bold uppercase flex items-center">
                <ShieldAlert className="w-3 h-3 mr-1" /> Suspend
              </span>
            )}
          </div>

          <div className="mt-6 w-full pt-6 border-t border-surface-border flex justify-around">
            <div className="text-center">
              <p className="text-[10px] text-text-muted uppercase font-bold">Rating</p>
              <div className="flex items-center text-yellow-500 font-bold mt-1">
                <Star className="w-3 h-3 fill-yellow-500 mr-1" />
                {dokter.rating_dokter || "0.0"}
              </div>
            </div>
            <div className="text-center">
              <p className="text-[10px] text-text-muted uppercase font-bold">Pengalaman</p>
              <div className="flex items-center text-text font-bold mt-1">
                <Briefcase className="w-3 h-3 mr-1 text-text-muted" />
                {dokter.tahun_pengalaman || 0} Thn
              </div>
            </div>
          </div>
        </div>

        {/* Kontak Quick Info */}
        <div className="bg-surface-muted dark:bg-dark-card rounded-card p-6 space-y-4">
          <h3 className="text-sm font-bold text-text flex items-center">
            <Phone className="w-4 h-4 mr-2 text-primary" /> Informasi Kontak
          </h3>
          <div className="space-y-3">
            <div className="flex items-center space-x-3 group">
              <div className="p-2 bg-surface rounded-full border border-surface-border group-hover:border-primary transition-colors">
                <Mail className="w-4 h-4 text-text-muted group-hover:text-primary" />
              </div>
              <div className="overflow-hidden">
                <p className="text-[10px] text-text-muted uppercase font-bold">Email</p>
                <p className="text-xs font-medium text-text truncate">{dokter.email_dokter}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 group">
              <div className="p-2 bg-surface rounded-full border border-surface-border group-hover:border-primary transition-colors">
                <Phone className="w-4 h-4 text-text-muted group-hover:text-primary" />
              </div>
              <div>
                <p className="text-[10px] text-text-muted uppercase font-bold">WhatsApp</p>
                <p className="text-xs font-medium text-text">{dokter.nomor_hp_dokter}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Kolom Kanan: Detail Information (8 cols) */}
      <div className="lg:col-span-8 space-y-6">
        {/* Data Personal & Profesional */}
        <div className="bg-surface-muted dark:bg-dark-card rounded-card p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-base font-semibold text-text flex items-center">
              <User className="w-5 h-5 mr-2 text-primary" /> Data Pribadi & Profesional
            </h3>
            <span className="text-[10px] text-text-muted bg-surface px-2 py-1 rounded-full border border-surface-border">
              ID: {dokter.id_dokter.split('-')[0]}...
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <DetailItem 
              icon={<CreditCard className="w-4 h-4" />}
              label="Nomor NIK"
              value={dokter.nomor_nik}
            />
            <DetailItem 
              icon={<User className="w-4 h-4" />}
              label="Jenis Kelamin"
              value={dokter.jenis_kelamin === "L" ? "Laki-laki" : "Perempuan"}
            />
            <DetailItem 
              icon={<Calendar className="w-4 h-4" />}
              label="Tanggal Lahir"
              value={dokter.tanggal_lahir}
            />
            <DetailItem 
              icon={<GraduationCap className="w-4 h-4" />}
              label="Lulusan"
              value={dokter.lulusan}
            />
            <DetailItem 
              icon={<FileText className="w-4 h-4" />}
              label="Nomor SIP"
              value={<code className="bg-surface px-2 py-0.5 rounded border border-surface-border">{dokter.nomor_sip_dokter || "-"}</code>}
            />
            <DetailItem 
              icon={<Clock className="w-4 h-4" />}
              label="Expired SIP"
              value={dokter.tanggal_expired_praktek || "-"}
            />
          </div>
        </div>

        {/* Data Alamat */}
        <div className="bg-surface-muted dark:bg-dark-card rounded-card p-6">
          <h3 className="text-base font-semibold text-text flex items-center mb-6">
            <MapPin className="w-5 h-5 mr-2 text-primary" /> Informasi Alamat
          </h3>

          <div className="space-y-6">
            {/* Domisili */}
            <div>
              <p className="text-xs font-bold text-text-muted uppercase tracking-widest mb-3 flex items-center">
                <span className="w-2 h-2 bg-primary rounded-full mr-2"></span> Alamat Domisili
              </p>
              <div className="bg-surface p-4 rounded-card border border-surface-border">
                <p className="text-sm font-medium text-text mb-2">{dokter.alamat_domisili}</p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-3 pt-3 border-t border-surface-border">
                  <div>
                    <p className="text-[10px] text-text-muted uppercase font-bold">Provinsi</p>
                    <p className="text-xs font-semibold text-text">{dokter.provinsi_domisili_nama}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-text-muted uppercase font-bold">Kabupaten/Kota</p>
                    <p className="text-xs font-semibold text-text">{dokter.kab_kota_domisili_nama}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-text-muted uppercase font-bold">Kecamatan</p>
                    <p className="text-xs font-semibold text-text">{dokter.kecamatan_domisili_nama}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Identitas (hanya tampil jika berbeda) */}
            {dokter.is_identitas_domisili_same === 0 ? (
              <div>
                <p className="text-xs font-bold text-text-muted uppercase tracking-widest mb-3 flex items-center">
                  <span className="w-2 h-2 bg-text-muted rounded-full mr-2"></span> Alamat Identitas (KTP)
                </p>
                <div className="bg-surface p-4 rounded-card border border-surface-border">
                  <p className="text-sm font-medium text-text mb-2">{dokter.alamat_identitas}</p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-3 pt-3 border-t border-surface-border">
                    <div>
                      <p className="text-[10px] text-text-muted uppercase font-bold">Provinsi</p>
                      <p className="text-xs font-semibold text-text">{dokter.provinsi_identitas_nama}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-text-muted uppercase font-bold">Kabupaten/Kota</p>
                      <p className="text-xs font-semibold text-text">{dokter.kab_kota_identitas_nama}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-text-muted uppercase font-bold">Kecamatan</p>
                      <p className="text-xs font-semibold text-text">{dokter.kecamatan_identitas_nama}</p>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-primary-light/30 border border-primary/20 rounded-card p-3 flex items-center">
                <ShieldAlert className="w-4 h-4 text-primary mr-2" />
                <p className="text-xs font-medium text-primary">Alamat Identitas sama dengan Alamat Domisili</p>
              </div>
            )}
          </div>
        </div>

        {/* Metadata */}
        <div className="flex items-center justify-between px-2">
          <p className="text-[10px] text-text-muted">Terdaftar pada: {dokter.created_at}</p>
          {dokter.updated_at && (
            <p className="text-[10px] text-text-muted">Pembaruan terakhir: {dokter.updated_at}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default DokterDetailCard;
