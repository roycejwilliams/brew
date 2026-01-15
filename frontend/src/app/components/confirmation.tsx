import React from "react";

export default function Confirmation() {
  const confirm = [
    {
      names: ["Alice", "Rob"],
      date: "Saturday · 7:30 PM",
      event: "Rooftop Drinks in DTLA",
    },
    {
      names: ["Jordan", "Maya"],
      date: "Sunday · 11:00 AM",
      event: "Brunch at Silverlake Café",
    },
    {
      names: ["Chris", "Dev"],
      date: "Friday · 6:00 PM",
      event: "Pickup Basketball at Venice Courts",
    },
  ];

  return (
    <>
      <div className="flex justify-between">
        <h2 className="text-sm uppercase">Coming Up</h2>
        <span className="text-xs">({confirm.length})</span>
      </div>
      {confirm.map((c, i) => (
        <div
          key={i}
          className="gap-x-4 rounded-md px-4 py-2   bg-[#2b2b2b]/50  w-full duration-200 ease-in-out transition  mb-2 relative shadow-xl border border-white/10  "
        >
          <div className="border-b my-2 pb-2 border-white/20">
            <h2 className=" text-base font-normal w-3/5 wrap-break-word">
              {c.names.join(" and ")}
            </h2>
            <p className="text-sm text-white/75 mt-2">
              <span className="">{c.date}</span>
            </p>
          </div>
          <div className="w-full flex items-center justify-between mt">
            <span className="text-sm">
              <span className="font-medium">{c.event}</span>
            </span>
            <button className="px-4 py-2 border border-white/10 rounded-md text-sm bg-black">
              View
            </button>
          </div>
        </div>
      ))}
    </>
  );
}
