import { RadioGroup } from "@heroui/radio";
import React, { ChangeEvent, useEffect, useState } from "react";
import CustomRadio from "./customRadio";
import { TimeInput } from "@heroui/react";
import { CalendarDate, Time } from "@internationalized/date";
import { AnimatePresence, motion } from "motion/react";
import { ChevronLeftIcon, InformationIcon, SendIcon } from "./icons";
import CircleScene from "./CircleScene";
import CircleSignal from "./CircleSignal";
import CircleControls from "./circleControls";
import SelectAction from "./selectAction";
import MomentConfirmation from "./momentConfirmation";

type MomentSelectionProp = "start" | "circle" | "people" | "nearby" | "confirm";
type WhoSelectionProp = "circle" | "people" | "nearby" | null;

interface Signal {
  circle: string;
  people: string[];
  time: string;
  image: string;
  date: CalendarDate;
}

interface Circle {
  circle: string;
  date: CalendarDate | string;
  image: string;
}

interface GoBackProp {
  chooser: "circle" | "people" | "nearby";
  setChooser: (value: "circle" | "people" | "nearby") => void;
  onGoBack?: () => void;
}

export default function StartMoment({
  chooser,
  setChooser,
  onGoBack,
}: GoBackProp) {
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
  const [createMoment, setCreateMoment] = useState<string>("");
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [selectedWho, setSelectedWho] = useState<WhoSelectionProp>();
  const [time, setTime] = useState<Time>(
    new Time(new Date().getHours(), new Date().getMinutes()),
  );
  const [showSubmit, setShowSubmit] = useState<boolean>(false);
  const [selectedModal, setSelectedModal] =
    useState<MomentSelectionProp>("start");
  const [selectedCircleProp, setSelectedCircleProp] = useState<Signal | null>(
    null,
  );
  //Active Signal
  const [activeSignal, setActiveSignal] = useState<number>(0);

  //copies whatever option that has been chosen to go back to.

  //allows the pick later dropdown to show
  const onSelectionTime = (value: string) => {
    setSelectedTime(value);
    if (value !== "pickTime") {
      setReveal(true);
    } else {
      setReveal(false);
    }
  };

  const onSelectionWho = (value: WhoSelectionProp) => {
    setSelectedWho(value);
    setShowSubmit(true);
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

  //Capturing Event input
  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setCreateMoment(e.target.value);
  };

  const signals: Signal[] = [
    {
      circle: "First Pour",
      people: [
        "Ava",
        "Marcus",
        "Elijah",
        "Noah",
        "Sofia",
        "Cam",
        "Jordan",
        "Maya",
        "Andre",
        "Liam",
        "Nina",
        "Ty",
        "Zoe",
        "Chris",
        "Ari",
        "Jules",
        "Ben",
        "Kira",
      ],
      time: "Now",
      image: "/ex1.jpg",
      date: new CalendarDate(2026, 3, 12),
    },
    {
      circle: "Hermes Rooftop Session",
      people: [
        "Lina",
        "Theo",
        "Isabella",
        "Mateo",
        "Julian",
        "Priya",
        "Omar",
        "Daniel",
        "Rhea",
        "Victor",
        "Sienna",
        "Alex",
        "Milo",
        "Anya",
        "Sam",
        "Leo",
      ],
      time: "Later",
      image: "/ex2.jpg",
      date: new CalendarDate(2026, 4, 24),
    },
    {
      circle: "Studio 54",
      people: [
        "John",
        "Max",
        "Valentina",
        "Luc",
        "Bianca",
        "Rafael",
        "Sasha",
        "Tony",
        "Nico",
        "Gia",
        "Evan",
        "Paolo",
        "Iris",
        "Marco",
        "Elena",
        "Dante",
        "Rose",
      ],
      time: "After",
      image: "/ex3.jpg",
      date: new CalendarDate(2026, 5, 26),
    },
    {
      circle: "Private",
      people: [
        "Peter",
        "Claire",
        "Jonah",
        "Elliot",
        "Freya",
        "Miles",
        "Hannah",
        "Owen",
        "Tess",
        "Caleb",
        "Rory",
        "Luca",
      ],
      time: "Now",
      image: "/ex4.jpg",
      date: new CalendarDate(2026, 6, 8),
    },
    {
      circle: "Second Light",
      people: [
        "Brian",
        "Aiden",
        "Naomi",
        "Lucas",
        "Emery",
        "Phoebe",
        "Khalil",
        "Julio",
        "Arman",
        "Keisha",
        "Finn",
        "Layla",
        "Theo",
        "Rami",
        "Ivy",
      ],
      time: "Later",
      image: "/ex5.jpg",
      date: new CalendarDate(2026, 7, 19),
    },
    {
      circle: "3rd Lounge",
      people: [
        "Brianna",
        "Jasper",
        "Amira",
        "Cole",
        "Yara",
        "Sebastian",
        "Nolan",
        "Marisol",
        "Tariq",
        "Anika",
        "Drew",
        "Hugo",
        "Maeve",
        "Reese",
        "Kian",
        "Lola",
      ],
      time: "After",
      image: "/ex6.jpg",
      date: new CalendarDate(2026, 8, 15),
    },
  ];

  const circles: Circle[] = signals.map((circle) => ({
    circle: circle.circle,
    date: circle.date,
    image: circle.image,
  }));

  const nextSignal = () => {
    setActiveSignal((i) => (i + 1) % signals.length);
  };

  const prevSignal = () => {
    setActiveSignal((i) => (i - 1 + signals.length) % signals.length);
  };

  //function to cycleback
  const goBack = () => {
    if (selectedModal === "confirm") {
      setSelectedModal(chooser!);
    } else if (selectedModal === "start") {
      // Go back to parent's two-card view
      onGoBack?.();
    } else {
      setSelectedModal("start");
    }
  };

  useEffect(() => {
    if (selectedWho) {
      setChooser(selectedWho);
    }
  }, [selectedWho, setChooser]);

  return (
    <>
      <motion.button
        onClick={goBack}
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        whileHover={{ x: -4, scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        transition={{
          opacity: { duration: 0.2 },
          x: { type: "spring", stiffness: 300, damping: 25 },
        }}
        className="absolute left-0 top-0 m-8 cursor-pointer flex gap-x-1 items-center text-white/80 hover:text-white transition-colors"
      >
        <motion.div
          animate={{ x: [0, -3, 0] }}
          transition={{
            repeat: Infinity,
            duration: 1.5,
            ease: "easeInOut",
            repeatDelay: 2,
          }}
        >
          <ChevronLeftIcon size={18} />
        </motion.div>
        back
      </motion.button>

      <motion.section
        layout
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -6 }}
        className={`mx-auto ${selectedModal !== "confirm" ? "max-w-md" : "max-w-7xl"}  text-[#cecece]/75`}
      >
        <AnimatePresence mode="wait">
          {selectedModal === "start" && (
            <motion.section key="start">
              <motion.div
                layout
                initial={{ opacity: 0.8 }}
                animate={{ opacity: 1 }}
                className="flex flex-col"
              >
                <label className="text-lg">What&apos;s the move?</label>
                <input
                  onChange={handleInputChange}
                  value={createMoment}
                  type="text"
                  id="move"
                  placeholder={`"Ramen Tonight"`}
                  disabled
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
                              whileFocus={{ scale: 1.01 }}
                              transition={{ duration: 0.15 }}
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
                        <InformationIcon size={18} color="currentColor" /> Just
                        checking interest — we&apos;ll decide the details
                        together.
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
                    onValueChange={(value) =>
                      onSelectionWho(value as WhoSelectionProp)
                    }
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
                    onClick={() => setSelectedModal(selectedWho!)}
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.96 }}
                    className="text-sm cursor-pointer px-4 py-2 bg-[#636363]/20 backdrop-blur-2xl 
                            text-white/90 border border-white/50 rounded-md 
                            transition-colors duration-150"
                  >
                    Continue
                  </motion.button>
                </motion.div>
              )}
            </motion.section>
          )}

          {selectedModal === "circle" && (
            <motion.section
              key="circle"
              layout
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              className="overflow-hidden text-center"
            >
              <AnimatePresence mode="wait">
                <div className="mb-4">
                  {selectedCircleProp ? (
                    <motion.h2
                      key="selected-title"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      Inviting
                      <br />
                      <span className="text-white font-medium text-xl">
                        {selectedCircleProp.circle}
                      </span>
                    </motion.h2>
                  ) : (
                    <motion.h2
                      key="browse-title"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      Who should see this event?
                    </motion.h2>
                  )}
                </div>
              </AnimatePresence>

              {/* MIDDLE — persistent */}
              <CircleScene
                circles={circles}
                activeIndex={activeSignal}
                selectedCircle={selectedCircleProp}
              />

              {/* CONTROLS — presence */}
              <AnimatePresence mode="wait">
                {selectedCircleProp === null && (
                  <motion.div
                    key="controls"
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.2, ease: "easeOut" }}
                  >
                    <CircleSignal
                      signals={signals}
                      activeIndex={activeSignal}
                    />
                    <CircleControls
                      nextMarker={nextSignal}
                      prevMarker={prevSignal}
                    />
                  </motion.div>
                )}
              </AnimatePresence>

              {/* CTA — persistent */}
            </motion.section>
          )}

          {selectedModal === "people" && <motion.section></motion.section>}
          {selectedModal === "nearby" && <motion.section></motion.section>}
          {selectedModal === "people" ||
            selectedModal === "nearby" ||
            (selectedModal === "circle" && (
              <SelectAction
                selectedSignal={selectedCircleProp}
                onSelect={() => setSelectedCircleProp(signals[activeSignal])}
                onContinue={() => setSelectedModal("confirm")}
              />
            ))}
          {selectedModal === "confirm" && <MomentConfirmation />}
        </AnimatePresence>
      </motion.section>
    </>
  );
}

interface ClockCircleLinearIconProps extends React.SVGProps<SVGSVGElement> {}

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
        <path
          d="M12 8v4l2.5 2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
    </svg>
  );
};
