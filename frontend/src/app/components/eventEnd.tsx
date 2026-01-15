import React from "react";
import AttendeeDetails from "./attendeeDetails";
import EventRecap from "./eventRecap";
import NightCap from "./nightCap";

interface EventLiveProp {
  activeModal: "end";
}

export default function EventEnd({ activeModal }: EventLiveProp) {
  return (
    <>
      <div className="py-4 flex items-center gap-x-2 border-b w-1/3">
        <div className="w-6 h-6  animation-pulse shadow-2xl border-2 border-red-600 rounded-full flex justify-center items-center">
          <div className="w-4 h-4  animation-pulse shadow-2xl border-2 border-red-600 rounded-full flex justify-center items-center">
            <div className="w-2 h-2  animation-pulse shadow-2xl border-2 border-red-600 rounded-full"></div>
          </div>
        </div>
        <h2 className="text-lg ">Event Ended</h2>
      </div>
      <div className="py-24">
        <h2 className="text-right ml-auto text-8xl max-w-md">
          Rewind the night
        </h2>
        <p className="mt-4 ml-auto text-right text-lg text-white/75">
          Relive the energy. Share your moments.
        </p>
      </div>
      {/* Detail numbers */}
      <AttendeeDetails activeEvent={activeModal} />
      {/* Photo Recap Grid */}
      <EventRecap />
      {/* Night Cap Comments */}
      <NightCap />
    </>
  );
}
