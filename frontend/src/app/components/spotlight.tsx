import React from "react";

interface SpotlightProp {
  id: string;
}

function Spotlight({ id }: SpotlightProp) {
  return (
    <section className=" w-full h-[400px] px-24">
      <div className=" w-full border border-white/20 h-full rounded-lg"></div>
    </section>
  );
}

export default Spotlight;
