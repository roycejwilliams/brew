"use client";
import Image from "next/image";
import { motion } from "motion/react";

const EASE = [0.16, 1, 0.3, 1] as const;

const stagger = (i: number) => ({
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  transition: { duration: 0.35, delay: i * 0.07, ease: EASE },
});

interface EventHeroProp {
  eventCard: MomentProp | null;
}

export default function EventHero({ eventCard }: EventHeroProp) {
  return (
    <section className="w-full grid grid-cols-1 xl:grid-cols-2 gap-8 py-12 sm:py-16 items-end">
      {/* LEFT — title + description */}
      <motion.div
        {...stagger(0)}
        className="flex flex-col justify-end gap-3 sm:gap-4 h-full"
      >
        {/* Eyebrow */}
        <p
          className="text-[10px] tracking-widest uppercase font-medium"
          style={{ color: "rgba(255,255,255,0.2)" }}
        >
          Tonight&apos;s Event
        </p>

        {/* Title — clamp scales down gracefully on mobile */}
        <div className="flex flex-col gap-1">
          {eventCard?.moments_name.split("\n").map((text, index) => (
            <h1
              key={index}
              className="text-white font-semibold leading-none"
              style={{
                fontSize: "clamp(36px, 8vw, 108px)",
                letterSpacing: "clamp(-1px, -0.04em, -4px)",
              }}
            >
              {text}
            </h1>
          ))}
        </div>

        {/* Description */}
        <p
          className="text-sm tracking-[-0.1px] leading-relaxed max-w-xs"
          style={{ color: "rgba(255,255,255,0.35)" }}
        >
          {eventCard?.description}
        </p>
      </motion.div>

      {/* RIGHT — image + date/time */}
      <div className="flex flex-col justify-between h-full gap-6 sm:gap-10">
        {/* Image card */}
        <motion.div
          {...stagger(1)}
          className="relative w-full overflow-hidden"
          style={{
            height: "clamp(220px, 40vw, 525px)",
            borderRadius: 16,
            border: "1px solid rgba(255,255,255,0.07)",
            boxShadow: "0 24px 60px rgba(0,0,0,0.5)",
          }}
        >
          <Image
            src={eventCard?.image || "/image-test-brew.jpg"}
            alt={eventCard?.moments_name as string}
            fill
            priority
            className="object-cover"
            style={{ filter: "brightness(0.65)" }}
          />
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "linear-gradient(180deg, transparent 40%, rgba(0,0,0,0.55) 100%)",
              borderRadius: 16,
            }}
          />
        </motion.div>

        {/* Date + times */}
        <motion.div {...stagger(2)} className="flex flex-col gap-4 sm:gap-6">
          {/* Date row */}
          <div
            className="flex items-center justify-between pb-4 sm:pb-5"
            style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}
          >
            <p
              className="text-[10px] tracking-widest uppercase font-medium"
              style={{ color: "rgba(255,255,255,0.2)" }}
            >
              Date
            </p>
            <p
              className="text-white font-medium tracking-[-0.5px]"
              style={{ fontSize: "clamp(16px, 4vw, 20px)" }}
            >
              {eventCard?.moment_start
                ? new Date(eventCard.moment_start).toLocaleDateString("en-US", {
                    weekday: "short",
                    month: "short",
                    day: "numeric",
                  })
                : "Date TBD"}
            </p>
          </div>

          {/* Time cards */}
          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            {[
              {
                label: "Opening",
                time: eventCard?.moment_start
                  ? new Date(eventCard.moment_start).toLocaleTimeString(
                      "en-US",
                      {
                        hour: "numeric",
                        minute: "2-digit",
                        hour12: true,
                      },
                    )
                  : "TBD",
              },
              {
                label: "Close",
                time: eventCard?.moment_end
                  ? new Date(eventCard.moment_end).toLocaleTimeString("en-US", {
                      hour: "numeric",
                      minute: "2-digit",
                      hour12: true,
                    })
                  : "TBD",
              },
            ].map(({ label, time }, i) => (
              <motion.div
                key={label}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{
                  duration: 0.3,
                  delay: 0.25 + i * 0.07,
                  ease: EASE,
                }}
                className="flex flex-col gap-1 px-3 sm:px-4 py-3 rounded-xl"
                style={{
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(255,255,255,0.06)",
                }}
              >
                <span
                  className="text-[10px] tracking-widest uppercase font-medium"
                  style={{ color: "rgba(255,255,255,0.25)" }}
                >
                  {label}
                </span>
                <span
                  className="text-white font-semibold tracking-[-0.5px]"
                  style={{ fontSize: "clamp(16px, 4vw, 22px)" }}
                >
                  {time}
                </span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
