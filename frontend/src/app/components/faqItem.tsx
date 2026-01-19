import React from "react";
import { ChevronDownIcon } from "./icons";

interface FaqItemProps {
  question: string;
  description: string;
  isActive: boolean;
  onToggle: () => void;
}

export default function FaqItem({
  question,
  description,
  isActive,
  onToggle,
}: FaqItemProps) {
  return (
    <>
      <li>
        <div className="flex justify-between items-center">
          <p className="font-light border-b border-white/20 py-2">{question}</p>
          <button
            onClick={onToggle}
            className={`cursor-pointer transition-all duration-300 ease-in-out ${
              isActive ? "-rotate-180" : "rotate-0"
            }`}
          >
            <ChevronDownIcon size={20} color="currentColor" />
          </button>
        </div>
        <div
          className={`transition-all mt-2 duration-300 ease-in-out overflow-hidden
      ${isActive ? "max-h-56" : "max-h-0"}`}
        >
          <p
            className={`transition-opacity duration-300 ${
              isActive ? "opacity-100" : "opacity-0"
            }`}
          >
            {description}
          </p>{" "}
        </div>{" "}
      </li>{" "}
    </>
  );
}
