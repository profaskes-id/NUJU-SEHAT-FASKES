import React from "react";
import { AlertCircle } from "lucide-react";

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  retryText?: string;
  className?: string;
}

/**
 * ErrorState - Komponen reusable untuk menampilkan state error.
 * Digunakan ketika data gagal dimuat dari API.
 */
const ErrorState: React.FC<ErrorStateProps> = ({
  title = "Gagal Memuat Data",
  message = "Terjadi kesalahan saat mengambil data. Silakan coba lagi nanti.",
  onRetry,
  retryText = "Coba Lagi",
  className = "",
}) => {
  return (
    <div className={`bg-red-50 border border-red-200 rounded-card p-8 flex flex-col items-center text-center space-y-3 ${className}`}>
      <AlertCircle className="w-12 h-12 text-red-500" />
      <h3 className="text-lg font-bold text-red-700">{title}</h3>
      <p className="text-red-600 max-w-md text-sm">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-4 bg-red-100 text-red-700 px-6 py-2 rounded-button font-semibold hover:bg-red-200 transition-colors"
        >
          {retryText}
        </button>
      )}
    </div>
  );
};

export default ErrorState;
