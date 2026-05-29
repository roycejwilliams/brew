"use client";
import React from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "motion/react";
import { usePathname } from "next/navigation";
import { useUserStore } from "@/stores/useUserStore";
import PinIcon from "./icons/PinIcon";
import SpinnerIcon from "./icons/SpinnerIcon";
import { useUIStore } from "@/stores/store";

const EASE = [0.16, 1, 0.3, 1] as const;

const navItems = [
  { href: "/pulse",  Icon: PinIcon,    label: "Pulse"  },
  { href: "/manage", Icon: SpinnerIcon, label: "Manage" },
];

const manageSubItems = [
  {
    name: "moments" as const,
    label: "Moments",
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <rect x="2" y="5" width="10" height="9" rx="1.5" stroke="currentColor" strokeWidth="1.25" />
        <rect x="4" y="3" width="10" height="9" rx="1.5" stroke="currentColor" strokeWidth="1.25" strokeOpacity="0.45" />
        <rect x="6" y="1" width="10" height="9" rx="1.5" stroke="currentColor" strokeWidth="1.25" strokeOpacity="0.2" />
      </svg>
    ),
  },
  {
    name: "circle" as const,
    label: "Circles",
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <circle cx="8" cy="8" r="5.5" stroke="currentColor" strokeWidth="1.25" />
        <circle cx="8" cy="8" r="2.5" stroke="currentColor" strokeWidth="1.25" strokeOpacity="0.45" />
      </svg>
    ),
  },
];

export default function AppSidebar() {
  const path = usePathname();
  const { user } = useUserStore();
  const { manageView, setManageView } = useUIStore();
  const onManagePage = path.startsWith("/manage");

  return (
    <motion.aside
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.35, ease: EASE }}
      className="hidden sm:flex w-20 h-full flex-col items-start pt-6 pb-5 px-3 shrink-0 relative z-20"
      style={{
        background: "rgba(var(--bg),0.9)",
        backdropFilter: "blur(24px)",
        borderRight: "1px solid rgba(var(--fg),0.06)",
      }}
    >
      {/* Top shimmer */}
      <div
        className="absolute top-0 left-0 right-0 pointer-events-none"
        style={{
          height: 1,
          background: "linear-gradient(90deg, transparent, rgba(var(--fg),0.06), transparent)",
        }}
      />

      {/* BR3W wordmark */}
      <Link href="/pulse" className="mb-5 pl-1">
        <motion.p
          whileHover={{ opacity: 0.7 }}
          whileTap={{ scale: 0.96 }}
          transition={{ duration: 0.15 }}
          className="text-xs tracking-[3px] uppercase font-medium cursor-pointer"
          style={{ color: "rgba(var(--fg),0.35)" }}
        >
          BR3W
        </motion.p>
      </Link>

      {/* Divider */}
      <div
        className="mb-4 shrink-0 ml-1"
        style={{ width: 24, height: 1, background: "rgba(var(--fg),0.07)" }}
      />

      {/* Nav */}
      <nav className="flex flex-col w-full gap-0.5">
        {navItems.map(({ href, Icon, label }) => {
          const isActive = path.startsWith(href);
          return (
            <div key={href} className="flex flex-col w-full">
              {/* Parent item */}
              <Link href={href} title={label}>
                <motion.div
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ duration: 0.15, ease: EASE }}
                  className="w-9 h-9 rounded-md flex items-center justify-center transition-colors duration-150"
                  style={{
                    background: isActive ? "rgba(var(--fg),0.08)" : "transparent",
                    border: isActive ? "1px solid rgba(var(--fg),0.12)" : "1px solid transparent",
                    color: isActive ? "rgba(var(--fg),0.8)" : "rgba(var(--fg),0.28)",
                  }}
                >
                  <Icon size={16} color="currentColor" />
                </motion.div>
              </Link>

              {/* Sub-items — indented under Manage */}
              {href === "/manage" && (
                <AnimatePresence>
                  {onManagePage && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.22, ease: EASE }}
                      className="overflow-hidden flex flex-col gap-0.5 mt-1"
                    >
                      {manageSubItems.map((sub, i) => {
                        const subActive = manageView === sub.name;
                        return (
                          <motion.button
                            key={sub.name}
                            initial={{ opacity: 0, x: -4 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.18, delay: i * 0.04, ease: EASE }}
                            onClick={() => setManageView(sub.name)}
                            whileTap={{ scale: 0.95 }}
                            title={sub.label}
                            className="flex items-center gap-2 pl-4 py-1.5 rounded-md w-full cursor-pointer transition-colors duration-150 text-left"
                            style={{
                              color: subActive ? "rgba(var(--fg),0.75)" : "rgba(var(--fg),0.3)",
                              background: subActive ? "rgba(var(--fg),0.06)" : "transparent",
                            }}
                          >
                            {/* Bullet */}
                            <span
                              className="shrink-0 w-1 h-1 rounded-full"
                              style={{
                                background: subActive
                                  ? "rgba(var(--fg),0.5)"
                                  : "rgba(var(--fg),0.2)",
                              }}
                            />
                            {sub.icon}
                          </motion.button>
                        );
                      })}
                    </motion.div>
                  )}
                </AnimatePresence>
              )}
            </div>
          );
        })}
      </nav>

      {/* Profile — pinned to bottom */}
      <div className="mt-auto ml-0.5">
        <Link href={`/profile/${user?.id}`}>
          <motion.div
            whileHover={{ scale: 1.06, y: -2 }}
            whileTap={{ scale: 0.96 }}
            transition={{ duration: 0.2, ease: EASE }}
            className="w-9 h-9 rounded-md overflow-hidden relative cursor-pointer"
            style={{ border: "1px solid rgba(var(--fg),0.1)" }}
          >
            <Image
              src={user?.profile_image || "/profile_4.png"}
              alt="profile"
              fill
              className="object-cover"
            />
          </motion.div>
        </Link>
      </div>
    </motion.aside>
  );
}
