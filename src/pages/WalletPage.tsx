import React from "react";
import { Wallet } from "lucide-react";
import PageHeader from "@/components/shared/PageHeader";
import WalletSaldo from "@/features/keuangan/components/WalletSaldo";
import WalletTransactionTable from "@/features/keuangan/components/WalletTransactionTable";

const WalletPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-surface p-6 space-y-6">
      <PageHeader
        icon={<Wallet className="w-5 h-5" />}
        title="Wallet"
        description="Kelola saldo dan lihat riwayat transaksi wallet Anda."
      />

      <WalletSaldo />
      <WalletTransactionTable />
    </div>
  );
};

export default WalletPage;