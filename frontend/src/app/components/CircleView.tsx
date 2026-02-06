import React from "react";
import CircleScene from "./CircleScene";
import CircleSignal from "./CircleSignal";

function CircleView() {
  return (
    <section className="w-full h-screen bg-linear-to-b from-black via-[#212121] to-black overflow-hidden relative">
      <CircleScene />
    </section>
  );
}

export default CircleView;
