export interface JenisBadanUsaha {
  kode: number;
  nama: string;
}

export interface JenisFaskes {
  kode: number;
  nama: string;
}

export interface Provinsi {
  kode_prop: string;
  nama_prop: string;
}

export interface KabKota {
  kode_kab: string;
  nama_kab: string;
}

export interface Kecamatan {
  kode_kec: string;
  nama_kec: string;
}

export interface FaskesDetail {
  id_fasilitas_kesehatan: string;
  is_klinik: string;
  nama_faskes: string;
  nama_pimpinan: string;
  alamat_faskes: string;
  logo_faskes: string | null;
  id_provinsi: string;
  id_kab_kota: string;
  nomor_hp_penanggung_jawab: string;
  nama_badan_usaha: string;
  jenis_badan_usaha: JenisBadanUsaha;
  tingkat_pelayanan: string | null;
  jenis_faskes: JenisFaskes;
  nama_penanggung_jawab: string;
  nomor_izin: string;
  surat_izin: string | null;
  nomor_npwp_perusahaan: string;
  is_pelanggan_profaskes: string;
  url_faskes: string | null;
  is_aktif: string;
  status_review: string;
  catatan_review: string | null;
  created_at: string;
  created_by: string | null;
  updated_at: string;
  updated_by: string;
  api_user_id: number;
  id_kecamatan: string;
  email_penanggung_jawab: string;
  provinsi: Provinsi;
  kab_kota: KabKota;
  kecamatan: Kecamatan;
}

export interface FaskesDetailResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: FaskesDetail;
}