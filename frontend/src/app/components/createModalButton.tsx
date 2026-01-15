import React from "react";
import { AsteriskStar } from "react-basicons";
import { Variants, motion } from "motion/react";

interface CreateModalProp {
  openModal: (type: "createModal") => void;
}

export default function CreateModalButtton({ openModal }: CreateModalProp) {
  const buttonVariants: Variants = {
    rest: {
      scale: 1,
    },
    hover: {
      scale: 1.06,
      transition: {
        duration: 0.3,
        ease: "easeOut",
      },
    },
  };

  const iconVariants: Variants = {
    rest: {
      rotate: 0,
    },
    hover: {
      rotate: 360,
      transition: {
        rotate: { duration: 0.75, ease: "easeOut" },
      },
    },
  };

  const revealVariants: Variants = {
    rest: {
      width: 0,
      opacity: 0,
    },
    hover: {
      width: "auto",
      opacity: 1,
      marginLeft: 2,
      transition: {
        width: { duration: 0.35, ease: "easeOut" },
        opacity: { duration: 0.2, delay: 0.1 },
      },
    },
  };

  return (
    <>
      <motion.button
        onClick={() => openModal("createModal")}
        variants={buttonVariants}
        initial="rest"
        whileHover="hover"
        className="absolute p-4 bottom-0 mb-12 left-1/2 duration-500 -translate-x-1/2 bg-linear-to-br from-[#555555] to-black hover:from-[#723630] hover:to-[#19535F] backdrop-blur-lg flex items-center justify-center cursor-pointer border border-[#3D3D3D] hover:border-white/10 rounded-lg text-base"
      >
        <motion.div variants={iconVariants}>
          <AsteriskStar size={22} color="white" weight={1} />
        </motion.div>
        <motion.div
          variants={revealVariants}
          className="overflow-hidden whitespace-nowrap"
        >
          <span className="text-white text-sm">Create</span>
        </motion.div>
      </motion.button>
    </>
  );
}
