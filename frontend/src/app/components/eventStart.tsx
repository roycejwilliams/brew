import React from "react";
import { motion } from "motion/react";
import AttendeeDetails from "./attendeeDetails";
import Transfer from "./Transfer";
import EventFAQ from "./eventFAQ";
import { Map } from "./map";

interface EventStartProp {
  activeModal: "prequel";
}

const EASE = [0.16, 1, 0.3, 1] as const;

const stagger = (i: number, base = 0) => ({
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4, delay: base + i * 0.06, ease: EASE },
});

export default function EventStart({ activeModal }: EventStartProp) {
  const details = [
    {
      principle:
        "Craft nights rooted in effortless style, intentional design, and shared human connection.",
      expect:
        "A thoughtfully curated environment designed to feel exclusive without being pretentious.",
    },
    {
      principle:
        "Create intimate atmospheres where conversations feel natural, elevated, and unforgettable.",
      expect:
        "Signature cocktails, refined bites, and ambient music that complement—not overpower—the night.",
    },
    {
      principle:
        "Blend curated soundscapes, modern aesthetics, and subtle storytelling to shape the mood.",
      expect:
        "Moments crafted for authenticity, reflection, and connection with people who value creativity.",
    },
    {
      principle:
        "Host invite-only gatherings in venues chosen for their warmth, texture, and creative character.",
      expect: "A space where elegance, taste, and community quietly intersect.",
    },
    {
      principle:
        "Prioritize genuine presence — fewer people, deeper moments, richer energy.",
      expect:
        "A gathering that feels intentional, intimate, and grounded in meaningful energy.",
    },
  ];

  return (
    <div className="flex flex-col gap-y-24">
      {/* Principles + Expectations */}
      <section className="w-full grid grid-cols-1 xl:grid-cols-2 gap-16 py-16">
        {/* LEFT — Principles */}
        <div className="flex flex-col gap-6">
          <motion.div
            {...stagger(0)}
            className="flex flex-col gap-2 pb-5"
            style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}
          >
            <p className="text-white/20 text-[10px] tracking-widest uppercase font-medium">
              Philosophy
            </p>
            <h2 className="text-white text-base font-medium tracking-[-0.3px]">
              Event Principles
            </h2>
          </motion.div>

          <ul className="flex flex-col gap-4">
            {details.map((d, i) => (
              <motion.li
                key={i}
                {...stagger(i, 0.05)}
                className="flex gap-3 items-start"
              >
                <span
                  className="mt-1.25 shrink-0 w-1 h-1 rounded-full"
                  style={{ background: "rgba(255,255,255,0.2)" }}
                />
                <p className="text-white/50 text-sm tracking-[-0.1px] leading-relaxed">
                  {d.principle}
                </p>
              </motion.li>
            ))}
          </ul>
        </div>

        {/* RIGHT — Expectations */}
        <div className="flex flex-col gap-6 xl:mt-20">
          <motion.div
            {...stagger(0, 0.1)}
            className="flex flex-col gap-2 pb-5"
            style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}
          >
            <p className="text-white/20 text-[10px] tracking-widest uppercase font-medium">
              Experience
            </p>
            <h2 className="text-white text-base font-medium tracking-[-0.3px]">
              What Guests Can Expect
            </h2>
          </motion.div>

          <ul className="flex flex-col gap-4">
            {details.map((d, i) => (
              <motion.li
                key={i}
                {...stagger(i, 0.12)}
                className="flex gap-3 items-start"
              >
                <span
                  className="mt-1.25 shrink-0 w-1 h-1 rounded-full"
                  style={{ background: "rgba(255,255,255,0.2)" }}
                />
                <p className="text-white/50 text-sm tracking-[-0.1px] leading-relaxed">
                  {d.expect}
                </p>
              </motion.li>
            ))}
          </ul>
        </div>
      </section>

      {/* Divider */}
      <motion.div
        initial={{ opacity: 0, scaleX: 0 }}
        animate={{ opacity: 1, scaleX: 1 }}
        transition={{ duration: 0.6, ease: EASE }}
        className="origin-left"
        style={{
          height: 1,
          background:
            "linear-gradient(90deg, rgba(255,255,255,0.07) 0%, transparent 80%)",
          marginTop: -16,
        }}
      />

      {/* Map */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1, ease: EASE }}
        className="w-full relative overflow-hidden"
        style={{
          height: "400px",
          borderRadius: 16,
          border: "1px solid rgba(255,255,255,0.07)",
          boxShadow: "0 24px 60px rgba(0,0,0,0.5)",
          opacity: 0.88,
        }}
      >
        <Map center={[-122.42285, 37.73393]} zoom={11} dragPan={false} />

        {/* Map vignette */}
        <div
          className="absolute inset-0 pointer-events-none rounded-md"
          style={{
            boxShadow: "inset 0 0 60px rgba(0,0,0,0.4)",
          }}
        />
      </motion.div>

      {/* Attendees & Tags */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.15, ease: EASE }}
      >
        <AttendeeDetails activeEvent={activeModal} />
      </motion.div>

      {/* QR Code & Transfer */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2, ease: EASE }}
      >
        <Transfer />
      </motion.div>

      {/* FAQ */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.25, ease: EASE }}
      >
        <EventFAQ />
      </motion.div>
    </div>
  );
}
