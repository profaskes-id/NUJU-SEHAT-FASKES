import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { Calendar, Stethoscope } from "lucide-react";
import { respondRequestDokter } from "@/api/dokter";
import Modal from "@/components/ui/Modal";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";

interface RespondRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  idRequestDokter: string;
  onSuccess: () => void;
}

const respondSchema = Yup.object({
  tanggal_mulai_praktek: Yup.date()
    .required("Tanggal mulai wajib diisi"),
  tanggal_expired_praktek: Yup.date()
    .min(Yup.ref("tanggal_mulai_praktek"), "Tanggal expired harus setelah tanggal mulai")
    .required("Tanggal expired wajib diisi"),
  tipe_dokter: Yup.string()
    .oneOf(["umum", "spesialis"], "Pilih tipe dokter")
    .required("Tipe dokter wajib dipilih"),
});

const RespondRequestModal: React.FC<RespondRequestModalProps> = ({
  isOpen,
  onClose,
  idRequestDokter,
  onSuccess,
}) => {
  const queryClient = useQueryClient();

  const respondMutation = useMutation({
    mutationFn: (payload: {
      tanggal_mulai_praktek: string;
      tanggal_expired_praktek: string;
      tipe_dokter: string;
    }) =>
      respondRequestDokter(idRequestDokter, {
        status: "accepted",
        is_aktif: 1,
        ...payload,
      }),
    onSuccess: (data) => {
      toast.success(data.message || "Request berhasil diterima");
      queryClient.invalidateQueries({ queryKey: ["request-dokter"] });
      formik.resetForm();
      onClose();
      onSuccess();
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Gagal menerima request");
    },
  });

  const formik = useFormik({
    initialValues: {
      tanggal_mulai_praktek: "",
      tanggal_expired_praktek: "",
      tipe_dokter: "umum",
    },
    validationSchema: respondSchema,
    onSubmit: (values) => {
      respondMutation.mutate(values);
    },
  });

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Terima Request Dokter">
      <form onSubmit={formik.handleSubmit} className="space-y-5">
        <Input
          label="Tanggal Mulai Praktek"
          name="tanggal_mulai_praktek"
          type="date"
          value={formik.values.tanggal_mulai_praktek}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.tanggal_mulai_praktek ? formik.errors.tanggal_mulai_praktek : undefined}
        />

        <Input
          label="Tanggal Expired Praktek"
          name="tanggal_expired_praktek"
          type="date"
          value={formik.values.tanggal_expired_praktek}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.tanggal_expired_praktek ? formik.errors.tanggal_expired_praktek : undefined}
        />

        <div className="space-y-2">
          <label className="text-xs font-medium text-text-muted">Tipe Dokter</label>
          <div className="flex items-center space-x-6 pt-1">
            <label className="flex items-center space-x-2 cursor-pointer group">
              <input
                type="radio"
                name="tipe_dokter"
                value="umum"
                checked={formik.values.tipe_dokter === "umum"}
                onChange={formik.handleChange}
                className="w-4 h-4 text-dark-bg focus:ring-dark-bg border-surface-border"
              />
              <span className="text-sm font-medium text-text group-hover:text-dark-bg transition-colors">
                Umum
              </span>
            </label>
            <label className="flex items-center space-x-2 cursor-pointer group">
              <input
                type="radio"
                name="tipe_dokter"
                value="spesialis"
                checked={formik.values.tipe_dokter === "spesialis"}
                onChange={formik.handleChange}
                className="w-4 h-4 text-dark-bg focus:ring-dark-bg border-surface-border"
              />
              <span className="text-sm font-medium text-text group-hover:text-dark-bg transition-colors">
                Spesialis
              </span>
            </label>
          </div>
          {formik.touched.tipe_dokter && formik.errors.tipe_dokter && (
            <p className="text-[10px] text-red-500">{formik.errors.tipe_dokter}</p>
          )}
        </div>

        <div className="flex items-center space-x-3 pt-3">
          <Button type="submit" loading={respondMutation.isPending}>
            Terima Request
          </Button>
          <Button type="button" variant="ghost" onClick={onClose}>
            Batal
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default RespondRequestModal;
