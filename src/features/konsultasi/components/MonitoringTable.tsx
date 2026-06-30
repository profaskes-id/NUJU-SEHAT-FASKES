import React, { useState, useMemo } from "react";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  type ColumnDef,
} from "@tanstack/react-table";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import {
  Search,
  ChevronLeft,
  ChevronRight,
  Activity,
  Calendar,
} from "lucide-react";
import { getBookingList } from "@/api/konsultasi";
import { useAuthStore } from "@/store/authStore";
import type { Booking } from "@/features/konsultasi/types";
import Select from "@/components/ui/Select";
import LoadingState from "@/components/shared/LoadingState";
import ErrorState from "@/components/shared/ErrorState";
import { formatDate } from "@/utils/format";

const statusOptions = [
  { value: "", label: "Semua Status" },
  { value: "pending", label: "Pending" },
  { value: "confirmed", label: "Confirmed" },
  { value: "ongoing", label: "Ongoing" },
  { value: "completed", label: "Completed" },
  { value: "cancelled", label: "Cancelled" },
];

const statusBadge: Record<string, { label: string; class: string }> = {
  pending: { label: "Pending", class: "bg-yellow-100 text-yellow-700" },
  confirmed: { label: "Confirmed", class: "bg-blue-100 text-blue-700" },
  ongoing: { label: "Ongoing", class: "bg-purple-100 text-purple-700" },
  completed: { label: "Completed", class: "bg-green-100 text-green-700" },
  cancelled: { label: "Cancelled", class: "bg-red-100 text-red-700" },
};

const tipeBookingLabel: Record<string, string> = {
  booking: "Booking",
  emergency: "Emergency",
};

const MonitoringTable: React.FC = () => {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [dokterFilter, setDokterFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [tanggalMulai, setTanggalMulai] = useState("");
  const [tanggalSelesai, setTanggalSelesai] = useState("");
  const [page, setPage] = useState(1);
  const limit = 10;

  const { data: bookingResponse, isLoading, isError } = useQuery({
    queryKey: ["booking", user?.id_faskes, statusFilter, search, dokterFilter, tanggalMulai, tanggalSelesai, page],
    queryFn: () =>
      getBookingList(user?.id_faskes || "", {
        status: statusFilter || undefined,
        search: search || undefined,
        dokter: dokterFilter || undefined,
        tanggal_mulai: tanggalMulai || undefined,
        tanggal_selesai: tanggalSelesai || undefined,
        page,
        limit,
      }),
    enabled: !!user?.id_faskes,
  });

  const bookings = bookingResponse?.data.items || [];
  const pagination = bookingResponse?.data.pagination;

  const columns = useMemo<ColumnDef<Booking>[]>(
    () => [
      {
        accessorKey: "tanggal",
        header: "Tanggal",
        cell: (info) => (
          <span className="text-text text-sm">
            {formatDate(info.getValue() as string)}
          </span>
        ),
      },
      {
        accessorKey: "jam_mulai",
        header: "Jam",
        cell: (info) => {
          const mulai = info.getValue() as string;
          const selesai = info.row.original.jam_selesai;
          return (
            <span className="text-text-muted text-sm">
              {mulai?.slice(0, 5)} - {selesai?.slice(0, 5)}
            </span>
          );
        },
      },
      {
        accessorKey: "nama_customer",
        header: "Pasien",
        cell: (info) => (
          <span className="font-semibold text-text text-sm">
            {info.getValue() as string}
          </span>
        ),
      },
      {
        accessorKey: "nama_dokter",
        header: "Dokter",
        cell: (info) => (
          <span className="text-text text-sm">{info.getValue() as string}</span>
        ),
      },
      {
        accessorKey: "tipe_booking",
        header: "Tipe",
        cell: (info) => {
          const tipe = info.getValue() as string;
          return (
            <span className="text-text-muted text-xs">
              {tipeBookingLabel[tipe] || tipe}
            </span>
          );
        },
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
        id: "actions",
        header: "Aksi",
        cell: (info) => (
          <button
            onClick={() => navigate(`/konsultasi/monitoring/${info.row.original.id_booking_dokter}`)}
            className="text-primary hover:underline text-xs font-bold flex items-center uppercase tracking-wider"
          >
            Detail
          </button>
        ),
      },
    ],
    [],
  );

  const table = useReactTable({
    data: bookings,
    columns,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    pageCount: pagination?.totalPages ?? -1,
  });

  const totalPages = pagination?.totalPages ?? 1;

  return (
    <div className="bg-surface-muted rounded-card overflow-hidden">
      <div className="p-4 border-b border-surface/10 flex flex-col md:flex-row gap-4 items-center flex-wrap">
        <div className="relative flex-1 min-w-[180px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
          <input
            type="text"
            placeholder="Cari pasien..."
            className="w-full pl-10 pr-4 py-2 bg-surface rounded-full border-none text-sm focus:ring-2 focus:ring-primary transition-all"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
          />
        </div>
        <input
          type="text"
          placeholder="ID Dokter"
          value={dokterFilter}
          onChange={(e) => {
            setDokterFilter(e.target.value);
            setPage(1);
          }}
          className="px-4 py-2 bg-surface rounded-full border-none text-sm focus:ring-2 focus:ring-primary transition-all w-40"
        />
        <div className="flex items-center space-x-2">
          <Calendar className="w-4 h-4 text-text-muted shrink-0" />
          <input
            type="date"
            value={tanggalMulai}
            onChange={(e) => {
              setTanggalMulai(e.target.value);
              setPage(1);
            }}
            className="px-3 py-2 bg-surface rounded-full border-none text-sm focus:ring-2 focus:ring-primary transition-all"
          />
          <span className="text-text-muted text-xs">s/d</span>
          <input
            type="date"
            value={tanggalSelesai}
            onChange={(e) => {
              setTanggalSelesai(e.target.value);
              setPage(1);
            }}
            className="px-3 py-2 bg-surface rounded-full border-none text-sm focus:ring-2 focus:ring-primary transition-all"
          />
        </div>
        <Select
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value);
            setPage(1);
          }}
        >
          {statusOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </Select>
      </div>

      <div className="overflow-x-auto min-h-[300px] relative">
        {isLoading && <LoadingState message="Memuat data monitoring..." />}

        {isError && (
          <div className="absolute inset-0 bg-surface/50 z-10 flex items-center justify-center p-6">
            <ErrorState
              message="Gagal mengambil data booking."
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
                  <div className="flex flex-col items-center space-y-2">
                    <Activity className="w-8 h-8 text-text-muted/50" />
                    <span>Tidak ada data booking.</span>
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
          <span className="text-text font-bold">{bookings.length}</span>{" "}
          dari{" "}
          <span className="text-text font-bold">
            {pagination?.totalItems ?? 0}
          </span>{" "}
          booking
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

export default MonitoringTable;