import React, { useState, useEffect } from "react";
import { Wallet, ArrowLeft, Banknote, Building2, User, CreditCard, ArrowUpRight, RefreshCw, Plus, Check, X } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { getWalletSaldo } from "@/api/keuangan";
import { useAuthStore } from "@/store/authStore";
import { useRekeningTersimpan, useCreateRekeningTersimpan, useCreateWithdrawRequest } from "@/features/keuangan/hooks/useRekeningTersimpan";
import PinModal from "@/features/keuangan/components/PinModal";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import LoadingState from "@/components/shared/LoadingState";

const formatRupiah = (num: number) =>
  new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(num);

type TabKey = "rekening-baru" | "tersimpan";

const QUICK_AMOUNTS = [100000, 500000, 1000000, 2000000];

const AjukanWithdraw: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [activeTab, setActiveTab] = useState<TabKey>("rekening-baru");
  const [namaPemilik, setNamaPemilik] = useState("");
  const [namaBank, setNamaBank] = useState("");
  const [nomorRekening, setNomorRekening] = useState("");
  const [jumlahPenarikan, setJumlahPenarikan] = useState("");
  const [simpanRekening, setSimpanRekening] = useState(false);
  const [showTambahForm, setShowTambahForm] = useState(false);
  const [tambahNamaPemilik, setTambahNamaPemilik] = useState("");
  const [tambahNamaBank, setTambahNamaBank] = useState("");
  const [tambahNomorRekening, setTambahNomorRekening] = useState("");
  const [selectedRekening, setSelectedRekening] = useState<string>("");
  const [tersimpanJumlah, setTersimpanJumlah] = useState("");
  const [isPinModalOpen, setIsPinModalOpen] = useState(false);
  const [pendingWithdraw, setPendingWithdraw] = useState<"baru" | "tersimpan" | null>(null);

  const createRekening = useCreateRekeningTersimpan(user?.id);
  const withdrawRequest = useCreateWithdrawRequest(user?.id);

  useEffect(() => {
    console.log("api_user_id:", user?.id);
  }, [user]);

  const { data: walletResponse, isLoading: isWalletLoading } = useQuery({
    queryKey: ["wallet-saldo", user?.id],
    queryFn: () => getWalletSaldo("faskes", user!.id),
    enabled: !!user?.id,
  });

  const { data: rekeningData, isLoading: isRekeningLoading } = useRekeningTersimpan(user?.id);

  const wallet = walletResponse?.data;
  const saldo = wallet?.saldo ?? 0;
  const rekeningList = rekeningData?.data?.items ?? [];

  const jumlahMelebihiSaldo = Number(jumlahPenarikan) > saldo;
  const tersimpanMelebihiSaldo = Number(tersimpanJumlah) > saldo;

  const tabs: { key: TabKey; label: string }[] = [
    { key: "rekening-baru", label: "Rekening Baru" },
    { key: "tersimpan", label: "Tersimpan" },
  ];

  const handleQuickAmount = (amount: number) => {
    setJumlahPenarikan(amount.toString());
  };

  const handleTambahRekening = async () => {
    if (!tambahNamaPemilik || !tambahNamaBank || !tambahNomorRekening) return;
    await createRekening.mutateAsync({
      nama_pemilik: tambahNamaPemilik,
      nama_bank: tambahNamaBank,
      nomor_rekening: tambahNomorRekening,
    });
    setTambahNamaPemilik("");
    setTambahNamaBank("");
    setTambahNomorRekening("");
    setShowTambahForm(false);
  };

  const handleAjukanWithdrawBaru = async () => {
    if (!namaPemilik || !namaBank || !nomorRekening || !jumlahPenarikan) return;
    setPendingWithdraw("baru");
    setIsPinModalOpen(true);
  };

  const handleAjukanWithdrawTersimpan = async () => {
    if (!selectedRekening || !tersimpanJumlah) return;
    setPendingWithdraw("tersimpan");
    setIsPinModalOpen(true);
  };

  const handlePinSuccess = async () => {
    setIsPinModalOpen(false);
    if (pendingWithdraw === "baru") {
      try {
        await withdrawRequest.mutateAsync({
          amount: Number(jumlahPenarikan),
          id_user: user!.id,
          nama_bank: namaBank,
          nomor_rekening: nomorRekening,
          atas_nama_rekening: namaPemilik,
          simpan_rekening: simpanRekening || undefined,
        });
        toast.success("Withdraw berhasil diajukan");
        setNamaPemilik("");
        setNamaBank("");
        setNomorRekening("");
        setJumlahPenarikan("");
        setSimpanRekening(false);
      } catch {
        toast.error("Gagal mengajukan withdraw");
      }
    } else if (pendingWithdraw === "tersimpan") {
      try {
        await withdrawRequest.mutateAsync({
          id_user: user!.id,
          amount: Number(tersimpanJumlah),
          id_rekening_tersimpan: selectedRekening,
        });
        toast.success("Withdraw berhasil diajukan");
        setSelectedRekening("");
        setTersimpanJumlah("");
      } catch {
        toast.error("Gagal mengajukan withdraw");
      }
    }
    setPendingWithdraw(null);
  };

  if (isWalletLoading) return <LoadingState message="Memuat data..." />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <button
          onClick={() => navigate("/keuangan/wallet")}
          className="p-2 rounded-full hover:bg-surface-muted text-text-muted hover:text-text transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="flex items-center space-x-3">
          <span className="bg-dark-bg text-white rounded-full p-2.5 inline-flex items-center justify-center shadow-sm">
            <ArrowUpRight className="w-5 h-5" />
          </span>
          <div>
            <h1 className="text-2xl font-bold text-text leading-tight">Ajukan Withdraw</h1>
            <p className="text-sm text-text-muted mt-0.5">Tarik saldo wallet ke rekening bank Anda</p>
          </div>
        </div>
      </div>

      {/* Saldo Card */}
      <div className="bg-gradient-to-br from-primary to-primary-hover rounded-card p-5 text-text-inverse relative overflow-hidden">
        <div className="absolute top-0 right-0 w-36 h-36 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/4" />
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/4" />

        <div className="relative flex items-center space-x-3">
          <span className="bg-white/20 text-white rounded-full p-2.5 inline-flex items-center justify-center backdrop-blur-sm">
            <Wallet className="w-5 h-5" />
          </span>
          <div>
            <p className="text-xs text-white/60 font-medium uppercase tracking-wider">Saldo Tersedia</p>
            <p className="text-2xl font-bold tracking-tight">
              {wallet ? formatRupiah(wallet.saldo) : "Rp 0"}
            </p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-surface-border">
        <div className="flex space-x-6">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`pb-3 text-sm font-medium transition-colors relative ${
                activeTab === tab.key
                  ? "text-primary border-b-2 border-primary"
                  : "text-text-muted hover:text-text"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === "rekening-baru" && (
        <div className="bg-surface-muted rounded-card p-6 space-y-6">
          <div className="flex items-center space-x-2">
            <Banknote className="w-4 h-4 text-text-muted" />
            <h3 className="text-sm font-semibold text-text">Informasi Rekening Tujuan</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input
              label="Nama Pemilik"
              placeholder="Masukkan nama pemilik rekening"
              value={namaPemilik}
              onChange={(e) => setNamaPemilik(e.target.value)}
            />
            <Input
              label="Nama Bank"
              placeholder="Masukkan nama bank"
              value={namaBank}
              onChange={(e) => setNamaBank(e.target.value)}
            />
            <Input
              label="Nomor Rekening"
              placeholder="Masukkan nomor rekening"
              value={nomorRekening}
              onChange={(e) => setNomorRekening(e.target.value)}
            />
          </div>

          <div className="border-t border-surface-border pt-6 space-y-4">
            <div className="flex items-center space-x-2">
              <CreditCard className="w-4 h-4 text-text-muted" />
              <h3 className="text-sm font-semibold text-text">Jumlah Penarikan</h3>
            </div>

            <div className="max-w-md">
              <Input
                placeholder="Masukkan jumlah penarikan"
                value={jumlahPenarikan}
                onChange={(e) => {
                  const val = e.target.value.replace(/\D/g, "");
                  setJumlahPenarikan(val);
                }}
              />
              {jumlahMelebihiSaldo && jumlahPenarikan && (
                <p className="text-[10px] text-red-500 mt-1">
                  Jumlah penarikan tidak boleh melebihi saldo ({formatRupiah(saldo)})
                </p>
              )}
            </div>

            <div className="flex flex-wrap gap-2">
              {QUICK_AMOUNTS.map((amount) => (
                <button
                  key={amount}
                  onClick={() => handleQuickAmount(amount)}
                  className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors border ${
                    Number(jumlahPenarikan) === amount
                      ? "bg-primary text-text-inverse border-primary"
                      : "bg-surface text-text-muted border-surface-border hover:border-primary hover:text-primary"
                  }`}
                >
                  {formatRupiah(amount)}
                </button>
              ))}
            </div>
          </div>

          <div className="border-t border-surface-border pt-6">
            <label className="flex items-center space-x-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={simpanRekening}
                onChange={(e) => setSimpanRekening(e.target.checked)}
                className="w-4 h-4 rounded border-surface-border text-primary focus:ring-primary"
              />
              <span className="text-sm text-text">Tambahkan rekening ini ke daftar tersimpan</span>
            </label>
          </div>

          <div className="flex justify-end pt-2">
            <Button
              onClick={handleAjukanWithdrawBaru}
              loading={withdrawRequest.isPending}
              disabled={!namaPemilik || !namaBank || !nomorRekening || !jumlahPenarikan || jumlahMelebihiSaldo}
            >
              <ArrowUpRight className="w-4 h-4 mr-2" />
              Ajukan Withdraw
            </Button>
          </div>
        </div>
      )}

      {activeTab === "tersimpan" && (
        <div className="bg-surface-muted rounded-card p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Building2 className="w-4 h-4 text-text-muted" />
              <h3 className="text-sm font-semibold text-text">Rekening Tersimpan</h3>
            </div>
            {!showTambahForm && (
              <button
                onClick={() => setShowTambahForm(true)}
                className="inline-flex items-center space-x-1.5 text-primary hover:text-primary-hover text-sm font-semibold transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>Tambah Rekening</span>
              </button>
            )}
          </div>

          {showTambahForm && (
            <div className="bg-surface rounded-card p-4 border border-surface-border space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-semibold text-text">Rekening Baru</h4>
                <button
                  onClick={() => setShowTambahForm(false)}
                  className="p-1 rounded-full hover:bg-surface-muted text-text-muted hover:text-text transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Input
                  label="Nama Pemilik"
                  placeholder="Masukkan nama pemilik rekening"
                  value={tambahNamaPemilik}
                  onChange={(e) => setTambahNamaPemilik(e.target.value)}
                />
                <Input
                  label="Nama Bank"
                  placeholder="Masukkan nama bank"
                  value={tambahNamaBank}
                  onChange={(e) => setTambahNamaBank(e.target.value)}
                />
                <Input
                  label="Nomor Rekening"
                  placeholder="Masukkan nomor rekening"
                  value={tambahNomorRekening}
                  onChange={(e) => setTambahNomorRekening(e.target.value)}
                />
              </div>
              <div className="flex justify-end">
                <Button
                  onClick={handleTambahRekening}
                  loading={createRekening.isPending}
                  disabled={!tambahNamaPemilik || !tambahNamaBank || !tambahNomorRekening}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Simpan Rekening
                </Button>
              </div>
            </div>
          )}

          {isRekeningLoading ? (
            <LoadingState message="Memuat rekening tersimpan..." />
          ) : rekeningList.length === 0 ? (
            <div className="py-12 flex flex-col items-center justify-center text-center space-y-3">
              <div className="bg-surface rounded-full p-4">
                <Building2 className="w-6 h-6 text-text-muted" />
              </div>
              <p className="text-sm font-medium text-text">Belum Ada Rekening Tersimpan</p>
              <p className="text-xs text-text-muted max-w-xs">
                Anda belum menyimpan rekening bank. Klik "Tambah Rekening" untuk menambahkan rekening baru.
              </p>
            </div>
          ) : (
            <>
              <div className="space-y-2">
                {rekeningList.map((rek) => (
                  <button
                    key={rek.id_rekening_tersimpan}
                    onClick={() => setSelectedRekening(rek.id_rekening_tersimpan)}
                    className={`w-full text-left bg-surface rounded-card p-4 border transition-colors ${
                      selectedRekening === rek.id_rekening_tersimpan
                        ? "border-primary ring-1 ring-primary"
                        : "border-surface-border hover:border-primary/50"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="bg-primary-light rounded-full p-2.5">
                          <Building2 className="w-4 h-4 text-primary" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-text">{rek.nama_bank}</p>
                          <p className="text-xs text-text-muted">{rek.nama_pemilik} • {rek.nomor_rekening}</p>
                        </div>
                      </div>
                      <span className="bg-green-100 text-green-700 rounded-full px-2 py-0.5 text-xs font-medium inline-flex items-center space-x-1">
                        <Check className="w-3 h-3" />
                        <span>Aktif</span>
                      </span>
                    </div>
                  </button>
                ))}
              </div>

              {selectedRekening && (
                <div className="bg-surface rounded-card p-4 border border-surface-border space-y-4">
                  <div className="flex items-center space-x-2">
                    <CreditCard className="w-4 h-4 text-text-muted" />
                    <h4 className="text-sm font-semibold text-text">Jumlah Penarikan</h4>
                  </div>
                  <div className="max-w-md">
                    <Input
                      placeholder="Masukkan jumlah penarikan"
                      value={tersimpanJumlah}
                      onChange={(e) => {
                        const val = e.target.value.replace(/\D/g, "");
                        setTersimpanJumlah(val);
                      }}
                    />
                    {tersimpanMelebihiSaldo && tersimpanJumlah && (
                      <p className="text-[10px] text-red-500 mt-1">
                        Jumlah penarikan tidak boleh melebihi saldo ({formatRupiah(saldo)})
                      </p>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {QUICK_AMOUNTS.map((q) => (
                      <button
                        key={q}
                        onClick={() => setTersimpanJumlah(q.toString())}
                        className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors border ${
                          Number(tersimpanJumlah) === q
                            ? "bg-primary text-text-inverse border-primary"
                            : "bg-surface text-text-muted border-surface-border hover:border-primary hover:text-primary"
                        }`}
                      >
                        {formatRupiah(q)}
                      </button>
                    ))}
                  </div>
                  <div className="flex justify-end">
                    <Button
                      onClick={handleAjukanWithdrawTersimpan}
                      loading={withdrawRequest.isPending}
                      disabled={!tersimpanJumlah || tersimpanMelebihiSaldo}
                    >
                      <ArrowUpRight className="w-4 h-4 mr-2" />
                      Ajukan Withdraw
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      )}

      <PinModal
        isOpen={isPinModalOpen}
        onClose={() => { setIsPinModalOpen(false); setPendingWithdraw(null); }}
        onSuccess={handlePinSuccess}
      />
    </div>
  );
};

export default AjukanWithdraw;
