import React, { useEffect, useState } from "react";
import { AnimatePresence, motion, Variants } from "motion/react";
import { EditIcon, EyeIcon, PinIcon, PlusIcon } from "./icons";
import Image from "next/image";
import { StaticImport } from "next/dist/shared/lib/get-img-props";
import { GroupIcon } from "lucide-react";
import EventCard from "./eventCard";
import { openEventCard } from "@/stores/store";
import NewMomentModal from "./NewMomentModal";
import AttendanceList from "./AttendanceList";
import EditMoment from "./EditMoment";

type StatusSymbol = "live-now" | "ended" | "closed" | "recent" | null;

interface FocusStatusProps {
  status: StatusSymbol;
}

interface LiveMoment {
  id: string | null;
  image: string | StaticImport;
  attending: number | null;
  invited: number | null;
  pending: number | null;
  title: string;
  location: string;
  date: Date;
  startTime: Date;
  endTime: Date;
  status: StatusSymbol;
}

const containerVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.05,
    },
  },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, scale: 0.95, y: 10 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.3, ease: "easeOut" },
  },
};

//going to have to sync this with the time
const indicators = [
  { key: "live-now", code: "Live now", color: "#008000" },
  { key: "recent", code: "Recent", color: "#000" },
  { key: "ended", code: "Ended", color: "#761F17" },
  { key: "closed", code: "Closed", color: "#8B837E" },
];

interface FocusStatusProps {
  status: StatusSymbol;
}

