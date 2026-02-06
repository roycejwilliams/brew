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
      className="max-w-[45%] w-full mx-auto mt-4 absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 flex justify-between items-center gap-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <motion.button
        onClick={prevMarker}
        className="relative w-24 h-24 border cursor-pointer border-white/20 shadow-2xl rounded-full  from-[#1a1a1a] to-[#0a0a0a] flex justify-center items-center group overflow-hidden backdrop-blur-sm"
        whileHover={{ scale: 1.05, borderColor: "rgba(255,255,255,0.3)" }}
        whileTap={{ scale: 0.95 }}
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20, scale: 0.9 }}
        transition={{ duration: 0.4, delay: 0.1 }}
      >
        <motion.div
          className="absolute inset-0 from-blue-500/0 via-blue-500/10 to-blue-500/0 opacity-0 group-hover:opacity-100"
          initial={false}
          animate={{ x: ["-100%", "100%"] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
        />
        <motion.div
          className="relative z-10 text-white/70 group-hover:text-white transition-colors"
          whileHover={{ x: -2 }}
          transition={{ type: "spring", stiffness: 400 }}
        >
          <ChevronLeftIcon size={24} color="currentColor" />
        </motion.div>
        <div className="absolute inset-0 rounded-full bg-white/5 group-hover:bg-white/10 transition-colors" />
      </motion.button>

      <motion.button
        onClick={nextMarker}
        className="relative w-24 h-24 border cursor-pointer border-white/20 shadow-2xl rounded-full bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] flex justify-center items-center group overflow-hidden backdrop-blur-sm"
        whileHover={{ scale: 1.05, borderColor: "rgba(255,255,255,0.3)" }}
        whileTap={{ scale: 0.95 }}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 20, scale: 0.9 }}
        transition={{ duration: 0.4, delay: 0.1 }}
      >
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-blue-500/0 via-blue-500/10 to-blue-500/0 opacity-0 group-hover:opacity-100"
          initial={false}
          animate={{ x: ["-100%", "100%"] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
        />
        <motion.div
          className="relative z-10 text-white/70 group-hover:text-white transition-colors"
          whileHover={{ x: 2 }}
          transition={{ type: "spring", stiffness: 400 }}
        >
          <ChevronRightIcon size={24} color="currentColor" />
        </motion.div>
        <div className="absolute inset-0 rounded-full bg-white/5 group-hover:bg-white/10 transition-colors" />
      </motion.button>
    </motion.div>
  );
}
