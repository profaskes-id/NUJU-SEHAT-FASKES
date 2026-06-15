export interface Dokter {
  id_dokter: string;
  nama_dokter: string;
  nomor_sip_dokter: string;
  status_praktek: number;
  tanggal_expired_praktek: string;
  tipe_dokter: string;
  jenis_kelamin: string;
  is_suspend: number;
  rating_dokter: string;
}

export interface DokterDetail extends Dokter {
  str_dokter: string | null;
  nomor_nik: string;
  email_dokter: string;
  nomor_hp_dokter: string;
  tanggal_lahir: string;
  tahun_pengalaman: number;
  lulusan: string;
  alamat_domisili: string;
  provinsi_domisili_nama: string;
  kab_kota_domisili_nama: string;
  kecamatan_domisili_nama: string;
  desa_domisili_nama: string | null;
  alamat_identitas: string;
  provinsi_identitas_nama: string;
  kab_kota_identitas_nama: string;
  kecamatan_identitas_nama: string;
  desa_identitas_nama: string | null;
  is_identitas_domisili_same: number;
  alasan_suspend: string | null;
  suspend_at: string | null;
  suspend_by: string | null;
  created_at: string;
  updated_at: string | null;
}

export interface Pagination {
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
  hasNextPage: boolean;
  nextPage: number | null;
}

export interface DokterResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: {
    items: Dokter[];
    pagination: Pagination;
  };
}

export interface DokterDetailResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: DokterDetail;
}
