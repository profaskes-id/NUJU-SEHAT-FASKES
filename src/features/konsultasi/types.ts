export interface Booking {
  id_booking_dokter: string;
  id_faskes: string;
  id_dokter: string;
  id_customer: string;
  nama_customer: string;
  nama_dokter: string;
  jam_mulai: string;
  jam_selesai: string;
  tanggal: string;
  tipe_booking: string;
  status: string;
}

export interface BookingDetail {
  id_booking_dokter: string;
  id_customer: string;
  id_dokter: string;
  id_faskes: string;
  nama_customer: string;
  nama_dokter: string;
  jam_mulai: string;
  jam_selesai: string;
  tanggal: string;
  tipe_booking: string;
  status: string;
  tipe_pasien: string;
  tipe_dokter: string | null;
  is_diperpanjang: string | null;
  durasi_perpanjangan_menit: string | null;
  is_cancel: number;
  cancel_date: string | null;
  cancel_by: string | null;
  cancel_reason: string | null;
  customer: null;
  dokter: null;
  payments: never[];
}

export interface BookingDetailResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: BookingDetail;
}

export interface Pagination {
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
  hasNextPage: boolean;
  nextPage: number | null;
}

export interface BookingListResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: {
    items: Booking[];
    pagination: Pagination;
  };
}