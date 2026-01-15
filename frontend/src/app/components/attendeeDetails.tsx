import React from "react";
import Vibe from "./vibe";

interface ActiveEventProp {
  activeEvent: "prequel" | "live" | "end";
}

function AttendeeDetails({ activeEvent }: ActiveEventProp) {
  return (
    <section className="w-full py-24 flex justify-center items-center ">
      {/* Attendee Details */}
      <div className="flex flex-col space-y-6">
        {/* Spots Left */}
        <h2
          className={`text-center font-light ${
            activeEvent === "live" || activeEvent === "end" ? "hidden" : "block"
          }`}
        >
          Only <span className="text-4xl font-semibold">12</span> spots left{" "}
        </h2>
        {/* Amount Attending + Vibe Chips */}
        <div className="block">
          <div className="flex justify-center items-center">
            <h2 className="text-7xl font-semibold">200</h2>
            {/* Circle */}
            {/* If they have a circle */}
            <div>
              <div className="flex">
                {Array.from({ length: 5 }, (_, i) => (
                  <div
                    key={i}
                    className={`w-8 h-8 border border-white/75 rounded-full -mr-3 -z-${i}`}
                  ></div>
                ))}
              </div>
              <h2 className="text-2xl">
                {activeEvent === "prequel"
                  ? "attending"
                  : activeEvent === "live"
                  ? "on the floor"
                  : activeEvent === "end"
                  ? "attended"
                  : ""}
              </h2>
            </div>
          </div>
        </div>
        {/* Vibes */}
        <Vibe />
      </div>
    </section>
  );
}

export default AttendeeDetails;
