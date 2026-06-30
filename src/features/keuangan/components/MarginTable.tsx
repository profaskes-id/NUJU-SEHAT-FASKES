import React, { useMemo } from "react";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  type ColumnDef,
} from "@tanstack/react-table";
import { Edit2 } from "lucide-react";
import type { Margin } from "../types";
import { formatCurrency } from "@/utils/format";

interface MarginTableProps {
  data: Margin[];
  onEdit: (margin: Margin) => void;
}

/**
 * MarginTable - Menampilkan daftar margin keuntungan per jenis konsultasi.
 */
const MarginTable: React.FC<MarginTableProps> = ({ data, onEdit }) => {
  const columns = useMemo<ColumnDef<Margin>[]>(
    () => [
      {
        accessorKey: "nama_jenis_konsultasi",
        header: "Jenis Konsultasi",
        cell: (info) => (
          <span className="font-semibold text-text">
            {info.getValue() as string}
          </span>
        ),
      },
      {
        accessorKey: "nominal",
        header: "Nominal Margin",
        cell: (info) => (
          <span className="text-primary font-bold">
            {formatCurrency(info.getValue() as number)}
          </span>
        ),
      },
      {
        id: "actions",
        header: "Aksi",
        cell: (info) => (
          <button
            onClick={() => onEdit(info.row.original)}
            className="bg-dark-bg text-white rounded-full p-2 hover:bg-opacity-80 transition-all shadow-sm"
            title="Edit Margin"
          >
            <Edit2 className="w-3.5 h-3.5" />
          </button>
        ),
      },
    ],
    [onEdit],
  );

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="bg-surface  overflow-hidden border border-surface-border">
      <table className="w-full text-left border-collapse">
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr
              key={headerGroup.id}
              className="bg-dark-bg text-text-inverse text-[10px] uppercase tracking-wider"
            >
              {headerGroup.headers.map((header) => (
                <th key={header.id} className="px-6 py-4 font-bold">
                  {flexRender(
                    header.column.columnDef.header,
                    header.getContext(),
                  )}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr
              key={row.id}
              className="hover:bg-surface-muted transition-colors"
            >
              {row.getVisibleCells().map((cell) => (
                <td
                  key={cell.id}
                  className="px-6 py-4 border-b border-surface-border last:border-0 text-sm"
                >
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

export default MarginTable;
