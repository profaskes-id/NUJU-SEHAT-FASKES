import React from "react";
import { useQuery } from "@tanstack/react-query";
import { useParams, useNavigate } from "react-router-dom";
import {
  ChevronLeft,
  Calendar,
  Clock,
  User,
  Stethoscope,
  Ban,
  BadgeCheck,
  XCircle,
  Hourglass,
  PlayCircle,
} from "lucide-react";
import { getBookingDetail } from "@/api/konsultasi";
import LoadingState from "@/components/shared/LoadingState";
import ErrorState from "@/components/shared/ErrorState";
import { formatDate, formatDateTime } from "@/utils/format";

const statusConfig: Record<string, { label: string; class: string; icon: React.ElementType }> = {
  pending: { label: "Pending", class: "bg-yellow-100 text-yellow-700", icon: Hourglass },
  confirmed: { label: "Confirmed", class: "bg-blue-100 text-blue-700", icon: BadgeCheck },
  ongoing: { label: "Ongoing", class: "bg-purple-100 text-purple-700", icon: PlayCircle },
  completed: { label: "Completed", class: "bg-green-100 text-green-700", icon: BadgeCheck },
  cancelled: { label: "Cancelled", class: "bg-red-100 text-red-700", icon: XCircle },
};

interface DetailItemProps {
  icon: React.ReactNode;
  label: string;
  value: string | null | undefined;
}

const DetailItem: React.FC<DetailItemProps> = ({ icon, label, value }) => (
  <div className="flex items-start space-x-3">
    <span className="text-text-muted mt-0.5 shrink-0">{icon}</span>
    <div>
      <p className="text-xs text-text-muted font-medium">{label}</p>
      <p className="text-sm font-semibold text-text">{value || "-"}</p>
    </div>
  </div>
);

const MonitoringDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: response, isLoading, isError } = useQuery({
    queryKey: ["booking-detail", id],
    queryFn: () => getBookingDetail(id || ""),
    enabled: !!id,
  });

  if (isLoading) return <LoadingState message="Memuat detail booking..." />;

  if (isError || !response?.data) {
    return (
      <ErrorState
        message="Gagal memuat detail booking."
        onRetry={() => window.location.reload()}
      />
    );
  }

  const d = response.data;
  const status = statusConfig[d.status.toLowerCase()] || statusConfig.completed;
  const StatusIcon = status.icon;
  const isCancelled = d.is_cancel === 1;

  return (
    <div className="space-y-6">
      <button
        onClick={() => navigate("/konsultasi/monitoring")}
        className="inline-flex items-center space-x-1.5 text-sm text-text-muted hover:text-text transition-colors"
      >
        <ChevronLeft className="w-4 h-4" />
        <span>Kembali ke Monitoring</span>
      </button>

      <div className="bg-gradient-to-br from-surface-muted to-surface rounded-card overflow-hidden">
        <div className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-14 h-14 rounded-full bg-dark-bg text-white flex items-center justify-center text-lg font-bold">
                {d.nama_customer?.charAt(0) || "P"}
              </div>
              <div>
                <div className="flex items-center space-x-3 mb-1">
                  <h2 className="text-xl font-bold text-text">{d.nama_customer}</h2>
                  <span className={`inline-flex items-center space-x-1 rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase ${status.class}`}>
                    <StatusIcon className="w-3 h-3" />
                    <span>{status.label}</span>
                  </span>
                </div>
                <p className="text-sm text-text-muted">
                  {d.tipe_booking === "booking" ? "Booking" : "Emergency"} &middot; {d.tipe_pasien === "customer" ? "Pasien" : d.tipe_pasien}
                  &middot; dr. {d.nama_dokter}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-surface/10 px-6 py-4 grid grid-cols-3 gap-6">
          <DetailItem
            icon={<Calendar className="w-4 h-4" />}
            label="Tanggal"
            value={formatDate(d.tanggal)}
          />
          <DetailItem
            icon={<Clock className="w-4 h-4" />}
            label="Jam"
            value={`${d.jam_mulai?.slice(0, 5)} - ${d.jam_selesai?.slice(0, 5)}`}
          />
          <DetailItem
            icon={<User className="w-4 h-4" />}
            label="Dokter"
            value={`dr. ${d.nama_dokter}`}
          />
        </div>
      </div>

      {isCancelled && d.cancel_reason && (
        <div className="bg-red-50 rounded-card p-4 flex items-start space-x-3">
          <Ban className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-red-700">Booking Dibatalkan</p>
            <p className="text-xs text-red-600 mt-0.5">{d.cancel_reason}</p>
            <p className="text-[10px] text-red-500 mt-1">
              {d.cancel_date ? formatDateTime(d.cancel_date) : ""} oleh {d.cancel_by || "sistem"}
            </p>
          </div>
        </div>
      )}

      {d.is_diperpanjang === "1" && (
        <div className="bg-purple-50 rounded-card p-4 flex items-start space-x-3">
          <Hourglass className="w-5 h-5 text-purple-500 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-purple-700">Konsultasi Diperpanjang</p>
            <p className="text-xs text-purple-600 mt-0.5">
              Durasi perpanjangan: {d.durasi_perpanjangan_menit} menit
            </p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-surface-muted rounded-card p-6">
          <h3 className="text-sm font-semibold text-text mb-4 flex items-center space-x-2">
            <User className="w-4 h-4 text-text-muted" />
            <span>Pasien</span>
          </h3>
          <div className="bg-surface rounded-lg p-4 space-y-3">
            <DetailItem icon={<User className="w-3.5 h-3.5" />} label="Nama" value={d.nama_customer} />
            <DetailItem icon={<BadgeCheck className="w-3.5 h-3.5" />} label="Tipe" value={d.tipe_pasien === "customer" ? "Pasien" : d.tipe_pasien} />
          </div>
        </div>

        <div className="bg-surface-muted rounded-card p-6">
          <h3 className="text-sm font-semibold text-text mb-4 flex items-center space-x-2">
            <Stethoscope className="w-4 h-4 text-text-muted" />
            <span>Dokter</span>
          </h3>
          <div className="bg-surface rounded-lg p-4 space-y-3">
            <DetailItem icon={<User className="w-3.5 h-3.5" />} label="Nama" value={`dr. ${d.nama_dokter}`} />
            {d.tipe_dokter && (
              <DetailItem icon={<BadgeCheck className="w-3.5 h-3.5" />} label="Tipe" value={d.tipe_dokter} />
            )}
          </div>
        </div>
      </div>

      {d.payments && d.payments.length > 0 && (
        <div className="bg-surface-muted rounded-card p-6">
          <h3 className="text-sm font-semibold text-text mb-4">Pembayaran</h3>
          <div className="bg-surface rounded-lg p-4">
            {d.payments.map((p: any) => (
              <div key={p.id_payments} className="flex items-center justify-between py-2 border-b border-surface/10 last:border-0">
                <span className="text-sm text-text">{p.metode_pembayaran}</span>
                <span className="text-sm font-semibold text-text">
                  {new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR" }).format(Number(p.total))}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default MonitoringDetail;