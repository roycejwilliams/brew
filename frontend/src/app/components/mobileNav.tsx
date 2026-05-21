"use client";
import { motion } from "motion/react";
import Link from "next/link";
import Image from "next/image";
import Asterisk from "./icons/AsterikIcon";

interface MobileNavProps {
  user: UserProp | null;
  onEventsPress: () => void;
  onCreatePress: () => void;
  eventsOpen: boolean;
}

export default function MobileNav({
  user,
  onEventsPress,
  onCreatePress,
  eventsOpen,
}: MobileNavProps) {
  return (
    <div className="fixed bottom-6.5 left-4 right-4">
      <div
        className="flex items-center justify-around px-6 pt-3 pb-3 rounded-2xl"
        style={{
          background: "rgba(8,8,8,0.96)",
          border: "1px solid rgba(255,255,255,0.08)",
          backdropFilter: "blur(24px)",
          boxShadow: "0 8px 32px rgba(0,0,0,0.5), 0 2px 8px rgba(0,0,0,0.3)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Top shimmer */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: 1,
            background:
              "linear-gradient(90deg, transparent, rgba(255,255,255,0.08), transparent)",
            pointerEvents: "none",
          }}
        />

        {/* Pulse */}
        <motion.button
          onClick={onEventsPress}
          whileTap={{ scale: 0.92 }}
          className="flex flex-col items-center gap-1.5 cursor-pointer"
        >
          <div
            className="w-9 h-9 rounded-md flex items-center justify-center transition-all duration-200"
            style={{
              background: eventsOpen
                ? "rgba(255,255,255,0.08)"
                : "rgba(255,255,255,0.04)",
              border: eventsOpen
                ? "1px solid rgba(255,255,255,0.14)"
                : "1px solid rgba(255,255,255,0.07)",
            }}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <circle
                cx="8"
                cy="8"
                r="2.5"
                fill={
                  eventsOpen
                    ? "rgba(255,255,255,0.9)"
                    : "rgba(255,255,255,0.45)"
                }
              />
              <circle
                cx="8"
                cy="8"
                r="5.5"
                stroke={
                  eventsOpen
                    ? "rgba(255,255,255,0.3)"
                    : "rgba(255,255,255,0.14)"
                }
                strokeWidth="1"
              />
            </svg>
          </div>
          <span
            className="text-[9px] tracking-[2px] uppercase font-medium transition-colors duration-200"
            style={{
              color: eventsOpen
                ? "rgba(255,255,255,0.75)"
                : "rgba(255,255,255,0.22)",
            }}
          >
            Pulse
          </span>
        </motion.button>

        {/* Create */}
        <motion.button
          onClick={onCreatePress}
          whileTap={{ scale: 0.92 }}
          className="flex flex-col items-center gap-1.5 cursor-pointer"
        >
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center"
            style={{
              background: "rgba(12,12,12,1)",
              border: "1px solid rgba(255,255,255,0.1)",
              boxShadow:
                "0 4px 20px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.07)",
            }}
          >
            <Asterisk size={20} color="rgba(255,255,255,0.82)" />
          </div>
        </motion.button>

        {/* Profile */}
        <Link href={`/profile/${user?.id}`}>
          <motion.div
            whileTap={{ scale: 0.92 }}
            className="flex flex-col items-center gap-1.5 cursor-pointer"
          >
            <div
              className="w-9 h-9 rounded-md  overflow-hidden relative"
              style={{
                border: "1px solid rgba(255,255,255,0.08)",
                boxShadow: "0 2px 8px rgba(0,0,0,0.3)",
              }}
            >
              <Image
                src={user?.profile_image || "/profile_4.png"}
                alt="profile"
                fill
                className="object-cover"
              />
            </div>
            <span
              className="text-[9px] tracking-[2px] uppercase font-medium"
              style={{ color: "rgba(255,255,255,0.22)" }}
            >
              Profile
            </span>
          </motion.div>
        </Link>
      </div>
    </div>
  );
}
