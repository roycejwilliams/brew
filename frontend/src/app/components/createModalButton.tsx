"use client";
import { motion } from "motion/react";
import Asterisk from "./icons/AsterikIcon";

interface CreateModalProp {
  openModal: (type: "createModal") => void;
}

const EASE = [0.16, 1, 0.3, 1] as const;

export default function CreateModalButton({ openModal }: CreateModalProp) {
  return (
    <motion.button
      onClick={() => openModal("createModal")}
      initial="rest"
      whileHover="hover"
      whileTap={{ scale: 0.96 }}
      className="absolute bottom-10 left-1/2 -translate-x-1/2 flex items-center justify-center cursor-pointer rounded-md px-5 py-3 overflow-hidden"
      style={{
        background: `rgba(var(--bg),0.95)`,
        border: `1px solid rgba(var(--fg),0.1)`,
        backdropFilter: "blur(20px)",
        boxShadow: `0 8px 32px var(--shadow-lg), inset 0 1px 0 rgba(var(--fg),0.07)`,
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
          background: `linear-gradient(90deg, transparent, rgba(var(--fg),0.08), transparent)`,
          pointerEvents: "none",
        }}
      />

      {/* Hover glow — amber tint matching BR3W */}
      <motion.div
        className="absolute inset-0"
        variants={{
          rest: { opacity: 0 },
          hover: { opacity: 1, transition: { duration: 0.35 } },
        }}
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(255,80,30,0.08) 0%, transparent 70%)",
        }}
      />

      {/* Asterisk — spins on hover */}
      <motion.div
        variants={{
          rest: { rotate: 0 },
          hover: {
            rotate: 360,
            transition: { duration: 0.75, ease: "easeOut" },
          },
        }}
        className="relative z-10"
      >
        <Asterisk size={18} color={`rgba(var(--fg),0.85)`} />
      </motion.div>

      {/* Label — slides in on hover */}
      <motion.div
        variants={{
          rest: { width: 0, opacity: 0, marginLeft: 0 },
          hover: {
            width: "auto",
            opacity: 1,
            marginLeft: 8,
            transition: {
              width: { duration: 0.3, ease: EASE },
              opacity: { duration: 0.2, delay: 0.08 },
              marginLeft: { duration: 0.3, ease: EASE },
            },
          },
        }}
        className="overflow-hidden whitespace-nowrap relative z-10"
      >
        <span
          className="text-xs tracking-widest uppercase font-medium"
          style={{ color: `rgba(var(--fg),0.72)` }}
        >
          Create
        </span>
      </motion.div>
    </motion.button>
  );
}
