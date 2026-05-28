"use client";

import { Suspense } from "react";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import { useCheckInAttendee } from "@/hooks/useMoments";
import { useUserStore } from "@/stores/useUserStore";

const EASE = [0.16, 1, 0.3, 1] as const;

type Status = "loading" | "success" | "already_checked_in" | "error";

// ── Inner component — uses useSearchParams ──
function CheckInContent() {
  const searchParams = useSearchParams();
  const moment_id = searchParams.get("moment");
  const attendee_param = searchParams.get("attendee");

  const { user, hasHydrated } = useUserStore();
  const attendee_id = attendee_param ?? user?.id ?? null;

  const [status, setStatus] = useState<Status>("loading");
  const { mutate: checkIn } = useCheckInAttendee();

  useEffect(() => {
    if (!hasHydrated) return;
    if (!moment_id || !attendee_id) {
      setStatus("error");
      return;
    }

    checkIn(
      { moment_id, attendee_id },
      {
        onSuccess: () => setStatus("success"),
        onError: (err: Error) => {
          const message = err?.message ?? "";
          if (message === "Attendee already checked in.") {
            setStatus("already_checked_in");
          } else {
            setStatus("error");
          }
        },
      },
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [moment_id, attendee_id, hasHydrated]);

  return (
    <div className="min-h-dvh overflow-hidden bg-[#0c0c0c] flex items-center justify-center px-6">
      <AnimatePresence mode="wait">
        {status === "loading" && (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: EASE }}
            className="flex flex-col items-center gap-4"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="w-7 h-7 border-2 border-white/10 border-t-white/50 rounded-full"
            />
            <p className="text-white/30 text-sm tracking-[-0.1px]">
              Checking you in...
            </p>
          </motion.div>
        )}

        {status === "success" && (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: EASE }}
            className="flex flex-col items-center gap-6 text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{
                delay: 0.1,
                type: "spring",
                stiffness: 200,
                damping: 15,
              }}
              className="w-16 h-16 rounded-full flex items-center justify-center"
              style={{
                border: "1px solid rgba(74,222,128,0.28)",
                background: "rgba(74,222,128,0.07)",
              }}
            >
              <motion.svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
              >
                <motion.path
                  d="M5 13l4 4L19 7"
                  stroke="rgba(74,222,128,0.85)"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.4, delay: 0.2 }}
                />
              </motion.svg>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25, duration: 0.35, ease: EASE }}
              className="flex flex-col gap-1"
            >
              <h1 className="text-white text-xl font-medium tracking-[-0.3px]">
                You&apos;re in.
              </h1>
              <p className="text-white/35 text-sm tracking-[-0.1px]">
                Welcome to the moment.
              </p>
            </motion.div>
          </motion.div>
        )}

        {status === "already_checked_in" && (
          <motion.div
            key="already"
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: EASE }}
            className="flex flex-col items-center gap-6 text-center"
          >
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center"
              style={{
                border: "1px solid rgba(255,255,255,0.08)",
                background: "rgba(255,255,255,0.04)",
              }}
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                <path
                  d="M5 13l4 4L19 7"
                  stroke="rgba(255,255,255,0.3)"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <div className="flex flex-col gap-1">
              <h1 className="text-white text-xl font-medium tracking-[-0.3px]">
                Already checked in.
              </h1>
              <p className="text-white/35 text-sm tracking-[-0.1px]">
                You&apos;re already part of this moment.
              </p>
            </div>
          </motion.div>
        )}

        {status === "error" && (
          <motion.div
            key="error"
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: EASE }}
            className="flex flex-col items-center gap-6 text-center"
          >
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center"
              style={{
                border: "1px solid rgba(220,80,80,0.25)",
                background: "rgba(220,80,80,0.07)",
              }}
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                <path
                  d="M18 6L6 18M6 6l12 12"
                  stroke="rgba(220,80,80,0.8)"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </div>
            <div className="flex flex-col gap-1">
              <h1 className="text-white text-xl font-medium tracking-[-0.3px]">
                Invalid ticket.
              </h1>
              <p className="text-white/35 text-sm tracking-[-0.1px]">
                This QR code isn&apos;t valid for this moment.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── Page export — Suspense boundary required for useSearchParams ──
export default function CheckInPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-dvh bg-[#0c0c0c] flex items-center justify-center">
          <div className="w-7 h-7 rounded-full border-2 border-white/10 border-t-white/50 animate-spin" />
        </div>
      }
    >
      <CheckInContent />
    </Suspense>
  );
}
