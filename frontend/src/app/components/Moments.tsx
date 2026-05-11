import { AnimatePresence, motion } from "motion/react";
import React, { useState } from "react";
import Image from "next/image";
import { useGetAllMomentsOwnedByUser } from "@/hooks/useMoments";
import { useInviteAttendeeToMoment } from "@/hooks/useInvites";
import { useUserStore } from "@/stores/useUserStore";

type InviteSelection = "people" | "where" | "share";

interface InviteUserProp {
  id: string;
  username: string;
  phonenumber: string;
  email: string;
  isExternal?: boolean;
  profile: {
    fullname: string;
    avatarUrl: string;
  };
}

interface InviteMomentSelection {
  selectedPeople: InviteUserProp[];
  setInviteSelection: (inviteSelection: InviteSelection) => void;
  setInviteType: (inviteType: "moment" | "circle" | "referral") => void;
  setInviteId: (inviteId: string) => void;
}

const formatDate = (dateStr: Date | string) => {
  const d = new Date(dateStr);
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);

  const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  let label = "";
  if (d.toDateString() === today.toDateString()) label = "Tonight";
  else if (d.toDateString() === tomorrow.toDateString()) label = "Tomorrow";
  else label = days[d.getDay()];

  const time = d.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });

  return `${label} · ${time}`;
};

export default function Moments({
  selectedPeople,
  setInviteSelection,
  setInviteId,
  setInviteType,
}: InviteMomentSelection) {
  const { user } = useUserStore();
  const { data: ownedMoments, isLoading } = useGetAllMomentsOwnedByUser(
    user?.id as string,
  );
  const { mutate: inviteAttendee } = useInviteAttendeeToMoment();

  const moments: MomentProp[] = ownedMoments?.data.data || [];
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const fullname = selectedPeople.map(
    (name) => name.profile.fullname.split(" ")[0],
  );

  const handleInvite = () => {
    if (!selectedId) return;
    selectedPeople.forEach((person) => {
      inviteAttendee({ moment_id: selectedId, recipient: person.username });
    });
    //later feature
    // setStep("expectation");
    setInviteType("moment");
    setInviteId(selectedId);
    setInviteSelection("share");
  };

  if (isLoading)
    return (
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col items-center w-full px-6 py-10 gap-y-4"
      >
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="w-full h-16 rounded-xl bg-white/3 border border-white/5"
            animate={{ opacity: [0.3, 0.6, 0.3] }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              delay: i * 0.2,
              ease: "easeInOut",
            }}
          />
        ))}
      </motion.section>
    );

  if (moments.length === 0)
    return (
      <motion.section
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center w-full px-6 py-10 gap-y-4 text-center"
      >
        <p className="text-white/40 text-sm">
          You haven&apos;t created any moments yet.
        </p>
        <p className="text-white/20 text-xs">
          Create a moment first, then invite people to it.
        </p>
      </motion.section>
    );

  return (
    <motion.section
      key="moment"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      className="flex flex-col items-center w-full px-6 py-10 gap-y-8"
    >
      {/* Header */}
      <AnimatePresence mode="wait">
        <motion.h2
          key={selectedId ? "selected" : "default"}
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 4 }}
          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          className="text-white text-xl font-medium tracking-[-0.3px] leading-tight"
        >
          {selectedId
            ? `Inviting ${
                fullname.length > 3
                  ? `${fullname.slice(0, 3).join(", ")}, +${fullname.length - 3} more`
                  : fullname.join(", ")
              } to...`
            : "Bring them into something specific."}
        </motion.h2>
      </AnimatePresence>

      {/* Moment list */}
      <motion.div
        layout
        className="w-full rounded-xl border border-white/[0.07] overflow-hidden shadow-2xl shadow-black/30 divide-y divide-white/[0.07]"
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
              onClick={() =>
                setSelectedId(isSelected ? null : (moment.id as string))
              }
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
                  className="relative w-12 h-12 rounded-md overflow-hidden shrink-0 border border-white/10 bg-white/5"
                >
                  {moment.image ? (
                    <Image
                      src={moment.image}
                      alt={moment.moments_name}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-white/5" />
                  )}
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
                    {moment.moments_name}
                  </motion.p>
                  <p className="text-xs text-white/35 truncate">
                    <span className="text-white/50">
                      {moment.moment_start
                        ? formatDate(moment.moment_start)
                        : "Date TBD"}
                    </span>
                    {moment.description && ` · ${moment.description}`}
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
            className="flex flex-col items-center gap-2 pt-1 w-full"
          >
            <motion.button
              onClick={handleInvite}
              whileTap={{ scale: 0.97 }}
              transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="w-full py-4 rounded-md text-sm font-medium tracking-[-0.2px] transition-opacity duration-200 hover:opacity-90"
              style={{
                background: "#ffffff",
                color: "#111111",
                cursor: "pointer",
              }}
            >
              Invite them.
            </motion.button>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1, duration: 0.25 }}
              className="text-xs text-white/30"
            >
              They&apos;ll receive access instantly.
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.section>
  );
}
