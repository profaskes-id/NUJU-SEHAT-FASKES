import React from "react";
import { Activity } from "lucide-react";
import PageHeader from "@/components/shared/PageHeader";
import MonitoringTable from "@/features/konsultasi/components/MonitoringTable";

const MonitoringPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-surface p-6 space-y-6">
      <PageHeader
        icon={<Activity className="w-5 h-5" />}
        title="Monitoring Konsultasi"
        description="Pantau jadwal dan status konsultasi dokter."
      />

      <MonitoringTable />
    </div>
  );
};

export default MonitoringPage;