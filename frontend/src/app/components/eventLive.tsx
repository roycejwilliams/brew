import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import CanvasQRcode from "./canvasQRcode";
import AttendeeDetails from "./attendeeDetails";
import HostMessage from "./hostMessage";
import { Map } from "./map";

interface EventLiveProp {
  activeModal: "live";
}

type HostMessageItem = {
  text: string;
  time: string;
};

const EASE = [0.16, 1, 0.3, 1] as const;

export default function EventLive({ activeModal }: EventLiveProp) {
  const [hostMessages, setHostMessages] = useState<HostMessageItem[]>([]);

  useEffect(() => {
    const dummyData: HostMessageItem[] = [
      {
        text: "We're opening the first pour now. Take your time settling into the space — the room is filling with a steady energy, and the music is beginning to shape the atmosphere. Feel free to make your way to the bar when you're ready. Tonight is meant to unfold slowly and intentionally; we'll guide you through each moment as the experience builds.",
        time: "8:17 PM",
      },
      {
        text: "If you've just arrived, you can check in at the bar when you're ready. There's no rush — move at your own pace, the night is designed to breathe.",
        time: "8:36 PM",
      },
    ];
    setHostMessages(dummyData.reverse());
  }, []);

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
        {/* Pulsing rings */}
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
          <CanvasQRcode qrWidth={240} />
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
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1, ease: EASE }}
        className="w-1/2 h-125 mx-auto relative overflow-hidden"
        style={{
          borderRadius: 16,
          border: "1px solid rgba(255,255,255,0.07)",
          boxShadow: "0 24px 60px rgba(0,0,0,0.5)",
          opacity: 0.88,
        }}
      >
        <Map
          center={[-122.42285, 37.73393]}
          zoom={11}
          dragPan={false}
          scrollZoom={false}
          doubleClickZoom={false}
          touchZoomRotate={false}
        />

        {/* Map vignette */}
        <div
          className="absolute inset-0 pointer-events-none rounded-md"
          style={{
            boxShadow: "inset 0 0 60px rgba(0,0,0,0.4)",
          }}
        />
      </motion.div>

      {/* Attendees */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.12, ease: EASE }}
      >
        <AttendeeDetails activeEvent={activeModal} />
      </motion.div>

      {/* Tonight's Signals */}
      <motion.section
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, delay: 0.15, ease: EASE }}
        className="flex flex-col gap-8 w-full"
      >
        {/* Header */}
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

        {/* Messages */}
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
      </motion.section>
    </div>
  );
}
