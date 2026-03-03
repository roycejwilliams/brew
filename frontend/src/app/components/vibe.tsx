import React from "react";
import Chip from "./chip";

export default function Vibe() {
  const vibes = [
    "Cocktails",
    "Underground",
    "Artistic",
    "Tech",
    "Private",
    "Invite Only",
  ];
  return (
    <section className="flex flex-col items-center gap-4">
      <p className="text-white/20 text-[10px] tracking-widest uppercase font-medium">
        Vibes
      </p>
      <div className="flex flex-wrap gap-2 justify-center max-w-sm">
        {vibes.map((v, i) => (
          <Chip key={v} label={v} index={i} />
        ))}
      </div>
    </section>
  );
}
