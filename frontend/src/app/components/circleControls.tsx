import React from "react";
import { motion } from "framer-motion";
import { ChevronLeftIcon, ChevronRightIcon } from "./icons";

interface CircleControlProp {
  nextMarker: () => void;
  prevMarker: () => void;
}

export default function CircleControls({
  nextMarker,
  prevMarker,
}: CircleControlProp) {
  return (
    <motion.div
      className="max-w-[45%] w-full mx-auto mt-4 absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 flex justify-between items-center gap-4 px-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
    >
      {/* Left Button */}
      <motion.button
        onClick={prevMarker}
        className="relative w-20 h-20 cursor-pointer border border-white/10 shadow-2xl shadow-black/40 rounded-full flex justify-center items-center group overflow-hidden backdrop-blur-2xl bg-[#1c1c1c]/60"
        initial={{ opacity: 0, x: -30, scale: 0.8 }}
        animate={{ opacity: 1, x: 0, scale: 1 }}
        exit={{ opacity: 0, x: -30, scale: 0.8 }}
        transition={{
          duration: 0.5,
          delay: 0.15,
          ease: [0.16, 1, 0.3, 1],
        }}
        whileHover={{
          scale: 1.08,
          borderColor: "rgba(255,255,255,0.25)",
          backgroundColor: "rgba(28,28,28,0.8)",
        }}
        whileTap={{ scale: 0.95 }}
      >
        {/* Shimmer effect */}
        <motion.div
          className="absolute inset-0 bg-linear-to-r from-transparent via-white/10 to-transparent"
          initial={{ x: "-100%" }}
          whileHover={{ x: "100%" }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
        />

        {/* Radial glow on hover */}
        <motion.div
          className="absolute inset-0 rounded-full bg-linear-to-br from-white/5 via-transparent to-transparent opacity-0 group-hover:opacity-100"
          transition={{ duration: 0.3 }}
        />

        {/* Icon */}
        <motion.div
          className="relative z-10 text-white/60 group-hover:text-white/90"
          whileHover={{ x: -3 }}
          transition={{
            type: "spring",
            stiffness: 400,
            damping: 20,
          }}
        >
          <ChevronLeftIcon size={22} color="currentColor" />
        </motion.div>

        {/* Pulse ring on hover */}
        <motion.div
          className="absolute inset-0 rounded-full border border-white/20"
          initial={{ scale: 1, opacity: 0 }}
          whileHover={{ scale: 1.3, opacity: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        />
      </motion.button>

      {/* Center Indicator Dots */}
      <motion.div
        className="flex gap-x-2"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{
          delay: 0.3,
          duration: 0.4,
          ease: [0.16, 1, 0.3, 1],
        }}
      >
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            className="w-1.5 h-1.5 rounded-full bg-white/20"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              delay: 0.35 + i * 0.05,
              duration: 0.3,
              ease: [0.16, 1, 0.3, 1],
            }}
            whileHover={{
              scale: 1.5,
              backgroundColor: "rgba(255,255,255,0.4)",
            }}
          />
        ))}
      </motion.div>

      {/* Right Button */}
      <motion.button
        onClick={nextMarker}
        className="relative w-20 h-20 cursor-pointer border border-white/10 shadow-2xl shadow-black/40 rounded-full flex justify-center items-center group overflow-hidden backdrop-blur-2xl bg-[#1c1c1c]/60"
        initial={{ opacity: 0, x: 30, scale: 0.8 }}
        animate={{ opacity: 1, x: 0, scale: 1 }}
        exit={{ opacity: 0, x: 30, scale: 0.8 }}
        transition={{
          duration: 0.5,
          delay: 0.15,
          ease: [0.16, 1, 0.3, 1],
        }}
        whileHover={{
          scale: 1.08,
          borderColor: "rgba(255,255,255,0.25)",
          backgroundColor: "rgba(28,28,28,0.8)",
        }}
        whileTap={{ scale: 0.95 }}
      >
        {/* Shimmer effect */}
        <motion.div
          className="absolute inset-0 bg-linear-to-r from-transparent via-white/10 to-transparent"
          initial={{ x: "-100%" }}
          whileHover={{ x: "100%" }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
        />

        {/* Radial glow on hover */}
        <motion.div
          className="absolute inset-0 rounded-full bg-linear-to-br from-white/5 via-transparent to-transparent opacity-0 group-hover:opacity-100"
          transition={{ duration: 0.3 }}
        />

        {/* Icon */}
        <motion.div
          className="relative z-10 text-white/60 group-hover:text-white/90"
          whileHover={{ x: 3 }}
          transition={{
            type: "spring",
            stiffness: 400,
            damping: 20,
          }}
        >
          <ChevronRightIcon size={22} color="currentColor" />
        </motion.div>

        {/* Pulse ring on hover */}
        <motion.div
          className="absolute inset-0 rounded-full border border-white/20"
          initial={{ scale: 1, opacity: 0 }}
          whileHover={{ scale: 1.3, opacity: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        />
      </motion.button>
    </motion.div>
  );
}
