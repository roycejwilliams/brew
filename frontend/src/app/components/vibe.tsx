import React from "react";
import Chip from "./chip";

function Vibe() {
  return (
    <section>
      <h2 className="text-center">Vibes</h2>
      <div className="w-full max-w-md flex flex-wrap gap-6 mt-8 justify-center p-4">
        <Chip></Chip>
      </div>
    </section>
  );
}

export default Vibe;
