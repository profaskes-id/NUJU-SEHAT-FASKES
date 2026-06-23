import React from "react";
import { UserPlus } from "lucide-react";
import PageHeader from "@/components/shared/PageHeader";
import InviteDokterTable from "@/features/dokter/components/InviteDokterTable";

const InviteDokterPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-surface p-6 space-y-6">
      <PageHeader
        icon={<UserPlus className="w-5 h-5" />}
        title="Invite Dokter"
        description="Daftar undangan yang telah dikirim ke dokter."
      />

      <InviteDokterTable />
    </div>
  );
};

export default InviteDokterPage;