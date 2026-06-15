export interface Margin {
  id_jenis_konsultasi: string;
  nama_jenis_konsultasi: string;
  nominal: number;
}

export interface Diskon {
  id_jenis_konsultasi: string;
  nama_jenis_konsultasi: string;
  id_diskon_konsultasi: string | null;
  nama_diskon: string | null;
  tipe_diskon: 'percentage' | 'fixed' | null;
  nilai_diskon: number;
  berlaku_mulai: string | null;
  berlaku_selesai: string | null;
  is_aktif: boolean;
}

export interface MarginResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: Margin[];
}

export interface DiskonResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: Diskon[];
}

export interface UpdateMarginPayload {
  items: Array<{
    id_jenis_konsultasi: string;
    nominal: number;
  }>;
}

export interface UpdateDiskonPayload {
  items: Array<{
    id_jenis_konsultasi: string;
    nama_diskon: string | null;
    tipe_diskon: 'percentage' | 'fixed' | null;
    nilai_diskon: number;
    berlaku_mulai: string | null;
    berlaku_selesai: string | null;
    is_aktif: boolean;
  }>;
}
