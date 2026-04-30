import React, { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";
import { getMe } from "@/api/auth";

interface GuardProps {
  children: React.ReactNode;
}

export const ProtectedRoute: React.FC<GuardProps> = ({ children }) => {
  const { user, setUser, logout, isAuthenticated, isLoading: storeLoading } = useAuthStore();
  const [isVerifying, setIsVerifying] = useState(true);
  const location = useLocation();

  useEffect(() => {
    const verifySession = async () => {
      // If store says not authenticated, no need to verify API
      if (!isAuthenticated) {
        setIsVerifying(false);
        return;
      }

      try {
        const data = await getMe();
        
        // Ensure user is 'faskes'
        if (!data.user.role.toLowerCase().includes('faskes')) {
          logout();
          return;
        }

        // Update user data if needed
        setUser(data.user);
      } catch (error: any) {
        // If 401 or any error, logout
        if (error.response?.status === 401) {
          logout();
        }
      } finally {
        setIsVerifying(false);
      }
    };

    verifySession();
  }, [isAuthenticated, logout, setUser]);

  if (storeLoading || isVerifying) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="text-sm text-text-muted font-medium">Memverifikasi sesi...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to={`/login?redirect=${location.pathname}`} replace />;
  }

  // Double check role
  if (!user?.role.toLowerCase().includes('faskes')) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

export const GuestRoute: React.FC<GuardProps> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuthStore();

  if (isLoading) {
    return null; // Or a small spinner
  }

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};
