import { motion } from "motion/react";
import React from "react";

type MomentSelectionProp = "start" | "circle" | "people" | "nearby" | "confirm";

interface AroundYouProp {
  selectedModal: MomentSelectionProp;
  setSelectedModal: (selectedModal: MomentSelectionProp) => void;
  goback: () => void;
}

export default function AroundYou({ goback, setSelectedModal }: AroundYouProp) {
  return (
    <motion.section className="text-center space-y-5 relative px-6">
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.35, duration: 0.3 }}
        className="text-sm text-black/30 dark:text-white/30 mt-8 sm:mt-12"
      >
        They can request to join — you decide who&apos;s welcome.{" "}
      </motion.p>

      {/* Visual metaphor */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.15, duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        className="flex justify-center py-2 sm:py-4"
      >
        <div className="relative w-44 h-44 sm:w-64 sm:h-64">
          {/* Outer fade ring */}
          <motion.div
            className="absolute inset-0 rounded-full border border-black/5 dark:border-white/5"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.4 }}
          />
          {/* Middle ring */}
          <motion.div
            className="absolute inset-4 rounded-full border border-black/10 dark:border-white/10"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.25, duration: 0.4 }}
          />
          {/* Center dot (you) */}
          <motion.div
            className="absolute top-1/2 left-1/2 w-3 h-3 -mt-1.5 -ml-1.5 rounded-full bg-black/60 dark:bg-white/60"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.3 }}
          />
          {/* Pulsing halo */}
          <motion.div
            className="absolute inset-8 rounded-full bg-black/5 dark:bg-white/5"
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.3, 0, 0.3],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        </div>
      </motion.div>

      {/* Reassurance footer */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.35, duration: 0.3 }}
        className="text-sm text-black/30 dark:text-white/30"
      >
        You&apos;ll always see who wants to join.
      </motion.p>
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25, duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        className="flex flex-col sm:flex-row gap-3 justify-center pt-2 w-full max-w-sm mx-auto"
      >
        <motion.button
          onClick={goback}
          whileHover={{ scale: 1.02, y: -1 }}
          whileTap={{ scale: 0.98 }}
          transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="w-full sm:w-auto text-sm font-medium cursor-pointer px-6 py-3.5 bg-black/5 dark:bg-white/5 backdrop-blur-2xl
                            text-black/60 dark:text-white/60 border border-black/10 dark:border-white/10 rounded-md
                            hover:bg-black/8 dark:hover:bg-white/8 hover:text-black/90 dark:hover:text-white/90 hover:border-black/20 dark:hover:border-white/20
                            transition-all duration-200"
        >
          Go back
        </motion.button>
        <motion.button
          onClick={() => {
            setSelectedModal("confirm");
          }}
          whileHover={{ scale: 1.02, y: -1 }}
          whileTap={{ scale: 0.98 }}
          transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="w-full sm:w-auto text-sm font-medium cursor-pointer px-6 py-3.5 bg-white/90 backdrop-blur-2xl
                            text-black border border-white/20 rounded-md
                            hover:bg-white shadow-lg shadow-white/10
                            transition-all duration-200"
        >
          Confirm to proceed
        </motion.button>
      </motion.div>
    </motion.section>
  );
}
