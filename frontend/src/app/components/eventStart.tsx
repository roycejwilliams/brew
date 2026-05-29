"use client";
import React from "react";
import { motion } from "motion/react";
import AttendeeDetails from "./attendeeDetails";
import Transfer from "./Transfer";
import EventFAQ from "./eventFAQ";
import MapBoxGl from "./mapBoxGl";

interface EventStartProp {
  activeModal: "prequel";
  eventCard: MomentProp | null;
}

const EASE = [0.16, 1, 0.3, 1] as const;

const stagger = (i: number, base = 0) => ({
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  transition: { duration: 0.35, delay: base + i * 0.06, ease: EASE },
});

export default function EventStart({ activeModal, eventCard }: EventStartProp) {
  const principles = eventCard?.principles || [];
  const expectations = eventCard?.expectations || [];
  const faqs = eventCard?.faqs || [];

  return (
    <div className="flex flex-col gap-16 sm:gap-24">
      {/* Principles + Expectations */}
      <section className="w-full grid grid-cols-1 xl:grid-cols-2 gap-10 sm:gap-16 py-10 sm:py-16">
        {/* Principles */}
        <div className="flex flex-col gap-6">
          <motion.div
            {...stagger(0)}
            className="flex flex-col gap-2 pb-4 sm:pb-5"
            style={{ borderBottom: "1px solid rgba(var(--fg),0.07)" }}
          >
            <p
              className="text-[10px] tracking-widest uppercase font-medium"
              style={{ color: "rgba(var(--fg),0.2)" }}
            >
              Philosophy
            </p>
            <h2 className="text-black dark:text-white text-base font-medium tracking-[-0.3px]">
              Event Principles
            </h2>
          </motion.div>

          <ul className="flex flex-col gap-4">
            {principles.map((principle, i) => (
              <motion.li
                key={i}
                {...stagger(i, 0.05)}
                className="flex gap-3 items-start"
              >
                <span
                  className="mt-1.5 shrink-0 w-1 h-1 rounded-full"
                  style={{ background: "rgba(var(--fg),0.2)" }}
                />
                <p
                  className="text-sm tracking-[-0.1px] leading-relaxed"
                  style={{ color: "rgba(var(--fg),0.5)" }}
                >
                  {principle}
                </p>
              </motion.li>
            ))}
          </ul>
        </div>

        {/* Expectations */}
        <div className="flex flex-col gap-6 xl:mt-20">
          <motion.div
            {...stagger(0, 0.1)}
            className="flex flex-col gap-2 pb-4 sm:pb-5"
            style={{ borderBottom: "1px solid rgba(var(--fg),0.07)" }}
          >
            <p
              className="text-[10px] tracking-widest uppercase font-medium"
              style={{ color: "rgba(var(--fg),0.2)" }}
            >
              Experience
            </p>
            <h2 className="text-black dark:text-white text-base font-medium tracking-[-0.3px]">
              What Guests Can Expect
            </h2>
          </motion.div>

          <ul className="flex flex-col gap-4">
            {expectations.map((expectation, i) => (
              <motion.li
                key={i}
                {...stagger(i, 0.12)}
                className="flex gap-3 items-start"
              >
                <span
                  className="mt-1.5 shrink-0 w-1 h-1 rounded-full"
                  style={{ background: "rgba(var(--fg),0.2)" }}
                />
                <p
                  className="text-sm tracking-[-0.1px] leading-relaxed"
                  style={{ color: "rgba(var(--fg),0.5)" }}
                >
                  {expectation}
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
        transition={{ duration: 0.5, ease: EASE }}
        className="origin-left -mt-8 sm:-mt-4"
        style={{
          height: 1,
          background:
            "linear-gradient(90deg, rgba(var(--fg),0.07) 0%, transparent 80%)",
        }}
      />

      {/* Map */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.1, ease: EASE }}
        className="w-full sm:w-3/4 lg:w-1/2 mx-auto relative overflow-hidden"
        style={{
          height: "clamp(240px, 40vw, 500px)",
          borderRadius: 16,
          border: "1px solid rgba(var(--fg),0.07)",
          boxShadow: "0 24px 60px rgba(var(--fg),0.15)",
          opacity: 0.88,
        }}
      >
        <MapBoxGl
          center={[
            (eventCard?.location as unknown as { x: number; y: number })?.x ??
              -122.4194,
            (eventCard?.location as unknown as { x: number; y: number })?.y ??
              37.7749,
          ]}
          zoom={11}
          scrollZoom={false}
          dragPan={false}
          dragRotate={false}
        />
        <div
          className="absolute inset-0 pointer-events-none rounded-2xl"
          style={{ boxShadow: "inset 0 0 60px rgba(var(--fg),0.12)" }}
        />
      </motion.div>

      {/* Attendees */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.35, delay: 0.15, ease: EASE }}
      >
        <AttendeeDetails activeEvent={activeModal} />
      </motion.div>

      {/* Transfer / Closed */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.35, delay: 0.2, ease: EASE }}
      >
        {eventCard?.close_moment ? (
          <div
            className="flex flex-col items-center justify-center py-10 gap-3"
            style={{
              border: "1px solid rgba(var(--fg),0.07)",
              borderRadius: 16,
            }}
          >
            <div
              className="w-1.5 h-1.5 rounded-full"
              style={{ background: "#761F17", opacity: 0.7 }}
            />
            <p
              className="text-sm tracking-[-0.1px]"
              style={{ color: "rgba(var(--fg),0.4)" }}
            >
              This moment is closed.
            </p>
            <p
              className="text-xs tracking-[-0.1px]"
              style={{ color: "rgba(var(--fg),0.2)" }}
            >
              No new check-ins or transfers.
            </p>
          </div>
        ) : (
          <Transfer />
        )}
      </motion.div>

      {/* FAQ */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.35, delay: 0.25, ease: EASE }}
        className="pb-10"
      >
        <EventFAQ faqs={faqs} />
      </motion.div>
    </div>
  );
}
