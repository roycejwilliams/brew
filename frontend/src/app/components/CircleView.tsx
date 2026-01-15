import React from "react";
import SearchMap from "./search";
import CircleScene from "./CircleScene";
import CircleSignal from "./CircleSignal";

function CircleView() {
  return (
    <section className="w-full h-screen bg-linear-to-b from-black via-[#212121] to-black overflow-hidden relative">
      <SearchMap />
      <CircleScene />
      <CircleSignal />
    </section>
  );
}

export default CircleView;
