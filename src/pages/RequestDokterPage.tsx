import React from "react";
import { UserCheck } from "lucide-react";
import PageHeader from "@/components/shared/PageHeader";
import RequestDokterList from "@/features/dokter/components/RequestDokterList";

const RequestDokterPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-surface p-6 space-y-6">
      <PageHeader
        icon={<UserCheck className="w-5 h-5" />}
        title="Request Join Dokter"
        description="Daftar permintaan bergabung dari dokter ke faskes Anda."
      />

      <RequestDokterList />
    </div>
  );
};

export default RequestDokterPage;