export function FocusStatus({ status }: FocusStatusProps) {
  const indicator = indicators.find((stat) => stat.key === status);

  return (
    <>
      {" "}
      {indicator && (
        <div className="flex gap-x-2 items-center absolute top-0 left-0 m-4 z-10">
          {status === "live-now" ? (
            <motion.div
              className="w-2 h-2 rounded-full border border-white/10 shadow-sm"
              style={{ background: indicator.color }}
              animate={{ opacity: [0.4, 1, 0.4] }}
              transition={{
                duration: 1.6,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          ) : (
            <div
              className="w-2 h-2 rounded-full border border-white/10 shadow-sm"
              style={{ background: indicator.color, opacity: 0.5 }}
            />
          )}
          <span className="uppercase text-xs text-white font-medium tracking-wide">
            {indicator.code}
          </span>
        </div>
      )}
    </>
  );
}

const mockMoments: LiveMoment[] = [
  {
    id: "668aee82-3f60-4e17-b6df-288b85c6c7d1",
    image: "/status1.jpg",
    attending: 142,
    invited: 20,
    pending: 3,
    title: "Jazz Night at the Fox",
    location: "Fox Theater, Oakland CA",
    date: new Date("2026-03-23"),
    startTime: new Date("2026-03-23T20:00:00"),
    endTime: new Date("2026-03-23T22:00:00"),
    status: "live-now",
  },
];

export default function ManageMoments() {
  const [liveMoment, setLiveMoment] = useState<LiveMoment[] | null>(
    mockMoments,
  );

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const [momentsHistory, setMomentsHistory] = useState<LiveMoment[] | null>([]);

  const [utils, setUtils] = useState<"attendance" | "history" | "edit">(
    "history",
  );

  const openCard = openEventCard((state) => state.openEvent);

  //new moments go here
  const currentMoment = (newMoment: LiveMoment) => {
    //so if a new moment comes in the current moment get places in the history with a ended indicator
    if (newMoment) {
      setMomentsHistory((moment) => {
        if (!moment) return null;

        return moment && liveMoment?.[0]
          ? [...moment, liveMoment?.[0]]
          : moment;
      });
    }

    //sets the liveMoment to the most recent status and most recent moment
    setLiveMoment((prev) => {
      if (!prev) return null;
      const now = new Date();

      if (newMoment) {
        //false or undefine would break the state type thats why we're using []
        return prev?.[0] ? [prev?.[0], newMoment] : [];
      }

      if (now >= prev?.[0].endTime) {
        const updateStatus = {
          ...prev?.[0],
          status: "recent" as StatusSymbol,
        };

        return [updateStatus];
      }

      return prev ? [...prev] : prev;
    });
  };

  //status closed indicator
  const closeMoment = (eventId: string) => {
    setLiveMoment((prev) => {
      if (!prev) return null;

      const findId = prev?.find((id) => id.id === eventId);

      if (findId) {
        //changes the event status to close when at compacity or when due date is up
        const closeStatus = {
          ...findId,
          status: "closed" as StatusSymbol,
        };
        return [closeStatus];
      }

      return prev ? [...prev] : prev;
    });
  };

  // useEffect(() => {
  //   currentMoment(mockMoments[0]);
  // }, []);

  return (
    <section className="flex-1 shrink-0 relative">
      <motion.div
        className="flex justify-between px-8 pb-4 pt-8 items-start z-20 text-sm backdrop-blur-[10px] bg-[#1b1b1b]/5  border-b border-white/5 shadow-sm absolute top-0 w-full"
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
      >
        <h1 className="tracking-wide font-normal uppercase text-[#656565]">
          Moments
        </h1>
        <motion.button
          className="relative flex gap-x-1 cursor-pointer items-center px-4 py-2  rounded-md text-xs text-white overflow-hidden border border-white/15 bg-white/8 backdrop-blur-sm"
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => setIsModalOpen(true)}
        >
          <div className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-white/40 to-transparent" />
          <div className="absolute top-0 left-0 right-0 h-1/2 bg-linear-to-b from-white/8 to-transparent pointer-events-none" />
          <PlusIcon size={16} color="#fff" />
          New Moment
        </motion.button>
      </motion.div>
      <motion.div
        className="grid grid-cols-2 h-full gap-8 px-8 items-center"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div
          key="live-moment"
          className="col-span-1 h-4/5 mt-12 align-self-center border content-center  border-white/10 rounded-sm  relative overflow-hidden"
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
        >
          {liveMoment?.[0] ? (
            <>
              <FocusStatus status={liveMoment[0].status} />
              <Image
                src={liveMoment[0].image}
                alt={liveMoment[0].title}
                fill
                className="absolute w-full h-full brightness-70"
              />
              <div className="absolute bottom-0 left-0 p-4 flex w-full justify-between items-start">
                <div className="space-y-1 ">
                  <h2 className="text-white text-2xl font-semibold">
                    {liveMoment[0].title}
                  </h2>
                  <p className="text-white/70 text-sm flex items-center gap-x-1">
                    <PinIcon size={16} /> {liveMoment[0].location}
                  </p>
                  <p className="text-white/70 text-sm">
                    {liveMoment[0].date.toLocaleDateString("en-US", {
                      weekday: "short",
                      month: "short",
                      day: "numeric",
                    })}{" "}
                    •{" "}
                    {liveMoment[0].startTime.toLocaleTimeString("en-US", {
                      hour: "numeric",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
                <div className="flex mt-auto gap-x-2">
                  <motion.button
                    onClick={() => setUtils("attendance")}
                    className="relative flex items-center gap-x-1.5 px-3 py-1.5 rounded-full text-xs font-medium text-white/70 overflow-hidden border border-white/10 bg-white/8 backdrop-blur-sm hover:text-white hover:border-white/25 hover:bg-white/15 active:scale-95 active:bg-white/10 transition-colors duration-150 cursor-pointer"
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <div className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-white/30 to-transparent" />
                    <GroupIcon size={15} />
                    <span>Attendees</span>
                  </motion.button>

                  <motion.button
                    onClick={() => setUtils("edit")}
                    className="relative flex items-center gap-x-1.5 px-3 py-1.5 rounded-full text-xs font-medium text-white/70 overflow-hidden border border-white/10 bg-white/8 backdrop-blur-sm hover:text-white hover:border-white/25 hover:bg-white/15 active:scale-95 active:bg-white/10 transition-colors duration-150 cursor-pointer"
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <div className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-white/30 to-transparent" />
                    <EditIcon size={15} color="#fff" />
                    <span>Edit</span>
                  </motion.button>

                  <motion.button
                    onClick={() => openCard(liveMoment[0].id)}
                    className="relative flex items-center gap-x-1.5 px-3 py-1.5 rounded-full text-xs font-medium text-white/70 overflow-hidden border border-white/10 bg-white/8 backdrop-blur-sm hover:text-white hover:border-white/25 hover:bg-white/15 active:scale-95 active:bg-white/10 transition-colors duration-150 cursor-pointer"
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <div className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-white/30 to-transparent" />
                    <EyeIcon />
                    <span>View</span>
                  </motion.button>
                </div>
              </div>
              <div className="absolute top-0 right-0 p-4 text-right">
                <p className="text-white/70 text-sm">
                  attending{" "}
                  <span className="font-bold text-white text-lg">
                    {liveMoment[0].attending}
                  </span>
                </p>
                <p className="text-white/70 text-sm">
                  invited{" "}
                  <span className="font-bold text-white">
                    {liveMoment[0].invited}
                  </span>
                </p>
                <p className="text-white/70 text-sm">
                  pending{" "}
                  <span className="font-bold text-white">
                    {liveMoment[0].pending}
                  </span>
                </p>
              </div>
            </>
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center gap-6">
              <div className="relative w-16 h-16">
                <motion.div
                  className="absolute inset-0 rounded-full border border-white/10"
                  animate={{ scale: [1, 1.6, 1], opacity: [0.4, 0, 0.4] }}
                  transition={{
                    duration: 2.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />
                <motion.div
                  className="absolute inset-0 rounded-full border border-white/5"
                  animate={{ scale: [1, 2, 1], opacity: [0.2, 0, 0.2] }}
                  transition={{
                    duration: 2.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 0.4,
                  }}
                />
                <div className="absolute inset-0 rounded-full border border-white/20 flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-white/30" />
                </div>
              </div>
              <div className="flex flex-col gap-1 text-center">
                <p className="text-white/50 text-sm tracking-wide">
                  Nothing live yet.
                </p>
                <p className="text-white/20 text-xs">
                  Create a moment and bring people together.
                </p>
              </div>
            </div>
          )}
        </motion.div>

        <motion.div className="col-span-1 h-full pb-10 pt-24 justify-center gap-4 overflow-y-auto no-scrollbar">
          <AnimatePresence mode="wait">
            {utils === "history" && (
              <motion.div
                key="history"
                className="col-span-2 w-full h-full grid grid-cols-2 place-items-start gap-4"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
              >
                {momentsHistory && momentsHistory.length > 0 ? (
                  momentsHistory.map((moments, i) => (
                    <motion.div
                      key={`moments-history-${i}`}
                      variants={cardVariants}
                      className="aspect-square w-full border border-white/10 rounded-sm relative"
                    >
                      <FocusStatus status="ended" />
                      <Image
                        src={moments.image}
                        alt={moments.title}
                        fill
                        className="absolute w-full h-full brightness-75"
                      />
                    </motion.div>
                  ))
                ) : (
                  <div className="col-span-2 flex flex-col items-center justify-center w-full h-full gap-6 text-center">
                    <div className="relative w-48 h-48 mx-auto flex justify-center items-center">
                      <div
                        className="absolute w-28 h-36 rounded-lg border border-white/10 bg-white/5 backdrop-blur-sm"
                        style={{
                          transform:
                            "rotate(-12deg) translateX(-30px) translateY(10px)",
                        }}
                      />
                      <div
                        className="absolute w-28 h-36 rounded-lg border border-white/10 bg-white/5 backdrop-blur-sm"
                        style={{
                          transform:
                            "rotate(10deg) translateX(30px) translateY(10px)",
                        }}
                      />
                      <div
                        className="absolute w-28 h-36 rounded-lg border border-white/10 bg-white/8 backdrop-blur-sm"
                        style={{
                          transform:
                            "rotate(0deg) translateX(0px) translateY(0px)",
                        }}
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <p className="text-white/60 text-sm tracking-wide">
                        Your moments live here.
                      </p>
                      <p className="text-white/25 text-xs">
                        The nights worth remembering will find their place.
                      </p>
                    </div>
                  </div>
                )}
              </motion.div>
            )}

            {utils === "attendance" && (
              <AttendanceList key="attendance" setUtils={setUtils} />
            )}

            {utils === "edit" && (
              <EditMoment
                key="edit"
                setUtils={setUtils}
                moment={liveMoment?.[0]}
              />
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>
      <AnimatePresence mode="wait">
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setIsModalOpen(false)}
            />
            <NewMomentModal setIsModalOpen={setIsModalOpen} />
          </div>
        )}{" "}
      </AnimatePresence>
    </section>
  );
}
