import React from "react";
import Carousel from "./carousel";

interface AttendedProp {
  id: string;
}

function Attended({ id }: AttendedProp) {
  return (
    <section className="w-full relative">
      <div className="px-24">
        <h1 className="border-b border-white/10 pb-4 text-xl font-light">
          Presence{" "}
        </h1>
      </div>
      <Carousel id={id} width={250} height={250} />
    </section>
  );
}

export default Attended;
