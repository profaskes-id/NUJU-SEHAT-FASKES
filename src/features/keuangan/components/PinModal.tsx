import React, { useState, useRef } from "react";
import { Lock, X } from "lucide-react";
import { verifyPin } from "@/api/keuangan";
import { useAuthStore } from "@/store/authStore";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";

interface PinModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const PinModal: React.FC<PinModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const { user } = useAuthStore();
  const [pin, setPin] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleChange = (index: number, value: string) => {
    if (value.length > 1) return;
    const newPin = [...pin];
    newPin[index] = value;
    setPin(newPin);
    setError("");

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
    if (nomorPin.length !== 6) {
      setError("PIN harus 6 digit");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await verifyPin({ id_user: user!.id, nomor_pin: nomorPin });
      if (res.success) {
        setPin(["", "", "", "", "", ""]);
        onSuccess();
      } else {
        setError(res.message || "PIN salah");
      }
    } catch {
      setError("PIN salah atau terjadi kesalahan");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Verifikasi PIN">
      <div className="flex flex-col items-center space-y-6">
        <span className="bg-dark-bg text-text-inverse rounded-full p-3 inline-flex items-center justify-center">
          <Lock className="w-5 h-5" />
        </span>
        <p className="text-sm text-text-muted text-center">
          Masukkan PIN Anda untuk melanjutkan pengajuan withdraw
        </p>

        <div className="flex items-center space-x-3">
          {pin.map((digit, index) => (
            <input
              key={index}
              ref={(el) => { inputRefs.current[index] = el; }}
              type="password"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              className={`w-10 h-12 text-center text-lg font-bold border rounded-input bg-surface text-text focus:outline-none focus:ring-2 focus:ring-primary transition-all ${
                error ? "border-red-500 focus:ring-red-500" : "border-surface-border"
              }`}
            />
          ))}
        </div>

        {error && (
          <p className="text-[10px] text-red-500 -mt-4">{error}</p>
        )}

        <Button
          onClick={handleSubmit}
          loading={loading}
          className="w-full"
          disabled={pin.join("").length !== 6}
        >
          Verifikasi PIN
        </Button>
      </div>
    </Modal>
  );
};

export default PinModal;
