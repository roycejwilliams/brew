"use client";
import { openEventCard } from "@/stores/store";
import React, { useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import EventStart from "./eventStart";
import EventLive from "./eventLive";
import EventEnd from "./eventEnd";
import { CloseIcon } from "./icons";
import EventHero from "./EventHero";
import { useRouter } from "next/navigation";
import Image from "next/image";
import useTimingStates from "@/hooks/useTimingStates";

function EventCard() {
  const EASE = [0.16, 1, 0.3, 1] as const;

  const router = useRouter();
  const closeEventCard = openEventCard((state) => state.closeEvent);
  const eventCard = openEventCard((state) => state.moment);

  const handleClose = () => {
    closeEventCard();
    router.back();
  };
  const { activeEvent } = useTimingStates({ eventCard });

  console.log("Event status:", activeEvent);

  return (
    <main
      className="min-h-screen w-full text-white"
      style={{ background: "#0c0c0c" }}
    >
      {/* Background — fixed so it stays while scrolling */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        {eventCard?.image ? (
          <>
            <Image
              src={eventCard.image}
              alt=""
              fill
              className="object-cover"
              style={{ filter: "blur(10px) brightness(0.5) saturate(1.2)" }}
              priority
            />
            <div
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(180deg, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.85) 100%)",
              }}
            />
          </>
        ) : (
          <>
            <div
              className="absolute inset-0"
              style={{ background: "#0c0c0c" }}
            />
            <div
              className="absolute top-0 left-1/2 -translate-x-1/2 pointer-events-none"
              style={{
                width: 900,
                height: 500,
                background:
                  "radial-gradient(ellipse at 50% 0%, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 40%, transparent 70%)",
              }}
            />
          </>
        )}
      </div>

      {/* Content */}
      <div className="relative z-10 w-full px-24">
        <motion.button
          onClick={handleClose}
          initial={{ opacity: 0, x: -8 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, ease: EASE }}
          whileHover={{ x: -2 }}
          whileTap={{ scale: 0.94 }}
          className="fixed top-0 left-0 mt-12 ml-6 z-50 flex items-center gap-2 cursor-pointer group"
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

        <EventHero eventCard={eventCard} />

        <AnimatePresence mode="popLayout">
          {activeEvent === "prequel" && (
            <EventStart activeModal="prequel" eventCard={eventCard} />
          )}
          {activeEvent === "live" && (
            <EventLive activeModal="live" eventCard={eventCard} />
          )}
          {activeEvent === "end" && (
            <EventEnd activeModal="end" eventCard={eventCard} />
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}

export default EventCard;
