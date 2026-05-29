"use client";
import { motion, AnimatePresence } from "motion/react";
import React, { useState } from "react";
import { ChevronLeftIcon } from "./icons";
import InvitePeople from "./InvitePeople";
import InvitePurpose from "./InvitePurpose";
import GenerateQrCode from "./GenerateQrCode";

type InviteSelection = "people" | "where" | "share";
type PurposeSelection = "moment" | "circle" | null;

interface InviteProp {
  onGoBack?: () => void;
  onContinue?: () => void;
  inviteSelection: InviteSelection;
  setInviteSelection: (inviteSelection: InviteSelection) => void;
  onClose: () => void;
}

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

const EASE = [0.16, 1, 0.3, 1] as const;

const inviteProp: InviteSelection[] = ["people", "where", "share"];

export default function Invite({
  onGoBack,
  inviteSelection,
  setInviteSelection,
  onClose,
}: InviteProp) {
  const [selectedInvitedUser, setSelectedInvitedUser] = useState<
    InviteUserProp[]
  >([]);
  const [selectPurpose, setSelectedPurpose] = useState<PurposeSelection | null>(
    null,
  );
  const [step, setStep] = useState<"destination" | "expectation">(
    "destination",
  );
  const [inviteType, setInviteType] = useState<
    "moment" | "circle" | "referral"
  >("moment");
  const [inviteId, setInviteId] = useState<string>("");

  const goBack = (steps: InviteSelection[]) => {
    if (!steps.includes(inviteSelection)) return;
    const position = steps.indexOf(inviteSelection);

    if (position === 0) {
      onGoBack?.();
      return;
    }

    if (
      inviteSelection === "where" &&
      (selectPurpose === "moment" || selectPurpose === "circle")
    ) {
      if (selectPurpose === "circle" && step === "expectation") {
        setStep("destination");
      } else {
        setSelectedPurpose(null);
      }
    } else {
      setInviteSelection(steps[position - 1]);
    }
  };

  return (
    <div className="w-full max-w-sm sm:max-w-md mx-auto px-4 sm:px-0 ">
      {/* Back button */}
      <AnimatePresence>
        {inviteSelection !== "share" && (
          <motion.button
            onClick={() => goBack(inviteProp)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            whileTap={{ scale: 0.94 }}
            className="absolute left-0 top-0 m-5 sm:m-6 z-50 cursor-pointer flex items-center gap-2 group"
          >
            <div
              className="flex items-center justify-center"
              style={{
                width: 36,
                height: 36,
                borderRadius: "50%",
                background: "rgba(var(--fg),0.06)",
                border: "1px solid rgba(var(--fg),0.1)",
              }}
            >
              <ChevronLeftIcon size={16} />
            </div>
            <span
              className="text-xs tracking-[-0.1px] opacity-0 group-hover:opacity-100 transition-opacity duration-200"
              style={{ color: "rgba(var(--fg),0.25)" }}
            >
              Back
            </span>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Step dots */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 mt-6 flex items-center gap-1.5"
        style={{ zIndex: 20 }}
      >
        {inviteProp.map((stage) => {
          const idx = inviteProp.indexOf(stage);
          const currentIdx = inviteProp.indexOf(inviteSelection);
          const isActive = stage === inviteSelection;
          const isPast = currentIdx > idx;
          return (
            <motion.div
              key={stage}
              animate={{
                width: isActive ? 18 : 4,
                background: isActive
                  ? "#d4a574"
                  : isPast
                    ? "rgba(212,165,116,0.32)"
                    : "rgba(var(--fg),0.1)",
              }}
              transition={{ duration: 0.35, ease: EASE }}
              style={{ height: 3, borderRadius: 2 }}
            />
          );
        })}
      </div>

      {/* Content */}
      <AnimatePresence mode="wait">
        {inviteSelection === "people" && (
          <motion.div
            key="people"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
          >
            <InvitePeople
              setInviteSelection={setInviteSelection}
              selectedInvitedUser={selectedInvitedUser}
              setSelectedInvitedUser={setSelectedInvitedUser}
            />
          </motion.div>
        )}

        {inviteSelection === "where" && (
          <motion.div
            key="where"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
          >
            <InvitePurpose
              selectedPeople={selectedInvitedUser}
              setInviteSelection={setInviteSelection}
              selectPurpose={selectPurpose}
              setSelectedPurpose={setSelectedPurpose}
              step={step}
              setStep={setStep}
              setInviteType={setInviteType}
              setInviteId={setInviteId}
            />
          </motion.div>
        )}

        {inviteSelection === "share" && (
          <motion.div
            key="share"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
          >
            <GenerateQrCode
              onClose={onClose}
              inviteType={inviteType}
              inviteId={inviteId}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
