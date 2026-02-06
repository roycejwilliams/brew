import { AnimatePresence, motion, Variants } from "motion/react";
import React, { useRef, useState } from "react";
import { useOutsideAlerter } from "../utils/outsideAlert";
import { RadialGradientBackground } from "./radialNoiseBackground";
import FingerprintIcon from "./icons/fingerPrint";
import SlashIcon from "./icons/slashIcon";
import StartMoment from "./startMoment";
import Asterisk from "./icons/AsterikIcon";
import { CloseIcon } from "./icons";

interface CreateModalProp {
  onClose: () => void;
}

function CreateModal({ onClose }: CreateModalProp) {
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

  const cardActionRef = useRef<HTMLDivElement>(null);

  useOutsideAlerter(cardActionRef, onClose);

  const [cardAction, setCardAction] = useState<"create" | "invite" | null>(
    null,
  );
  const [hoveredAction, setHoveredAction] = useState<
    "create" | "invite" | null
  >("create");

  const [chooser, setChooser] = useState<"circle" | "people" | "nearby" | null>(
    null,
  );

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="w-full h-screen  fixed left-0 top-0 bg-linear-to-br from-black/80 to-[#535353] backdrop-blur-sm z-80"
    >
      {cardAction === null && (
        <motion.button
          onClick={onClose}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          whileTap={{ scale: 0.95 }}
          transition={{
            type: "spring",
            stiffness: 300,
            damping: 25,
          }}
          className="absolute left-0 top-0 m-8 cursor-pointer flex gap-x-1 items-center text-white/80 hover:text-white transition-colors group"
        >
          <motion.span
            className="inline-block"
            whileHover={{ rotate: 90 }}
            transition={{ duration: 0.2 }}
          >
            <CloseIcon size={18} />
          </motion.span>
          close
        </motion.button>
      )}

      <div className="mx-auto text-center mt-10 mb-4 flex flex-col justify-center items-center">
        <motion.div
          initial={{ rotate: 0 }}
          animate={{ rotate: 360 }}
          exit={{ rotate: 0 }}
          transition={{ duration: 0.75, ease: "easeInOut" }}
          className="mx-auto text-center text-6xl"
        >
          <Asterisk size={48} color="white" />
        </motion.div>
        <h1 className="text-3xl font-normal mt-8">
          {cardAction === "create"
            ? "Start a moment"
            : cardAction === "invite"
              ? "Invite"
              : "Create a moment."}
        </h1>
        <h3 className="text-lg mt-2 font-light">
          {cardAction === null && "Turn a passing idea into a real plan."}
        </h3>
        <p className="text-base mt-2 ">
          {cardAction === null &&
            "Invite people, set the tone, and see what happens."}
        </p>
      </div>

      <div
        className={`w-full h-full mx-auto ${cardAction === "create" || cardAction === "invite" ? "mt-4" : "mt-24"}`}
      >
        <AnimatePresence mode="popLayout">
          {cardAction === "create" ? (
            //start moment
            <StartMoment
              chooser={chooser!}
              setChooser={setChooser}
              onGoBack={() => setCardAction(null)}
            /> //invite
          ) : cardAction === "invite" ? (
            ""
          ) : (
            //Create moment
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
          )}
        </AnimatePresence>
      </div>
    </motion.section>
  );
}

export default CreateModal;
