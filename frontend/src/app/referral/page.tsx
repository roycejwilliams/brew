"use client";

import { Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion } from "motion/react";

const EASE = [0.16, 1, 0.3, 1] as const;

function ReferralContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const ref = searchParams.get("ref");
  const referredBy = searchParams.get("referredBy");

  const isValid = !!ref;

  return (
    <div className="h-dvh overflow-hidden bg-[#0c0c0c] flex items-center justify-center px-6">
      {/* Background glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at 30% 80%, rgba(255,80,30,0.14) 0%, transparent 60%)",
        }}
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.45, ease: EASE }}
        className="flex flex-col items-center gap-7 text-center max-w-xs w-full"
      >
        {/* Icon */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.1, type: "spring", stiffness: 200, damping: 15 }}
          className="w-16 h-16 rounded-full flex items-center justify-center"
          style={{
            border: "1px solid rgba(255,255,255,0.1)",
            background: "rgba(255,255,255,0.05)",
          }}
        >
          <span className="text-2xl tracking-[3px] text-white/60">✦</span>
        </motion.div>

        {/* Text */}
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.35, ease: EASE }}
          className="flex flex-col gap-2"
        >
          <h1 className="text-white text-xl font-medium tracking-[-0.3px]">
            {isValid ? "You've been invited." : "Invalid invite."}
          </h1>
          <p className="text-white/35 text-sm tracking-[-0.1px] leading-relaxed">
            {isValid
              ? referredBy
                ? "Someone on BR3W thinks you belong here. Request access to join."
                : "You've been referred to BR3W. Request access to get started."
              : "This referral link is invalid or has expired."}
          </p>
        </motion.div>

        {/* Actions */}
        {isValid && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.35, ease: EASE }}
            className="flex flex-col gap-3 w-full"
          >
            <motion.button
              onClick={() => router.push("/?tab=invite")}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              className="w-full py-3 rounded-xl text-sm font-medium tracking-[-0.1px] cursor-pointer"
              style={{
                background: "rgba(255,255,255,0.9)",
                color: "#0c0c0c",
              }}
            >
              Request Access
            </motion.button>
            <motion.button
              onClick={() => router.push("/")}
              whileTap={{ scale: 0.97 }}
              className="w-full py-3 rounded-xl text-sm tracking-[-0.1px] cursor-pointer"
              style={{
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.08)",
                color: "rgba(255,255,255,0.4)",
              }}
            >
              Sign in instead
            </motion.button>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}

export default function ReferralPage() {
  return (
    <Suspense
      fallback={
        <div className="h-dvh bg-[#0c0c0c] flex items-center justify-center">
          <div className="w-7 h-7 rounded-full border-2 border-white/10 border-t-white/50 animate-spin" />
        </div>
      }
    >
      <ReferralContent />
    </Suspense>
  );
}
