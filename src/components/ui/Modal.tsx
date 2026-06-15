import React, { useEffect } from "react";
import { X } from "lucide-react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

/**
 * Modal - Komponen UI dasar untuk menampilkan konten di atas overlay.
 * Mengikuti desain sistem dari .ai/DESIGN.md.
 */
const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Overlay */}
      <div 
        className="absolute inset-0 bg-dark-bg/40 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <div className="bg-surface dark:bg-dark-card w-full max-w-lg rounded-card shadow-xl relative z-10 overflow-hidden transform transition-all scale-100 animate-in fade-in zoom-in duration-200">
        <div className="px-6 py-4 border-b border-surface-border flex items-center justify-between">
          <h3 className="text-lg font-bold text-text">{title}</h3>
          <button 
            onClick={onClose}
            className="p-1 rounded-full hover:bg-surface-muted text-text-muted transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="px-6 py-6 overflow-y-auto max-h-[80vh]">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;
