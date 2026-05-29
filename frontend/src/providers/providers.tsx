"use client";

import { HeroUIProvider } from "@heroui/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import AuthHandler from "./AuthHandler";
import { ThemeProvider } from "./ThemeProvider";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,   // 5 min — don't refetch unless data is old
      gcTime: 1000 * 60 * 10,     // 10 min — keep unused cache around
      refetchOnWindowFocus: false, // never blast the server on tab switch
      refetchOnReconnect: false,   // don't refetch on reconnect either
      retry: 1,                    // one retry max, not the default 3
    },
  },
});

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        <AuthHandler>
          <HeroUIProvider>{children}</HeroUIProvider>
        </AuthHandler>
      </QueryClientProvider>
    </ThemeProvider>
  );
}
