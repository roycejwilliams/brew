"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import Asterisk from "./icons/AsterikIcon";
import Link from "next/link";

type ManageView = "moments" | "circle" | "referral" | null;

interface ManageTools {
  manage: ManageView;
  setManage: React.Dispatch<React.SetStateAction<ManageView>>;
}

const EASE = [0.16, 1, 0.3, 1] as const;

const manageNav: { name: ManageView; label: string; icon: React.ReactNode }[] =
  [
    {
      name: "moments",
      label: "Moments",
      icon: (
        // Stack of squares icon
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <rect
            x="2"
            y="5"
            width="10"
            height="9"
            rx="1.5"
            stroke="currentColor"
            strokeWidth="1.2"
          />
          <rect
            x="4"
            y="3"
            width="10"
            height="9"
            rx="1.5"
            stroke="currentColor"
            strokeWidth="1.2"
            strokeOpacity="0.5"
          />
          <rect
            x="6"
            y="1"
            width="10"
            height="9"
            rx="1.5"
            stroke="currentColor"
            strokeWidth="1.2"
            strokeOpacity="0.25"
          />
        </svg>
      ),
    },
    {
      name: "circle",
      label: "Circles",
      icon: (
        // Ring icon
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <circle
            cx="8"
            cy="8"
            r="5.5"
            stroke="currentColor"
            strokeWidth="1.2"
          />
          <circle
            cx="8"
            cy="8"
            r="2.5"
            stroke="currentColor"
            strokeWidth="1.2"
            strokeOpacity="0.5"
          />
        </svg>
      ),
    },
  ];

export default function Tools({ manage, setManage }: ManageTools) {
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  return (
    <div
      className="h-full w-16 sm:w-20 flex flex-col items-center py-6 gap-6 shrink-0 relative z-10"
      style={{
        borderRight: "1px solid rgba(255,255,255,0.06)",
        background: "rgba(8,8,8,0.8)",
      }}
    >
      {/* Top shimmer */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 1,
          background:
            "linear-gradient(90deg, transparent, rgba(255,255,255,0.06), transparent)",
          pointerEvents: "none",
        }}
      />

      {/* Logo */}
      <Link
        href="/pulse"
        className="flex items-center justify-center w-8 h-8 rounded-full shrink-0"
        style={{
          background: "rgba(255,255,255,0.06)",
          border: "1px solid rgba(255,255,255,0.1)",
        }}
      >
        <Asterisk size={14} color="rgba(255,255,255,0.6)" />
      </Link>

      {/* Divider */}
      <div
        style={{ width: 24, height: 1, background: "rgba(255,255,255,0.06)" }}
      />

      {/* Nav items */}
      <nav className="flex flex-col items-center gap-3 w-full px-2">
        {manageNav.map((m) => {
          const isActive = manage === m.name;
          const isHovered = hoveredItem === m.name;

          return (
            <div
              key={m.name}
              className="relative flex flex-col items-center gap-1.5 w-full"
              onMouseEnter={() => setHoveredItem(m.name as string)}
              onMouseLeave={() => setHoveredItem(null)}
            >
              <motion.button
                onClick={() => setManage(m.name)}
                whileTap={{ scale: 0.94 }}
                className="w-10 h-10 mx-auto flex justify-center items-center rounded-xl cursor-pointer transition-all duration-150"
                style={{
                  background: isActive
                    ? "rgba(255,255,255,0.08)"
                    : "rgba(255,255,255,0.04)",
                  border: isActive
                    ? "1px solid rgba(255,255,255,0.14)"
                    : "1px solid rgba(255,255,255,0.07)",
                  color: isActive
                    ? "rgba(255,255,255,0.82)"
                    : "rgba(255,255,255,0.3)",
                }}
              >
                {m.icon}
              </motion.button>

              {/* Active indicator dot */}
              {isActive && (
                <motion.div
                  layoutId="tools-active-dot"
                  className="w-1 h-1 rounded-full"
                  style={{ background: "rgba(212,165,116,0.8)" }}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
              )}

              {/* Hover label tooltip */}
              <AnimatePresence>
                {isHovered && !isActive && (
                  <motion.div
                    initial={{ opacity: 0, x: 4 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 4 }}
                    transition={{ duration: 0.15, ease: EASE }}
                    className="absolute left-full ml-2 top-1/2 -translate-y-1/2 pointer-events-none z-50"
                    style={{
                      background: "rgba(8,8,8,0.95)",
                      border: "1px solid rgba(255,255,255,0.08)",
                      borderRadius: 6,
                      padding: "4px 8px",
                      whiteSpace: "nowrap",
                    }}
                  >
                    <span
                      className="text-[10px] font-medium tracking-[-0.1px]"
                      style={{ color: "rgba(255,255,255,0.6)" }}
                    >
                      {m.label}
                    </span>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </nav>

      {/* Bottom label */}
      <div className="mt-auto">
        <p
          className="text-[8px] tracking-[2px] uppercase font-medium"
          style={{ color: "rgba(255,255,255,0.15)" }}
        >
          Mgmt
        </p>
      </div>
    </div>
  );
}
