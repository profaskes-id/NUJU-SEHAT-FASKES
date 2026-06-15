import React from "react";

interface PageHeaderProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  backButton?: React.ReactNode;
  actionButton?: React.ReactNode;
}

/**
 * PageHeader - Komponen reusable untuk bagian atas halaman admin.
 * Menampilkan icon, judul, deskripsi, serta tombol aksi opsional.
 */
const PageHeader: React.FC<PageHeaderProps> = ({
  icon,
  title,
  description,
  backButton,
  actionButton,
}) => {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div className="flex items-center space-x-4">
        {backButton}
        <div className="flex items-center space-x-3">
          <span className="bg-dark-bg text-white rounded-full p-2.5 inline-flex items-center justify-center shrink-0 shadow-sm">
            {icon}
          </span>
          <div>
            <h1 className="text-2xl font-bold text-text leading-tight">{title}</h1>
            <p className="text-sm text-text-muted mt-0.5">{description}</p>
          </div>
        </div>
      </div>
      {actionButton && (
        <div className="shrink-0">
          {actionButton}
        </div>
      )}
    </div>
  );
};

export default PageHeader;
