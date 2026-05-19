"use client";
import React from "react";
import { motion } from "motion/react";
import AttendeeDetails from "./attendeeDetails";
import EventRecap from "./eventRecap";
import { useGenerateRecap } from "@/hooks/useMoments";

interface EventEndProp {
  activeModal: "end";
  eventCard: MomentProp | null;
}

const EASE = [0.16, 1, 0.3, 1] as const;

const stagger = (i: number) => ({
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  transition: { duration: 0.35, delay: i * 0.08, ease: EASE },
});

export default function EventEnd({ activeModal, eventCard }: EventEndProp) {
  const { data: recap, isLoading: recapLoading } = useGenerateRecap(eventCard);

  return (
    <div className="flex flex-col gap-16 sm:gap-20 pb-8">
      {/* Ended indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3, ease: EASE }}
        className="flex items-center gap-2 w-fit"
        style={{
          borderBottom: "1px solid rgba(255,255,255,0.07)",
          paddingBottom: 16,
        }}
      >
        <div
          className="w-2.5 h-2.5 rounded-full"
          style={{ background: "rgba(255,255,255,0.15)" }}
        />
        <span
          className="text-sm font-medium tracking-[-0.1px]"
          style={{ color: "rgba(255,255,255,0.35)" }}
        >
          Event Ended
        </span>
      </motion.div>

      {/* Hero headline */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.05, ease: EASE }}
        className="flex flex-col items-end gap-2 text-right"
      >
        <h2
          className="text-white font-semibold leading-none"
          style={{
            fontSize: "clamp(36px, 8vw, 72px)",
            letterSpacing: "clamp(-1px, -0.04em, -3px)",
            maxWidth: 520,
          }}
        >
          Rewind the night.
        </h2>
        <p
          className="text-base tracking-[-0.1px] mt-1"
          style={{ color: "rgba(255,255,255,0.3)" }}
        >
          Relive the energy. Share your moments.
        </p>
      </motion.div>

      {/* AI Recap */}
      <motion.div
        {...stagger(1)}
        className="flex flex-col gap-3"
        style={{
          borderLeft: "1px solid rgba(255,255,255,0.08)",
          paddingLeft: 20,
        }}
      >
        <p
          className="text-[10px] tracking-widest uppercase font-medium"
          style={{ color: "rgba(255,255,255,0.2)" }}
        >
          Tonight&apos;s Recap
        </p>
        {recapLoading ? (
          <div className="flex flex-col gap-2">
            {[80, 60, 70].map((w, i) => (
              <div
                key={i}
                className="h-3 rounded-full animate-pulse"
                style={{ width: `${w}%`, background: "rgba(255,255,255,0.06)" }}
              />
            ))}
          </div>
        ) : recap ? (
          <p
            className="text-sm tracking-[-0.1px] leading-relaxed max-w-lg"
            style={{ color: "rgba(255,255,255,0.55)" }}
          >
            {recap}
          </p>
        ) : null}
      </motion.div>

      {/* Divider */}
      <motion.div
        initial={{ opacity: 0, scaleX: 0 }}
        animate={{ opacity: 1, scaleX: 1 }}
        transition={{ duration: 0.5, delay: 0.2, ease: EASE }}
        className="origin-left"
        style={{
          height: 1,
          background:
            "linear-gradient(90deg, rgba(255,255,255,0.07) 0%, transparent 80%)",
        }}
      />

      {/* Attendees */}
      <motion.div {...stagger(2)}>
        <AttendeeDetails activeEvent={activeModal} />
      </motion.div>

      {/* Photo recap */}
      <motion.div {...stagger(3)} className="pb-10">
        <EventRecap />
      </motion.div>
    </div>
  );
}
