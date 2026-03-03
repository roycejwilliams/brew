import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";

type InviteSelection = "people" | "where" | "share" | "refer";

interface ReferProp {
  setInvitedSelection: (inviteSelection: InviteSelection) => void;
}

export default function Referral({ setInvitedSelection }: ReferProp) {
  const [reason, setReason] = useState("");

  const canSend = reason.trim().length > 0;

  const REFERRALS_AVAILABLE = 3;

  return (
    <motion.section
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      className="flex flex-col items-center w-full px-6 py-10 gap-y-8"
    >
      <AnimatePresence mode="wait">
        {/* FORM STATE */}
        <motion.div
          key="form"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col items-center w-full gap-y-8"
        >
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col items-center gap-2"
          >
            <h2 className="text-white text-xl font-medium tracking-[-0.3px] leading-tight">
              Refer to <span className="text-4xl tracking-[-1px]">brew</span>
            </h2>
            <p className="text-white/40 text-sm tracking-[-0.1px] text-center">
              Brew is curated. Referrals are reviewed to maintain quality.
            </p>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{
                delay: 0.1,
                duration: 0.3,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="flex items-center gap-3 mt-2 px-5 py-3 rounded-xl"
              style={{
                background: "rgba(255,255,255,0.06)",
                border: "1px solid rgba(255,255,255,0.1)",
              }}
            >
              <span
                className="text-white font-semibold tracking-[-0.5px]"
                style={{ fontSize: 28, lineHeight: 1 }}
              >
                {REFERRALS_AVAILABLE}
              </span>
              <div className="flex flex-col">
                <span className="text-white/70 text-sm font-medium tracking-[-0.1px] leading-tight">
                  referrals left
                </span>
                <span className="text-white/25 text-xs tracking-[-0.1px]">
                  use them wisely
                </span>
              </div>
            </motion.div>
          </motion.div>

          {/* Form */}
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              delay: 0.08,
              duration: 0.3,
              ease: [0.16, 1, 0.3, 1],
            }}
            className="w-full flex flex-col gap-3"
          >
            <p className="text-white/25 text-xs tracking-wide uppercase font-medium">
              Why do they belong?
            </p>
            <div
              className="w-full rounded-md transition-all duration-200"
              style={{
                background: "rgba(255,255,255,0.04)",
                border: reason.trim()
                  ? "1px solid rgba(255,255,255,0.18)"
                  : "1px solid rgba(255,255,255,0.08)",
              }}
            >
              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Tell us why they belong on Brew..."
                rows={6}
                className="w-full bg-transparent text-white placeholder-white/20 text-sm tracking-[-0.2px] outline-none resize-none px-4 py-4"
                style={{ lineHeight: "1.6" }}
              />
            </div>
            <p className="text-white/20 text-xs tracking-[-0.1px] text-center">
              Access is reviewed.
            </p>
          </motion.div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              delay: 0.14,
              duration: 0.3,
              ease: [0.16, 1, 0.3, 1],
            }}
            className="w-full"
          >
            <motion.button
              whileTap={{ scale: canSend ? 0.97 : 1 }}
              onClick={() => setInvitedSelection("refer")}
              disabled={!canSend}
              className="w-full py-4 rounded-md text-sm font-medium tracking-[-0.2px] transition-opacity duration-200 hover:opacity-90"
              style={{
                background: "#ffffff",
                color: "#111111",
                opacity: canSend ? 1 : 0.3,
                cursor: canSend ? "pointer" : "default",
              }}
            >
              Send Referral
            </motion.button>
          </motion.div>
        </motion.div>
      </AnimatePresence>
    </motion.section>
  );
}
