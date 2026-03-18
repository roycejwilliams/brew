import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCubesStacked,
  faRing,
  faBeerMugEmpty,
} from "@fortawesome/free-solid-svg-icons";

type ManageView = "moments" | "circle" | "referral" | null;

interface ManageTools {
  manage: ManageView;
  setManage: React.Dispatch<React.SetStateAction<ManageView>>;
}

export default function Tools({ manage, setManage }: ManageTools) {
  const manageNav = [
    {
      icon: <FontAwesomeIcon icon={faCubesStacked} />,
      name: "moments",
    },
    {
      icon: <FontAwesomeIcon icon={faRing} />,
      name: "circle",
    },
    {
      icon: <FontAwesomeIcon icon={faBeerMugEmpty} />,
      name: "referral",
    },
  ];

  return (
    <div className="h-full max-w-50 flex flex-col items-center border-l border-r border-white/5">
      <h1 className="mt-8 tracking-wide font-normal uppercase text-[#ffffff]/40">
        Manage
      </h1>
      <ul className="mt-8 w-full space-y-8">
        {manageNav.map((m) => (
          <button
            key={m.name}
            onClick={() => setManage(m.name as ManageView)}
            className={`w-12 h-12 mx-auto flex justify-center items-center border border-white/5 shadow-lg rounded-full cursor-pointer bg-white/15 ${m.name !== manage ? "opacity-30" : "opacity-100"}`}
          >
            {m.icon}
          </button>
        ))}
      </ul>
    </div>
  );
}
