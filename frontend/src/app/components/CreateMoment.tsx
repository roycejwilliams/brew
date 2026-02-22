import { motion, Variants } from "motion/react";
import React, { useState } from "react";
import { RadialGradientBackground } from "./radialNoiseBackground";
import SlashIcon from "./icons/slashIcon";
import FingerprintIcon from "./icons/fingerPrint";

interface CreateMomentProp {
  setCardAction: (cardaction: "create" | "invite" | null) => void;
}

export default function CreateMoment({ setCardAction }: CreateMomentProp) {
  const scaleVariants: Variants = {
    rest: { scale: 1 },
    active: { scale: 1.15, transition: { duration: 0.3, ease: "easeInOut" } },
  };

  const glowVariants: Variants = {
    rest: {
      boxShadow: "0px 0px 0px rgba(0,0,0,0)",
      opacity: 0.6,
    },
    active: {
      boxShadow: "0px 0px 24px rgba(255,255,255,0.4)",
      opacity: 1,
      transition: { duration: 0.5, ease: "easeInOut" },
    },
  };

  const textVariants: Variants = {
    rest: {
      opacity: 0.6,
    },
    active: {
      opacity: 1,
      transition: { duration: 0.5, ease: "easeInOut" },
      fontWeight: 500,
    },
  };

  const [hoveredAction, setHoveredAction] = useState<
    "create" | "invite" | null
  >("create");

  return (
    <div className="flex gap-x-20 justify-center items-center mx-auto max-w-xl">
      <button
        onMouseEnter={() => setHoveredAction("create")}
        onClick={() => setCardAction("create")}
        className="cursor-pointer"
      >
        <motion.div
          animate={hoveredAction === "create" ? "active" : "rest"}
          variants={scaleVariants}
          className="text-center"
        >
          <motion.div
            animate={hoveredAction === "create" ? "active" : "rest"}
            variants={glowVariants}
            className="w-64 h-64 border border-white/15 rounded-md shadow-lg relative overflow-hidden flex justify-center items-center"
          >
            <RadialGradientBackground
              centerColor="rgba(140,120,255,0.85)" // purple core
              midColor="rgba(255,180,200,0.75)" // soft pink
              edgeColor="rgba(255,200,170,0.9)" // peach edge
            />
            <SlashIcon width={75} height={75} />
          </motion.div>
          <motion.p
            animate={hoveredAction === "create" ? "active" : "rest"}
            variants={textVariants}
            className="mt-6 text-sm"
          >
            Start a moment
          </motion.p>
        </motion.div>
      </button>

      <button
        onMouseEnter={() => setHoveredAction("invite")}
        onClick={() => setCardAction("invite")}
        className="cursor-pointer"
      >
        <motion.div
          animate={hoveredAction === "invite" ? "active" : "rest"}
          variants={scaleVariants}
          className="text-center"
        >
          <motion.div
            animate={hoveredAction === "invite" ? "active" : "rest"}
            variants={glowVariants}
            className="w-64 h-64 border border-white/15 rounded-md shadow-lg relative overflow-hidden  flex justify-center items-center"
          >
            <div>
              <RadialGradientBackground
                centerColor="rgba(60, 160, 255, 0.9)" // bright cyan-blue core
                midColor="rgba(120, 200, 255, 0.75)" // soft sky blue
                edgeColor="rgba(190, 200, 255, 0.85)" // light lavender edge
                noiseOpacity={0.12}
              />
            </div>
            <FingerprintIcon width={65} height={103} />
          </motion.div>
          <motion.p
            animate={hoveredAction === "invite" ? "active" : "rest"}
            variants={textVariants}
            className="mt-6 text-sm"
          >
            Invite People
          </motion.p>
        </motion.div>
      </button>
    </div>
  );
}
