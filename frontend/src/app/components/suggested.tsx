import React from "react";
import Carousel from "./carousel";

interface SuggestedProp {
  id: string;
}

function Suggested({ id }: SuggestedProp) {
  return (
    <section>
      <div className="px-24">
        <h1 className="border-b border-white/10 pb-4 text-xl font-light">
          Our Picks
        </h1>
      </div>{" "}
      <Carousel id={id} width={400} height={250} />
    </section>
  );
}

export default Suggested;
