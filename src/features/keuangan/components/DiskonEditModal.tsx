import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import Modal from "@/components/ui/Modal";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import Select from "@/components/ui/Select";
import type { Diskon } from "../types";
import toast from "react-hot-toast";

interface DiskonEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  diskon: Diskon | null;
  onSubmit: (values: any) => Promise<void>;
}

const validationSchema = Yup.object({
  nama_diskon: Yup.string().required("Nama diskon wajib diisi"),
  tipe_diskon: Yup.string().oneOf(["percentage", "fixed"]).required("Tipe diskon wajib dipilih"),
  nilai_diskon: Yup.number()
    .min(0, "Nilai tidak boleh negatif")
    .when("tipe_diskon", {
      is: "percentage",
      then: (schema) => schema.max(100, "Persentase maksimal 100%"),
    })
    .required("Nilai diskon wajib diisi"),
  berlaku_mulai: Yup.string().required("Tanggal mulai wajib diisi"),
  berlaku_selesai: Yup.string().required("Tanggal selesai wajib diisi"),
  is_aktif: Yup.boolean(),
});

/**
 * DiskonEditModal - Modal untuk mengatur program diskon jenis konsultasi.
 */
const DiskonEditModal: React.FC<DiskonEditModalProps> = ({
  isOpen,
  onClose,
  diskon,
  onSubmit,
}) => {
  const formik = useFormik({
    initialValues: {
      nama_diskon: diskon?.nama_diskon || "",
      tipe_diskon: diskon?.tipe_diskon || "percentage",
      nilai_diskon: diskon?.nilai_diskon || 0,
      berlaku_mulai: diskon?.berlaku_mulai?.split(" ")[0] || "",
      berlaku_selesai: diskon?.berlaku_selesai?.split(" ")[0] || "",
      is_aktif: diskon?.is_aktif ?? false,
    },
    enableReinitialize: true,
    validationSchema,
    onSubmit: async (values) => {
      try {
        // Format tanggal ke format yang diminta API: YYYY-MM-DD HH:mm:ss
        const payload = {
          ...values,
          berlaku_mulai: `${values.berlaku_mulai} 00:00:00`,
          berlaku_selesai: `${values.berlaku_selesai} 23:59:59`,
        };
        await onSubmit(payload);
        onClose();
      } catch (error) {
        toast.error("Gagal memperbarui diskon");
      }
    },
  });

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Edit Diskon: ${diskon?.nama_jenis_konsultasi}`}>
      <form onSubmit={formik.handleSubmit} className="space-y-4">
        <div>
          <label className="text-[10px] font-bold text-text-muted uppercase tracking-wider mb-1 block">
            Nama Program Diskon
          </label>
          <Input
            name="nama_diskon"
            placeholder="Contoh: Promo Lebaran"
            value={formik.values.nama_diskon}
            onChange={formik.handleChange}
            error={formik.touched.nama_diskon ? formik.errors.nama_diskon : undefined}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-[10px] font-bold text-text-muted uppercase tracking-wider mb-1 block">
              Tipe Diskon
            </label>
            <Select
              name="tipe_diskon"
              value={formik.values.tipe_diskon}
              onChange={formik.handleChange}
            >
              <option value="percentage">Persentase (%)</option>
              <option value="fixed">Nominal Tetap (Rp)</option>
            </Select>
          </div>
          <div>
            <label className="text-[10px] font-bold text-text-muted uppercase tracking-wider mb-1 block">
              Nilai Diskon
            </label>
            <Input
              type="number"
              name="nilai_diskon"
              value={formik.values.nilai_diskon}
              onChange={formik.handleChange}
              error={formik.touched.nilai_diskon ? formik.errors.nilai_diskon : undefined}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-[10px] font-bold text-text-muted uppercase tracking-wider mb-1 block">
              Berlaku Mulai
            </label>
            <Input
              type="date"
              name="berlaku_mulai"
              value={formik.values.berlaku_mulai}
              onChange={formik.handleChange}
              error={formik.touched.berlaku_mulai ? formik.errors.berlaku_mulai : undefined}
            />
          </div>
          <div>
            <label className="text-[10px] font-bold text-text-muted uppercase tracking-wider mb-1 block">
              Berlaku Selesai
            </label>
            <Input
              type="date"
              name="berlaku_selesai"
              value={formik.values.berlaku_selesai}
              onChange={formik.handleChange}
              error={formik.touched.berlaku_selesai ? formik.errors.berlaku_selesai : undefined}
            />
          </div>
        </div>

        <div className="flex items-center space-x-3 p-3 bg-surface-muted rounded-input">
          <input
            type="checkbox"
            name="is_aktif"
            id="is_aktif"
            className="w-4 h-4 text-primary focus:ring-primary border-surface-border rounded"
            checked={formik.values.is_aktif}
            onChange={formik.handleChange}
          />
          <label htmlFor="is_aktif" className="text-sm font-medium text-text cursor-pointer">
            Aktifkan Program Diskon
          </label>
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

export default DiskonEditModal;
