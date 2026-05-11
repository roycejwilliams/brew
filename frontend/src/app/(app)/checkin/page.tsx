"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import { useCheckInAttendee } from "@/hooks/useMoments";

type Status = "loading" | "success" | "already_checked_in" | "error";

export default function CheckInPage() {
  const searchParams = useSearchParams();
  const moment_id = searchParams.get("moment");
  const attendee_id = searchParams.get("attendee");

  const [status, setStatus] = useState<Status>("loading");
  const { mutate: checkIn } = useCheckInAttendee();

  useEffect(() => {
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
  }, [moment_id, attendee_id]);
  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <AnimatePresence mode="wait">
        {status === "loading" && (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center gap-4"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="w-8 h-8 border-2 border-white/10 border-t-white/60 rounded-full"
            />
            <p className="text-white/40 text-sm tracking-[-0.1px]">
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
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
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
                border: "1px solid rgba(74,222,128,0.3)",
                background: "rgba(74,222,128,0.08)",
              }}
            >
              <motion.svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
              >
                <motion.path
                  d="M5 13l4 4L19 7"
                  stroke="rgba(74,222,128,0.8)"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.4, delay: 0.2 }}
                />
              </motion.svg>
            </motion.div>
            <div className="space-y-1">
              <h1 className="text-white text-xl font-medium tracking-[-0.3px]">
                You&apos;re in.
              </h1>
              <p className="text-white/40 text-sm tracking-[-0.1px]">
                Welcome to the moment.
              </p>
            </div>
          </motion.div>
        )}

        {status === "already_checked_in" && (
          <motion.div
            key="already"
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col items-center gap-6 text-center"
          >
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center"
              style={{
                border: "1px solid rgba(255,255,255,0.1)",
                background: "rgba(255,255,255,0.05)",
              }}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path
                  d="M5 13l4 4L19 7"
                  stroke="rgba(255,255,255,0.3)"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <div className="space-y-1">
              <h1 className="text-white text-xl font-medium tracking-[-0.3px]">
                Already checked in.
              </h1>
              <p className="text-white/40 text-sm tracking-[-0.1px]">
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
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col items-center gap-6 text-center"
          >
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center"
              style={{
                border: "1px solid rgba(220,80,80,0.3)",
                background: "rgba(220,80,80,0.08)",
              }}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path
                  d="M18 6L6 18M6 6l12 12"
                  stroke="rgba(220,80,80,0.8)"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </div>
            <div className="space-y-1">
              <h1 className="text-white text-xl font-medium tracking-[-0.3px]">
                Invalid ticket.
              </h1>
              <p className="text-white/40 text-sm tracking-[-0.1px]">
                This QR code isn&apos;t valid for this moment.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
