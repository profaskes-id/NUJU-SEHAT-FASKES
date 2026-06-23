import React from "react";
import { Loader2 } from "lucide-react";

const PageLoading: React.FC = () => {
  return (
    <div className="min-h-screen bg-surface flex flex-col items-center justify-center">
      <div className="flex items-center space-x-3 mb-8">
        <img src="/logo.png" alt="Logo" className="w-10 h-10 object-contain" />
        <span className="text-xl font-bold text-text tracking-tight uppercase">
          Nuju Sehat
        </span>
      </div>
      <Loader2 className="w-8 h-8 text-primary animate-spin" />
      <p className="text-sm text-text-muted mt-4 font-medium">Memuat aplikasi...</p>
    </div>
  );
};

export default PageLoading;