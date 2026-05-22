"use client";
import { AnimatePresence, motion } from "motion/react";
import React, { useRef, useState } from "react";
import { useOutsideAlerter } from "../utils/outsideAlert";
import StartMoment from "./startMoment";
import Asterisk from "./icons/AsterikIcon";
import { CloseIcon } from "./icons";
import Invite from "./invite";
import CreateMoment from "./CreateMoment";

type CreateMomentStage = "start" | "circle" | "people" | "nearby" | "confirm";
type InviteSelection = "people" | "where" | "share";

interface CreateModalProp {
  onClose: () => void;
}

const EASE = [0.16, 1, 0.3, 1] as const;

function CreateModal({ onClose }: CreateModalProp) {
  const cardActionRef = useRef<HTMLDivElement>(null);

  const [cardAction, setCardAction] = useState<"create" | "invite" | null>(
    null,
  );
  const [selectedModal, setSelectedModal] =
    useState<CreateMomentStage>("start");
  const [inviteSelection, setInviteSelection] =
    useState<InviteSelection>("people");

  useOutsideAlerter(cardActionRef, onClose);

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      className="w-full h-dvh absolute left-0 top-0 z-80 overflow-hidden"
      style={{ background: "#0c0c0c" }}
    >
      {/* Background glows */}
      <div
        style={{
          position: "absolute",
          bottom: "-10%",
          left: "-10%",
          width: "70%",
          height: "65%",
          background:
            "radial-gradient(ellipse, rgba(255,80,30,0.18) 0%, rgba(180,50,10,0.08) 40%, transparent 70%)",
          filter: "blur(40px)",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          top: "-5%",
          right: "-10%",
          width: "60%",
          height: "55%",
          background:
            "radial-gradient(ellipse, rgba(18,18,18,0.9) 0%, rgba(10,10,10,0.5) 40%, transparent 70%)",
          filter: "blur(30px)",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          top: "30%",
          left: "50%",
          transform: "translateX(-50%)",
          width: "80%",
          height: "40%",
          background:
            "radial-gradient(ellipse, rgba(255,60,20,0.05) 0%, transparent 65%)",
          filter: "blur(50px)",
          pointerEvents: "none",
        }}
      />

      {/* Close button */}
      <AnimatePresence>
        {cardAction === null && (
          <motion.button
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            whileTap={{ scale: 0.94 }}
            className="fixed top-0 left-0 m-6 z-50 flex items-center gap-2 cursor-pointer group"
          >
            <div
              className="flex items-center justify-center transition-all duration-200"
              style={{
                width: 36,
                height: 36,
                borderRadius: "50%",
                background: "rgba(255,255,255,0.06)",
                border: "1px solid rgba(255,255,255,0.1)",
              }}
            >
              <CloseIcon color="#fff" size={14} />
            </div>
            <span className="text-white/25 text-xs tracking-[-0.1px] opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              Close
            </span>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Content */}
      <div className="relative z-10 w-full h-full flex flex-col">
        {/* Header */}
        <motion.div
          animate={{
            marginTop: cardAction !== null ? "3.5rem" : "2rem",
            marginBottom: "0.75rem",
          }}
          transition={{ duration: 0.3, ease: EASE }}
          className="mx-auto text-center flex flex-col justify-center items-center px-6 gap-2"
        >
          {/* Asterisk + extra copy + divider — all exit together instantly */}
          <AnimatePresence>
            {cardAction === null && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
                className="flex flex-col items-center gap-2 w-full"
              >
                <div
                  className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-full"
                  style={{
                    background: "rgba(255,255,255,0.06)",
                    border: "1px solid rgba(255,255,255,0.1)",
                  }}
                >
                  <Asterisk size={18} color="rgba(255,255,255,0.7)" />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Title */}
          <AnimatePresence mode="wait">
            <motion.h1
              key={cardAction ?? "default"}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="text-2xl sm:text-3xl font-medium tracking-[-0.6px] text-white"
            >
              {cardAction === "create"
                ? "Start a moment."
                : cardAction === "invite"
                  ? "Invite people."
                  : "Create a moment."}
            </motion.h1>
          </AnimatePresence>

          {/* Subtitle */}
          <AnimatePresence mode="wait">
            <motion.p
              key={`sub-${cardAction}-${selectedModal}-${inviteSelection}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="text-sm tracking-[-0.1px] leading-relaxed max-w-xs"
              style={{ color: "rgba(255,255,255,0.3)" }}
            >
              {cardAction === "create" && selectedModal === "start"
                ? "Set something in motion."
                : cardAction === "invite"
                  ? "Start with people. We'll figure out the rest."
                  : "Turn a passing idea into a real plan."}
            </motion.p>
          </AnimatePresence>

          {/* Extra copy + divider — exit together with asterisk */}
          <AnimatePresence>
            {cardAction === null && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
                className="flex flex-col items-center gap-2 w-full"
              >
                <p
                  className="text-sm tracking-[-0.1px]"
                  style={{ color: "rgba(255,255,255,0.2)" }}
                >
                  Invite people, set the tone, and see what happens.
                </p>
                <div
                  className="w-full max-w-xs mt-2"
                  style={{
                    height: 1,
                    background:
                      "linear-gradient(90deg, transparent, rgba(255,255,255,0.07), transparent)",
                  }}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Modal content */}
        <motion.div
          animate={{ marginTop: cardAction !== null ? "0" : "1rem" }}
          transition={{ duration: 0.3, ease: EASE }}
          className="w-full flex-1 min-h-0 overflow-hidden mx-auto"
        >
          <AnimatePresence mode="wait">
            {cardAction === "create" ? (
              <motion.div
                key="create"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="h-full"
              >
                <StartMoment
                  setSelectedModal={setSelectedModal}
                  selectedModal={selectedModal}
                  onGoBack={() => setCardAction(null)}
                  onClose={onClose}
                />
              </motion.div>
            ) : cardAction === "invite" ? (
              <motion.div
                key="invite"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <Invite
                  onGoBack={() => setCardAction(null)}
                  inviteSelection={inviteSelection}
                  setInviteSelection={setInviteSelection}
                  onClose={onClose}
                />
              </motion.div>
            ) : (
              <motion.div
                key="selection"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <CreateMoment setCardAction={setCardAction} />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </motion.section>
  );
}

export default CreateModal;
