import React, { useState, useMemo } from "react";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  type ColumnDef,
} from "@tanstack/react-table";
import { useQuery } from "@tanstack/react-query";
import { Search, ChevronLeft, ChevronRight, Mail, Plus } from "lucide-react";
import { getInviteDokter } from "@/api/dokter";
import { useAuthStore } from "@/store/authStore";
import type { InvitedDokter } from "@/features/dokter/types";
import LoadingState from "@/components/shared/LoadingState";
import ErrorState from "@/components/shared/ErrorState";
import InviteDokterModal from "@/features/dokter/components/InviteDokterModal";

const statusLabel: Record<string, { label: string; class: string }> = {
  pending: { label: "Menunggu", class: "bg-yellow-100 text-yellow-700" },
  accepted: { label: "Diterima", class: "bg-green-100 text-green-700" },
  expired: { label: "Kadaluarsa", class: "bg-gray-100 text-gray-600" },
  cancelled: { label: "Dibatalkan", class: "bg-red-100 text-red-700" },
};

const InviteDokterTable: React.FC = () => {
  const { user } = useAuthStore();
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const limit = 10;

  const { data: inviteResponse, isLoading, isError } = useQuery({
    queryKey: ["invite-dokter", user?.id_faskes, page],
    queryFn: () => getInviteDokter(user?.id_faskes || "", { page, limit }),
    enabled: !!user?.id_faskes,
  });

  const invites = inviteResponse?.data.items || [];
  const pagination = inviteResponse?.data.pagination;

  const filteredData = useMemo(() => {
    if (!search) return invites;
    return invites.filter(
      (i) =>
        i.email_dokter.toLowerCase().includes(search.toLowerCase()) ||
        (i.nama_faskes && i.nama_faskes.toLowerCase().includes(search.toLowerCase())),
    );
  }, [invites, search]);

  const columns = useMemo<ColumnDef<InvitedDokter>[]>(
    () => [
      {
        accessorKey: "email_dokter",
        header: "Email Dokter",
        cell: (info) => (
          <span className="font-semibold text-text text-sm">
            {info.getValue() as string}
          </span>
        ),
      },
      {
        accessorKey: "nomor_hp_dokter",
        header: "Nomor HP",
        cell: (info) => {
          const val = info.getValue() as string;
          return val ? (
            <span className="text-text-muted text-sm">{val}</span>
          ) : (
            <span className="text-text-muted text-xs">-</span>
          );
        },
      },
      {
        accessorKey: "nama_faskes",
        header: "Faskes",
        cell: (info) => (
          <span className="text-text text-sm">
            {info.getValue() as string}
          </span>
        ),
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: (info) => {
          const status = (info.getValue() as string).toLowerCase();
          const badge = statusLabel[status] || {
            label: status,
            class: "bg-gray-100 text-gray-600",
          };
          return (
            <span
              className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ${badge.class}`}
            >
              {badge.label}
            </span>
          );
        },
      },
      {
        accessorKey: "created_at",
        header: "Dibuat",
        cell: (info) => {
          const val = info.getValue() as string;
          return val ? (
            <span className="text-text-muted text-xs">{val}</span>
          ) : (
            "-"
          );
        },
      },
      {
        accessorKey: "accepted_at",
        header: "Diterima",
        cell: (info) => {
          const val = info.getValue() as string;
          return val ? (
            <span className="text-text-muted text-xs">{val}</span>
          ) : (
            <span className="text-text-muted/50 text-xs italic">-</span>
          );
        },
      },
    ],
    [],
  );

  const table = useReactTable({
    data: filteredData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    pageCount: pagination?.totalPages ?? -1,
  });

  const totalPages = pagination?.totalPages ?? 1;

  return (
    <div className="bg-surface-muted rounded-card overflow-hidden">
      <div className="p-4 border-b border-surface/10 flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
          <input
            type="text"
            placeholder="Cari email atau faskes..."
            className="w-full pl-10 pr-4 py-2 bg-surface rounded-full border-none text-sm focus:ring-2 focus:ring-primary transition-all"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="inline-flex items-center space-x-2 bg-primary hover:bg-primary-hover text-text-inverse rounded-button px-4 py-2 text-sm font-semibold transition-colors shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah</span>
        </button>
      </div>

      <div className="overflow-x-auto min-h-[300px] relative">
        {isLoading && <LoadingState message="Memuat daftar undangan..." />}

        {isError && (
          <div className="absolute inset-0 bg-surface/50 z-10 flex items-center justify-center p-6">
            <ErrorState
              message="Gagal mengambil data undangan."
              onRetry={() => window.location.reload()}
            />
          </div>
        )}

        <table className="w-full text-left border-collapse">
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr
                key={headerGroup.id}
                className="bg-surface text-text-muted text-[10px] uppercase tracking-wider"
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
                  <div className="flex flex-col items-center space-y-2">
                    <Mail className="w-8 h-8 text-text-muted/50" />
                    <span>Belum ada undangan dikirim.</span>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="p-4 bg-surface flex items-center justify-between">
        <div className="text-xs text-text-muted font-medium">
          Menampilkan{" "}
          <span className="text-text font-bold">{filteredData.length}</span>{" "}
          dari{" "}
          <span className="text-text font-bold">
            {pagination?.totalItems ?? 0}
          </span>{" "}
          undangan
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page <= 1}
            className="p-2 rounded-full hover:bg-surface-muted disabled:opacity-30 transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div className="flex items-center space-x-1">
            <span className="text-xs font-bold bg-primary text-white w-8 h-8 rounded-full flex items-center justify-center">
              {page}
            </span>
          </div>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page >= totalPages}
            className="p-2 rounded-full hover:bg-surface-muted disabled:opacity-30 transition-colors"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      <InviteDokterModal isOpen={showModal} onClose={() => setShowModal(false)} />
    </div>
  );
};

export default InviteDokterTable;