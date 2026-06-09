"use client";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AppContextProvider } from "@/context/AppContext";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AppContextProvider>
      {children}
      <ToastContainer />
    </AppContextProvider>
  );
}
