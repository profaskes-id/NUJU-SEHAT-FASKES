import React from "react";
import { Loader2 } from "lucide-react";

interface LoadingStateProps {
  message?: string;
  className?: string;
}

/**
 * LoadingState - Komponen reusable untuk menampilkan state loading.
 * Menggunakan animasi spin dari Lucide Loader2.
 */
const LoadingState: React.FC<LoadingStateProps> = ({ 
  message = "Memuat data...", 
  className = "" 
}) => {
  return (
    <div className={`absolute inset-0 bg-surface/50 backdrop-blur-sm z-10 flex flex-col items-center justify-center space-y-3 ${className}`}>
      <Loader2 className="w-10 h-10 text-primary animate-spin" />
      <p className="text-sm font-medium text-text-muted">{message}</p>
    </div>
  );
};

export default LoadingState;
