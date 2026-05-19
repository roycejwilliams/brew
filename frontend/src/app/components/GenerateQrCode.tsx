"use client";
import { motion, AnimatePresence } from "motion/react";
import React, { useState, useEffect } from "react";
import OrbitDots from "./icons/OrbitDots";
import CanvasQRcode from "./canvasQRcode";

interface ShareProp {
  onClose: () => void;
  inviteType: "moment" | "circle" | "referral";
  inviteId: string;
}

const EASE = [0.16, 1, 0.3, 1] as const;

function GenerateQrCode({ onClose, inviteType, inviteId }: ShareProp) {
  const [copied, setCopied] = useState(false);
  const [phase, setPhase] = useState<"generating" | "ready">("generating");

  const inviteLink =
    inviteType === "moment"
      ? `https://br3w.app/checkin?moment=${inviteId}`
      : inviteType === "circle"
        ? `https://br3w.app/join?circle=${inviteId}`
        : `https://br3w.app/join?ref=${inviteId}`;

  useEffect(() => {
    const timer = setTimeout(() => setPhase("ready"), 2400);
    return () => clearTimeout(timer);
  }, []);

  const handleCopy = () => {
    navigator.clipboard.writeText(inviteLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="w-full max-w-sm sm:max-w-md mx-auto px-4 sm:px-0 flex flex-col items-center gap-8"
    >
      {/* QR / spinner area */}
      <div
        className="flex items-center justify-center w-full"
        style={{ minHeight: 260 }}
      >
        <AnimatePresence mode="wait">
          {phase === "generating" ? (
            <motion.div
              key="spinner"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="flex items-center justify-center"
            >
              <OrbitDots />
            </motion.div>
          ) : (
            <motion.div
              key="qr"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.35, ease: EASE }}
              style={{
                padding: 20,
                background: "#f0efed",
                borderRadius: 16,
                boxShadow:
                  "0 0 0 1px rgba(255,255,255,0.06), 0 24px 48px rgba(0,0,0,0.5)",
              }}
            >
              <CanvasQRcode
                qrWidth={220}
                type={
                  inviteType === "moment"
                    ? "checkin"
                    : inviteType === "circle"
                      ? "circle"
                      : "referral"
                }
                id={inviteId}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Headline */}
      <AnimatePresence mode="wait">
        {phase === "generating" ? (
          <motion.div
            key="generating"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            className="flex flex-col items-center gap-1 text-center"
          >
            <h2
              className="text-lg font-medium tracking-[-0.3px]"
              style={{ color: "rgba(255,255,255,0.45)" }}
            >
              Generating invite
            </h2>
            <p
              className="text-sm tracking-[-0.1px]"
              style={{ color: "rgba(255,255,255,0.2)" }}
            >
              {inviteType === "moment"
                ? "Moment access"
                : inviteType === "circle"
                  ? "Circle invite"
                  : "Brew referral"}
            </p>
          </motion.div>
        ) : (
          <motion.div
            key="ready"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            className="flex flex-col items-center gap-1 text-center"
          >
            <h2
              className="text-lg font-medium tracking-[-0.3px]"
              style={{ color: "rgba(255,255,255,0.88)" }}
            >
              Ready to go.
            </h2>
            <p
              className="text-sm tracking-[-0.1px]"
              style={{ color: "rgba(255,255,255,0.3)" }}
            >
              {inviteType === "moment"
                ? "Share this to bring them to the moment."
                : inviteType === "circle"
                  ? "Share this to add them to your circle."
                  : "Share this referral link."}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Actions */}
      <motion.div
        animate={{ opacity: phase === "ready" ? 1 : 0 }}
        transition={{ duration: 0.2, ease: EASE }}
        className="flex flex-col gap-3 w-full"
        style={{ pointerEvents: phase === "ready" ? "auto" : "none" }}
      >
        {/* Link actions */}
        <div
          className="flex items-center justify-center gap-4 px-4 py-3 rounded-xl"
          style={{
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(255,255,255,0.07)",
          }}
        >
          <motion.button
            whileTap={{ scale: 0.96 }}
            onClick={handleCopy}
            className="text-sm tracking-[-0.1px] cursor-pointer transition-colors duration-150"
            style={{
              color: copied ? "rgba(74,222,128,0.8)" : "rgba(255,255,255,0.4)",
            }}
          >
            {copied ? "✓ Copied" : "Copy link"}
          </motion.button>
          {/* <div
            style={{
              width: 1,
              height: 12,
              background: "rgba(255,255,255,0.1)",
            }}
          />
          <motion.button
            whileTap={{ scale: 0.96 }}
            className="text-sm tracking-[-0.1px] cursor-pointer transition-colors duration-150"
            style={{ color: "rgba(255,255,255,0.4)" }}
          >
            Share link
          </motion.button> */}
        </div>

        {/* Done button */}
        <motion.button
          onClick={onClose}
          whileTap={{ scale: 0.98 }}
          className="w-full flex justify-between items-center px-4 py-3 rounded-xl cursor-pointer transition-all duration-150 text-sm font-medium tracking-[-0.1px]"
          style={{
            background: "rgba(255,255,255,0.9)",
            color: "#0c0c0c",
            border: "1px solid rgba(255,255,255,0.2)",
          }}
        >
          <span>Done</span>
          <span style={{ opacity: 0.4 }}>✦</span>
        </motion.button>
      </motion.div>
    </motion.div>
  );
}

export default GenerateQrCode;
