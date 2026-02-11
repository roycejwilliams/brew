import { PinIcon } from "./icons";
import { motion } from "framer-motion";
import React from "react";

interface NearYouProp {
  place: string | null;
}

export default function NearYou({ place }: NearYouProp) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="mt-3 p-4 bg-neutral-900/60 backdrop-blur-sm border border-neutral-700/50 rounded-xl shadow-lg"
    >
      <div className="flex items-center gap-3">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{
            delay: 0.15,
            type: "spring",
            stiffness: 200,
            damping: 15,
          }}
          className="w-6 h-6 rounded-full bg-white flex justify-center items-center shadow-sm"
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.25 }}
          >
            <PinIcon size={20} className="text-neutral-400" />
          </motion.div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: -5 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2, duration: 0.3 }}
          className="flex-1 space-y-1"
        >
          <div className="flex flex-col space-y-1">
            <span className="text-sm text-neutral-200 font-medium">
              Near • {place}
            </span>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
