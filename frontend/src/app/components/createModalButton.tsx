import React from "react";
import { Variants, motion } from "motion/react";
import Asterisk from "./icons/AsterikIcon";

interface CreateModalProp {
  openModal: (type: "createModal") => void;
}

export default function CreateModalButton({ openModal }: CreateModalProp) {
  const buttonVariants: Variants = {
    rest: { scale: 1 },
    hover: {
      scale: 1.06,
      transition: { duration: 0.3, ease: "easeOut" },
    },
  };

  const iconVariants: Variants = {
    rest: { rotate: 0 },
    hover: {
      rotate: 360,
      transition: { duration: 0.75, ease: "easeOut" },
    },
  };

  const revealVariants: Variants = {
    rest: { width: 0, opacity: 0 },
    hover: {
      width: "auto",
      opacity: 1,
      marginLeft: 8,
      transition: {
        width: { duration: 0.35, ease: [0.16, 1, 0.3, 1] },
        opacity: { duration: 0.2, delay: 0.1 },
      },
    },
  };

  return (
    <motion.button
      onClick={() => openModal("createModal")}
      variants={buttonVariants}
      initial="rest"
      whileHover="hover"
      whileTap={{ scale: 0.96 }}
      className="absolute bottom-10 left-1/2 -translate-x-1/2 flex items-center justify-center cursor-pointer rounded-md px-4 py-3 overflow-hidden"
      style={{
        background: "rgba(20,20,20,0.9)",
        border: "1px solid rgba(255,255,255,0.1)",
        backdropFilter: "blur(20px)",
        boxShadow:
          "0 8px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.08)",
      }}
    >
      {/* Top gloss */}
      <div className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-white/20 to-transparent" />

      {/* Hover glow */}
      <motion.div
        className="absolute inset-0 opacity-0 rounded-xl"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(113,54,48,0.2) 0%, transparent 70%)",
        }}
        variants={{
          rest: { opacity: 0 },
          hover: { opacity: 1, transition: { duration: 0.4 } },
        }}
      />

      <motion.div variants={iconVariants} className="relative z-10">
        <Asterisk size={20} color="rgba(255,255,255,0.9)" />
      </motion.div>

      <motion.div
        variants={revealVariants}
        className="overflow-hidden whitespace-nowrap relative z-10"
      >
        <span className="text-white/80 text-xs tracking-widest uppercase font-medium">
          Create
        </span>
      </motion.div>
    </motion.button>
  );
}
