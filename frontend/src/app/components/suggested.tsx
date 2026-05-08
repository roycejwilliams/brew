import React from "react";
import Carousel from "./carousel";

interface SuggestedProp {
  id: string;
}

function Suggested({ id }: SuggestedProp) {
  return (
    <section>
      <div className="flex items-center gap-2 border-b border-white/8 pb-4 mb-4">
        <p className="text-xs tracking-[3px] uppercase text-white/20">
          Our picks
        </p>
      </div>
      <Carousel id={id} width={400} height={250} />
    </section>
  );
}

export default Suggested;
