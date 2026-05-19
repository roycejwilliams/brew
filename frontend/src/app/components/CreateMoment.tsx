"use client";
import { motion } from "motion/react";
import React, { useState } from "react";
import SlashIcon from "./icons/slashIcon";
import FingerprintIcon from "./icons/fingerPrint";

interface CreateMomentProp {
  setCardAction: (cardaction: "create" | "invite" | null) => void;
}

const EASE = [0.16, 1, 0.3, 1] as const;

const cards = [
  {
    key: "create" as const,
    label: "Start a moment",
    sub: "Set something in motion.",
    Icon: SlashIcon,
    iconProps: { width: 75, height: 75 },
  },
  {
    key: "invite" as const,
    label: "Invite people",
    sub: "Start with who matters.",
    Icon: FingerprintIcon,
    iconProps: { width: 65, height: 103 },
  },
];

export default function CreateMoment({ setCardAction }: CreateMomentProp) {
  const [hovered, setHovered] = useState<"create" | "invite" | null>("create");

  return (
    <div className="flex flex-col sm:flex-row gap-3 sm:gap-5 justify-center items-stretch mx-auto w-full max-w-sm sm:max-w-xl px-4 sm:px-2">
      {cards.map(({ key, label, sub, Icon, iconProps }) => {
        const isActive = hovered === key;
        return (
          <motion.button
            key={key}
            onMouseEnter={() => setHovered(key)}
            onMouseLeave={() => setHovered(null)}
            onFocus={() => setHovered(key)}
            onClick={() => setCardAction(key)}
            whileTap={{ scale: 0.98 }}
            className="cursor-pointer w-full sm:flex-1 sm:min-w-0"
            animate={{ opacity: isActive ? 1 : 0.55 }}
            transition={{ duration: 0.3, ease: EASE }}
          >
            <motion.div
              animate={{
                borderColor: isActive
                  ? "rgba(255,255,255,0.14)"
                  : "rgba(255,255,255,0.06)",
                background: isActive
                  ? "rgba(255,255,255,0.05)"
                  : "rgba(255,255,255,0.02)",
              }}
              transition={{ duration: 0.3, ease: EASE }}
              className="w-full rounded-2xl relative overflow-hidden flex sm:flex-col sm:aspect-square flex-row items-center gap-5 px-5 py-5 sm:justify-center"
              style={{
                border: "1px solid rgba(255,255,255,0.06)",
                boxShadow: isActive
                  ? "0 8px 24px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.06)"
                  : "0 2px 8px rgba(0,0,0,0.2)",
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
                    "linear-gradient(90deg, transparent, rgba(255,255,255,0.07), transparent)",
                  pointerEvents: "none",
                }}
              />

              {/* Grain */}
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  backgroundImage:
                    "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E\")",
                  backgroundSize: "120px",
                  opacity: 0.07,
                }}
              />

              {/* Hover glow */}
              <motion.div
                className="absolute inset-0 pointer-events-none"
                animate={{ opacity: isActive ? 1 : 0 }}
                transition={{ duration: 0.3, ease: EASE }}
                style={{
                  background:
                    "radial-gradient(ellipse at center, rgba(255,80,30,0.08) 0%, transparent 70%)",
                }}
              />

              {/* Icon */}
              <motion.div
                animate={{
                  opacity: isActive ? 1 : 0.3,
                  scale: isActive ? 1.04 : 1,
                }}
                transition={{ duration: 0.3, ease: EASE }}
                className="relative z-10 shrink-0 flex items-center justify-center w-14 h-14 sm:w-auto sm:h-auto"
              >
                <Icon {...iconProps} />
              </motion.div>

              {/* Text */}
              <div className="relative z-10 flex flex-col gap-0.5 text-left sm:text-center sm:mt-3">
                <p className="text-sm text-white font-medium tracking-[-0.2px]">
                  {label}
                </p>
                <p
                  className="text-[11px] leading-relaxed tracking-[-0.1px]"
                  style={{
                    color: isActive
                      ? "rgba(255,255,255,0.4)"
                      : "rgba(255,255,255,0.2)",
                    transition: "color 0.3s",
                  }}
                >
                  {sub}
                </p>
              </div>
            </motion.div>
          </motion.button>
        );
      })}
    </div>
  );
}
