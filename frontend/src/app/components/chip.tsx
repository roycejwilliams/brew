import React from "react";
import { motion } from "motion/react";

const EASE = [0.16, 1, 0.3, 1] as const;

const vibes = [
  "Cocktails",
  "Underground",
  "Artistic",
  "Tech",
  "Private",
  "Invite Only",
];

function Chip({ label, index }: { label: string; index: number }) {
  return (
    <motion.button
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.96 }}
      className="py-1.5 px-4 rounded-full text-xs font-medium tracking-[-0.1px] cursor-pointer transition-all duration-200"
      style={{
        background: "rgba(255,255,255,0.05)",
        border: "1px solid rgba(255,255,255,0.08)",
        color: "rgba(255,255,255,0.5)",
      }}
    >
      {label}
    </motion.button>
  );
}

export default Chip;
