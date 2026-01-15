import React, { useState, useRef } from "react";
import CustomRadio from "./customRadio";
import { RadioGroup } from "@heroui/react";
import { motion } from "motion/react";
import { useOutsideAlerter } from "../utils/outsideAlert";
import SearchMap from "./search";

interface FilterProps {
  onClose: () => void;
}

function ScopeLocator({ onClose }: FilterProps) {
  const ref = useRef<HTMLDivElement | null>(null);

  useOutsideAlerter(ref, onClose);

  return (
    <>
      <motion.div
        layout
        ref={ref}
        initial={{ opacity: 0, height: 0 }}
        animate={{ opacity: 1, height: "auto" }}
        exit={{ opacity: 0, height: 0 }}
        transition={{ duration: 0.35, ease: "easeInOut" }}
        className=" bg-[#181818]  mx-auto pb-4 relative mt-4 rounded-lg border border-white/10 overflow-hidden"
      >
        <SearchMap />
        <motion.ul className="mt-2 px-4 py-2  flex flex-col gap-y-8">
          <li>
            <span className="text-xs text-white/75">Look around</span>
            <RadioGroup
              disableAnimation
              size="sm"
              orientation="horizontal"
              classNames={{
                label: "mb-4",
                wrapper: "flex  flex-wrap mt-4 ml-2  gap-6",
              }}
            >
              <CustomRadio value="tech">Here</CustomRadio>
              <CustomRadio value="creative">Around Me</CustomRadio>
              <CustomRadio value="art">Where I&apos;m going</CustomRadio>
              <CustomRadio value="start-up">Nearby Cities</CustomRadio>
            </RadioGroup>{" "}
          </li>
          <li>
            <span className="text-xs text-white/75">Time</span>
            <RadioGroup
              disableAnimation
              orientation="horizontal"
              size="sm"
              classNames={{
                label: "mb-4",
                wrapper: "flex flex-wrap  gap-6 mt-4 ml-2  text-white",
              }}
            >
              <CustomRadio value="tonight">Tonight</CustomRadio>
              <CustomRadio value="tomorrow">Tomorrow</CustomRadio>
              <CustomRadio value="weekend">This Weekend</CustomRadio>
            </RadioGroup>
          </li>
          <li className="text-sm">
            <span className="text-xs text-white/75">Summary</span>
            <p className="mt-4">
              Showing what
              <span className="text-white/50">
                &apos;s happening around San Francisco tonight
              </span>
            </p>
          </li>
        </motion.ul>
      </motion.div>
    </>
  );
}

export default ScopeLocator;
