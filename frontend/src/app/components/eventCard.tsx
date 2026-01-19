"use client";
import { openEventCard } from "@/stores/store";
import React, { useRef, useState } from "react";
import { useOutsideAlerter } from "../utils/outsideAlert";
import { AnimatePresence, motion } from "motion/react";
import Image from "next/image";
import EventStart from "./eventStart";
import EventLive from "./eventLive";
import EventEnd from "./eventEnd";
import { CloseIcon } from "./icons";

function EventCard() {
  const ref = useRef<HTMLDivElement | null>(null);
  const closeEventCard = openEventCard((state) => state.closeEvent);
  const scrollY = openEventCard((state) => state.scrollY);
  useOutsideAlerter(ref, closeEventCard);

  const [activeEvent, setActive] = useState<"prequel" | "live" | "end">("live");

  return (
    <motion.main
      ref={ref}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{ top: scrollY }}
      className={`absolute backdrop-blur-3xl left-0 h-screen w-full overflow-y-scroll z-50`}
    >
      <motion.section className="sticky h-screen top-0 left-0 w-full ">
        <Image
          src="/image-test-brew.jpg"
          alt=""
          fill
          className="relative   brightness-50 blur-xl object-cover"
        />
      </motion.section>
      <motion.section className="absolute h-screen left-0 top-0 inset-0 w-full z-10  px-24">
        <button
          onClick={closeEventCard}
          className="fixed top-0 right-0 m-4 cursor-pointer z-50"
        >
          <CloseIcon color="#fff" size={20} />
        </button>
        {/* Start Up Details */}
        <section className="w-full grid grid-cols-1 xl:grid-cols-2 gap-12 py-24 min-h-[85vh]">
          {/* LEFT COLUMN — Bottom-aligned Big Title */}
          <div className="flex flex-col justify-end mt-8">
            <h1 className="text-7xl xl:text-9xl font-semibold leading-tight text-white">
              Lorem <br /> Ipsum
            </h1>
          </div>

          {/* RIGHT COLUMN — Top-aligned Event Details */}
          <div className="flex flex-col justify-start space-y-8 text-white/90">
            {/* Small Title */}
            <h1 className="text-xl font-light">Lorem Ipsum</h1>

            {/* Date */}
            <h3 className="text-3xl font-medium">Sat, Oct 25</h3>

            {/* Times */}
            <div className="flex justify-between w-full">
              <div className="flex flex-col gap-y-2">
                <span className="text-xl">Opening</span>
                <span className="text-3xl font-medium">8:00 pm</span>
              </div>

              <div className="flex flex-col gap-y-2">
                <span className="text-xl">Close</span>
                <span className="text-3xl font-medium">1:00 am</span>
              </div>
            </div>

            {/* Description */}
            <p className="text-lg max-w-xl">
              Curabitur tempor quis eros tempus lacinia. Nam bibendum
              pellentesque quam a convallis. Sed ut vulputate nisi. Integer in
              felis sed leo vestibulum venenatis. Suspendisse quis arcu sem.
              Aenean.
            </p>

            {/* Mini Card */}
            <div className="w-full max-w-xs  h-80 relative rounded-lg  ml-auto overflow-hidden">
              <Image
                src="/image-test-brew.jpg"
                alt=""
                fill
                className="relative inset-0  brightness-50  object-contain shadow-xl shadow-[#19535F]"
              />{" "}
            </div>
          </div>
        </section>

        <AnimatePresence mode="popLayout">
          {activeEvent === "prequel" && <EventStart activeModal="prequel" />}
          {activeEvent === "live" && <EventLive activeModal="live" />}
          {activeEvent === "end" && <EventEnd activeModal="end" />}
        </AnimatePresence>
      </motion.section>
    </motion.main>
  );
}

export default EventCard;
