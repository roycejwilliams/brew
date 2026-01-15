import React from "react";

interface HostMessageProp {
  hostMessage: string | null;
  hostTime: Date | string;
}

export default function HostMessage({
  hostMessage,
  hostTime,
}: HostMessageProp) {
  return (
    <>
      <div className="max-w-4xl mx-auto mt-8 hover:scale-105 ease-in-out duration-500 transform transition-all">
        <div className="w-full bg-linear-to-b from-[#2b2b2b]/75 to-black/20 backdrop-blur-3xl shadow-lg shadow-[#98473E] border border-white/10 mx-auto p-6 text-left rounded-xl">
          <span className="text-sm">{hostMessage}</span>
        </div>

        <div className="w-full mt-4 flex justify-end">
          <span className="text-right  text-sm font-light ml-auto">
            {hostTime.toString()}
          </span>
        </div>
      </div>
    </>
  );
}
