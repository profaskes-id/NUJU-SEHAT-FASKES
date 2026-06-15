import React, { useMemo } from "react";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  type ColumnDef,
} from "@tanstack/react-table";
import { Edit2, BadgePercent, Calendar } from "lucide-react";
import type { Diskon } from "../types";

interface DiskonTableProps {
  data: Diskon[];
  onEdit: (diskon: Diskon) => void;
}

/**
 * DiskonTable - Menampilkan daftar program diskon per jenis konsultasi.
 */
const DiskonTable: React.FC<DiskonTableProps> = ({ data, onEdit }) => {
  const columns = useMemo<ColumnDef<Diskon>[]>(
    () => [
      {
        accessorKey: "nama_jenis_konsultasi",
        header: "Jenis Konsultasi",
        cell: (info) => <span className="font-semibold text-text">{info.getValue() as string}</span>,
      },
      {
        accessorKey: "nama_diskon",
        header: "Nama Program",
        cell: (info) => {
          const val = info.getValue() as string | null;
          return val ? (
            <div className="flex items-center space-x-2">
              <BadgePercent className="w-4 h-4 text-primary" />
              <span>{val}</span>
            </div>
          ) : (
            <span className="text-text-muted italic">Tidak ada diskon</span>
          );
        },
      },
      {
        accessorKey: "nilai_diskon",
        header: "Nilai",
        cell: (info) => {
          const row = info.row.original;
          if (!row.id_diskon_konsultasi) return "-";
          return (
            <span className="bg-primary-light text-primary font-bold px-2 py-1 rounded-full text-xs">
              {info.getValue() as number}{row.tipe_diskon === 'percentage' ? '%' : ''}
            </span>
          );
        },
      },
      {
        accessorKey: "berlaku_mulai",
        header: "Periode",
        cell: (info) => {
          const row = info.row.original;
          if (!row.berlaku_mulai) return "-";
          return (
            <div className="flex items-center text-xs text-text-muted">
              <Calendar className="w-3.5 h-3.5 mr-1" />
              {row.berlaku_mulai} s/d {row.berlaku_selesai}
            </div>
          );
        },
      },
      {
        accessorKey: "is_aktif",
        header: "Status",
        cell: (info) => {
          const isActive = info.getValue() as boolean;
          return (
            <span
              className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ${
                isActive
                  ? "bg-green-100 text-green-700"
                  : "bg-gray-100 text-gray-600"
              }`}
            >
              {isActive ? "Aktif" : "Tidak Aktif"}
            </span>
          );
        },
      },
      {
        id: "actions",
        header: "Aksi",
        cell: (info) => (
          <button
            onClick={() => onEdit(info.row.original)}
            className="bg-dark-bg text-white rounded-full p-2 hover:bg-opacity-80 transition-all shadow-sm"
            title="Edit Diskon"
          >
            <Edit2 className="w-3.5 h-3.5" />
          </button>
        ),
      },
    ],
    [onEdit]
  );

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="bg-surface rounded-card overflow-hidden border border-surface-border">
      <table className="w-full text-left border-collapse">
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id} className="bg-surface-muted text-text-muted text-[10px] uppercase tracking-wider">
              {headerGroup.headers.map((header) => (
                <th key={header.id} className="px-6 py-4 font-bold">
                  {flexRender(header.column.columnDef.header, header.getContext())}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id} className="hover:bg-surface-muted transition-colors">
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id} className="px-6 py-4 border-b border-surface-border last:border-0 text-sm">
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DiskonTable;
