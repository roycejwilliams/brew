import { openEventCard } from "@/stores/store";
import { motion } from "motion/react";
import React from "react";

interface CardProp {
  width: number;
  height: number;
  id: string;
}

const EASE = [0.16, 1, 0.3, 1] as const;

// Mock data — replace with real data from store/props
const MOCK = {
  title: "Late Night Session",
  location: "Silver Lake, LA",
  date: "Fri, Jan 24",
  time: "10 PM",
  attendees: 12,
  tag: "Circle",
};

function Card({ width, height, id }: CardProp) {
  const openCard = openEventCard((state) => state.openEvent);

  return (
    <motion.div
      onClick={() => openCard(id)}
      whileHover="hover"
      whileTap={{ scale: 0.98 }}
      initial="rest"
      animate="rest"
      style={{ width, height }}
      className="relative cursor-pointer overflow-hidden rounded-xl flex flex-col justify-between"
      variants={{
        rest: { scale: 1 },
        hover: { scale: 1.025 },
      }}
      transition={{ duration: 0.3, ease: EASE }}
    >
      {/* Background — image placeholder with gradient */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(160deg, rgba(40,38,36,1) 0%, rgba(20,18,16,1) 100%)",
        }}
      />

      {/* Subtle texture grain */}
      <motion.div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E\")",
          backgroundSize: "120px",
        }}
      />

      {/* Inner glow on hover */}
      <motion.div
        className="absolute inset-0 rounded-xl pointer-events-none"
        variants={{
          rest: { opacity: 0 },
          hover: { opacity: 1 },
        }}
        transition={{ duration: 0.3, ease: EASE }}
        style={{
          boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.1)",
        }}
      />

      {/* Bottom scrim */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, transparent 30%, rgba(0,0,0,0.75) 100%)",
        }}
      />

      {/* Border */}
      <div
        className="absolute inset-0 rounded-xl pointer-events-none"
        style={{ border: "1px solid rgba(255,255,255,0.08)" }}
      />

      {/* Top — tag */}
      <div className="relative z-10 p-4 flex items-start justify-between">
        <span
          className="text-white/50 text-[10px] font-medium tracking-widest uppercase px-2.5 py-1 rounded-full"
          style={{
            background: "rgba(255,255,255,0.07)",
            border: "1px solid rgba(255,255,255,0.08)",
          }}
        >
          {MOCK.tag}
        </span>

        {/* Attendee count */}
        <div className="flex items-center gap-1.5">
          <div className="flex">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="w-4 h-4 rounded-full"
                style={{
                  background: `rgba(255,255,255,${0.12 + i * 0.06})`,
                  border: "1.5px solid rgba(17,17,17,0.8)",
                  marginLeft: i === 0 ? 0 : -5,
                }}
              />
            ))}
          </div>
          <span className="text-white/35 text-[10px] tracking-[-0.1px]">
            {MOCK.attendees}
          </span>
        </div>
      </div>

      {/* Bottom — event info */}
      <div className="relative z-10 p-4 flex flex-col gap-1">
        <h3
          className="text-white font-semibold leading-tight"
          style={{ fontSize: 15, letterSpacing: "-0.3px" }}
        >
          {MOCK.title}
        </h3>

        <div className="flex items-center justify-between mt-1">
          <div className="flex items-center gap-1 text-white/35 text-xs tracking-[-0.1px]">
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
              <path
                d="M5 1C3.34 1 2 2.34 2 4c0 2.25 3 5 3 5s3-2.75 3-5c0-1.66-1.34-3-3-3zm0 4a1 1 0 110-2 1 1 0 010 2z"
                fill="rgba(255,255,255,0.35)"
              />
            </svg>
            {MOCK.location}
          </div>
          <span className="text-white/25 text-[10px] tracking-[-0.1px]">
            {MOCK.date} · {MOCK.time}
          </span>
        </div>
      </div>
    </motion.div>
  );
}

export default Card;
