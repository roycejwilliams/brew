import React, { useState } from "react";
import { motion } from "motion/react";
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
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

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
    <div className="h-full max-w-25 flex-1 flex flex-col items-center border-l border-r border-white/5">
      <h1 className="mt-8 tracking-wide font-normal text-xs uppercase text-[#656565]">
        Manage
      </h1>
      <ul className="mt-8 w-full space-y-4">
        {manageNav.map((m) => (
          <motion.li
            key={m.name}
            className="flex flex-col justify-center space-y-2"
            animate={{ opacity: m.name !== manage ? 0.3 : 1 }}
            transition={{ duration: 0.2 }}
            onMouseEnter={() => setHoveredItem(m.name)}
            onMouseLeave={() => setHoveredItem(null)}
          >
            <motion.button
              onClick={() => setManage(m.name as ManageView)}
              className="w-12 h-12 mx-auto flex justify-center items-center border border-white/5 shadow-lg rounded-full cursor-pointer bg-white/15"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ scale: 1.1 }}
              transition={{ duration: 0.2 }}
            >
              {m.icon}
            </motion.button>
            <motion.span
              className="text-xs mx-auto"
              initial={{ opacity: 0, y: 4 }}
              animate={
                hoveredItem === m.name
                  ? { opacity: 1, y: 0 }
                  : { opacity: 0, y: 4 }
              }
              transition={{ duration: 0.2 }}
            >
              {m.name}
            </motion.span>
          </motion.li>
        ))}
      </ul>
    </div>
  );
}
