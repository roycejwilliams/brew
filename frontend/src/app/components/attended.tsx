import React from "react";
import Carousel from "./carousel";

interface AttendedProp {
  id: string;
}

function Attended({ id }: AttendedProp) {
  return (
    <section className="w-full relative">
      <h1 className="border-b border-white/10 pb-4 text-xl font-light">
        Presence{" "}
      </h1>
      <Carousel id={id} width={300} height={300} />
    </section>
  );
}

export default Attended;
