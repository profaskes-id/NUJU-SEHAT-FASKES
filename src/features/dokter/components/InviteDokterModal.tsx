import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { Mail, Phone } from "lucide-react";
import { createInviteDokter } from "@/api/dokter";
import { useAuthStore } from "@/store/authStore";
import Modal from "@/components/ui/Modal";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";

interface InviteDokterModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const inviteSchema = Yup.object({
  email_dokter: Yup.string()
    .email("Email tidak valid")
    .required("Email wajib diisi"),
  nomor_hp_dokter: Yup.string()
    .matches(/^[0-9]+$/, "Nomor HP harus angka")
    .min(10, "Minimal 10 digit")
    .max(15, "Maksimal 15 digit")
    .required("Nomor HP wajib diisi"),
});

const InviteDokterModal: React.FC<InviteDokterModalProps> = ({ isOpen, onClose }) => {
  const { user } = useAuthStore();
  const queryClient = useQueryClient();

  const inviteMutation = useMutation({
    mutationFn: (payload: { email_dokter: string; nomor_hp_dokter: string }) =>
      createInviteDokter({
        id_faskes: user?.id_faskes || "",
        ...payload,
      }),
    onSuccess: (data) => {
      toast.success(data.message || "Undangan berhasil dikirim");
      formik.resetForm();
      queryClient.invalidateQueries({ queryKey: ["invite-dokter"] });
      onClose();
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Gagal mengirim undangan");
    },
  });

  const formik = useFormik({
    initialValues: {
      email_dokter: "",
      nomor_hp_dokter: "",
    },
    validationSchema: inviteSchema,
    onSubmit: (values) => {
      inviteMutation.mutate(values);
    },
  });

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Undang Dokter Baru">
      <form onSubmit={formik.handleSubmit} className="space-y-4">
        <Input
          label="Email Dokter"
          name="email_dokter"
          type="email"
          placeholder="dokter@email.com"
          value={formik.values.email_dokter}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.email_dokter ? formik.errors.email_dokter : undefined}
        />

        <Input
          label="Nomor HP Dokter"
          name="nomor_hp_dokter"
          placeholder="081234567890"
          value={formik.values.nomor_hp_dokter}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.nomor_hp_dokter ? formik.errors.nomor_hp_dokter : undefined}
        />

        <div className="flex items-center space-x-3 pt-2">
          <Button type="submit" loading={inviteMutation.isPending}>
            Kirim Undangan
          </Button>
          <Button type="button" variant="ghost" onClick={onClose}>
            Batal
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default InviteDokterModal;