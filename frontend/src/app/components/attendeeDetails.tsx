import React from "react";
import { motion } from "motion/react";
import Vibe from "./vibe";

interface ActiveEventProp {
  activeEvent: "prequel" | "live" | "end";
}

const EASE = [0.16, 1, 0.3, 1] as const;

const statusLabel = {
  prequel: "attending",
  live: "on the floor",
  end: "attended",
};

const statusColor = {
  prequel: "rgba(255,255,255,0.35)",
  live: "#4ade80",
  end: "rgba(255,255,255,0.2)",
};

function AttendeeDetails({ activeEvent }: ActiveEventProp) {
  const isLive = activeEvent === "live";

  return (
    <section className="w-full py-16 flex flex-col items-center gap-10">
      {/* Spots left — prequel only */}
      {activeEvent === "prequel" && (
        <motion.div
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: EASE }}
          className="flex items-center gap-2 px-4 py-2 rounded-full"
          style={{
            background: "rgba(255,255,255,0.05)",
            border: "1px solid rgba(255,255,255,0.08)",
          }}
        >
          <span
            className="w-1.5 h-1.5 rounded-full"
            style={{ background: "rgba(255,200,100,0.8)" }}
          />
          <p className="text-white/50 text-sm tracking-[-0.1px]">
            Only <span className="text-white font-semibold text-sm">12</span>{" "}
            spots remaining
          </p>
        </motion.div>
      )}

      {/* Count + label */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, delay: 0.05, ease: EASE }}
        className="flex flex-col items-center gap-3"
      >
        {/* Big number */}
        <div className="flex items-end gap-5">
          <span
            className="text-white font-semibold leading-none"
            style={{ fontSize: 80, letterSpacing: "-4px" }}
          >
            200
          </span>

          {/* Avatar stack + label */}
          <div className="flex flex-col gap-2 pb-2">
            <div className="flex">
              {Array.from({ length: 5 }).map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -6 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{
                    duration: 0.3,
                    delay: 0.1 + i * 0.05,
                    ease: EASE,
                  }}
                  className="w-7 h-7 rounded-full"
                  style={{
                    background: `rgba(255,255,255,${0.08 + i * 0.04})`,
                    border: "1.5px solid rgba(17,17,17,0.9)",
                    marginLeft: i === 0 ? 0 : -10,
                    boxShadow: "0 2px 6px rgba(0,0,0,0.4)",
                  }}
                />
              ))}
            </div>

            {/* Status label */}
            <div className="flex items-center gap-1.5">
              {isLive && (
                <motion.span
                  animate={{ opacity: [1, 0.3, 1] }}
                  transition={{
                    duration: 1.6,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="w-1.5 h-1.5 rounded-full"
                  style={{ background: "#4ade80" }}
                />
              )}
              <p
                className="text-sm font-medium tracking-[-0.1px]"
                style={{ color: statusColor[activeEvent] }}
              >
                {statusLabel[activeEvent]}
              </p>
            </div>
          </div>
        </div>

        {/* Thin divider */}
        <motion.div
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{ scaleX: 1, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2, ease: EASE }}
          className="w-16 origin-left"
          style={{
            height: 1,
            background: "rgba(255,255,255,0.08)",
          }}
        />
      </motion.div>

      {/* Vibe chips */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.18, ease: EASE }}
        className="mx-auto"
      >
        <Vibe />
      </motion.div>
    </section>
  );
}

export default AttendeeDetails;
