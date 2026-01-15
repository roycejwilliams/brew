import React from "react";
import Carousel from "./carousel";

interface HostedProp {
  id: string;
}

function Hosted({ id }: HostedProp) {
  return (
    <section>
      <div className="px-24">
        <h1 className="border-b border-white/10 pb-4 text-xl font-light">
          Facilitated
        </h1>
      </div>{" "}
      <Carousel id={id} width={250} height={400} />
    </section>
  );
}

export default Hosted;
