import React from "react";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  type ColumnDef,
} from "@tanstack/react-table";
import { useQuery } from "@tanstack/react-query";
import { ArrowUpLeft, ArrowDownRight, Receipt } from "lucide-react";
import { getWalletTransactions } from "@/api/keuangan";
import { useAuthStore } from "@/store/authStore";
import type { WalletTransaction } from "@/features/keuangan/types";
import LoadingState from "@/components/shared/LoadingState";
import ErrorState from "@/components/shared/ErrorState";
import { formatDateTime } from "@/utils/format";

const formatRupiah = (num: number) =>
  new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(num);

const referenceLabel: Record<string, string> = {
  consultation: "Konsultasi",
  withdrawal: "Penarikan",
};

const WalletTransactionTable: React.FC = () => {
  const { user } = useAuthStore();

  const { data: transactionResponse, isLoading, isError } = useQuery({
    queryKey: ["wallet-transactions", user?.id],
    queryFn: () => getWalletTransactions("faskes", user!.id),
    enabled: !!user?.id,
  });

  const transactions = transactionResponse?.data.items || [];

  const columns: ColumnDef<WalletTransaction>[] = [
    {
        accessorKey: "created_at",
        header: "Tanggal",
        cell: (info) => (
          <span className="text-text text-sm">
            {formatDateTime(info.getValue() as string)}
          </span>
        ),
    },
    {
      accessorKey: "tipe_transaksi",
      header: "Tipe",
      cell: (info) => {
        const tipe = info.getValue() as string;
        return tipe === "credit" ? (
          <span className="inline-flex items-center space-x-1 text-green-600 text-xs font-semibold">
            <ArrowDownRight className="w-3.5 h-3.5" />
            <span>Masuk</span>
          </span>
        ) : (
          <span className="inline-flex items-center space-x-1 text-red-600 text-xs font-semibold">
            <ArrowUpLeft className="w-3.5 h-3.5" />
            <span>Keluar</span>
          </span>
        );
      },
    },
    {
      accessorKey: "jumlah",
      header: "Jumlah",
      cell: (info) => {
        const tipe = info.row.original.tipe_transaksi;
        const jumlah = info.getValue() as number;
        return (
          <span
            className={`font-semibold text-sm ${
              tipe === "credit" ? "text-green-600" : "text-red-600"
            }`}
          >
            {tipe === "credit" ? "+" : "-"}
            {formatRupiah(jumlah)}
          </span>
        );
      },
    },
    {
      accessorKey: "reference_type",
      header: "Jenis",
      cell: (info) => {
        const refType = info.getValue() as string;
        return (
          <span className="text-text-muted text-sm">
            {referenceLabel[refType] || refType}
          </span>
        );
      },
    },
    {
      accessorKey: "keterangan",
      header: "Keterangan",
      cell: (info) => (
        <span className="text-text-muted text-xs max-w-[250px] inline-block truncate">
          {info.getValue() as string}
        </span>
      ),
    },
    {
      id: "actions",
      header: "Aksi",
      cell: () => (
        <button className="text-primary hover:underline text-xs font-bold flex items-center uppercase tracking-wider">
          Detail
        </button>
      ),
    },
  ];

  const table = useReactTable({
    data: transactions,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="bg-surface-muted rounded-card overflow-hidden">
      <div className="px-6 py-4 border-b border-surface/10 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <span className="bg-dark-bg text-white rounded-full p-2.5 inline-flex items-center justify-center">
            <Receipt className="w-4 h-4" />
          </span>
          <h3 className="text-base font-semibold text-text">
            Riwayat Transaksi
          </h3>
        </div>
      </div>

      <div className="overflow-x-auto min-h-[200px] relative">
        {isLoading && <LoadingState message="Memuat riwayat transaksi..." />}

        {isError && (
          <div className="absolute inset-0 bg-surface/50 z-10 flex items-center justify-center p-6">
            <ErrorState
              message="Gagal memuat riwayat transaksi."
              onRetry={() => window.location.reload()}
            />
          </div>
        )}

        <table className="w-full text-left border-collapse">
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr
                key={headerGroup.id}
                className="bg-dark-bg text-text-inverse text-[10px] uppercase tracking-wider"
              >
                {headerGroup.headers.map((header) => (
                  <th key={header.id} className="px-6 py-4 font-bold">
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.length > 0 ? (
              table.getRowModel().rows.map((row) => (
                <tr
                  key={row.id}
                  className="hover:bg-surface transition-colors"
                >
                  {row.getVisibleCells().map((cell) => (
                    <td
                      key={cell.id}
                      className="px-6 py-4 border-b border-surface/10 last:border-0"
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-6 py-12 text-center text-text-muted italic"
                >
                  Belum ada transaksi.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default WalletTransactionTable;