import { AnimatePresence, motion } from "motion/react";
import React, { useState } from "react";
import { CalendarDate } from "@internationalized/date";
import Image from "next/image";
import { StaticImport } from "next/dist/shared/lib/get-img-props";

interface Moment {
  id: string;
  circleId: string;
  title: string;
  date: CalendarDate;
  time: string;
  description: string;
  attendees: string[];
  image: string;
}

interface UserProp {
  id: string;
  username: string;
  phonenumber: string;
  email: string;
  profile: {
    fullname: string;
    avatarUrl: string | StaticImport;
  };
}

interface InviteMomentSelection {
  selectedPeople: UserProp[];
}

const formatDate = (date: CalendarDate, time: string) => {
  const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const d = new Date(date.year, date.month - 1, date.day);
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);

  let label = "";
  if (d.toDateString() === today.toDateString()) label = "Tonight";
  else if (d.toDateString() === tomorrow.toDateString()) label = "Tomorrow";
  else label = days[d.getDay()];

  return `${label} · ${time}`;
};

export default function Moments({ selectedPeople }: InviteMomentSelection) {
  const mockMoments: Moment[] = [
    {
      id: "moment_1",
      circleId: "circle_founders",
      title: "Late-Night Ramen",
      date: new CalendarDate(2026, 2, 22),
      time: "8:30 PM",
      description: "Nothing fancy. Just ramen and catching up.",
      attendees: ["alex", "jordan", "mia"],
      image: "/ramen.jpg",
    },
    {
      id: "moment_2",
      circleId: "circle_founders",
      title: "Founder's Club – Morning Connect & Walk",
      date: new CalendarDate(2026, 2, 23),
      time: "7:30 AM",
      description:
        "Start the day moving and talking. Coffee after if it feels right.",
      attendees: ["sam", "jordan"],
      image: "/founder.jpg",
    },
    {
      id: "moment_3",
      circleId: "circle_creatives",
      title: "Wine & Ideas",
      date: new CalendarDate(2026, 2, 24),
      time: "7:00 PM",
      description: "A bottle or two. No agenda. Let the conversation wander.",
      attendees: ["lena", "omar", "chris"],
      image: "/wine.jpg",
    },
    {
      id: "moment_4",
      circleId: "circle_studio",
      title: "Studio Drop-In",
      date: new CalendarDate(2026, 2, 25),
      time: "Afternoon",
      description: "Working on things. Come by if you're nearby.",
      attendees: ["maya"],
      image: "/studio.jpg",
    },
  ];

  const [moments] = useState<Moment[]>(mockMoments);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const fullname = selectedPeople.map(
    (name) => name.profile.fullname.split(" ")[0],
  );

  return (
    <motion.section
      key="moment"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      className="space-y-5 mx-auto w-full"
    >
      {/* Header */}
      <AnimatePresence mode="wait">
        <motion.h2
          key={selectedId ? "selected" : "default"}
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 4 }}
          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          className="text-white/50 text-center tracking-wide"
        >
          {selectedId
            ? `Inviting ${fullname?.join(" & ") ?? "them"} to...`
            : "Bring them into something specific."}
        </motion.h2>
      </AnimatePresence>

      {/* Moment list */}
      <motion.div
        layout
        className="rounded-xl border border-white/[0.07] overflow-hidden shadow-2xl shadow-black/30 divide-y divide-white/[0.07]"
      >
        {moments.map((moment, i) => {
          const isSelected = selectedId === moment.id;

          return (
            <motion.button
              key={moment.id}
              layout
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                delay: 0.1 + i * 0.07,
                duration: 0.35,
                ease: [0.16, 1, 0.3, 1],
              }}
              onClick={() => setSelectedId(isSelected ? null : moment.id)}
              className="w-full text-left"
            >
              <motion.div
                animate={{
                  backgroundColor: isSelected
                    ? "rgba(255,255,255,0.06)"
                    : "rgba(255,255,255,0)",
                }}
                transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                className="flex items-center gap-4 px-4 py-4 relative"
              >
                {/* Selected indicator */}
                <AnimatePresence>
                  {isSelected && (
                    <motion.div
                      initial={{ scaleY: 0, opacity: 0 }}
                      animate={{ scaleY: 1, opacity: 1 }}
                      exit={{ scaleY: 0, opacity: 0 }}
                      transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                      className="absolute left-0 top-2 bottom-2 w-0.5 bg-white/60 rounded-full origin-center"
                    />
                  )}
                </AnimatePresence>

                {/* Thumbnail */}
                <motion.div
                  animate={{ scale: isSelected ? 1.04 : 1 }}
                  transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                  className="relative w-12 h-12 rounded-md overflow-hidden shrink-0 border border-white/10"
                >
                  <Image
                    src={moment.image}
                    alt={moment.title}
                    fill
                    className="object-cover"
                  />
                </motion.div>

                {/* Text */}
                <div className="flex-1 min-w-0 space-y-0.5">
                  <motion.p
                    animate={{
                      color: isSelected
                        ? "rgba(255,255,255,0.95)"
                        : "rgba(255,255,255,0.85)",
                    }}
                    className="text-sm font-medium leading-snug truncate"
                  >
                    {moment.title}
                  </motion.p>
                  <p className="text-xs text-white/35 truncate">
                    <span className="text-white/50">
                      {formatDate(moment.date, moment.time)}
                    </span>
                    {" · "}
                    {moment.description}
                  </p>
                </div>

                {/* Selection dot */}
                <div className="shrink-0 w-4 h-4 rounded-full border border-white/20 flex items-center justify-center">
                  <AnimatePresence>
                    {isSelected && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                        transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                        className="w-2 h-2 rounded-full bg-white"
                      />
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            </motion.button>
          );
        })}
      </motion.div>

      {/* Confirm button */}
      <AnimatePresence>
        {selectedId && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 6 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col items-center gap-2 pt-1"
          >
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="bg-white text-black text-sm font-medium px-8 py-3 rounded-full cursor-pointer"
            >
              Invite them.
            </motion.button>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1, duration: 0.25 }}
              className="text-xs text-white/30"
            >
              They'll receive access instantly.
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.section>
  );
}
