export interface Dokter {
  id_dokter: string;
  nama_dokter: string;
  nomor_sip_dokter: string;
  status_praktek: number;
  tanggal_expired_praktek: string;
  tipe_dokter: string;
  spesialis_dokter: string | null;
  jenis_kelamin: string;
  is_suspend: number;
  rating: string;
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
  tgl_berlaku_str: string | null;
  tgl_berakhir_str: string | null;
  foto: string | null;
  ktp: string | null;
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

export interface InvitedDokter {
  id_invite: string;
  id_faskes: string;
  email_dokter: string;
  nomor_hp_dokter: string;
  token_invite: string;
  status: string;
  accepted_at: string | null;
  created_at: string;
  created_by: string | null;
  nama_faskes: string;
}

export interface InviteDokterListResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: {
    items: InvitedDokter[];
    pagination: Pagination;
  };
}

export interface CreateInviteDokterPayload {
  id_faskes: string;
  email_dokter: string;
  nomor_hp_dokter: string;
}

export interface CreateInviteDokterResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: InvitedDokter;
}

export interface RequestDokter {
  id_request_dokter: string;
  id_dokter: string;
  nomor_sip: string;
  id_faskes: string;
  status: string;
  created_at: string;
  accepted_at: string | null;
  nama_dokter: string;
  nama_faskes: string;
  tgl_berlaku_sip: string | null;
  tgl_berakhir_sip: string | null;
}

export interface RequestDokterListResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: {
    items: RequestDokter[];
    pagination: Pagination;
  };
}

export interface ReviewDokter {
  id_review_dokter: string;
  id_dokter: string;
  id_customer: string;
  nama_customer: string;
  bintang: number;
  ulasan: string;
  created_at: string;
}

export interface ReviewDokterResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: {
    items: ReviewDokter[];
    pagination: Pagination;
  };
}

export interface ApproveRejectResponse {
  success: boolean;
  statusCode: number;
  message: string;
}

export interface RequestDokterDetailResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: RequestDokter;
}

export interface RespondRequestPayload {
  status: "accepted" | "rejected";
  is_aktif: number;
  tanggal_mulai_praktek?: string;
  tanggal_expired_praktek?: string;
  tipe_dokter?: string;
}

export interface RespondRequestResponse {
  success: boolean;
  statusCode: number;
  message: string;
}
