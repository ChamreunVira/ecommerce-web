"use client";

import { Suspense } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AppContextProvider } from "@/context/AppContext";
import OAuthHandler from "@/components/OAuthHandler";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AppContextProvider>
      <Suspense fallback={null}>
        <OAuthHandler />
      </Suspense>
      {children}
      <ToastContainer />
    </AppContextProvider>
  );
}
