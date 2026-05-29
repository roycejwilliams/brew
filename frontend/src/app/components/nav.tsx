"use client";
import React, { useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useOutsideAlerter } from "../utils/outsideAlert";
import { ScrollLock } from "../utils/scrollLock";
import { motion, AnimatePresence } from "motion/react";
import { openEventCard, useUIStore } from "@/stores/store";
import { useUserStore } from "@/stores/useUserStore";
import { useTheme } from "@/providers/ThemeProvider";

const EASE = [0.16, 1, 0.3, 1] as const;

const navLinks = [
  { href: "/pulse",  label: "Pulse" },
  { href: "/manage", label: "Manage" },
];

export default function Nav() {
  const path = usePathname();
  const router = useRouter();
  const ref = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);

  useOutsideAlerter(ref, () => setOpen(false));
  ScrollLock(false);

  const { user, clearUser } = useUserStore();
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const handleLogout = () => {
    clearUser();
    router.push("/");
  };

  const isEventOpen = openEventCard((state) => state.isEventOpen);
  const { pulseOpen } = useUIStore();

  if (isEventOpen || pulseOpen) return null;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: EASE }}
      className={`absolute left-4 top-4 flex items-center gap-3 ${open ? "z-200" : "z-60"}`}
    >
      {/* Wordmark */}
      <Link
        href="/pulse"
        className="text-base tracking-[4px] font-medium text-black/80 dark:text-white/80 hover:text-black dark:hover:text-white transition-colors duration-200"
      >
        BR3W
      </Link>

      {/* Avatar trigger */}
      <div className="relative">
        <motion.button
          onClick={() => setOpen((o) => !o)}
          whileTap={{ scale: 0.94 }}
          className="w-8 h-8 rounded-md overflow-hidden relative cursor-pointer ring-offset-0 transition-all duration-200"
          style={{
            border: open
              ? `1px solid rgba(var(--fg),0.22)`
              : `1px solid rgba(var(--fg),0.1)`,
            boxShadow: open
              ? `0 0 0 2px rgba(var(--fg),0.06)`
              : "none",
          }}
        >
          <Image
            src={user?.profile_image || "/profile_4.png"}
            alt="menu"
            fill
            className="object-cover"
          />
        </motion.button>

        {/* Dropdown */}
        <AnimatePresence>
          {open && (
            <motion.div
              key="nav-dropdown"
              initial={{ opacity: 0, y: -8, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.97 }}
              transition={{ duration: 0.18, ease: EASE }}
              className="absolute top-full left-0 mt-2 w-56 rounded-xl overflow-hidden"
              style={{
                background: isDark ? "rgba(12,12,12,0.97)" : "rgba(248,248,248,0.97)",
                border: isDark ? "1px solid rgba(255,255,255,0.08)" : "1px solid rgba(0,0,0,0.08)",
                backdropFilter: "blur(24px)",
                boxShadow: isDark
                  ? "0 8px 32px rgba(0,0,0,0.6), 0 2px 8px rgba(0,0,0,0.3)"
                  : "0 8px 32px rgba(0,0,0,0.1), 0 2px 8px rgba(0,0,0,0.06)",
              }}
            >
              {/* Top shimmer */}
              <div
                style={{
                  height: 1,
                  background: isDark
                    ? "linear-gradient(90deg, transparent, rgba(255,255,255,0.07), transparent)"
                    : "linear-gradient(90deg, transparent, rgba(0,0,0,0.05), transparent)",
                }}
              />

              {/* User info */}
              <div className="flex items-center gap-3 px-4 py-3.5">
                <div
                  className="w-9 h-9 rounded-md overflow-hidden relative shrink-0"
                  style={{ border: `1px solid rgba(var(--fg),0.08)` }}
                >
                  <Image
                    src={user?.profile_image || "/profile_4.png"}
                    alt={user?.first_name || ""}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="min-w-0">
                  <p
                    className="text-sm font-medium truncate tracking-[-0.1px]"
                    style={{ color: `rgba(var(--fg),0.85)` }}
                  >
                    {user?.first_name} {user?.last_name}
                  </p>
                  <p
                    className="text-xs truncate tracking-[-0.1px]"
                    style={{ color: `rgba(var(--fg),0.35)` }}
                  >
                    @{user?.username}
                  </p>
                </div>
              </div>

              {/* Divider */}
              <div style={{ height: 1, background: `rgba(var(--fg),0.06)` }} />

              {/* Nav links */}
              <div className="p-1.5">
                {navLinks.map(({ href, label }) => (
                  <Link
                    key={href}
                    href={href}
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium tracking-[-0.1px] transition-colors duration-150"
                    style={{
                      color: path === href
                        ? `rgba(var(--fg),0.9)`
                        : `rgba(var(--fg),0.45)`,
                      background: path === href
                        ? `rgba(var(--fg),0.06)`
                        : "transparent",
                    }}
                    onMouseEnter={(e) => {
                      if (path !== href)
                        (e.currentTarget as HTMLElement).style.background = `rgba(var(--fg),0.04)`;
                    }}
                    onMouseLeave={(e) => {
                      if (path !== href)
                        (e.currentTarget as HTMLElement).style.background = "transparent";
                    }}
                  >
                    {path === href && (
                      <span
                        className="w-1 h-1 rounded-full shrink-0"
                        style={{ background: `rgba(var(--fg),0.5)` }}
                      />
                    )}
                    {label}
                  </Link>
                ))}
              </div>

              {/* Divider */}
              <div style={{ height: 1, background: `rgba(var(--fg),0.06)` }} />

              {/* Sign out */}
              <div className="p-1.5">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium tracking-[-0.1px] transition-colors duration-150 cursor-pointer"
                  style={{ color: `rgba(var(--fg),0.3)` }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.color = "rgba(239,68,68,0.7)";
                    (e.currentTarget as HTMLElement).style.background = "rgba(239,68,68,0.05)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.color = `rgba(var(--fg),0.3)`;
                    (e.currentTarget as HTMLElement).style.background = "transparent";
                  }}
                >
                  Sign out
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
