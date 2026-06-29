import React, { useState, useRef } from "react";
import { Lock, ShieldCheck, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { createPin } from "@/api/auth";
import { useAuthStore } from "@/store/authStore";
import Button from "@/components/ui/Button";

const PinSettings: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [pin, setPin] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleChange = (index: number, value: string) => {
    if (value.length > 1) return;
    const newPin = [...pin];
    newPin[index] = value;
    setPin(newPin);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !pin[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleSubmit = async () => {
    const nomorPin = pin.join("");
    if (nomorPin.length !== 6) return;

    setLoading(true);
    try {
      await createPin({ id_user: user!.id, nomor_pin: nomorPin });
      toast.success("PIN berhasil dibuat");
      setPin(["", "", "", "", "", ""]);
    } catch {
      toast.error("Gagal membuat PIN");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto space-y-6">
      <div className="flex items-center space-x-4">
        <button
          onClick={() => navigate("/pengaturan/profile")}
          className="p-2 rounded-full hover:bg-surface-muted text-text-muted hover:text-text transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="flex items-center space-x-3">
          <span className="bg-dark-bg text-white rounded-full p-2.5 inline-flex items-center justify-center shadow-sm">
            <Lock className="w-5 h-5" />
          </span>
          <div>
            <h1 className="text-2xl font-bold text-text leading-tight">Pengaturan PIN</h1>
            <p className="text-sm text-text-muted mt-0.5">Buat PIN keamanan untuk transaksi withdraw</p>
          </div>
        </div>
      </div>

      <div className="bg-surface-muted rounded-card p-6 space-y-6">
        <div className="flex flex-col items-center space-y-4">
          <span className="bg-dark-bg text-text-inverse rounded-full p-3 inline-flex items-center justify-center">
            <ShieldCheck className="w-6 h-6" />
          </span>
          <p className="text-sm text-text-muted text-center">
            Masukkan PIN 6 digit yang akan digunakan sebagai verifikasi saat mengajukan withdraw
          </p>
        </div>

        <div className="flex items-center justify-center space-x-3">
          {pin.map((digit, index) => (
            <input
              key={index}
              ref={(el) => { inputRefs.current[index] = el; }}
              type="password"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              className="w-10 h-12 text-center text-lg font-bold border border-surface-border rounded-input bg-surface text-text focus:outline-none focus:ring-2 focus:ring-primary transition-all"
            />
          ))}
        </div>

        <Button
          onClick={handleSubmit}
          loading={loading}
          className="w-full"
          disabled={pin.join("").length !== 6}
        >
          Simpan PIN
        </Button>
      </div>
    </div>
  );
};

export default PinSettings;
