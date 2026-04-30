import { useMutation } from '@tanstack/react-query';
import { useNavigate, useSearchParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { login } from '@/api/auth';
import { useAuthStore } from '@/store/authStore';

export const useLogin = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { setUser } = useAuthStore();
  const redirectPath = searchParams.get('redirect') || '/dashboard';

  return useMutation({
    mutationFn: login,
    onSuccess: (response) => {
      if (response.success) {
        setUser(response.data);
        toast.success(response.message || 'Login sukses');
        navigate(redirectPath, { replace: true });
      }
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Email atau password salah';
      toast.error(message);
    },
  });
};
