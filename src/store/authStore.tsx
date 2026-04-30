import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import type { AuthUser } from "@/features/auth/types";

interface AuthContextType {
  user: AuthUser | null;
  setUser: (user: AuthUser | null) => void;
  logout: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<AuthUser | null>(() => {
    const savedUser = localStorage.getItem("auth_user");
    try {
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      return null;
    }
  });
  const [isLoading, setIsLoading] = useState(true);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem("auth_user");
    // Clear cookies if any (optional, but good for security)
    document.cookie.split(";").forEach((c) => {
      document.cookie = c
        .replace(/^ +/, "")
        .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
    });
  }, []);

  useEffect(() => {
    if (user) {
      localStorage.setItem("auth_user", JSON.stringify(user));
    } else {
      localStorage.removeItem("auth_user");
    }
    setIsLoading(false);
  }, [user]);

  // Sync logout across tabs and detect manual storage deletion
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "auth_user" && !e.newValue) {
        setUser(null);
      }
    };

    window.addEventListener("storage", handleStorageChange);
    
    // Periodic check to detect manual deletion in the same tab's DevTools
    // (StorageEvent doesn't fire in the same tab for manual deletions)
    const interval = setInterval(() => {
      if (user && !localStorage.getItem("auth_user")) {
        setUser(null);
      }
    }, 2000);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      clearInterval(interval);
    };
  }, [user]);

  const value = {
    user,
    setUser,
    logout,
    isAuthenticated: !!user,
    isLoading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuthStore = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuthStore must be used within an AuthProvider");
  }
  return context;
};
