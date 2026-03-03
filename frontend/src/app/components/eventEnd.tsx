import React from "react";
import { motion } from "motion/react";
import AttendeeDetails from "./attendeeDetails";
import EventRecap from "./eventRecap";
import NightCap from "./nightCap";

interface EventEndProp {
  activeModal: "end";
}

const EASE = [0.16, 1, 0.3, 1] as const;

export default function EventEnd({ activeModal }: EventEndProp) {
  return (
    <div className="flex flex-col gap-y-20">
      {/* Ended indicator */}
      <motion.div
        initial={{ opacity: 0, y: -4 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: EASE }}
        className="flex items-center gap-2 w-fit"
        style={{
          borderBottom: "1px solid rgba(255,255,255,0.07)",
          paddingBottom: 16,
        }}
      >
        <div
          className="w-2.5 h-2.5 rounded-full"
          style={{ background: "rgba(255,255,255,0.2)" }}
        />
        <span className="text-white/40 text-sm font-medium tracking-[-0.1px]">
          Event Ended
        </span>
      </motion.div>

      {/* Hero headline */}
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.05, ease: EASE }}
        className="flex flex-col items-end gap-2 text-right"
      >
        <h2
          className="text-white font-semibold leading-none"
          style={{ fontSize: 72, letterSpacing: "-3px", maxWidth: 520 }}
        >
          Rewind the night.
        </h2>
        <p className="text-white/30 text-base tracking-[-0.1px] mt-1">
          Relive the energy. Share your moments.
        </p>
      </motion.div>

      {/* Divider */}
      <motion.div
        initial={{ opacity: 0, scaleX: 0 }}
        animate={{ opacity: 1, scaleX: 1 }}
        transition={{ duration: 0.5, delay: 0.1, ease: EASE }}
        className="origin-right"
        style={{
          height: 1,
          background:
            "linear-gradient(270deg, rgba(255,255,255,0.07) 0%, transparent 80%)",
          marginTop: -8,
        }}
      />

      {/* Attendees */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1, ease: EASE }}
      >
        <AttendeeDetails activeEvent={activeModal} />
      </motion.div>

      {/* Photo recap */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, delay: 0.14, ease: EASE }}
      >
        <EventRecap />
      </motion.div>

      {/* Night cap */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, delay: 0.18, ease: EASE }}
      >
        <NightCap />
      </motion.div>
    </div>
  );
}
