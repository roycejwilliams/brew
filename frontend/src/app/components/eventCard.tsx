"use client";
import { openEventCard } from "@/stores/store";
import { AnimatePresence, motion } from "motion/react";
import EventStart from "./eventStart";
import EventLive from "./eventLive";
import EventEnd from "./eventEnd";
import { CloseIcon } from "./icons";
import EventHero from "./EventHero";
import { useRouter } from "next/navigation";
import Image from "next/image";
import useTimingStates from "@/hooks/useTimingStates";
import { useSocket } from "@/hooks/useSocket";
import { useEffect } from "react";

const EASE = [0.16, 1, 0.3, 1] as const;

function EventCard() {
  const router = useRouter();
  const closeEventCard = openEventCard((state) => state.closeEvent);
  const eventCard = openEventCard((state) => state.moment);
  const { joinMoment, leaveMoment } = useSocket();

  useEffect(() => {
    if (!eventCard?.id) return;
    joinMoment(eventCard.id);
    return () => leaveMoment(eventCard.id!);
  }, [eventCard?.id]);

  const handleClose = () => {
    closeEventCard();
    router.back();
  };

  const { activeEvent } = useTimingStates({ eventCard });

  return (
    <main
      className="min-h-dvh overflow-x-hidden w-full text-black dark:text-white"
      style={{ background: `rgb(var(--bg))` }}
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
                  "linear-gradient(180deg, rgba(var(--bg),0.45) 0%, rgba(var(--bg),0.85) 100%)",
              }}
            />
          </>
        ) : (
          <>
            <div
              className="absolute inset-0"
              style={{ background: `rgb(var(--bg))` }}
            />
            <div
              className="absolute top-0 left-1/2 -translate-x-1/2 pointer-events-none"
              style={{
                width: 900,
                height: 500,
                background:
                  "radial-gradient(ellipse at 50% 0%, rgba(var(--fg),0.06) 0%, rgba(var(--fg),0.02) 40%, transparent 70%)",
              }}
            />
          </>
        )}
      </div>

      {/* Close button */}
      <motion.button
        onClick={handleClose}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.25, ease: EASE }}
        whileTap={{ scale: 0.94 }}
        className="fixed z-50 flex items-center gap-2 cursor-pointer group"
        style={{ top: "calc(env(safe-area-inset-top, 0px) + 1.25rem)", left: "1rem" }}
      >
        <div
          className="flex items-center justify-center transition-colors duration-200"
          style={{
            width: 36,
            height: 36,
            borderRadius: "50%",
            background: "rgba(var(--fg),0.08)",
            border: "1px solid rgba(var(--fg),0.12)",
            backdropFilter: "blur(8px)",
          }}
        >
          <CloseIcon color="currentColor" size={14} />
        </div>
        <span
          className="text-xs tracking-[-0.1px] opacity-0 group-hover:opacity-100 transition-opacity duration-200"
          style={{ color: "rgba(var(--fg),0.3)" }}
        >
          Close
        </span>
      </motion.button>

      {/* Content */}
      <div className="relative z-10 w-full px-4 sm:px-8 md:px-16 lg:px-24 pb-28 pt-20">
        <EventHero eventCard={eventCard} />

        <AnimatePresence mode="popLayout">
          {activeEvent === "prequel" && (
            <motion.div
              key="prequel"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <EventStart activeModal="prequel" eventCard={eventCard} />
            </motion.div>
          )}
          {activeEvent === "live" && (
            <motion.div
              key="live"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <EventLive activeModal="live" eventCard={eventCard} />
            </motion.div>
          )}
          {activeEvent === "end" && (
            <motion.div
              key="end"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <EventEnd activeModal="end" eventCard={eventCard} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}

export default EventCard;
