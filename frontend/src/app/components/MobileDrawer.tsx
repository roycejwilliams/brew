"use client";
import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "motion/react";
import { usePathname, useRouter } from "next/navigation";
import { useUserStore } from "@/stores/useUserStore";
import { useUIStore } from "@/stores/store";
import { useTheme } from "@/providers/ThemeProvider";
import PinIcon from "./icons/PinIcon";
import SpinnerIcon from "./icons/SpinnerIcon";

const EASE = [0.16, 1, 0.3, 1] as const;

const manageSubItems = [
  {
    name: "moments" as const,
    label: "Moments",
    icon: (
      <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
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
      <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
        <circle cx="8" cy="8" r="5.5" stroke="currentColor" strokeWidth="1.25" />
        <circle cx="8" cy="8" r="2.5" stroke="currentColor" strokeWidth="1.25" strokeOpacity="0.45" />
      </svg>
    ),
  },
];

export default function MobileDrawer() {
  const [open, setOpen] = useState(false);
  const path = usePathname();
  const router = useRouter();
  const { user } = useUserStore();
  const { manageView, setManageView, eventsOpen, toggleEvents } = useUIStore();
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const close = () => setOpen(false);

  const handleNavClick = (href: string) => {
    close();
    router.push(href);
  };

  const handleSubItemClick = (name: "moments" | "circle") => {
    setManageView(name);
    close();
    router.push("/manage");
  };

  return (
    <>
      {/* Left-edge swipe zone — opens drawer */}
      {!open && (
        <motion.div
          className="fixed left-0 top-0 bottom-0 w-5 z-40 sm:hidden"
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={{ left: 0, right: 0.6 }}
          onDragEnd={(_, info) => {
            if (info.offset.x > 40 || info.velocity.x > 250) setOpen(true);
          }}
          style={{ touchAction: "pan-y", cursor: "default" }}
        />
      )}

      {/* Floating stack — hamburger + Pulse toggle */}
      {!open && (
        <div className="fixed top-4 left-4 z-40 sm:hidden flex flex-col gap-2">
          {/* Hamburger */}
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onClick={() => setOpen(true)}
            whileTap={{ scale: 0.92 }}
            className="w-9 h-9 rounded-md flex items-center justify-center cursor-pointer"
            style={{
              background: isDark ? "rgba(18,18,18,0.92)" : "rgba(245,245,245,0.92)",
              border: `1px solid rgba(var(--fg),0.1)`,
              backdropFilter: "blur(12px)",
            }}
          >
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
              <path d="M2 4h12M2 8h12M2 12h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" style={{ color: "rgba(var(--fg),0.6)" }} />
            </svg>
          </motion.button>

          {/* Pulse toggle */}
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.05 }}
            onClick={toggleEvents}
            whileTap={{ scale: 0.92 }}
            className="w-9 h-9 rounded-md flex items-center justify-center cursor-pointer"
            style={{
              background: eventsOpen
                ? isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.08)"
                : isDark ? "rgba(18,18,18,0.92)" : "rgba(245,245,245,0.92)",
              border: eventsOpen
                ? `1px solid rgba(var(--fg),0.18)`
                : `1px solid rgba(var(--fg),0.1)`,
              backdropFilter: "blur(12px)",
            }}
          >
            <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
              <circle
                cx="8" cy="8" r="2.5"
                fill={eventsOpen
                  ? isDark ? "rgba(255,255,255,0.9)" : "rgba(0,0,0,0.7)"
                  : isDark ? "rgba(255,255,255,0.45)" : "rgba(0,0,0,0.35)"}
              />
              <circle
                cx="8" cy="8" r="5.5"
                stroke={eventsOpen
                  ? isDark ? "rgba(255,255,255,0.35)" : "rgba(0,0,0,0.28)"
                  : isDark ? "rgba(255,255,255,0.18)" : "rgba(0,0,0,0.14)"}
                strokeWidth="1"
              />
            </svg>
          </motion.button>
        </div>
      )}

      <AnimatePresence>
        {open && (
          <>
            {/* Backdrop */}
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-50 sm:hidden"
              style={{ background: "rgba(0,0,0,0.45)", backdropFilter: "blur(4px)" }}
              onClick={close}
            />

            {/* Drawer panel */}
            <motion.div
              key="drawer"
              drag="x"
              dragConstraints={{ left: -320, right: 0 }}
              dragElastic={{ left: 0.15, right: 0 }}
              onDragEnd={(_, info) => {
                if (info.offset.x < -60 || info.velocity.x < -350) close();
              }}
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 32, stiffness: 300 }}
              className="fixed left-0 top-0 bottom-0 z-50 sm:hidden flex flex-col"
              style={{
                width: 280,
                background: isDark ? "rgba(10,10,10,0.98)" : "rgba(248,248,248,0.98)",
                backdropFilter: "blur(24px)",
                borderRight: `1px solid rgba(var(--fg),0.08)`,
              }}
            >
              {/* Top shimmer */}
              <div style={{ height: 1, background: "linear-gradient(90deg, transparent, rgba(var(--fg),0.06), transparent)" }} />

              {/* User info — tapping navigates to profile */}
              <Link href={`/profile/${user?.id}`} onClick={close}>
              <div
                className="flex items-center gap-3 px-5 py-5 cursor-pointer"
                style={{ borderBottom: "1px solid rgba(var(--fg),0.06)" }}
              >
                <div
                  className="w-10 h-10 rounded-xl overflow-hidden relative shrink-0"
                  style={{ border: "1px solid rgba(var(--fg),0.1)" }}
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
                    className="text-sm font-medium tracking-[-0.1px] truncate"
                    style={{ color: "rgba(var(--fg),0.85)" }}
                  >
                    {user?.first_name} {user?.last_name}
                  </p>
                  <p
                    className="text-xs tracking-[-0.1px] truncate"
                    style={{ color: "rgba(var(--fg),0.35)" }}
                  >
                    @{user?.username}
                  </p>
                </div>

                {/* Close */}
                <motion.button
                  onClick={(e) => { e.preventDefault(); close(); }}
                  whileTap={{ scale: 0.92 }}
                  className="ml-auto shrink-0 w-7 h-7 rounded-md flex items-center justify-center cursor-pointer"
                  style={{
                    background: "rgba(var(--fg),0.05)",
                    border: "1px solid rgba(var(--fg),0.08)",
                  }}
                >
                  <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                    <path d="M1 1l8 8M9 1l-8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" style={{ color: "rgba(var(--fg),0.4)" }} />
                  </svg>
                </motion.button>
              </div>
              </Link>

              {/* Nav */}
              <nav className="flex flex-col gap-0.5 px-3 py-4 flex-1">
                {/* Pulse */}
                <motion.button
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleNavClick("/pulse")}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl w-full text-left cursor-pointer transition-colors duration-150"
                  style={{
                    background: path.startsWith("/pulse") ? "rgba(var(--fg),0.07)" : "transparent",
                    color: path.startsWith("/pulse") ? "rgba(var(--fg),0.85)" : "rgba(var(--fg),0.45)",
                  }}
                >
                  <PinIcon size={17} color="currentColor" />
                  <span className="text-sm font-medium tracking-[-0.1px]">Pulse</span>
                </motion.button>

                {/* Manage */}
                <motion.button
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleNavClick("/manage")}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl w-full text-left cursor-pointer transition-colors duration-150"
                  style={{
                    background: path.startsWith("/manage") ? "rgba(var(--fg),0.07)" : "transparent",
                    color: path.startsWith("/manage") ? "rgba(var(--fg),0.85)" : "rgba(var(--fg),0.45)",
                  }}
                >
                  <SpinnerIcon size={17} color="currentColor" />
                  <span className="text-sm font-medium tracking-[-0.1px]">Manage</span>
                </motion.button>

                {/* Manage sub-items — always visible as sub-navigation */}
                <div className="flex flex-col gap-0.5 ml-3 mt-0.5">
                  {manageSubItems.map((sub, i) => {
                    const isActive = path.startsWith("/manage") && manageView === sub.name;
                    return (
                      <motion.button
                        key={sub.name}
                        initial={{ opacity: 0, x: -6 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.04, duration: 0.18, ease: EASE }}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => handleSubItemClick(sub.name)}
                        className="flex items-center gap-3 px-3 py-2 rounded-lg w-full text-left cursor-pointer transition-colors duration-150"
                        style={{
                          background: isActive ? "rgba(var(--fg),0.06)" : "transparent",
                          color: isActive ? "rgba(var(--fg),0.75)" : "rgba(var(--fg),0.3)",
                        }}
                      >
                        {/* Bullet */}
                        <span
                          className="w-1 h-1 rounded-full shrink-0"
                          style={{ background: isActive ? "rgba(var(--fg),0.5)" : "rgba(var(--fg),0.2)" }}
                        />
                        {sub.icon}
                        <span className="text-xs font-medium tracking-[-0.1px]">{sub.label}</span>
                      </motion.button>
                    );
                  })}
                </div>
              </nav>

            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
