import React from "react";

export default function Chip() {
  const vibe = [
    "Cocktails",
    "Underground",
    "Artistic",
    "Tech",
    "Private",
    "Invite Only",
  ];

  return (
    <>
      {vibe.map((v, i) => (
        <button
          key={i}
          className="py-2 px-4 w-fit max-w-sm bg-black rounded-full cursor-pointer transform hover:-translate-y-2 tracking-wider ease-in-out duration-200 text-sm font-light shadow-md border border-white/20 inset-shadow-xs inset-shadow-[#98473E]/75 shadow-[#98473E]/50"
        >
          {v}
        </button>
      ))}
    </>
  );
}
