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
  Phone,
  Hash,
  Wallet,
  Fingerprint,
} from "lucide-react";
import { getBookingDetail } from "@/api/konsultasi";
import LoadingState from "@/components/shared/LoadingState";
import ErrorState from "@/components/shared/ErrorState";
import { formatDate, formatDateTime } from "@/utils/format";

const statusConfig: Record<
  string,
  { label: string; class: string; icon: React.ElementType }
> = {
  pending: {
    label: "Pending",
    class: "bg-yellow-100 text-yellow-700",
    icon: Hourglass,
  },
  confirmed: {
    label: "Confirmed",
    class: "bg-blue-100 text-blue-700",
    icon: BadgeCheck,
  },
  ongoing: {
    label: "Ongoing",
    class: "bg-purple-100 text-purple-700",
    icon: PlayCircle,
  },
  completed: {
    label: "Completed",
    class: "bg-green-100 text-green-700",
    icon: BadgeCheck,
  },
  cancelled: {
    label: "Cancelled",
    class: "bg-red-100 text-red-700",
    icon: XCircle,
  },
};

const InfoRow: React.FC<{
  icon: React.ReactNode;
  label: string;
  value: string | React.ReactNode;
}> = ({ icon, label, value }) => (
  <div className="flex items-center py-3 px-4 odd:bg-white even:bg-surface-muted dark:odd:bg-dark-card dark:even:bg-dark-surface rounded-lg">
    <div className="flex items-center w-1/2 sm:w-2/5">
      <span className="text-text-muted shrink-0 mr-3">{icon}</span>
      <span className="text-xs font-semibold text-text-muted uppercase tracking-wider">
        {label}
      </span>
    </div>
    <div className="w-1/2 sm:w-3/5 text-sm font-medium text-text">
      {value || "-"}
    </div>
  </div>
);

const SubHeader: React.FC<{ icon: React.ReactNode; title: string }> = ({
  icon,
  title,
}) => (
  <div className="flex items-center space-x-2.5 mb-3">
    <span className="text-dark-bg dark:text-dark-text">{icon}</span>
    <h4 className="text-sm font-bold text-dark-bg dark:text-dark-text uppercase tracking-wider">
      {title}
    </h4>
  </div>
);

const MonitoringDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const {
    data: response,
    isLoading,
    isError,
  } = useQuery({
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
  const isCancelled = d.is_cancel === 1;
  const status = isCancelled
    ? statusConfig.cancelled
    : statusConfig[d.status.toLowerCase()] || statusConfig.completed;
  const StatusIcon = status.icon;

  return (
    <div className="space-y-5 max-w-5xl mx-auto">
      <button
        onClick={() => navigate("/konsultasi/monitoring")}
        className="inline-flex items-center space-x-1.5 text-sm text-text-muted hover:text-text transition-colors"
      >
        <ChevronLeft className="w-4 h-4" />
        <span>Kembali ke Monitoring</span>
      </button>

      {/* Header */}
      <div className="bg-dark-bg rounded-xl overflow-hidden p-5">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 rounded-full bg-white/10 text-text-inverse flex items-center justify-center text-base font-bold shrink-0">
            {d.nama_customer?.charAt(0) || "P"}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center flex-wrap gap-2">
              <h2 className="text-lg font-bold text-text-inverse truncate">
                {d.nama_customer}
              </h2>
              <span
                className={`inline-flex items-center space-x-1 rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase ${status.class}`}
              >
                <StatusIcon className="w-3 h-3" />
                <span>{status.label}</span>
              </span>
            </div>
            <p className="text-sm text-text-inverse/70 mt-0.5">
              {d.tipe_booking === "booking" ? "Booking" : "Emergency"}
              {d.tipe_pasien
                ? ` · ${d.tipe_pasien === "customer" ? "Pasien" : d.tipe_pasien}`
                : ""}
              {d.nama_dokter ? ` · dr. ${d.nama_dokter}` : ""}
            </p>
          </div>
        </div>
      </div>

      {/* Jadwal & Dokter */}
      <div className="bg-surface-muted dark:bg-dark-card rounded-xl border border-surface-border/40 overflow-hidden">
        <div className="px-5 py-4 border-b border-surface-border/40">
          <SubHeader
            icon={<Calendar className="w-4 h-4" />}
            title="Jadwal & Dokter"
          />
        </div>
        <div className="rounded-lg overflow-hidden border border-surface-border/30 divide-y divide-surface-border/30 mx-5 mb-4">
          <InfoRow
            icon={<Calendar className="w-4 h-4" />}
            label="Tanggal"
            value={formatDate(d.tanggal)}
          />
          <InfoRow
            icon={<Clock className="w-4 h-4" />}
            label="Jam"
            value={`${d.jam_mulai?.slice(0, 5)} - ${d.jam_selesai?.slice(0, 5)}`}
          />
          <InfoRow
            icon={<User className="w-4 h-4" />}
            label="Dokter"
            value={`dr. ${d.nama_dokter}`}
          />
        </div>
      </div>

      {/* Cancel Info */}
      {isCancelled && d.cancel_reason && (
        <div className="bg-red-50 dark:bg-red-950/30 rounded-xl border border-red-200/60 dark:border-red-800/40 p-4 flex items-start space-x-3">
          <Ban className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-red-700 dark:text-red-400">
              Booking Dibatalkan
            </p>
            <p className="text-xs text-red-600 dark:text-red-300 mt-0.5">
              {d.cancel_reason}
            </p>
            <p className="text-[10px] text-red-500 dark:text-red-400 mt-1">
              {d.cancel_date ? formatDateTime(d.cancel_date) : ""} oleh{" "}
              {d.cancel_by || "sistem"}
            </p>
          </div>
        </div>
      )}

      {/* Extend Info */}
      {d.is_diperpanjang === "1" && (
        <div className="bg-purple-50 dark:bg-purple-950/30 rounded-xl border border-purple-200/60 dark:border-purple-800/40 p-4 flex items-start space-x-3">
          <Hourglass className="w-5 h-5 text-purple-500 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-bold text-purple-700 dark:text-purple-400">
              Konsultasi Diperpanjang
            </p>
            <p className="text-xs text-purple-600 dark:text-purple-300 mt-0.5">
              Durasi perpanjangan: {d.durasi_perpanjangan_menit} menit
            </p>
          </div>
        </div>
      )}

      {/* Pasien & Dokter Detail */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="bg-surface-muted dark:bg-dark-card rounded-xl border border-surface-border/40 overflow-hidden">
          <div className="px-5 py-3 border-b border-surface-border/40">
            <SubHeader icon={<User className="w-4 h-4" />} title="Pasien" />
          </div>
          <div className="px-5 pb-4">
            <div className="rounded-lg overflow-hidden border border-surface-border/30 divide-y divide-surface-border/30">
              <InfoRow
                icon={<User className="w-4 h-4" />}
                label="Nama"
                value={d.nama_customer}
              />
              <InfoRow
                icon={<BadgeCheck className="w-4 h-4" />}
                label="Tipe"
                value={d.tipe_pasien === "customer" ? "Pasien" : d.tipe_pasien}
              />
              {d.nomor_hp_customer && (
                <InfoRow
                  icon={<Phone className="w-4 h-4" />}
                  label="No. HP"
                  value={d.nomor_hp_customer}
                />
              )}
              {d.email_customer && (
                <InfoRow
                  icon={<Hash className="w-4 h-4" />}
                  label="Email"
                  value={d.email_customer}
                />
              )}
            </div>
          </div>
        </div>

        <div className="bg-surface-muted dark:bg-dark-card rounded-xl border border-surface-border/40 overflow-hidden">
          <div className="px-5 py-3 border-b border-surface-border/40">
            <SubHeader
              icon={<Stethoscope className="w-4 h-4" />}
              title="Dokter"
            />
          </div>
          <div className="px-5 pb-4">
            <div className="rounded-lg overflow-hidden border border-surface-border/30 divide-y divide-surface-border/30">
              <InfoRow
                icon={<User className="w-4 h-4" />}
                label="Nama"
                value={`dr. ${d.nama_dokter}`}
              />
              {d.tipe_dokter && (
                <InfoRow
                  icon={<BadgeCheck className="w-4 h-4" />}
                  label="Tipe"
                  value={d.tipe_dokter}
                />
              )}
              {d.nomor_hp_dokter && (
                <InfoRow
                  icon={<Phone className="w-4 h-4" />}
                  label="No. HP"
                  value={d.nomor_hp_dokter}
                />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Pembayaran */}
      {d.payments && d.payments.length > 0 && (
        <div className="bg-surface-muted dark:bg-dark-card rounded-xl border border-surface-border/40 overflow-hidden">
          <div className="px-5 py-3 border-b border-surface-border/40">
            <SubHeader
              icon={<Wallet className="w-4 h-4" />}
              title="Pembayaran"
            />
          </div>
          <div className="px-5 pb-4">
            <div className="rounded-lg overflow-hidden border border-surface-border/30">
              {d.payments.map((p: any, idx: number) => (
                <div
                  key={p.id_payments || idx}
                  className="flex items-center justify-between py-3 px-4 odd:bg-white even:bg-surface-muted dark:odd:bg-dark-card dark:even:bg-dark-surface last:rounded-b-lg"
                >
                  <span className="text-sm font-medium text-text">
                    {p.metode_pembayaran}
                  </span>
                  <span className="text-sm font-bold text-text">
                    {new Intl.NumberFormat("id-ID", {
                      style: "currency",
                      currency: "IDR",
                    }).format(Number(p.total))}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MonitoringDetail;
