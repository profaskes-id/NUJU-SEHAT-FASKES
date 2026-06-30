import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  type ColumnDef,
} from "@tanstack/react-table";
import { useQuery } from "@tanstack/react-query";
import { Search, ChevronLeft, ChevronRight, Eye, UserPlus } from "lucide-react";
import { getRequestDokter } from "@/api/dokter";
import { useAuthStore } from "@/store/authStore";
import type { RequestDokter } from "@/features/dokter/types";
import LoadingState from "@/components/shared/LoadingState";
import ErrorState from "@/components/shared/ErrorState";

const statusBadge: Record<string, { label: string; class: string }> = {
  pending: { label: "Menunggu", class: "bg-yellow-100 text-yellow-700" },
  accepted: { label: "Diterima", class: "bg-green-100 text-green-700" },
  rejected: { label: "Ditolak", class: "bg-red-100 text-red-700" },
};

const RequestDokterList: React.FC = () => {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const limit = 20;

  const {
    data: requestResponse,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["request-dokter", user?.id_faskes, page],
    queryFn: () => getRequestDokter(user?.id_faskes || "", { page, limit }),
    enabled: !!user?.id_faskes,
  });

  const requests = requestResponse?.data.items || [];
  const pagination = requestResponse?.data.pagination;

  const filteredData = useMemo(() => {
    if (!search) return requests;
    return requests.filter(
      (r) =>
        r.nama_dokter.toLowerCase().includes(search.toLowerCase()) ||
        r.nama_faskes.toLowerCase().includes(search.toLowerCase()),
    );
  }, [requests, search]);

  const columns = useMemo<ColumnDef<RequestDokter>[]>(
    () => [
      {
        accessorKey: "nama_dokter",
        header: "Nama Dokter",
        cell: (info) => (
          <span className="font-semibold text-text text-sm">
            {info.getValue() as string}
          </span>
        ),
      },
      {
        accessorKey: "nomor_sip",
        header: "Nomor SIP",
        cell: (info) => {
          const val = info.getValue() as string;
          return val ? (
            <code className="text-xs bg-surface px-2 py-1 rounded text-text-muted">
              {val}
            </code>
          ) : (
            <span className="text-text-muted text-xs">-</span>
          );
        },
      },
      {
        accessorKey: "nama_faskes",
        header: "Faskes Tujuan",
        cell: (info) => (
          <span className="text-text text-sm">{info.getValue() as string}</span>
        ),
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: (info) => {
          const status = (info.getValue() as string).toLowerCase();
          const badge = statusBadge[status] || {
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
        header: "Tanggal Request",
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
      {
        id: "actions",
        header: "Aksi",
        cell: (info) => {
          const row = info.row.original;
          return (
            <button
              onClick={() =>
                navigate(
                  `/dokter/request/${row.id_request_dokter}?id_dokter=${row.id_dokter}`,
                )
              }
              className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-button bg-primary text-text-inverse text-xs font-medium hover:bg-primary-hover transition-colors"
              title="Lihat detail"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Detail</span>
            </button>
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
      <div className="p-4 border-b border-surface/10">
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
          <input
            type="text"
            placeholder="Cari nama dokter atau faskes..."
            className="w-full pl-10 pr-4 py-2 bg-surface rounded-full border-none text-sm focus:ring-2 focus:ring-primary transition-all"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="overflow-x-auto min-h-[300px] relative">
        {isLoading && <LoadingState message="Memuat request dokter..." />}

        {isError && (
          <div className="absolute inset-0 bg-surface/50 z-10 flex items-center justify-center p-6">
            <ErrorState
              message="Gagal mengambil data request."
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
                <tr key={row.id} className="hover:bg-surface transition-colors">
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
                    <UserPlus className="w-8 h-8 text-text-muted/50" />
                    <span>Tidak ada request join dokter.</span>
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
          request
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
    </div>
  );
};

export default RequestDokterList;
