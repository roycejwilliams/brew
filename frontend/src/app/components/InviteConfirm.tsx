import { motion } from "motion/react";
import { useQRCode } from "next-qrcode";
import React, { useState } from "react";

interface CreateModalProp {
  onClose: () => void;
}

export default function InviteConfirm({ onClose }: CreateModalProp) {
  const REFERRAL_LINK = "https://brew.app/r/abc123";
  const handleCopy = () => {
    navigator.clipboard.writeText(REFERRAL_LINK);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const [copied, setCopied] = useState(false);
  const { Canvas } = useQRCode();
  return (
    <motion.div
      key="sent"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      className="flex flex-col w-full gap-y-7"
    >
      {/* Status header */}
      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          delay: 0.05,
          duration: 0.3,
          ease: [0.16, 1, 0.3, 1],
        }}
        className="flex flex-col gap-1 pt-2"
      >
        <h2 className="text-white text-xl font-medium tracking-[-0.3px] leading-tight">
          Referral sent.
        </h2>
        <p className="text-white/40 text-sm tracking-[-0.1px]">
          We'll review this referral.
        </p>
      </motion.div>

      {/* Status row */}
      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          delay: 0.1,
          duration: 0.3,
          ease: [0.16, 1, 0.3, 1],
        }}
        className="flex items-center justify-between px-4 py-3 rounded-md"
        style={{
          background: "rgba(255,255,255,0.04)",
          border: "1px solid rgba(255,255,255,0.07)",
        }}
      >
        <span className="text-white/35 text-xs tracking-wide uppercase font-medium">
          Status
        </span>
        <span className="text-white/60 text-xs font-medium tracking-[-0.1px]">
          Pending Review
        </span>
      </motion.div>

      {/* Actions */}
      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          delay: 0.15,
          duration: 0.3,
          ease: [0.16, 1, 0.3, 1],
        }}
        className="flex flex-col gap-2 w-full"
      >
        <motion.button
          whileTap={{ scale: 0.98 }}
          onClick={handleCopy}
          className="flex items-center justify-between w-full px-4 py-3.5 rounded-md cursor-pointer transition-all duration-200"
          style={{
            background: "rgba(255,255,255,0.05)",
            border: "1px solid rgba(255,255,255,0.08)",
          }}
        >
          <span className="text-white/60 text-sm tracking-[-0.1px]">
            Copy link
          </span>
          <span className="text-white/30 text-xs tracking-[-0.1px] transition-colors duration-200">
            {copied ? "Copied" : REFERRAL_LINK.replace("https://", "")}
          </span>
        </motion.button>

        <motion.button
          whileTap={{ scale: 0.98 }}
          className="flex items-center justify-between w-full px-4 py-3.5 rounded-md cursor-pointer transition-all duration-200"
          style={{
            background: "rgba(255,255,255,0.05)",
            border: "1px solid rgba(255,255,255,0.08)",
          }}
        >
          <span className="text-white/60 text-sm tracking-[-0.1px]">Share</span>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path
              d="M2 7v4.5a.5.5 0 00.5.5h9a.5.5 0 00.5-.5V7M7 2v7M4.5 4.5L7 2l2.5 2.5"
              stroke="rgba(255,255,255,0.3)"
              strokeWidth="1.3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </motion.button>
      </motion.div>

      {/* QR — secondary */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{
          delay: 0.22,
          duration: 0.35,
          ease: [0.16, 1, 0.3, 1],
        }}
        className="flex flex-col items-center gap-3"
      >
        <p className="text-white/20 text-xs tracking-wide uppercase font-medium">
          Or scan
        </p>
        <div
          style={{
            padding: 14,
            background: "#f0efed",
            borderRadius: 14,
            opacity: 0.7,
          }}
        >
          <Canvas
            text={REFERRAL_LINK}
            options={{
              errorCorrectionLevel: "M",
              margin: 1,
              scale: 10,
              width: 160,
              color: { dark: "#1a1a1a", light: "#f0efed" },
            }}
          />
        </div>
      </motion.div>
      <motion.button
        onClick={onClose}
        whileTap={{ scale: 0.97 }}
        className="w-full py-4 rounded-xl cursor-pointer text-[15px] font-semibold tracking-[-0.2px] transition-opacity duration-200 hover:opacity-90 active:opacity-80"
        style={{
          background: "#ffffff",
          color: "#111111",
        }}
      >
        Done
      </motion.button>
    </motion.div>
  );
}
