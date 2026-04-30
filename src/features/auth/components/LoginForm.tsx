import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { useLogin } from '../hooks/useLogin';

const loginSchema = Yup.object().shape({
  email: Yup.string()
    .email('Format email tidak valid')
    .required('Email wajib diisi'),
  password: Yup.string().required('Password wajib diisi'),
});

const LoginForm: React.FC = () => {
  const { mutate: login, isPending } = useLogin();

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema: loginSchema,
    onSubmit: (values) => {
      login(values);
    },
  });

  return (
    <form onSubmit={formik.handleSubmit} className="space-y-4">
      <Input
        label="Email"
        name="email"
        placeholder="nama@perusahaan.com"
        value={formik.values.email}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={formik.touched.email ? formik.errors.email : undefined}
        disabled={isPending}
      />
      <Input
        label="Password"
        name="password"
        isPassword
        placeholder="••••••••"
        value={formik.values.password}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={formik.touched.password ? formik.errors.password : undefined}
        disabled={isPending}
      />
      <div className="pt-2">
        <Button
          type="submit"
          className="w-full"
          isLoading={isPending}
        >
          Masuk
        </Button>
      </div>
    </form>
  );
};

export default LoginForm;
