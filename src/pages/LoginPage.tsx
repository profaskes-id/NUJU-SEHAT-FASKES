import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import LoginForm from '@/features/auth/components/LoginForm';

const LoginPage: React.FC = () => {
  const { isAuthenticated } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    // Force light theme on login page
    const root = window.document.documentElement;
    const isDark = root.classList.contains('dark');
    if (isDark) {
      root.classList.remove('dark');
    }

    if (isAuthenticated) {
      navigate('/dashboard', { replace: true });
    }

    // Cleanup: restore dark mode if it was enabled when leaving the login page
    // (though usually you'd go to a protected page which will have its own theme handling)
    return () => {
      const savedTheme = localStorage.getItem('theme');
      if (savedTheme === 'dark') {
        root.classList.add('dark');
      }
    };
  }, [isAuthenticated, navigate]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-surface p-6">
      <div className="w-full max-w-[400px] space-y-8">
        <div className="flex flex-col items-center space-y-2">
          <img src="/logo.png" alt="Logo" className="w-10 h-10 object-contain" />
          <div className="text-center">
            <h1 className="text-2xl font-bold tracking-tight">Selamat Datang</h1>
            <p className="text-sm text-text-muted">Masuk ke panel admin faskes Anda</p>
          </div>
        </div>

        <div className="bg-surface-muted p-8 rounded-card">
          <LoginForm />
        </div>

        <p className="text-center text-xs text-text-muted">
          © {new Date().getFullYear()} Nuju Sehat. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
