import React, { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import Image from "next/image";
import Expectation from "./Expectation";
import { useGetAllCirclesOwnedByUser } from "@/hooks/useCircles";
import { useCreateCircle } from "@/hooks/useCircles";
import { useInviteMemberToCircle, useInviteExternalToCircle } from "@/hooks/useInvites";
import { useUserStore } from "@/stores/useUserStore";

type InviteSelection = "people" | "where" | "share";
type Destination = "destination" | "expectation";

interface InviteSelectionProp {
  setInviteSelection: (inviteSelection: InviteSelection) => void;
  step: Destination;
  selectedPeople: {
    id: string;
    username: string;
    phonenumber: string;
    email: string;
    isExternal?: boolean;
    profile: { fullname: string; avatarUrl: string };
  }[];
  setInviteType: (inviteType: "moment" | "circle" | "referral") => void;
  setInviteId: (inviteId: string) => void;
}

export default function CircleDestination({
  setInviteSelection,
  step,
  selectedPeople,
  setInviteType,
  setInviteId,
}: InviteSelectionProp) {
  const [circleOption, setCircleOption] = useState<"new" | "existing" | null>(
    null,
  );
  const [selectedCircle, setSelectedCircle] = useState<string | null>(null);
  const [newCircleName, setNewCircleName] = useState("");

  const { user } = useUserStore();
  const { data: circlesData, isLoading } = useGetAllCirclesOwnedByUser(
    user?.id as string,
  );
  const { mutate: createCircle, isPending: isCreating } = useCreateCircle();
  const { mutate: inviteMember } = useInviteMemberToCircle();
  const { mutate: inviteExternal } = useInviteExternalToCircle();

  const circles: CircleProp[] = circlesData?.data.data || [];

  const canContinue =
    circleOption === "new"
      ? newCircleName.trim().length > 0
      : circleOption === "existing"
        ? selectedCircle !== null
        : false;

  const handleContinue = () => {
    if (circleOption === "new") {
      createCircle(
        {
          circle_name: newCircleName,
          owner_id: user?.id,
        } as CircleProp,
        {
          onSuccess: (data) => {
            const newCircle = data.data.data;
            selectedPeople.forEach((person) => {
              if (person.isExternal) {
                inviteExternal({ circle_id: newCircle?.id, recipient: person.email || person.phonenumber });
              } else {
                inviteMember({
                  circle: newCircle,
                  invite_member: { member_id: person.id } as InviteMembersProp,
                });
              }
            });
            //later feature
            // setStep("expectation");
            setInviteId(newCircle?.id);
            setInviteType("circle");
            setInviteSelection("share");
          },
        },
      );
    } else if (circleOption === "existing" && selectedCircle) {
      const circle = circles.find((c) => c.id === selectedCircle);
      if (!circle) return;
      selectedPeople.forEach((person) => {
        if (person.isExternal) {
          inviteExternal({ circle_id: circle.id as string, recipient: person.email || person.phonenumber });
        } else {
          inviteMember({
            circle,
            invite_member: { member_id: person.id } as InviteMembersProp,
          });
        }
      });
      //later feature
      // setStep("expectation");
      setInviteId(circle?.id as string);
      setInviteType("circle");
      setInviteSelection("share");
    }
  };

  if (step === "destination") {
    return (
      <motion.section
        key="circle-destination"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        className="flex flex-col gap-y-8 mx-auto w-full px-6 py-8"
      >
        <motion.div
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          className="text-center space-y-1 pt-2"
        >
          <h2 className="text-black dark:text-white md:text-xl text-md text-center font-medium tracking-[-0.3px] leading-tight">
            Where should these people live?
          </h2>
          <p className="text-black/40 dark:text-white/40 text-sm tracking-[-0.1px]">
            Invite them into an existing Circle or start a new one.
          </p>
        </motion.div>

        <div className="grid grid-cols-2 gap-3">
          <motion.button
            onClick={() => {
              setCircleOption("new");
              setSelectedCircle(null);
            }}
            whileTap={{ scale: 0.97 }}
            animate={{
              opacity: circleOption === "existing" ? 0.25 : 1,
              scale: circleOption === "new" ? 1.01 : 1,
            }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="relative flex flex-col items-center justify-center gap-3 rounded-md p-5 cursor-pointer"
            style={{
              background:
                circleOption === "new"
                  ? "rgba(var(--fg),0.09)"
                  : "rgba(var(--fg),0.04)",
              border:
                circleOption === "new"
                  ? "1px solid rgba(var(--fg),0.22)"
                  : "1px solid rgba(var(--fg),0.06)",
              minHeight: 130,
            }}
          >
            <div
              className="flex items-center justify-center rounded-full transition-all duration-200"
              style={{
                width: 40,
                height: 40,
                background:
                  circleOption === "new"
                    ? "rgba(var(--fg),0.14)"
                    : "rgba(var(--fg),0.06)",
              }}
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path
                  d="M8 3v10M3 8h10"
                  stroke={
                    circleOption === "new"
                      ? "rgba(var(--fg),0.95)"
                      : "rgba(var(--fg),0.4)"
                  }
                  strokeWidth="1.6"
                  strokeLinecap="round"
                />
              </svg>
            </div>
            <div className="text-center">
              <p
                className="text-sm font-medium tracking-[-0.1px]"
                style={{
                  color:
                    circleOption === "new"
                      ? "rgba(var(--fg),0.95)"
                      : "rgba(var(--fg),0.45)",
                }}
              >
                New Circle
              </p>
              <p
                className="text-xs mt-0.5"
                style={{
                  color:
                    circleOption === "new"
                      ? "rgba(var(--fg),0.35)"
                      : "rgba(var(--fg),0.2)",
                }}
              >
                Start fresh
              </p>
            </div>
          </motion.button>

          <motion.button
            onClick={() => {
              setCircleOption("existing");
              setNewCircleName("");
            }}
            whileTap={{ scale: 0.97 }}
            animate={{
              opacity: circleOption === "new" ? 0.25 : 1,
              scale: circleOption === "existing" ? 1.01 : 1,
            }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="relative flex flex-col items-center justify-center gap-3 rounded-md p-5 cursor-pointer"
            style={{
              background:
                circleOption === "existing"
                  ? "rgba(var(--fg),0.09)"
                  : "rgba(var(--fg),0.04)",
              border:
                circleOption === "existing"
                  ? "1px solid rgba(var(--fg),0.22)"
                  : "1px solid rgba(var(--fg),0.06)",
              minHeight: 130,
            }}
          >
            <div
              className="flex items-center justify-center rounded-full transition-all duration-200"
              style={{
                width: 40,
                height: 40,
                background:
                  circleOption === "existing"
                    ? "rgba(var(--fg),0.14)"
                    : "rgba(var(--fg),0.06)",
              }}
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <circle
                  cx="8"
                  cy="8"
                  r="5"
                  stroke={
                    circleOption === "existing"
                      ? "rgba(var(--fg),0.95)"
                      : "rgba(var(--fg),0.4)"
                  }
                  strokeWidth="1.6"
                />
                <circle
                  cx="8"
                  cy="8"
                  r="2"
                  fill={
                    circleOption === "existing"
                      ? "rgba(var(--fg),0.95)"
                      : "rgba(var(--fg),0.4)"
                  }
                />
              </svg>
            </div>
            <div className="text-center">
              <p
                className="text-sm font-medium tracking-[-0.1px]"
                style={{
                  color:
                    circleOption === "existing"
                      ? "rgba(var(--fg),0.95)"
                      : "rgba(var(--fg),0.45)",
                }}
              >
                Existing
              </p>
              <p
                className="text-xs mt-0.5"
                style={{
                  color:
                    circleOption === "existing"
                      ? "rgba(var(--fg),0.35)"
                      : "rgba(var(--fg),0.2)",
                }}
              >
                Add to one
              </p>
            </div>
          </motion.button>
        </div>

        <AnimatePresence mode="popLayout">
          {circleOption === "new" && (
            <motion.div
              key="new-circle-input"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col gap-1"
            >
              <p className="text-black/25 dark:text-white/25 text-xs tracking-wide uppercase font-medium mb-2">
                Circle name
              </p>
              <div
                className="w-full rounded-md px-4 py-4 transition-all duration-200"
                style={{
                  background: "rgba(var(--fg),0.05)",
                  border: newCircleName.trim()
                    ? "1px solid rgba(var(--fg),0.2)"
                    : "1px solid rgba(var(--fg),0.08)",
                }}
              >
                <input
                  type="text"
                  value={newCircleName}
                  onChange={(e) => setNewCircleName(e.target.value)}
                  placeholder="e.g. Inner Circle, NYC crew…"
                  autoFocus
                  className="w-full bg-transparent text-black dark:text-white placeholder-black/20 dark:placeholder-white/20 text-sm tracking-[-0.3px] outline-none"
                />
              </div>
              <p className="text-black/20 dark:text-white/20 text-xs tracking-[-0.1px] mt-1 px-1">
                This name defines who&apos;s inside. Choose carefully.
              </p>
            </motion.div>
          )}

          {circleOption === "existing" && (
            <motion.div
              key="existing-circles"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col gap-2"
            >
              <p className="text-black/25 dark:text-white/25 text-xs tracking-wide uppercase font-medium mb-2">
                Your circles
              </p>
              {isLoading ? (
                [0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    className="w-full h-14 rounded-md bg-white/3 border border-white/5"
                    animate={{ opacity: [0.3, 0.6, 0.3] }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      delay: i * 0.2,
                      ease: "easeInOut",
                    }}
                  />
                ))
              ) : circles.length === 0 ? (
                <p className="text-black/30 dark:text-white/30 text-sm text-center py-4">
                  No circles yet.
                </p>
              ) : (
                circles.map((circle, i) => (
                  <motion.button
                    key={circle.id}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.22,
                      delay: i * 0.05,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                    whileTap={{ scale: 0.99 }}
                    onClick={() => setSelectedCircle(circle.id as string)}
                    className="flex items-center justify-between w-full px-4 py-3.5 rounded-md cursor-pointer transition-all duration-200"
                    style={{
                      background:
                        selectedCircle === circle.id
                          ? "rgba(var(--fg),0.09)"
                          : "rgba(var(--fg),0.03)",
                      border:
                        selectedCircle === circle.id
                          ? "1px solid rgba(var(--fg),0.2)"
                          : "1px solid rgba(var(--fg),0.05)",
                    }}
                  >
                    <div className="flex gap-x-4 items-center">
                      <div className="w-8 h-8 rounded-sm relative overflow-hidden bg-white/5">
                        {circle.circle_image && (
                          <Image
                            src={circle.circle_image}
                            alt={circle.circle_name}
                            fill
                            className="object-cover"
                          />
                        )}
                      </div>
                      <span
                        className="text-sm font-medium tracking-[-0.1px] transition-colors duration-200"
                        style={{
                          color:
                            selectedCircle === circle.id
                              ? "rgba(var(--fg),0.95)"
                              : "rgba(var(--fg),0.5)",
                        }}
                      >
                        {circle.circle_name}
                      </span>
                    </div>
                    <span
                      className="text-xs transition-colors duration-200"
                      style={{
                        color:
                          selectedCircle === circle.id
                            ? "rgba(var(--fg),0.35)"
                            : "rgba(var(--fg),0.18)",
                      }}
                    >
                      {circle.members?.length ?? 0} people
                    </span>
                  </motion.button>
                ))
              )}
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {circleOption && (
            <motion.button
              onClick={handleContinue}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: canContinue ? 1 : 0.3, y: 0 }}
              exit={{ opacity: 0, y: 6 }}
              whileTap={{ scale: canContinue ? 0.97 : 1 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              disabled={!canContinue || isCreating}
              className="w-full py-4 rounded-md text-sm font-medium tracking-[-0.2px] transition-opacity duration-200 hover:opacity-90"
              style={{
                background: "#ffffff",
                color: "#111111",
                cursor: canContinue ? "pointer" : "default",
              }}
            >
              {isCreating ? "Creating..." : "Continue"}
            </motion.button>
          )}
        </AnimatePresence>
      </motion.section>
    );
  }

  if (step === "expectation") {
    return <Expectation setInviteSelection={setInviteSelection} />;
  }
}
