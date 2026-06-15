import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import Modal from "@/components/ui/Modal";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import type { Margin } from "../types";
import toast from "react-hot-toast";

interface MarginEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  margin: Margin | null;
  onSubmit: (values: { nominal: number }) => Promise<void>;
}

const validationSchema = Yup.object({
  nominal: Yup.number()
    .min(0, "Nominal tidak boleh negatif")
    .required("Nominal wajib diisi"),
});

/**
 * MarginEditModal - Modal untuk mengubah nominal margin jenis konsultasi.
 */
const MarginEditModal: React.FC<MarginEditModalProps> = ({
  isOpen,
  onClose,
  margin,
  onSubmit,
}) => {
  const formik = useFormik({
    initialValues: {
      nominal: margin?.nominal || 0,
    },
    enableReinitialize: true,
    validationSchema,
    onSubmit: async (values) => {
      try {
        await onSubmit(values);
        onClose();
      } catch (error) {
        toast.error("Gagal memperbarui margin");
      }
    },
  });

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Edit Margin: ${margin?.nama_jenis_konsultasi}`}>
      <form onSubmit={formik.handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <div>
            <label className="text-xs font-bold text-text-muted uppercase tracking-wider mb-1.5 block">
              Nominal Margin (Rp)
            </label>
            <Input
              type="number"
              name="nominal"
              placeholder="Masukkan nominal margin..."
              value={formik.values.nominal}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.nominal ? formik.errors.nominal : undefined}
              disabled={formik.isSubmitting}
            />
            <p className="text-[10px] text-text-muted mt-2">
              Margin ini akan ditambahkan ke harga dasar konsultasi dokter.
            </p>
          </div>
        </div>

        <div className="flex justify-end space-x-3 pt-4 border-t border-surface-border">
          <Button type="button" variant="ghost" onClick={onClose} disabled={formik.isSubmitting}>
            Batal
          </Button>
          <Button type="submit" loading={formik.isSubmitting}>
            Simpan Perubahan
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default MarginEditModal;
