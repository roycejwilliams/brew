import { RadioGroup } from "@heroui/radio";
import React, { useState } from "react";
import CustomRadio from "./customRadio";
import { TimeInput } from "@heroui/react";
import { Time } from "@internationalized/date";
import { AnimatePresence, motion } from "motion/react";
import { InformationIcon, SendIcon } from "./icons";
import Asterisk from "./icons/AsterikIcon";


interface ClockCircleLinearIconProps extends React.SVGProps<SVGSVGElement> {}


export default function StartMoment() {
  const timeChips = [
    {
      value: "tonight",
      date: "Tonight",
    },
    {
      value: "tomorrow",
      date: "Tomorrow",
    },
    {
      value: "weekend",
      date: "This Weekend",
    },
    {
      value: "pickTime",
      date: "Pick Time +",
    },
  ];

  const typeInvite = [
    {
      value: "circle",
      type: "Circle",
    },
    {
      value: "people",
      type: "People",
    },
    {
      value: "nearby",
      type: "Anyone Nearby",
    },
  ];

  const revealUp = {
      hidden: { opacity: 0, y: 8 },
      visible: { opacity: 1, y: 0 },
    };

    const settle = {
      tap: { scale: 0.96 },
      hover: { scale: 1.03 },
    };

    const commit = {
      hidden: { opacity: 0, y: 12, scale: 0.98 },
      visible: { opacity: 1, y: 0, scale: 1 },
    };



  const [reveal, setReveal] = useState<boolean>(false);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [selectedWho, setSelectedWho] = useState<string | null>(null);
  const [hours, setHours] = useState<number>(new Date().getHours()); //capturing the hours
  const [minutes, setMinutes] = useState<number>(new Date().getMinutes()); //capturing the minutes
  const [showSubmit, setShowSubmit] = useState<boolean>(false);

    //allows the pick later dropdown to show  
    const onSelectionTime = (value: string) => {
      setSelectedTime(value);
      if(value !== "pickTime") {
        setReveal(true);
      } else {
        setReveal(false);
      }
    };

    const onSelectionWho = (value: string) => {
        setSelectedWho(value);
        setShowSubmit(true);
    }


    //allows the submit button to show after its made 


    //Captures the change of the set time
    const timeChange = (time: Time) => {
        if(!time) return;
        setHours(time?.hour);
        setMinutes(time?.minute);
    }

    //Logic for AM or PM
    let period = hours >= 12 ? 'PM' : 'AM';

    console.log("Hours:", hours, "Minutes:", minutes, period);
    console.log("who", selectedWho);
    console.log("time", selectedTime);



  return (
    <motion.section 
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -6 }}
      className="mx-auto max-w-md text-[#cecece]/75"
    >
      <motion.div  
      layout
      initial={{ opacity: 0.8 }}
      animate={{ opacity: 1 }}
      className="flex flex-col">
        <label className="text-lg">What&apos;s the move?</label>
        <input
          onFocus={(e) => e.currentTarget.parentElement?.classList.add("scale-[1.01]")}
          onBlur={(e) => e.currentTarget.parentElement?.classList.remove("scale-[1.01]")}
          type="text"
          id="move"
          placeholder={`"Ramen Tonight"`}
          required
          className="mt-4 border py-2 px-4 rounded-md bg-[#636363]/20 border-white/30 backdrop-blur-2xl 
           focus:outline-none focus:border-white/60 
           text-white/90 placeholder:text-white/30 placeholder:text-sm
           transition-colors duration-150"
           />
      </motion.div>
      <motion.div layout className="mt-8">
        <RadioGroup
          disableAnimation
          orientation="horizontal"
          label="When?"
          value={selectedTime}
          onValueChange={onSelectionTime}
          size="lg"
          classNames={{
            label: "mb-2 text-base",
            wrapper: "flex gap-6 mt-4 ml-4 text-white",
          }}
        >
          {timeChips.map((when) => (
            <motion.div 
            key={when.value}
            whileTap="tap"
            whileHover="hover"
            variants={settle}
            >
            <CustomRadio
              value={when.value}
              className={
                selectedTime === when.value
                  ? "text-white"
                  : "text-white/60"
              }
            >                
              {when.date}
              </CustomRadio>
            </motion.div>
          ))}
        </RadioGroup>
         
      </motion.div>
        {/* Pick Selected time */}
        <AnimatePresence mode="popLayout">
        {selectedTime === "pickTime" && (
          <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{
            opacity: { duration: 0.15 },
            layout: { duration: 0.25, ease: "easeInOut" },
          }}  
          layout 
          className="w-full flex flex-wrap mt-8 gap-4">
            <motion.div
                className="flex w-full items-center gap-x-2"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                
              >
              <AnimatePresence mode="popLayout">
                {!reveal ? (
                  <motion.div
                    key="time-input"
                    className="flex w-full items-center gap-x-2"
                    initial={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.15, ease: "easeInOut" }}
                  >
                    {/* Time input */}
                    <motion.div
                      className="flex-1"
                      whileFocus={{ scale: 1.01 }}
                      transition={{ duration: 0.15 }}
                    >
                      <TimeInput
                        defaultValue={new Time(hours, minutes)}
                        onChange={(t) => timeChange(new Time(t?.hour, t?.minute))}
                        value={new Time(hours, minutes)}
                        label="Event Time"
                        isDisabled={reveal}
                        labelPlacement="outside"
                        classNames={{
                          label: "text-sm text-white/40 mb-2",
                          inputWrapper:
                            "bg-[#636363]/20 backdrop-blur-2xl rounded-md border border-white/30 focus-within:border-white/60 transition-colors",
                          segment: "text-base",
                          input: "font-normal [--foreground:white]/40",
                        }}
                        startContent={
                          <ClockCircleLinearIcon className="text-xl text-default-400 pointer-events-none shrink-0" />
                        }
                      />
                    </motion.div>

                    {/* Commit button */}
                    <motion.button
                      onClick={() => setReveal(true)}
                      whileHover={{ scale: 1.06 }}
                      whileTap={{ scale: 0.92 }}
                      transition={{ duration: 0.15 }}
                      className="w-10 h-10 cursor-pointer mt-auto bg-[#636363]/20 backdrop-blur-2xl flex items-center justify-center border border-white/30 rounded-md"
                    >
                      <SendIcon size={18} color="currentColor" className="rotate-45" />
                    </motion.button>
                  </motion.div>
                ) : (
                  <motion.h2
                    layout
                    key="time-confirmed"
                    className="text-sm my-auto text-white/70"
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.2, ease: "easeOut" }}
                  >
                    You&apos;ve selected:
                    <span className="text-lg font-medium ml-2 text-white">
                      {hours}:{minutes} {period}
                    </span>
                  </motion.h2>
                )}
              </AnimatePresence>

              </motion.div>

          {!reveal && (
          <span className="text-xs flex gap-x-2 items-center"><InformationIcon size={18} color="currentColor" /> Just checking interest — we&apos;ll decide the details together.</span>
          )}
        </motion.div>
      )}
      </AnimatePresence>

      {reveal && (
      <motion.div 
      layout
        initial="hidden"
        animate="visible"
        variants={revealUp}
        transition={{ delay: 0.05 }} 
        className="mt-8"
      >
        <RadioGroup
          disableAnimation
          onValueChange={onSelectionWho}
          orientation="horizontal"
          value={selectedWho}
          label="Who?"
          size="lg"
          classNames={{
            label: "mb-2 text-base",
            wrapper: "flex gap-6 mt-4 ml-4  text-white",
          }}
        >
          {typeInvite.map((invite) => (
             <motion.div
                key={invite.value}
                className={
                  invite.value === "nearby"
                    ? "text-white/85"
                    : "text-white/90"
                }
                whileHover={{
                  color:
                    invite.value === "nearby"
                      ? "rgba(255,255,255,1)"
                      : "rgba(255,255,255,0.95)",
                }}
              >  
                <CustomRadio key={invite.value} value={invite.value}>
                  {invite.type}
                </CustomRadio>
            </motion.div>  
          ))}
        </RadioGroup>
      </motion.div>
      )}

      {showSubmit && (
        <motion.div 
        layout
           className="mt-16"
          initial="hidden"
          animate="visible"
          variants={commit}
          transition={{ duration: 0.25, ease: "easeOut" }}
       >
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            className="text-sm cursor-pointer px-4 py-2 bg-[#636363]/20 backdrop-blur-2xl 
                      text-white/90 border border-white/50 rounded-md 
                      transition-colors duration-150">          
           Continue
          </motion.button>
        </motion.div>
      )}

    </motion.section>
  );
}


export const ClockCircleLinearIcon = (props: ClockCircleLinearIconProps) => {
  return (
    <svg
      aria-hidden="true"
      fill="none"
      focusable="false"
      height="0.8em"
      role="presentation"
      viewBox="0 0 24 24"
      width="0.8em"
      {...props}
    >
      <g fill="none" stroke="currentColor" strokeWidth="1.5">
        <circle cx="12" cy="12" r="10" />
        <path d="M12 8v4l2.5 2.5" strokeLinecap="round" strokeLinejoin="round" />
      </g>
    </svg>
  );
};