import React from "react";

export default function CircleSignal() {
  const signals = [
    { event: "First Pour", people: ["Ava", "Marcus"], time: "Now" },
    { event: "Hermes Rooftop Session", people: ["Lina"], time: "Later" },
    { event: "Studio 54", people: ["John"], time: "After" },
    { event: "Private", people: ["Peter"], time: "Now" },
    { event: "Second Light", people: ["Brian"], time: "Later" },
    { event: "3rd Lounge", people: ["Brianna"], time: "After" },
  ];

  return (
    <div className=" absolute right-0 transform -translate-y-1/2 top-1/2 shadow-lg p-8">
      <div className="rounded-full blur-2xl w-full h-full bg-[#101010a3]  absolute border"></div>
      <h2 className="text-lg">Today</h2>
      <ul className="mt-4 flex flex-col gap-y-8">
        {signals.map((signal, i) => (
          <li
            key={i}
            className="flex gap-x-8 justify-between items-center opacity-60 text-sm"
          >
            <h2>
              <span className="break-all">{signal.event}</span> -{" "}
              {signal.people.join(", ")}
            </h2>
            <span className="w-14">&#8226; {signal.time}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
