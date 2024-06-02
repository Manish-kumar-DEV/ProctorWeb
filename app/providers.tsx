"use client";

import { AuthProvider } from "@/app/context/AuthContext";
import { NextUIProvider } from "@nextui-org/react";
import { ThemeProvider } from "next-themes";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <NextUIProvider>
        <AuthProvider>{children}</AuthProvider>
      </NextUIProvider>
    </ThemeProvider>
  );
}
