import { AnimatePresence, motion } from "motion/react";
import React, { ChangeEvent, useState } from "react";
import { RadioGroup } from "@heroui/radio";
import CustomRadio from "./customRadio";
import { TimeInput } from "@heroui/react";
import { Time } from "@internationalized/date";
import { ClockCircleLinearIcon } from "./startMoment";
import { InformationIcon, SendIcon } from "./icons";

type WhoSelectionProp = "circle" | "people" | "nearby" | null;
type CreateMomentStage = "start" | "circle" | "people" | "nearby" | "confirm";

interface MomentProp {
  chooser: "circle" | "people" | "nearby";
  setChooser: (value: "circle" | "people" | "nearby" | null) => void;
  onGoBack?: () => void;
  onContinue?: () => void;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onWho: (value: WhoSelectionProp) => void;
  selectedWho: WhoSelectionProp;
  showSubmit: boolean;
  createMoment: string;
  selectedModal: CreateMomentStage;
  setSelectedModal: (selectedModal: CreateMomentStage) => void;
}

export default function Start({
  createMoment,
  onChange,
  onWho,
  setSelectedModal,
  selectedWho,
  showSubmit,
}: MomentProp) {
  const [reveal, setReveal] = useState<boolean>(false);
  //Allows you to show submit button once Invite intent is selected

  //Current Time used for setSelectedTime
  const [time, setTime] = useState<Time>(
    new Time(new Date().getHours(), new Date().getMinutes()),
  );
  //Captures the selectTime
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  //allows the pick later dropdown to show
  const onSelectionTime = (value: string) => {
    setSelectedTime(value);
    if (value !== "pickTime") {
      setReveal(true);
    } else {
      setReveal(false);
    }
  };

  //Actions that designates what selectModal gets visibility

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

  //Invite intent
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
      type: "Around You",
    },
  ];

  //framer motion animations
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

  //time conversion
  const hours24 = time.hour;
  const minutes = time.minute;

  const period = hours24 >= 12 ? "PM" : "AM"; //sets the period
  const hours12 = hours24 % 12 === 0 ? 12 : hours24 % 12; //set to 12-hr time
  const paddedMinutes = minutes.toString().padStart(2, "0"); //make at least 2 characters long, add the 0 if its only 1

  //Captures the change of the set time
  const onTimeChange = (t: Time | null) => {
    if (!t) return;
    setTime(t);
  };

  return (
    <motion.section key="start">
      <motion.div
        layout
        initial={{ opacity: 0.8 }}
        animate={{ opacity: 1 }}
        className="flex flex-col"
      >
        <label className="text-md font-medium text-white/75">
          What&apos;s the move?
        </label>
        <input
          onChange={onChange}
          value={createMoment}
          type="text"
          id="move"
          placeholder={`"Ramen Tonight"`}
          required
          className="w-full px-5 py-3.5  mt-4 bg-[#1c1c1c] backdrop-blur-xl rounded-lg border border-white/8  mx-auto flex items-center gap-3 shadow shadow-black/20
                focus:outline-none 
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
            label: "mb-2 text-md font-medium text-white/75",
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
                  selectedTime === when.value ? "text-white" : "text-white/60"
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
            className="w-full flex flex-wrap mt-8 gap-4"
          >
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
                      whileFocus={{ scale: 1.005 }}
                      transition={{ duration: 0.2 }}
                    >
                      <TimeInput
                        onChange={(t) => onTimeChange(t)}
                        value={time}
                        label="Event Time"
                        isDisabled={reveal}
                        labelPlacement="outside"
                        classNames={{
                          label: "text-sm text-white/40 mb-2",
                          inputWrapper:
                            "bg-[#1c1c1c] rounded-md border border-white/8 hover:border-white/12 focus-within:border-white/20 transition-all duration-200",
                          segment: "text-base text-white/90",
                          input: "font-normal [--foreground:white]/40",
                        }}
                        startContent={
                          <motion.div
                            initial={{ opacity: 0.4 }}
                            whileHover={{ opacity: 0.6 }}
                            transition={{ duration: 0.2 }}
                          >
                            <ClockCircleLinearIcon className="text-xl text-white/40 pointer-events-none shrink-0" />
                          </motion.div>
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
                      <SendIcon
                        size={18}
                        color="currentColor"
                        className="rotate-45"
                      />
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
                      {hours12}:{paddedMinutes} {period}
                    </span>
                  </motion.h2>
                )}
              </AnimatePresence>
            </motion.div>

            {!reveal && (
              <span className="text-xs flex gap-x-2 items-center">
                <InformationIcon size={18} color="currentColor" /> Just checking
                interest — we&apos;ll decide the details together.
              </span>
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
            onValueChange={(value) => onWho(value as WhoSelectionProp)}
            orientation="horizontal"
            value={selectedWho}
            label="Who?"
            size="lg"
            classNames={{
              label: "mb-2 text-md font-medium text-white/75",
              wrapper: "flex gap-6 mt-4 ml-4  text-white",
            }}
          >
            {typeInvite.map((invite) => (
              <motion.div
                key={invite.value}
                className={
                  invite.value === "nearby" ? "text-white/85" : "text-white/90"
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
            onClick={() => {
              setSelectedModal(selectedWho!);
            }}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            className="ttext-sm font-medium cursor-pointer px-6 py-3.5 bg-white/90 backdrop-blur-2xl 
                      text-black border border-white/20 rounded-md 
                      hover:bg-white shadow-lg shadow-white/10
                      transition-all duration-200"
          >
            Continue
          </motion.button>
        </motion.div>
      )}
    </motion.section>
  );
}
