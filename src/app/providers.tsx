"use client";

import { Toaster } from "react-hot-toast";
import AuthProvider from "../context/AuthContext";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Toaster
        position="top-center"
        reverseOrder={false}
        toastOptions={{
          style: {
            fontSize: 14,
          },
        }}
      />
      <AuthProvider>{children}</AuthProvider>
    </>
  );
}
