"use client";
import { ArrowUpRight } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import Image from "next/image";
import Moments from "./Moments";
import CircleDestination from "./CircleDestination";

type PurposeSelection = "moment" | "circle" | null;
type InviteSelection = "people" | "where" | "share";
type Destination = "destination" | "expectation";

interface InviteUserProp {
  id: string;
  username: string;
  phonenumber: string;
  email: string;
  isExternal?: boolean;
  first_name?: string;
  last_name?: string;
  profile_image?: string;
  profile: {
    fullname: string;
    avatarUrl: string;
  };
}

interface InviteMomentSelection {
  selectedPeople: InviteUserProp[];
  setInviteSelection: (inviteSelection: InviteSelection) => void;
  selectPurpose: PurposeSelection;
  setSelectedPurpose: (selectPurpose: PurposeSelection) => void;
  step: Destination;
  setStep: (step: Destination) => void;
  setInviteType: (inviteType: "moment" | "circle" | "referral") => void;
  setInviteId: (inviteId: string) => void;
}

const purposes = [
  {
    id: "moment",
    title: "A Moment",
    description: "Something specific, happening soon.",
    image: "/moment.jpg",
  },
  {
    id: "circle",
    title: "A Circle",
    description: "A group you trust.",
    image: "/circle.jpg",
  },
];

export default function InvitePurpose({
  selectedPeople,
  setInviteSelection,
  selectPurpose,
  setSelectedPurpose,
  step,
  setInviteId,
  setInviteType,
}: InviteMomentSelection) {
  return (
    <AnimatePresence mode="wait">
      {selectPurpose === null && (
        <motion.div
          key="purpose"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
          className="w-full max-w-sm sm:max-w-md mx-auto px-4 sm:px-0 flex flex-col gap-5"
        >
          {/* Header */}
          <div className="flex flex-col gap-1 text-center">
            <h2
              className="text-white md:text-xl text-md text-center font-medium tracking-[-0.3px] leading-tight"
              style={{ color: "rgba(255,255,255,0.85)" }}
            >
              What is this for?
            </h2>
            <p
              className="text-sm tracking-[-0.1px]"
              style={{ color: "rgba(255,255,255,0.3)" }}
            >
              Choose where you&apos;re bringing them.
            </p>
          </div>

          {/* Purpose cards */}
          <div
            className="rounded-xl overflow-hidden"
            style={{ border: "1px solid rgba(255,255,255,0.07)" }}
          >
            {purposes.map((purpose, i) => (
              <motion.button
                key={purpose.id}
                onClick={() =>
                  setSelectedPurpose(purpose.id as PurposeSelection)
                }
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.06 + i * 0.06, duration: 0.18 }}
                whileTap={{ scale: 0.99 }}
                className="group relative text-left px-6 py-10 flex justify-between items-center cursor-pointer w-full overflow-hidden"
                style={{
                  borderBottom:
                    i < purposes.length - 1
                      ? "1px solid rgba(255,255,255,0.07)"
                      : "none",
                }}
              >
                {/* Background image */}
                <Image
                  src={purpose.image}
                  alt={purpose.title}
                  fill
                  className="object-cover -z-20 brightness-50 group-hover:brightness-75 group-hover:scale-105 transition-all duration-700 ease-out"
                />

                {/* Gradient overlays */}
                <div className="absolute inset-0 -z-10 bg-linear-to-r from-black/90 via-black/60 to-black/20" />
                <div className="absolute inset-0 -z-10 bg-linear-to-t from-black/50 to-transparent" />

                {/* Grain */}
                <div
                  className="absolute inset-0 -z-10 opacity-[0.07]"
                  style={{
                    backgroundImage:
                      "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E\")",
                    backgroundSize: "120px",
                  }}
                />

                {/* Text */}
                <div className="flex flex-col gap-1.5">
                  <h3
                    className="text-sm font-medium tracking-[-0.2px] leading-snug"
                    style={{ color: "rgba(255,255,255,0.9)" }}
                  >
                    {purpose.title}
                  </h3>
                  <p
                    className="text-[11px] tracking-[-0.1px] transition-colors duration-300"
                    style={{ color: "rgba(255,255,255,0.38)" }}
                  >
                    {purpose.description}
                  </p>
                </div>

                {/* Arrow */}
                <div
                  className="ml-6 shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300"
                  style={{
                    border: "1px solid rgba(255,255,255,0.1)",
                    background: "rgba(255,255,255,0.05)",
                  }}
                >
                  <ArrowUpRight
                    size={14}
                    className="text-white/40 group-hover:text-white/80 transition-colors duration-300"
                  />
                </div>
              </motion.button>
            ))}
          </div>
        </motion.div>
      )}

      {selectPurpose === "moment" && (
        <motion.div
          key="moment"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
          className="w-full max-w-sm sm:max-w-md mx-auto px-4 sm:px-0"
        >
          <Moments
            selectedPeople={selectedPeople}
            setInviteSelection={setInviteSelection}
            setInviteId={setInviteId}
            setInviteType={setInviteType}
          />
        </motion.div>
      )}

      {selectPurpose === "circle" && (
        <motion.div
          key="circle"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
          className="w-full max-w-sm sm:max-w-md mx-auto px-4 sm:px-0"
        >
          <CircleDestination
            selectedPeople={selectedPeople}
            setInviteSelection={setInviteSelection}
            step={step}
            setInviteId={setInviteId}
            setInviteType={setInviteType}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
