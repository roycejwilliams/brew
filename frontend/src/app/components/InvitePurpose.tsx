import { ArrowUpRight } from "lucide-react";
import { motion } from "motion/react";
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
  setInviteId: (inviteId: string) => void; // <-- Updated this line
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
  setStep: _setStep,
  setInviteId,
  setInviteType,
}: InviteMomentSelection) {
  if (selectPurpose === null) {
    return (
      <motion.section
        key="purpose"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        className="space-y-6 mx-auto my-auto w-full"
      >
        <motion.div
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="text-center space-y-1"
        >
          <h2 className="text-white/90 text-lg font-medium tracking-[-0.2px]">
            What is this for?
          </h2>
          <p className="text-white/30 text-sm tracking-[-0.1px]">
            Choose where you&apos;re bringing them.
          </p>
        </motion.div>

        <div className="rounded-xl overflow-hidden border border-white/[0.07] divide-y divide-white/[0.07] shadow-2xl shadow-black/40">
          {purposes.map((purpose, i) => (
            <motion.button
              onClick={() => setSelectedPurpose(purpose.id as PurposeSelection)}
              key={purpose.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                delay: 0.15 + i * 0.08,
                duration: 0.4,
                ease: [0.16, 1, 0.3, 1],
              }}
              whileTap={{ scale: 0.99 }}
              className="group relative text-left px-6 py-10 flex justify-between items-center cursor-pointer w-full overflow-hidden"
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
                className="absolute inset-0 -z-10 opacity-10"
                style={{
                  backgroundImage:
                    "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E\")",
                  backgroundSize: "120px",
                }}
              />

              {/* Text */}
              <div className="space-y-1.5">
                <h3 className="text-sm font-medium text-white/90 tracking-[-0.1px] leading-snug">
                  {purpose.title}
                </h3>
                <p className="text-xs text-white/40 group-hover:text-white/60 transition-colors duration-300 tracking-[-0.1px]">
                  {purpose.description}
                </p>
              </div>

              {/* Arrow */}
              <motion.div
                whileHover={{ x: 2, y: -2 }}
                transition={{ duration: 0.2 }}
                className="ml-6 shrink-0 w-8 h-8 rounded-full border border-white/10 flex items-center justify-center bg-white/5 group-hover:bg-white/10 group-hover:border-white/20 transition-all duration-300"
              >
                <ArrowUpRight
                  size={14}
                  className="text-white/40 group-hover:text-white/80 transition-colors duration-300"
                />
              </motion.div>
            </motion.button>
          ))}
        </div>
      </motion.section>
    );
  }

  if (selectPurpose === "moment") {
    return (
      <Moments
        selectedPeople={selectedPeople}
        setInviteSelection={setInviteSelection}
        setInviteId={setInviteId}
        setInviteType={setInviteType}
      />
    );
  }

  if (selectPurpose === "circle") {
    return (
      <CircleDestination
        selectedPeople={selectedPeople}
        setInviteSelection={setInviteSelection}
        step={step}
        setInviteId={setInviteId}
        setInviteType={setInviteType}
      />
    );
  }
}
