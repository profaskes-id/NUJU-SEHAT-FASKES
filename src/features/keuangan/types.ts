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

export interface Wallet {
  id_wallets: string;
  owner_type: string;
  id_dokter: string | null;
  id_faskes: string | null;
  id_customer: string | null;
  saldo: number;
  created_at: string;
  updated_at: string;
}

export interface WalletResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: Wallet;
}

export interface WalletTransaction {
  id: string;
  id_wallet: string;
  tipe_transaksi: "credit" | "debit";
  jumlah: number;
  reference_type: string;
  reference_id: string;
  keterangan: string;
  created_at: string;
}

export interface WalletTransactionResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: {
    items: WalletTransaction[];
  };
}
