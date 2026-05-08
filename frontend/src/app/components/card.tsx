import { openEventCard } from "@/stores/store";
import { motion } from "motion/react";
import React from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

interface CardProp {
  width: number;
  height: number;
  moment: MomentProp;
  momentId: string | null;
}

const EASE = [0.16, 1, 0.3, 1] as const;

function Card({ width, height, moment }: CardProp) {
  const openMoment = openEventCard((state) => state.openEvent);
  const router = useRouter();

  return (
    <motion.div
      onClick={() => {
        openMoment(moment);
        router.push(`/moments/${moment.id}`, { scroll: false });
      }}
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
      {/* Background */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, transparent 30%, rgba(0,0,0,0.7) 60%, rgba(0,0,0,0.95) 100%)",
        }}
      />
      {/* Grain */}
      {/* Inner glow on hover */}
      <motion.div
        className="absolute inset-0 rounded-xl pointer-events-none"
        variants={{
          rest: { opacity: 0 },
          hover: { opacity: 1 },
        }}
        transition={{ duration: 0.3, ease: EASE }}
        style={{ boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.1)" }}
      />
      {/* Scrim */}
      {/* Background */}
      {moment?.image ? (
        <>
          <Image
            src={moment.image}
            alt=""
            fill
            className="object-cover"
            style={{ filter: "brightness(0.4) saturate(1.2)" }}
            priority
          />
        </>
      ) : (
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(160deg, rgba(40,38,36,1) 0%, rgba(20,18,16,1) 100%)",
          }}
        />
      )}

      {/* Border */}
      <div
        className="absolute inset-0 rounded-xl pointer-events-none"
        style={{ border: "1px solid rgba(255,255,255,0.07)" }}
      />
      {/* Top — tag + attendees */}
      <div className="relative z-10 p-3.5 flex items-start justify-between">
        <span
          className="text-[9px] font-medium tracking-[2px] uppercase text-white/45 px-2.5 py-1 rounded-full"
          style={{
            background: "rgba(255,255,255,0.06)",
            border: "1px solid rgba(255,255,255,0.08)",
          }}
        >
          {moment?.visibility_type || "Moment"}
        </span>

        <div className="flex items-center gap-1.5">
          <div className="flex">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="w-4.5 h-4.5 rounded-full"
                style={{
                  background: `rgba(255,255,255,${0.12 + i * 0.04})`,
                  border: "1.5px solid rgba(17,17,17,0.8)",
                  marginLeft: i === 0 ? 0 : -6,
                }}
              />
            ))}
          </div>
          <span className="text-white/30 text-[14px]">
            {moment?.cap_attendance || 0}
          </span>
        </div>
      </div>
      {/* Bottom — event info */}
      <div className="relative z-10 px-3.5 pb-4 flex flex-col gap-2.5">
        {/* Divider */}
        <div
          className="w-full h-px"
          style={{ background: "rgba(255,255,255,0.08)" }}
        />

        {/* Title */}
        <h3
          className="text-white/90 font-medium leading-tight truncate"
          style={{ fontSize: 17, letterSpacing: "-0.4px" }}
        >
          {moment?.moments_name}
        </h3>

        {/* Meta */}
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center gap-1.5">
            <span className="text-[9px] tracking-[2px] uppercase text-white/20 w-9">
              When
            </span>
            <div className="w-1 h-1 rounded-full bg-white/15" />
            <span className="text-[11px] text-white/50">
              {moment?.moment_start
                ? new Date(moment.moment_start).toLocaleDateString("en-US", {
                    weekday: "short",
                    month: "short",
                    day: "numeric",
                  }) +
                  " · " +
                  new Date(moment.moment_start).toLocaleTimeString("en-US", {
                    hour: "numeric",
                    hour12: true,
                  })
                : "Date TBD"}
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-[9px] tracking-[2px] uppercase text-white/20 w-9">
              Where
            </span>
            <div className="w-1 h-1 rounded-full bg-white/15" />
            <span className="text-[11px] text-white/50">
              {moment?.location_name || "Location TBD"}
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default Card;
