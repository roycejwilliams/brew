import { AnimatePresence, motion } from "motion/react";
import React from "react";
import { RadioGroup } from "@heroui/radio";
import CustomRadio from "./customRadio";

type VisibilityType = "circle" | "people" | "nearby" | null;
type MomentStage = "start" | "circle" | "people" | "nearby" | "confirm";

interface MomentProp {
  form: {
    moments_name: string;
    moment_start: string;
    moment_end: string;
    cap_attendance: string;
    [key: string]: unknown;
  };
  handleChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => void;
  setSelectedVisibility: (value: VisibilityType) => void;
  selectedVisbility: VisibilityType;
  setSelectedModal: (modal: MomentStage) => void;
  showSubmit: boolean;
  handleTimeChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  reveal: boolean;
  setReveal: (reveal: boolean) => void;
}

const EASE = [0.16, 1, 0.3, 1] as const;

const typeInvite = [
  { value: "circle", type: "Circle" },
  { value: "people", type: "People" },
  { value: "nearby", type: "Around You" },
];

const inputClass =
  "w-full px-4 py-3 bg-white/5 rounded-md border border-white/10 focus:outline-none focus:border-white/25 text-white/90 placeholder:text-white/20 text-sm transition-all duration-200";

const labelClass = "text-[10px] tracking-[3px] uppercase text-white/25";

export default function Start({
  form,
  handleChange,
  setSelectedVisibility,
  selectedVisbility,
  setSelectedModal,
  showSubmit,
  handleTimeChange,
  reveal,
  setReveal,
}: MomentProp) {
  const revealUp = {
    hidden: { opacity: 0, y: 8 },
    visible: { opacity: 1, y: 0 },
  };

  const commit = {
    hidden: { opacity: 0, y: 12, scale: 0.98 },
    visible: { opacity: 1, y: 0, scale: 1 },
  };

  // date AND time both set
  const dateAndTimeSet =
    !!form.moment_start.split("T")[0] && !!form.moment_start.split("T")[1];

  // only requires name, start datetime, and visibility
  const canContinue = form.moments_name && dateAndTimeSet && selectedVisbility;

  return (
    <motion.section
      key="start"
      className="max-w-lg mx-auto px-6 flex flex-col gap-8"
    >
      {/* 1 — Moment name */}
      <motion.div
        layout
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: EASE }}
        className="flex flex-col gap-2"
      >
        <p className={labelClass}>The move</p>
        <input
          name="moments_name"
          value={form.moments_name}
          onChange={handleChange}
          type="text"
          placeholder={`"Ramen Tonight"`}
          required
          className={inputClass}
        />
      </motion.div>

      {/* 2 — Date + Start time */}
      <motion.div
        layout
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.05, ease: EASE }}
        className="flex flex-col gap-2"
      >
        <p className={labelClass}>When</p>
        <div className="flex gap-3">
          <input
            name="moment_start_date"
            value={form.moment_start.split("T")[0] || ""}
            type="date"
            required
            onInput={(e) => {
              handleTimeChange(e as React.ChangeEvent<HTMLInputElement>);
              if ((e.target as HTMLInputElement).value) setReveal(true);
            }}
            className={inputClass}
          />
          <input
            name="moment_start_time"
            value={form.moment_start.split("T")[1] || ""}
            type="time"
            required
            onInput={(e) => {
              handleTimeChange(e as React.ChangeEvent<HTMLInputElement>);
              if ((e.target as HTMLInputElement).value) setReveal(true);
            }}
            className={inputClass}
          />
        </div>
      </motion.div>

      {/* 3 — Until + Cap — reveal after date AND time set */}
      <AnimatePresence>
        {dateAndTimeSet && (
          <motion.div
            layout
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={revealUp}
            transition={{ duration: 0.4, ease: EASE }}
            className="flex flex-col gap-6"
          >
            {/* End time */}
            <div className="flex flex-col gap-2">
              <p className={labelClass}>Until</p>
              <input
                name="moment_end_time"
                value={form.moment_end ? form.moment_end.split("T")[1] : ""}
                type="time"
                onInput={(e) =>
                  handleTimeChange(e as React.ChangeEvent<HTMLInputElement>)
                }
                className={inputClass}
              />
              <p className="text-[10px] text-white/20 tracking-[-0.1px]">
                Optional — leave blank if open-ended
              </p>
            </div>

            {/* Cap */}
            <div className="flex flex-col gap-2">
              <p className={labelClass}>Cap</p>
              <input
                name="cap_attendance"
                value={form.cap_attendance || ""}
                onChange={handleChange}
                type="number"
                min={1}
                placeholder="No limit"
                className={inputClass}
              />
              <p className="text-[10px] text-white/20 tracking-[-0.1px]">
                Optional — max number of attendees
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 4 — Who */}
      <AnimatePresence>
        {reveal && (
          <motion.div
            layout
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={revealUp}
            transition={{ duration: 0.4, delay: 0.05, ease: EASE }}
            className="flex flex-col gap-3"
          >
            <p className={labelClass}>Who</p>
            <RadioGroup
              disableAnimation
              onValueChange={(value) =>
                setSelectedVisibility(value as VisibilityType)
              }
              orientation="horizontal"
              value={selectedVisbility}
              classNames={{
                label: "mb-2 text-md font-medium text-white/75",
                wrapper: "flex gap-6 ml-2 text-white",
              }}
            >
              {typeInvite.map((invite) => (
                <CustomRadio key={invite.value} value={invite.value}>
                  {invite.type}
                </CustomRadio>
              ))}
            </RadioGroup>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 5 — Continue */}
      <AnimatePresence>
        {showSubmit && (
          <motion.div
            layout
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={commit}
            transition={{ duration: 0.3, ease: EASE }}
          >
            <button
              type="button"
              disabled={!canContinue}
              onClick={() => setSelectedModal(selectedVisbility ?? "start")}
              className="w-full flex justify-between items-center px-4 py-2.5 border border-white/10 rounded-md hover:bg-white/5 hover:border-white/20 transition-all cursor-pointer text-sm text-white/50 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <span>Continue</span>
              <span className="text-white/25">→</span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.section>
  );
}
