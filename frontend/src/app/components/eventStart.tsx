import React from "react";
import AttendeeDetails from "./attendeeDetails";
import Transfer from "./Transfer";
import EventFAQ from "./eventFAQ";
import { Map } from "./map";

interface EventStartProp {
  activeModal: "prequel";
}

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
    <>
      {/* More Details */}
      <section className="w-full grid grid-cols-1 xl:grid-cols-2 gap-24 py-24 min-h-[85vh]">
        {/* LEFT COLUMN */}
        <div className="flex flex-col space-y-6 text-white/75">
          <div className="pb-4 border-b">
            <h2 className="text-lg font-medium ">Event Principles</h2>
          </div>

          <ul className="list-disc pl-6 space-y-4 text-sm ">
            {details.map((prin, index) => (
              <li key={index}>{prin.principle}</li>
            ))}
          </ul>
        </div>

        {/* RIGHT COLUMN */}
        <div className="flex flex-col justify-end space-y-6 text-white/75  mt-80">
          <div className="pb-4 border-b">
            <h2 className="text-lg font-medium ">What Guests Can Expect</h2>
          </div>

          <ul className="list-disc pl-6 space-y-4 text-sm ">
            {details.map((guest, index) => (
              <li key={index}>{guest.expect}</li>
            ))}
          </ul>
        </div>
      </section>

      {/* Map */}
      <div className="w-full h-2/3 relative my-8 overflow-hidden inset-0  rounded-lg shadow-lg opacity-85">
        <Map center={[-122.42285, 37.73393]} zoom={11} />
      </div>
      {/* Attendees & Tags */}
      <AttendeeDetails activeEvent={activeModal} />
      {/* QR Code & Transfer Options */}
      <Transfer />
      {/* Event FAQ */}
      <EventFAQ />
    </>
  );
}
