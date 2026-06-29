import React from "react";
import { useNavigate } from "react-router-dom";
import { Building2, Lock } from "lucide-react";
import PageHeader from "@/components/shared/PageHeader";
import Button from "@/components/ui/Button";
import ProfileFaskes from "@/features/pengaturan/components/ProfileFaskes";

const ProfileFaskesPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-surface p-6 space-y-6">
      <PageHeader
        icon={<Building2 className="w-5 h-5" />}
        title="Profile Faskes"
        description="Detail informasi fasilitas kesehatan Anda."
        actionButton={
          <Button variant="ghost" onClick={() => navigate("/pengaturan/pin")}>
            <Lock className="w-4 h-4 mr-2" />
            Atur PIN
          </Button>
        }
      />

      <ProfileFaskes />
    </div>
  );
};

export default ProfileFaskesPage;