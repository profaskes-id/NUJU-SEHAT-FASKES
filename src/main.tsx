import { StrictMode, Suspense } from "react";
import { createRoot } from "react-dom/client";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { RouterProvider } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "@/store/authStore";
import { ThemeProvider } from "@/store/themeStore";
import { queryClient } from "@/lib/query-client";
import { router } from "@/routes";
import PageLoading from "@/components/shared/PageLoading";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
          <Suspense fallback={<PageLoading />}>
            <RouterProvider router={router} />
          </Suspense>
          <Toaster position="top-right" />
        </AuthProvider>
      </ThemeProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  </StrictMode>,
);
