import Image from "next/image";
import { motion } from "motion/react";
import { openEventCard } from "@/stores/store";

const EASE = [0.16, 1, 0.3, 1] as const;

const stagger = (i: number) => ({
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.45, delay: i * 0.07, ease: EASE },
});

interface EventHeroProp {
  eventCard: MomentProp | null;
}

export default function EventHero({ eventCard }: EventHeroProp) {
  return (
    <section className="w-full grid grid-cols-1 xl:grid-cols-2 gap-8 py-16 items-end">
      {/* LEFT — Big title pinned to bottom */}
      <motion.div
        {...stagger(0)}
        className="flex flex-col justify-end gap-4 h-full"
      >
        {/* Eyebrow */}
        <p className="text-white/20 text-[10px] tracking-widest uppercase font-medium">
          Tonight's Event
        </p>

        {eventCard?.moments_name.split("\n").map((text, index) => (
          <h1
            key={index}
            className="text-white font-semibold leading-none"
            style={{
              fontSize: "clamp(64px, 10vw, 108px)",
              letterSpacing: "-4px",
            }}
          >
            <span>{text}</span>
          </h1>
        ))}

        {/* Subtitle */}
        <p className="text-white/35 text-sm tracking-[-0.1px] max-w-xs leading-relaxed">
          {eventCard?.description}
        </p>
      </motion.div>

      {/* RIGHT — Details stacked top */}
      <div className="flex flex-col justify-between h-full gap-10">
        {/* Image card */}
        <motion.div
          {...stagger(1)}
          className="relative w-full overflow-hidden"
          style={{
            height: 525,
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
          {/* Inner vignette */}
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
        <motion.div {...stagger(2)} className="flex flex-col gap-6">
          {/* Date row */}
          <div
            className="flex items-center justify-between pb-5"
            style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}
          >
            <p className="text-white/20 text-[10px] tracking-widest uppercase font-medium">
              Date
            </p>
            <p
              className="text-white font-medium tracking-[-0.5px]"
              style={{ fontSize: 20 }}
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

          {/* Time row */}
          <div className="grid grid-cols-2 gap-4">
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
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.35,
                  delay: 0.25 + i * 0.07,
                  ease: EASE,
                }}
                className="flex flex-col gap-1 px-4 py-3 rounded-xl"
                style={{
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(255,255,255,0.06)",
                }}
              >
                <span className="text-white/25 text-[10px] tracking-widest uppercase font-medium">
                  {label}
                </span>
                <span
                  className="text-white font-semibold tracking-[-0.5px]"
                  style={{ fontSize: 22 }}
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
