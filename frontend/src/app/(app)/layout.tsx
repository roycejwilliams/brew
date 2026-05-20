"use client";
import { useUserStore } from "@/stores/useUserStore";
import Nav from "../components/nav";
import { motion, AnimatePresence } from "motion/react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

const hideNavRoutes = ["/checkin", "/join", "/admin", "/manage"];

export default function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const showNav = !hideNavRoutes.some((route) => pathname.startsWith(route));
  const router = useRouter();

  const { user, hasHydrated } = useUserStore();

  useEffect(() => {
    if (!hasHydrated) return;
    if (!user) {
      router.replace("/");
    }
  }, [user, hasHydrated, router]);

  return (
    <main>
      <div className="relative flex-1">
        {showNav && <Nav />}
        <AnimatePresence>
          {hasHydrated && (
            <motion.div
              key={pathname}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            >
              {children}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}
