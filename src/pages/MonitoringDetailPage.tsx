import React from "react";
import { Activity } from "lucide-react";
import PageHeader from "@/components/shared/PageHeader";
import MonitoringDetail from "@/features/konsultasi/components/MonitoringDetail";

const MonitoringDetailPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-surface p-6 space-y-6">
      <PageHeader
        icon={<Activity className="w-5 h-5" />}
        title="Detail Booking"
        description="Informasi lengkap jadwal konsultasi."
      />

      <MonitoringDetail />
    </div>
  );
};

export default MonitoringDetailPage;