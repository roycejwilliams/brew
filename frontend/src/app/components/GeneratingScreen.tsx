import { motion, AnimatePresence } from "motion/react";
import { useState, useEffect } from "react";

const EASE = [0.16, 1, 0.3, 1] as const;

const phrases = [
  "Setting the tone...",
  "Curating the atmosphere...",
  "Defining the energy...",
  "Crafting the experience...",
  "Almost there...",
];

export default function GeneratingScreen() {
  const [phraseIndex, setPhraseIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setPhraseIndex((i) => (i + 1) % phrases.length);
    }, 1800);
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex flex-col items-center justify-center min-h-[50vh] gap-12 relative overflow-hidden"
    >
      {/* Ambient background pulse */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        animate={{
          background: [
            "radial-gradient(ellipse at 50% 50%, rgba(255,255,255,0.03) 0%, transparent 70%)",
            "radial-gradient(ellipse at 50% 50%, rgba(255,255,255,0.06) 0%, transparent 70%)",
            "radial-gradient(ellipse at 50% 50%, rgba(255,255,255,0.03) 0%, transparent 70%)",
          ],
        }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Orbital rings */}
      <div className="relative flex items-center justify-center w-32 h-32">
        {/* Outer ring */}
        <motion.div
          className="absolute w-32 h-32 rounded-full"
          style={{ border: "1px solid rgba(255,255,255,0.06)" }}
          animate={{ rotate: 360 }}
          transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
        />
        {/* Middle ring */}
        <motion.div
          className="absolute w-20 h-20 rounded-full"
          style={{ border: "1px dashed rgba(255,255,255,0.1)" }}
          animate={{ rotate: -360 }}
          transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
        />
        {/* Orbiting dot — outer */}
        <motion.div
          className="absolute w-32 h-32"
          animate={{ rotate: 360 }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
        >
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-white/40" />
        </motion.div>
        {/* Orbiting dot — inner */}
        <motion.div
          className="absolute w-20 h-20"
          animate={{ rotate: -360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        >
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1 h-1 rounded-full bg-white/25" />
        </motion.div>
        {/* Center dot */}
        <motion.div
          className="w-2 h-2 rounded-full bg-white/50"
          animate={{ scale: [1, 1.4, 1], opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      {/* Cycling phrase */}
      <div className="flex flex-col items-center gap-3">
        <AnimatePresence mode="wait">
          <motion.p
            key={phraseIndex}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.4, ease: EASE }}
            className="text-white/50 text-sm tracking-[-0.1px]"
          >
            {phrases[phraseIndex]}
          </motion.p>
        </AnimatePresence>
        <p className="text-white/15 text-[10px] tracking-[3px] uppercase">
          Generating your moment
        </p>
      </div>
    </motion.div>
  );
}
