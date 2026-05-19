"use client";
import React from "react";
import { motion } from "motion/react";
import CanvasQRcode from "./canvasQRcode";
import AttendeeDetails from "./attendeeDetails";
import MapBoxGl from "./mapBoxGl";

interface EventLiveProp {
  activeModal: "live";
  eventCard: MomentProp | null;
}

const EASE = [0.16, 1, 0.3, 1] as const;

export default function EventLive({ activeModal, eventCard }: EventLiveProp) {
  if (!eventCard) return null;

  const lng = (eventCard?.location as unknown as { x: number; y: number })?.x;
  const lat = (eventCard?.location as unknown as { x: number; y: number })?.y;
  const hasLocation = lng != null && lat != null;

  return (
    <div className="flex flex-col gap-16 sm:gap-20 pb-8">
      {/* Live indicator */}
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
        <span
          className="text-sm font-medium tracking-[-0.1px]"
          style={{ color: "rgba(255,255,255,0.6)" }}
        >
          Live Now
        </span>
      </motion.div>

      {/* QR hero */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.35, delay: 0.05, ease: EASE }}
        className="flex flex-col items-center gap-6 sm:gap-8 text-center"
      >
        <div className="flex flex-col items-center gap-2">
          <h2
            className="text-white font-semibold leading-tight"
            style={{
              fontSize: "clamp(36px, 8vw, 52px)",
              letterSpacing: "-2px",
            }}
          >
            Let&apos;s Party
          </h2>
          <p
            className="text-base tracking-[-0.1px]"
            style={{ color: "rgba(255,255,255,0.35)" }}
          >
            Time to Brew
          </p>
        </div>

        {/* QR code */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.1, ease: EASE }}
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

        {/* Check-in label */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.15, ease: EASE }}
          className="flex flex-col items-center gap-1"
        >
          <p
            className="text-sm font-medium tracking-[-0.1px]"
            style={{ color: "rgba(255,255,255,0.6)" }}
          >
            Check in with host
          </p>
          <p
            className="text-xs tracking-[-0.1px]"
            style={{ color: "rgba(255,255,255,0.2)" }}
          >
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
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.1, ease: EASE }}
          className="w-full sm:w-3/4 lg:w-1/2 mx-auto relative"
          style={{ borderRadius: 16 }}
        >
          <div
            className="w-full overflow-hidden relative"
            style={{
              height: "clamp(240px, 40vw, 500px)",
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
              className="absolute inset-0 pointer-events-none rounded-2xl"
              style={{ boxShadow: "inset 0 0 60px rgba(0,0,0,0.4)" }}
            />
          </div>

          {/* Directions button */}
          <motion.a
            href={`https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`}
            target="_blank"
            rel="noreferrer"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.35, duration: 0.25, ease: EASE }}
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
            <span
              className="text-[11px] tracking-[-0.1px] whitespace-nowrap"
              style={{ color: "rgba(255,255,255,0.6)" }}
            >
              Get directions
            </span>
          </motion.a>
        </motion.div>
      )}

      {/* Attendees */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.35, delay: 0.12, ease: EASE }}
      >
        <AttendeeDetails activeEvent={activeModal} />
      </motion.div>
    </div>
  );
}
