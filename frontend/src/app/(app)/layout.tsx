"use client";
import { useUserStore } from "@/stores/useUserStore";
import AppSidebar from "../components/AppSidebar";
import MobileDrawer from "../components/MobileDrawer";
import { motion } from "motion/react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { useSocket } from "@/hooks/useSocket";

export default function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const router = useRouter();

  const { user, hasHydrated } = useUserStore();
  useSocket();

  useEffect(() => {
    if (!hasHydrated) return;
    if (!user) {
      const redirect = window.location.pathname + window.location.search;
      router.replace(`/?redirect=${encodeURIComponent(redirect)}`);
    }
  }, [user, hasHydrated, router]);

  return (
    <main className="flex h-dvh overflow-hidden">
      <AppSidebar />
      <MobileDrawer />
      <div className="flex-1 min-w-0 relative overflow-hidden">
        {hasHydrated && (
          <motion.div
            key={pathname}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="h-full"
          >
            {children}
          </motion.div>
        )}
      </div>
    </main>
  );
}
