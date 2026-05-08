import React from "react";
import { motion } from "motion/react";
import AttendeeDetails from "./attendeeDetails";
import Transfer from "./Transfer";
import EventFAQ from "./eventFAQ";
import { openEventCard } from "@/stores/store";
import MapBoxGl from "./mapBoxGl";

interface EventStartProp {
  activeModal: "prequel";
  eventCard: MomentProp | null;
}

const EASE = [0.16, 1, 0.3, 1] as const;

const stagger = (i: number, base = 0) => ({
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4, delay: base + i * 0.06, ease: EASE },
});

export default function EventStart({ activeModal, eventCard }: EventStartProp) {
  const principles = eventCard?.principles || [];
  const expectations = eventCard?.expectations || [];
  const faqs = eventCard?.faqs || [];

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
            <ul className="flex flex-col gap-4">
              {principles?.map((principle, i) => (
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
                    {principle}
                  </p>
                </motion.li>
              ))}
            </ul>
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
            <ul className="flex flex-col gap-4">
              {expectations?.map((expectation, i) => (
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
                    {expectation}
                  </p>
                </motion.li>
              ))}
            </ul>
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
        className="w-1/2 h-125 mx-auto relative overflow-hidden"
        style={{
          borderRadius: 16,
          border: "1px solid rgba(255,255,255,0.07)",
          boxShadow: "0 24px 60px rgba(0,0,0,0.5)",
          opacity: 0.88,
        }}
      >
        <MapBoxGl
          center={[
            (eventCard?.location as any)?.x ?? -122.4194,
            (eventCard?.location as any)?.y ?? 37.7749,
          ]}
          zoom={11}
          scrollZoom={false}
          dragPan={false}
          dragRotate={false}
        />

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
        {/* QR Code & Transfer */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2, ease: EASE }}
        >
          {eventCard?.close_moment ? (
            <div
              className="flex flex-col items-center justify-center py-10 gap-3"
              style={{
                border: "1px solid rgba(255,255,255,0.07)",
                borderRadius: 16,
              }}
            >
              <div
                className="w-1.5 h-1.5 rounded-full"
                style={{ background: "#761F17", opacity: 0.7 }}
              />
              <p className="text-white/40 text-sm tracking-[-0.1px]">
                This moment is closed.
              </p>
              <p className="text-white/20 text-xs">
                No new check-ins or transfers.
              </p>
            </div>
          ) : (
            <Transfer />
          )}
        </motion.div>{" "}
      </motion.div>

      {/* FAQ */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.25, ease: EASE }}
      >
        <EventFAQ faqs={faqs || []} />{" "}
      </motion.div>
    </div>
  );
}
