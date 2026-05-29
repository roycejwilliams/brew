"use client";
import { motion } from "motion/react";
import Asterisk from "./icons/AsterikIcon";
import { useTheme } from "@/providers/ThemeProvider";

interface MobileNavProps {
  onCreatePress: () => void;
}

export default function MobileNav({ onCreatePress }: MobileNavProps) {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-10 flex justify-center"
      style={{
        paddingBottom: "calc(env(safe-area-inset-bottom, 0px) + 1.5rem)",
      }}
    >
      <motion.button
        onClick={onCreatePress}
        whileTap={{ scale: 0.92 }}
        whileHover={{ scale: 1.04 }}
        transition={{ duration: 0.18 }}
        className="cursor-pointer"
      >
        <div
          className="w-16 h-16 rounded-2xl flex items-center justify-center"
          style={{
            background: isDark ? "rgba(12,12,12,0.98)" : "rgba(240,240,240,0.98)",
            border: isDark ? "1px solid rgba(255,255,255,0.1)" : "1px solid rgba(0,0,0,0.08)",
            backdropFilter: "blur(24px)",
            boxShadow: isDark
              ? "0 8px 32px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.07)"
              : "0 8px 32px rgba(0,0,0,0.1), inset 0 1px 0 rgba(255,255,255,0.9)",
          }}
        >
          <Asterisk size={24} color={isDark ? "rgba(255,255,255,0.82)" : "rgba(0,0,0,0.65)"} />
        </div>
      </motion.button>
    </div>
  );
}
