"use client";

import { HeroUIProvider } from "@heroui/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import AuthHandler from "./AuthHandler";

const queryClient = new QueryClient();

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthHandler>
        <HeroUIProvider>{children}</HeroUIProvider>
      </AuthHandler>
    </QueryClientProvider>
  );
}
