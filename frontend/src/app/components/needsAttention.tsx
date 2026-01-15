import React from "react";
import Image from "next/image";
import { openEventCard } from "@/stores/store";

interface NeedsAttentionProp {
  id: string;
}

export default function NeedsAttention({ id }: NeedsAttentionProp) {
  const moments = [
    {
      image: "/image-test-brew.jpg",
      event: "Late Night Ramen Run",
      people: ["Jordan", "Maya"],
      date: "Tonight · 10:45 PM",
    },
    {
      image: "/profile_4.png",
      event: "Morning Coffee Walk",
      people: ["Chris"],
      date: "Tomorrow · 9:00 AM",
    },
  ];

  const openCard = openEventCard((state) => state.openEvent);

  return (
    <>
      <div className="flex justify-between">
        <h2 className="text-sm uppercase">Needs your Response</h2>
        <span className="text-xs">({moments.length})</span>
      </div>
      {moments.map((moment, i) => (
        <div
          key={i}
          className="flex gap-x-4 rounded-md px-2 py-2   bg-[#2b2b2b]/50  w-full duration-200 ease-in-out transition  mb-2 relative shadow-xl border border-white/10  "
        >
          <button
            onClick={() => {
              openCard(id);
            }}
            className="w-20 h-20 max-w-sm border border-white/20 overflow-hidden rounded-sm shadow-xl relative cursor-pointer"
          >
            <Image
              src={moment.image}
              fill
              alt="test image"
              className="object-fill brightness-75  w-full h-full  z-0 "
            />
          </button>
          <div className="flex flex-col items-start w-full justify-between text-left relative">
            <h2 className="font-medium text-base  wrap-break-word">
              {moment.event}
            </h2>
            <p className="text-sm text-white/75">{moment.people.join(" + ")}</p>
            <p className="text-sm text-white/75 mt-4">
              <span className="font-semibold">Monday </span> &bull; 10am
            </p>
            <span className="text-xs text-white/50">
              Awaiting your response
            </span>
            <div className="flex mt-4 justify-between gap-x-4 w-full h-fit">
              <button className="px-4 py-2 text-xs border  border-white/10 shadow-lg bg-black w-full cursor-pointer rounded-md">
                Accept
              </button>
              <button className="px-4 py-2 text-xs border border-white/10 shadow-lg w-full cursor-pointer rounded-md">
                Suggest Time
              </button>
            </div>
          </div>
        </div>
      ))}
    </>
  );
}
