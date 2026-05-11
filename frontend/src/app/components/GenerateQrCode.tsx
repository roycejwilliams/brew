import { motion, AnimatePresence } from "motion/react";
import React, { useState, useEffect } from "react";
import OrbitDots from "./icons/OrbitDots";
import CanvasQRcode from "./canvasQRcode";


interface ShareProp {
  onClose: () => void;
  inviteType: "moment" | "circle" | "referral";
  inviteId: string;
}

function GenerateQrCode({ onClose, inviteType, inviteId }: ShareProp) {
  const [copied, setCopied] = useState(false);
  const [phase, setPhase] = useState<"generating" | "ready">("generating");

  const inviteLink = `br3w://${inviteType}/${inviteId}`;

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
    <motion.section
      key="generate"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="flex flex-col items-center justify-between gap-y-8 w-full px-6 py-8"
    >
      <div
        className="flex items-center justify-center w-full"
        style={{ minHeight: 280 }}
      >
        <AnimatePresence mode="wait">
          {phase === "generating" ? (
            <motion.div
              key="spinner"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="flex items-center justify-center"
            >
              <OrbitDots />
            </motion.div>
          ) : (
            <motion.div
              key="qr"
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              style={{
                padding: "20px",
                background: "#f0efed",
                borderRadius: "18px",
                boxShadow:
                  "0 0 0 1px rgba(255,255,255,0.04), 0 24px 48px rgba(0,0,0,0.4)",
              }}
            >
              <CanvasQRcode
                qrWidth={240}
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

      <AnimatePresence mode="wait">
        {phase === "generating" ? (
          <motion.div
            key="headline-generating"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="text-center pt-2"
          >
            <h2 className="text-white/50 text-xl font-medium tracking-[-0.1px]">
              Generating invite
            </h2>
            <p className="text-white/20 text-sm mt-1 tracking-[-0.1px]">
              {inviteType === "moment"
                ? "Moment access"
                : inviteType === "circle"
                  ? "Circle invite"
                  : "Brew referral"}
            </p>
          </motion.div>
        ) : (
          <motion.div
            key="headline-ready"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="text-center space-y-1 pt-2"
          >
            <h2 className="text-white text-xl font-medium tracking-[-0.3px] leading-tight">
              Ready to go.
            </h2>
            <p className="text-white/40 text-sm tracking-[-0.1px]">
              {inviteType === "moment"
                ? "Share this to bring them to the moment"
                : inviteType === "circle"
                  ? "Share this to add them to your circle"
                  : "Share this referral link"}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: phase === "ready" ? 1 : 0 }}
        transition={{ duration: 0.4, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
        className="flex flex-col items-center gap-3 w-full"
        style={{ pointerEvents: phase === "ready" ? "auto" : "none" }}
      >
        <div className="flex items-center gap-4">
          <motion.button
            whileTap={{ scale: 0.96 }}
            onClick={handleCopy}
            className="text-white/40 text-[13px] cursor-pointer tracking-[-0.1px] transition-colors duration-200 hover:text-white/70 px-2 py-1"
          >
            {copied ? "Copied" : "Copy link"}
          </motion.button>
          <span className="w-px h-3 bg-white/10" />
          <motion.button
            whileTap={{ scale: 0.96 }}
            className="text-white/40 text-[13px] cursor-pointer tracking-[-0.1px] transition-colors duration-200 hover:text-white/70 px-2 py-1"
          >
            Share link
          </motion.button>
        </div>

        <motion.button
          onClick={onClose}
          whileTap={{ scale: 0.97 }}
          className="w-full py-4 rounded-xl cursor-pointer text-[15px] font-semibold tracking-[-0.2px] transition-opacity duration-200 hover:opacity-90 active:opacity-80"
          style={{ background: "#ffffff", color: "#111111" }}
        >
          Done
        </motion.button>
      </motion.div>
    </motion.section>
  );
}

export default GenerateQrCode;
