import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  getPaginationRowModel,
  type ColumnDef,
  getFilteredRowModel,
} from "@tanstack/react-table";
import {
  Search,
  Filter,
  Star,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  ShieldAlert,
  UserCheck,
  Stethoscope,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getDokterByFaskes } from "@/api/dokter";
import { useAuthStore } from "@/store/authStore";
import type { Dokter } from "@/features/dokter/types";
import Select from "@/components/ui/Select";
import LoadingState from "@/components/shared/LoadingState";
import ErrorState from "@/components/shared/ErrorState";
import PageHeader from "@/components/shared/PageHeader";

/**
 * DokterPage - Halaman utama Manajemen Dokter.
 * Menampilkan daftar dokter dalam format tabel dengan fitur pencarian, filter, dan pagination.
 */
const DokterPage: React.FC = () => {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [globalFilter, setGlobalFilter] = useState("");
  const [specialtyFilter, setSpecialtyFilter] = useState("Semua Tipe");

  /**
   * Mengambil data dokter dari API menggunakan React Query.
   * Query ini akan otomatis berjalan saat id_faskes tersedia.
   */
  const { data: dokterResponse, isLoading, isError } = useQuery({
    queryKey: ["dokter", user?.id_faskes],
    queryFn: () => getDokterByFaskes(user?.id_faskes || ""),
    enabled: !!user?.id_faskes,
  });

  const doctors = dokterResponse?.data.items || [];

  /**
   * filteredData - Logika filter data dokter berdasarkan nama dan tipe dokter.
   * Dihitung ulang hanya jika data API, globalFilter, atau specialtyFilter berubah.
   */
  const filteredData = useMemo(() => {
    let data = [...doctors];

    if (globalFilter) {
      data = data.filter((d) =>
        d.nama_dokter.toLowerCase().includes(globalFilter.toLowerCase()),
      );
    }

    if (specialtyFilter !== "Semua Tipe") {
      data = data.filter((d) => d.tipe_dokter === specialtyFilter);
    }

    return data;
  }, [doctors, globalFilter, specialtyFilter]);

  /**
   * specialties - Mendapatkan daftar unik tipe dokter untuk keperluan dropdown filter.
   */
  const specialties = useMemo(() => {
    const s = new Set(doctors.map((d) => d.tipe_dokter));
    return ["Semua Tipe", ...Array.from(s)];
  }, [doctors]);

  /**
   * columns - Definisi kolom tabel menggunakan Tanstack Table.
   * Mencakup formatting data, badge status, dan aksi detail.
   */
  const columns = useMemo<ColumnDef<Dokter>[]>(
    () => [
      {
        accessorKey: "nama_dokter",
        header: "Nama Dokter",
        cell: (info) => (
          <span className="font-semibold text-text">
            {info.getValue() as string}
          </span>
        ),
      },
      {
        accessorKey: "tipe_dokter",
        header: "Tipe",
      },
      {
        accessorKey: "nomor_sip_dokter",
        header: "Nomor SIP",
        cell: (info) => (
          <code className="text-xs bg-surface-muted px-2 py-1 rounded text-text-muted">
            {info.getValue() as string}
          </code>
        ),
      },
      {
        accessorKey: "tanggal_expired_praktek",
        header: "Expired SIP",
        cell: (info) => {
          const val = info.getValue() as string;
          if (!val) return "-";
          const date = new Date(val);
          const now = new Date();
          const diffTime = date.getTime() - now.getTime();
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

          if (diffDays < 0) {
            return (
              <span className="bg-red-100 text-red-700 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase">
                Expired
              </span>
            );
          }
          if (diffDays < 30) {
            return (
              <span className="bg-yellow-100 text-yellow-700 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase">
                Hampir Expired
              </span>
            );
          }
          return (
            <span className="text-text-muted text-xs">
              {val}
            </span>
          );
        },
      },
      {
        accessorKey: "status_praktek",
        header: "Status",
        cell: (info) => {
          const status = info.getValue() as number;
          return (
            <span
              className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ${
                status === 1
                  ? "bg-green-100 text-green-700"
                  : "bg-gray-100 text-gray-600"
              }`}
            >
              {status === 1 ? "Aktif" : "Tidak Aktif"}
            </span>
          );
        },
      },
      {
        accessorKey: "is_suspend",
        header: "Suspend",
        cell: (info) => {
          const isSuspend = info.getValue() as number;
          return isSuspend === 1 ? (
            <span className="bg-red-100 text-red-700 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase flex items-center w-fit">
              <ShieldAlert className="w-3 h-3 mr-1" /> Suspend
            </span>
          ) : (
            <span className="text-green-600">
              <UserCheck className="w-4 h-4" />
            </span>
          );
        },
      },
      {
        accessorKey: "rating_dokter",
        header: "Rating",
        cell: (info) => (
          <div className="flex items-center text-yellow-500 font-bold text-sm">
            <Star className="w-3 h-3 fill-yellow-500 mr-1" />
            {info.getValue() as string}
          </div>
        ),
      },
      {
        id: "actions",
        header: "Aksi",
        cell: (info) => (
          <button 
            onClick={() => navigate(`/dokter/${info.row.original.id_dokter}`)}
            className="text-primary hover:underline text-xs font-bold flex items-center uppercase tracking-wider"
          >
            <ExternalLink className="w-3 h-3 mr-1" /> Detail
          </button>
        ),
      },
    ],
    [],
  );

  /**
   * table - Konfigurasi instance Tanstack Table.
   */
  const table = useReactTable({
    data: filteredData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    initialState: {
      pagination: {
        pageIndex: 0,
        pageSize: 5,
      },
    },
  });

  return (
    <div className="min-h-screen bg-surface p-6 space-y-6">
      {/* Header Page: Judul dan tombol aksi utama */}
      <PageHeader 
        icon={<Stethoscope className="w-5 h-5" />}
        title="Manajemen Dokter"
        description="Kelola informasi, status praktek, dan performa dokter."
        actionButton={
          <button className="bg-primary text-white px-4 py-2 rounded-button font-semibold text-sm shadow-sm hover:bg-primary-hover transition-colors">
            + Tambah Dokter
          </button>
        }
      />

      {/* Filters: Bagian pencarian nama dan dropdown filter spesialisasi */}
      <div className="bg-surface-muted p-4 rounded-card flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
          <input
            type="text"
            placeholder="Cari nama dokter..."
            className="w-full pl-10 pr-4 py-2 bg-surface rounded-full border-none text-sm focus:ring-2 focus:ring-primary transition-all"
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
          />
        </div>
        <Select
          icon={<Filter className="w-4 h-4" />}
          value={specialtyFilter}
          onChange={(e) => setSpecialtyFilter(e.target.value)}
        >
          {specialties.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </Select>
      </div>

      {/* Table Area: Render tabel dengan header dan baris data */}
      <div className="bg-surface-muted rounded-card overflow-hidden">
        <div className="overflow-x-auto min-h-[300px] relative">
          {isLoading && <LoadingState message="Memuat data dokter..." />}
          
          {isError && (
            <div className="absolute inset-0 bg-surface/50 z-10 flex items-center justify-center p-6">
              <ErrorState 
                message="Gagal mengambil data dokter. Silakan coba muat ulang halaman ini."
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
                    Data dokter tidak ditemukan.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination: Navigasi halaman dan informasi jumlah data */}
        <div className="p-4 bg-surface flex items-center justify-between">
          <div className="text-xs text-text-muted font-medium">
            Menampilkan{" "}
            <span className="text-text font-bold">
              {table.getRowModel().rows.length}
            </span>{" "}
            dari{" "}
            <span className="text-text font-bold">{filteredData.length}</span>{" "}
            dokter
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              className="p-2 rounded-full hover:bg-surface-muted disabled:opacity-30 transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div className="flex items-center space-x-1">
              <span className="text-xs font-bold bg-primary text-white w-8 h-8 rounded-full flex items-center justify-center">
                {table.getState().pagination.pageIndex + 1}
              </span>
            </div>
            <button
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              className="p-2 rounded-full hover:bg-surface-muted disabled:opacity-30 transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DokterPage;
