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
    <div className="flex gap-x-8 justify-center items-center mx-auto max-w-xl">
      {cards.map(({ key, label, sub, Icon, iconProps }) => (
        <motion.button
          key={key}
          onMouseEnter={() => setHovered(key)}
          onMouseLeave={() => setHovered(null)}
          onClick={() => setCardAction(key)}
          className="cursor-pointer text-center group"
          animate={{ y: hovered === key ? -4 : 0 }}
          transition={{ duration: 0.5, ease: EASE }}
        >
          <motion.div
            animate={{
              scale: hovered === key ? 1.02 : 1,
              borderColor:
                hovered === key
                  ? "rgba(255,255,255,0.18)"
                  : "rgba(255,255,255,0.06)",
              background:
                hovered === key
                  ? "rgba(255,255,255,0.05)"
                  : "rgba(255,255,255,0.02)",
            }}
            transition={{ duration: 0.5, ease: EASE }}
            className="w-56 h-56 rounded-xl relative overflow-hidden flex justify-center items-center"
            style={{ border: "1px solid rgba(255,255,255,0.06)" }}
          >
            {/* Grain */}
            <div
              className="absolute inset-0 opacity-10 pointer-events-none"
              style={{
                backgroundImage:
                  "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E\")",
                backgroundSize: "120px",
              }}
            />

            {/* Subtle inner glow on hover */}
            <motion.div
              className="absolute inset-0 pointer-events-none rounded-xl"
              animate={{
                opacity: hovered === key ? 1 : 0,
              }}
              transition={{ duration: 0.5, ease: EASE }}
              style={{
                boxShadow: "inset 0 0 40px rgba(255,255,255,0.03)",
              }}
            />

            <motion.div
              animate={{
                opacity: hovered === key ? 1 : 0.35,
                scale: hovered === key ? 1.05 : 1,
              }}
              transition={{ duration: 0.5, ease: EASE }}
            >
              <Icon {...iconProps} />
            </motion.div>
          </motion.div>

          <motion.div
            className="mt-4 flex flex-col gap-0.5"
            animate={{ opacity: hovered === key ? 1 : 0.4 }}
            transition={{ duration: 0.5, ease: EASE }}
          >
            <p className="text-sm  text-white font-medium tracking-[-0.1px]">
              {label}
            </p>
            <motion.p
              className="text-xs text-white/50 "
              animate={{ opacity: hovered === key ? 0.5 : 0.25 }}
              transition={{ duration: 0.5, ease: EASE }}
            >
              {sub}
            </motion.p>
          </motion.div>
        </motion.button>
      ))}
    </div>
  );
}
