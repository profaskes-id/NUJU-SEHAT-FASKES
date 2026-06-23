import React from "react";
import { Building2 } from "lucide-react";
import PageHeader from "@/components/shared/PageHeader";
import ProfileFaskes from "@/features/pengaturan/components/ProfileFaskes";

const ProfileFaskesPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-surface p-6 space-y-6">
      <PageHeader
        icon={<Building2 className="w-5 h-5" />}
        title="Profile Faskes"
        description="Detail informasi fasilitas kesehatan Anda."
      />

      <ProfileFaskes />
    </div>
  );
};

export default ProfileFaskesPage;