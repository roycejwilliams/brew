import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import CanvasQRcode from "./canvasQRcode";
import AttendeeDetails from "./attendeeDetails";
import HostMessage from "./hostMessage";
import { openEventCard } from "@/stores/store";
import MapBoxGl from "./mapBoxGl";

interface EventLiveProp {
  activeModal: "live";
  eventCard: MomentProp | null;
}

type HostMessageItem = {
  text: string;
  time: string;
};

const EASE = [0.16, 1, 0.3, 1] as const;

export default function EventLive({ activeModal, eventCard }: EventLiveProp) {
  // const [hostMessages, setHostMessages] = useState<HostMessageItem[]>([]);

  console.log(eventCard);

  if (!eventCard) return null;

  const lng = (eventCard?.location as any)?.x;
  const lat = (eventCard?.location as any)?.y;
  const hasLocation = lng != null && lat != null;

  return (
    <div className="flex flex-col gap-y-20 pb-8">
      {/* Live indicator */}
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
        <div className="relative flex items-center justify-center w-5 h-5">
          <motion.div
            animate={{ scale: [1, 1.9], opacity: [0.4, 0] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: "easeOut" }}
            className="absolute w-4 h-4 rounded-full"
            style={{ background: "rgba(74,222,128,0.3)" }}
          />
          <div
            className="w-2.5 h-2.5 rounded-full"
            style={{
              background: "#4ade80",
              boxShadow: "0 0 8px rgba(74,222,128,0.6)",
            }}
          />
        </div>
        <span className="text-white/60 text-sm font-medium tracking-[-0.1px]">
          Live Now
        </span>
      </motion.div>

      {/* Hero — QR + headline */}
      <motion.section
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, delay: 0.05, ease: EASE }}
        className="flex flex-col items-center gap-8 text-center"
      >
        <div className="flex flex-col items-center gap-2">
          <h2
            className="text-white font-semibold leading-tight"
            style={{ fontSize: 52, letterSpacing: "-2px" }}
          >
            Let's Party
          </h2>
          <p className="text-white/35 text-base tracking-[-0.1px]">
            Time to Brew
          </p>
        </div>

        {/* QR */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, delay: 0.1, ease: EASE }}
          style={{
            background: "#f0efed",
            borderRadius: 18,
            boxShadow: "0 24px 60px rgba(0,0,0,0.5)",
            overflow: "hidden",
          }}
        >
          <CanvasQRcode
            qrWidth={160}
            type="checkin"
            id={eventCard?.id as string}
          />
        </motion.div>

        {/* Check in label */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.2, ease: EASE }}
          className="flex flex-col items-center gap-1"
        >
          <p className="text-white/60 text-sm font-medium tracking-[-0.1px]">
            Check in with host
          </p>
          <p className="text-white/20 text-xs tracking-[-0.1px]">
            Show this at the door
          </p>
        </motion.div>
      </motion.section>

      {/* Divider */}
      <motion.div
        initial={{ opacity: 0, scaleX: 0 }}
        animate={{ opacity: 1, scaleX: 1 }}
        transition={{ duration: 0.5, delay: 0.15, ease: EASE }}
        className="origin-left"
        style={{
          height: 1,
          background:
            "linear-gradient(90deg, rgba(255,255,255,0.07) 0%, transparent 80%)",
        }}
      />

      {/* Map */}
      {hasLocation && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1, ease: EASE }}
          className="w-1/2 mx-auto relative" // remove overflow-hidden
          style={{
            borderRadius: 16,
          }}
        >
          {/* Map with its own opacity */}
          <div
            className="w-full h-125 overflow-hidden relative"
            style={{
              borderRadius: 16,
              border: "1px solid rgba(255,255,255,0.07)",
              boxShadow: "0 24px 60px rgba(0,0,0,0.5)",
              opacity: 0.88,
            }}
          >
            <MapBoxGl
              center={[lng, lat]}
              zoom={14}
              dragPan={false}
              scrollZoom={false}
              dragRotate={false}
            />
            <div
              className="absolute inset-0 pointer-events-none rounded-md"
              style={{ boxShadow: "inset 0 0 60px rgba(0,0,0,0.4)" }}
            />
          </div>

          {/* Directions button outside overflow-hidden */}
          <motion.a
            href={`https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`}
            target="_blank"
            rel="noreferrer"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.3, ease: EASE }}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 px-4 py-2 rounded-full cursor-pointer"
            style={{
              background: "rgba(10,10,10,0.85)",
              border: "1px solid rgba(255,255,255,0.12)",
              backdropFilter: "blur(16px)",
              boxShadow: "0 4px 20px rgba(0,0,0,0.4)",
            }}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
              <path
                d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"
                fill="rgba(255,255,255,0.6)"
              />
            </svg>
            <span className="text-[11px] text-white/60 tracking-[-0.1px] whitespace-nowrap">
              Get directions
            </span>
          </motion.a>
        </motion.div>
      )}

      {/* Attendees */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.12, ease: EASE }}
      >
        <AttendeeDetails activeEvent={activeModal} />
      </motion.div>

      {/* Tonight's Signals */}
      {/* <motion.section
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, delay: 0.15, ease: EASE }}
        className="flex flex-col gap-8 w-full"
      >
        <div
          className="flex flex-col gap-1 pb-5"
          style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}
        >
          <p className="text-white/20 text-[10px] tracking-widest uppercase font-medium">
            Host
          </p>
          <h2
            className="text-white font-semibold tracking-[-0.5px]"
            style={{ fontSize: 26 }}
          >
            Tonight's Signals
          </h2>
          <p className="text-white/35 text-sm tracking-[-0.1px] mt-0.5">
            Real-time notes from your host. Curated for those present.
          </p>
        </div>

        <div className="flex flex-col gap-3">
          <AnimatePresence>
            {hostMessages.map((msg, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: i * 0.07, ease: EASE }}
              >
                <HostMessage hostMessage={msg.text} hostTime={msg.time} />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </motion.section> */}
    </div>
  );
}
