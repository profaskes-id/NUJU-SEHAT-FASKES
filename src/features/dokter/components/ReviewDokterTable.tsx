import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Star, MessageSquareText } from "lucide-react";
import { getReviewDokter } from "@/api/dokter";
import type { ReviewDokter } from "@/features/dokter/types";
import LoadingState from "@/components/shared/LoadingState";
import ErrorState from "@/components/shared/ErrorState";
import { formatDateTime } from "@/utils/format";

interface ReviewDokterTableProps {
  idDokter: string;
}

const ReviewDokterTable: React.FC<ReviewDokterTableProps> = ({ idDokter }) => {
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["review-dokter", idDokter],
    queryFn: () => getReviewDokter(idDokter),
    enabled: !!idDokter,
  });

  const items = data?.data?.items ?? [];

  return (
    <div className="bg-surface-muted rounded-card overflow-hidden">
      <div className="px-6 py-4 border-b border-surface/10 flex items-center space-x-3">
        <span className="bg-dark-bg text-white rounded-full p-2.5 inline-flex items-center justify-center">
          <MessageSquareText className="w-4 h-4" />
        </span>
        <h3 className="text-base font-semibold text-text">Ulasan Pasien</h3>
      </div>

      <div className="overflow-x-auto min-h-[200px]">
        {isLoading && <LoadingState message="Memuat ulasan..." />}

        {isError && (
          <div className="p-6">
            <ErrorState message="Gagal memuat ulasan." onRetry={refetch} />
          </div>
        )}

        {!isLoading && !isError && (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface text-text-muted text-[10px] uppercase tracking-wider">
                <th className="px-6 py-4 font-bold">Pasien</th>
                <th className="px-6 py-4 font-bold">Rating</th>
                <th className="px-6 py-4 font-bold">Ulasan</th>
                <th className="px-6 py-4 font-bold">Tanggal</th>
              </tr>
            </thead>
            <tbody>
              {items.length > 0 ? (
                items.map((review: ReviewDokter) => (
                  <tr key={review.id_review_dokter} className="hover:bg-surface transition-colors">
                    <td className="px-6 py-4 border-b border-surface/10 text-sm font-medium text-text">
                      {review.nama_customer}
                    </td>
                    <td className="px-6 py-4 border-b border-surface/10">
                      <div className="flex items-center space-x-0.5">
                        {Array.from({ length: 5 }, (_, i) => (
                          <Star
                            key={i}
                            className={`w-3.5 h-3.5 ${
                              i < review.bintang
                                ? "text-yellow-400 fill-yellow-400"
                                : "text-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4 border-b border-surface/10 text-sm text-text-muted max-w-xs">
                      {review.ulasan || "-"}
                    </td>
                    <td className="px-6 py-4 border-b border-surface/10 text-sm text-text-muted whitespace-nowrap">
                      {formatDateTime(review.created_at)}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-text-muted italic">
                    Belum ada ulasan untuk dokter ini.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default ReviewDokterTable;
