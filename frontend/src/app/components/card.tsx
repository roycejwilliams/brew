import { openEventCard } from "@/stores/store";
import React from "react";

interface CardProp {
  width: number;
  height: number;
  id: string;
}

function Card({ width, height, id }: CardProp) {
  const openCard = openEventCard((state) => state.openEvent);

  return (
    <div
      onClick={() => openCard(id)}
      style={{ width, height }}
      className={` border border-white/20 cursor-pointer hover:scale-105 ease-in-out transition duration-200 rounded-lg shadow-md shadow-[#19535F]`}
    >
      <div></div>
    </div>
  );
}

export default Card;
