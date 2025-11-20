import React, { useState, useRef, useEffect } from "react";
import CustomRadio from "./customRadio";
import { RadioGroup, Slider, Switch } from "@heroui/react";
import { motion } from "motion/react";
import { useOutsideAlerter } from "../utils/outsideAlert";

interface FilterProps {
  onClose: () => void;
}

function Filter({ onClose }: FilterProps) {
  const [apply, setApply] = useState<boolean>(false);
  const ref = useRef<HTMLDivElement | null>(null);

  useOutsideAlerter(ref, onClose);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="w-full h-screen bg-linear-to-b absolute top-0 left-0 bg-black/10 backdrop-blur-md z-50 flex justify-center items-center"
    >
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 200 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 200 }}
        transition={{ duration: 0.35, ease: "easeInOut", delay: 0.2 }}
        className="max-w-1/3 bg-linear-to-b from-[#2b2b2b] to-black relative rounded-2xl shadow-sm border border-white/10 p-8"
      >
        <h2 className="text-2xl">Filter</h2>
        <motion.ul
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.95 }}
          transition={{ duration: 0.35, ease: "easeInOut" }}
          className="mt-4  flex flex-col gap-y-8"
        >
          <li>
            <Slider
              className="max-w-md mt-4"
              defaultValue={10}
              label="Distance (mi)"
              maxValue={100}
              minValue={0}
              step={1}
              classNames={{
                filler: "bg-[#98473E]",
                track: "bg-[#fefefe]",
                thumb: "bg-white border border-black/20",
              }}
            />
          </li>
          <RadioGroup
            disableAnimation
            label="Date"
            orientation="horizontal"
            size="md"
            classNames={{
              label: "mb-4",
              wrapper: "flex flex-row flex-wrap gap-6 ",
            }}
          >
            <CustomRadio value="today">Today</CustomRadio>
            <CustomRadio value="this-week">This Week</CustomRadio>
            <CustomRadio value="next-week">Next Week</CustomRadio>
            <CustomRadio value="this-month">This Month</CustomRadio>
          </RadioGroup>
          <RadioGroup
            disableAnimation
            label="Category"
            size="md"
            orientation="horizontal"
            classNames={{
              label: "mb-4",
              wrapper: "flex flex-row flex-wrap gap-6",
            }}
          >
            <CustomRadio value="tech">Tech</CustomRadio>
            <CustomRadio value="creative">Creative</CustomRadio>
            <CustomRadio value="art">Art</CustomRadio>
            <CustomRadio value="start-up">Start Up</CustomRadio>
            <CustomRadio value="coffee">Coffee</CustomRadio>
            <CustomRadio value="music">Music</CustomRadio>
          </RadioGroup>{" "}
          <li>
            <span>Visibility</span>
            <div className="flex flex-col gap-4 mt-4 text-sm">
              <Switch
                aria-label="Visibility toggle"
                classNames={{
                  wrapper: `border border-white/20 group-data-[selected=true]:bg-[#98473E]`,
                }}
              >
                See events in my circle
              </Switch>
              <Switch
                aria-label="Visibility toggle"
                classNames={{
                  wrapper: `border border-white/20 group-data-[selected=true]:bg-[#98473E]`,
                  base: `group-data-[selected=true]:bg-[#98473E]`,
                }}
              >
                Show private events
              </Switch>
            </div>
          </li>
          <button className="text-sm text-black bg-white p-2 cursor-pointer rounded-full shadow-lg border-white/20">
            {apply ? (
              <span className="loading loading-ring loading-md"></span>
            ) : (
              "Apply"
            )}
          </button>
        </motion.ul>
      </motion.div>
    </motion.div>
  );
}

export default Filter;
