import React from "react";

import { ChevronLeftIcon, ChevronRightIcon, EyeIcon, MicrophoneMuteIcon, TargetIcon } from "./icons";

interface CircleControlProp {
  nextMarker: () => void;
  prevMarker: () => void;
}

export default function CircleControls({
  nextMarker,
  prevMarker,
}: CircleControlProp) {
  return (
    <div className="xl:max-w-1/4 max-w-1/2  mx-auto mt-4  flex items-center gap-4">
      <button
        onClick={prevMarker}
        className="w-10 h-10 border cursor-pointer border-white/10 shadow-2xl rounded-full bg-[#101010] flex justify-center items-center"
      >
        <div >
          <ChevronLeftIcon
            size={24}
            color="currentColor"
          />
        </div>
      </button>
      <div className="flex-1 flex justify-around border border-[#3A3A3A]/25 shadow  backdrop-blur-lg p-2 rounded-full ">
        {/* I’m here, this matters */}
        <button className="cursor-pointer text-center flex flex-col gap-y-1 items-center group transition-all duration-500 ease-in-out">
          <EyeIcon
            size={24}
            className="w-5 h-5 group-hover:scale-80 transition-transform duration-500 ease-in-out"
          />{" "}
          <span className="text-[10px] group-hover:scale-80 transition-transform duration-500 ease-in-out">
            Presence
          </span>
        </button>{" "}
        {/* within this, these signals matter more */}
        <button className="cursor-pointer text-center flex flex-col gap-y-1 items-center group transition-all duration-500 ease-in-out">
          <TargetIcon
            size={24}
            className="w-5 h-5 group-hover:scale-80 transition-transform duration-500 ease-in-out"
          />
          <span className="text-[10px] group-hover:scale-80 transition-transform duration-500 ease-in-out">
            Focus
          </span>
        </button>
        {/* I need to step back */}
        <button className="cursor-pointer text-center flex flex-col gap-y-1 items-center group transition-all duration-500 ease-in-out">
          <MicrophoneMuteIcon
            size={24}
            className="w-5 h-5 group-hover:scale-80 transition-transform duration-500 ease-in-out"
          />
          <span className="text-[10px] group-hover:scale-80 transition-transform duration-500 ease-in-out">
            Mute
          </span>
        </button>{" "}
      </div>
      <button
        onClick={nextMarker}
        className="w-10 h-10 border cursor-pointer border-white/10 shadow-2xl rounded-full bg-[#101010] flex justify-center items-center"
      >
        <div>
          <ChevronRightIcon
            size={24}
            color="currentColor"
          />
        </div>
      </button>{" "}
    </div>
  );
}
