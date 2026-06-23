/**
 * Memformat angka menjadi format mata uang Rupiah (IDR).
 * 
 * @param amount - Angka yang akan diformat
 * @returns String format Rupiah (contoh: Rp 5.000)
 */
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

/**
 * Memformat tanggal string menjadi format lokal Indonesia.
 * 
 * @param dateString - Tanggal dalam format string
 * @returns Tanggal terformat (contoh: 1 Januari 2024)
 */
export const formatDate = (dateString: string): string => {
  if (!dateString) return "-";
  return new Date(dateString).toLocaleDateString("id-ID", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

export const formatDateTime = (dateString: string): string => {
  if (!dateString) return "-";
  const date = new Date(dateString);
  return date.toLocaleDateString("id-ID", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }) + " " + date.toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
  });
};
