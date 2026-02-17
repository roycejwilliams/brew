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
    <motion.section className="text-center space-y-5 relative ">
      <motion.div
        key="aroundYou-header"
        initial={{ opacity: 0, y: -4 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        className="space-y-1"
      >
        <h2 className="text-lg font-medium text-white/90">
          Visible to people around you
        </h2>
        <p className="text-sm text-white/40 leading-relaxed max-w-xs mx-auto">
          People nearby can discover this moment on their map.
        </p>
      </motion.div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.35, duration: 0.3 }}
        className="text-sm text-white/30 mt-12"
      >
        They can request to join — you decide who's welcome.{" "}
      </motion.p>

      {/* Visual metaphor */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.15, duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        className="flex justify-center py-4 "
      >
        <div className="relative w-64 h-64">
          {/* Outer fade ring */}
          <motion.div
            className="absolute inset-0 rounded-full border border-white/5"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.4 }}
          />
          {/* Middle ring */}
          <motion.div
            className="absolute inset-4 rounded-full border border-white/10"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.25, duration: 0.4 }}
          />
          {/* Center dot (you) */}
          <motion.div
            className="absolute top-1/2 left-1/2 w-3 h-3 -mt-1.5 -ml-1.5 rounded-full bg-white/60"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.3 }}
          />
          {/* Pulsing halo */}
          <motion.div
            className="absolute inset-8 rounded-full bg-white/5"
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
        className="text-sm text-white/30"
      >
        You'll always see who wants to join.
      </motion.p>
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25, duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        className="flex gap-x-3 justify-center pt-2"
      >
        <motion.button
          onClick={goback}
          whileHover={{ scale: 1.02, y: -1 }}
          whileTap={{ scale: 0.98 }}
          transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="text-sm font-medium cursor-pointer px-6 py-3.5 bg-white/5 backdrop-blur-2xl 
                            text-white/60 border border-white/10 rounded-md 
                            hover:bg-white/8 hover:text-white/90 hover:border-white/20
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
          className="text-sm font-medium cursor-pointer px-6 py-3.5 bg-white/90 backdrop-blur-2xl 
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
