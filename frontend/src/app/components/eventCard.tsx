"use client";
import { openEventCard } from "@/stores/store";
import React, { useRef, useState } from "react";
import { useOutsideAlerter } from "../utils/outsideAlert";
import { AnimatePresence, motion } from "motion/react";
import Image from "next/image";
import EventStart from "./eventStart";
import EventLive from "./eventLive";
import EventEnd from "./eventEnd";
import { CloseIcon } from "./icons";
import EventHero from "./EventHero";

function EventCard() {
  const ref = useRef<HTMLDivElement | null>(null);
  const closeEventCard = openEventCard((state) => state.closeEvent);
  const scrollY = openEventCard((state) => state.scrollY);
  useOutsideAlerter(ref, closeEventCard);
  const EASE = [0.16, 1, 0.3, 1] as const;

  const [activeEvent, setActive] = useState<"prequel" | "live" | "end">(
    "prequel",
  );

  return (
    <motion.main
      ref={ref}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{ top: scrollY }}
      className={`absolute backdrop-blur-3xl left-0 h-screen w-full overflow-y-scroll z-50 bg-black/40`}
    >
      <motion.section className="absolute h-screen left-0 top-0 inset-0 w-full z-10  px-24">
        <motion.button
          onClick={closeEventCard}
          initial={{ opacity: 0, x: -8 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, ease: EASE }}
          whileHover={{ x: -2 }}
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
          <span className="text-white/30 text-xs tracking-[-0.1px] opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            Close
          </span>
        </motion.button>
        {/* Start Up Details */}
        <EventHero />

        <AnimatePresence mode="popLayout">
          {activeEvent === "prequel" && <EventStart activeModal="prequel" />}
          {activeEvent === "live" && <EventLive activeModal="live" />}
          {activeEvent === "end" && <EventEnd activeModal="end" />}
        </AnimatePresence>
      </motion.section>
    </motion.main>
  );
}

export default EventCard;
