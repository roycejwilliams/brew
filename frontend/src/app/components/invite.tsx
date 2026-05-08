import { motion } from "motion/react";
import React, { useState } from "react";
import ChevronLeftIcon from "./icons/ChevronLeftIcon";
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

  const inviteProp: InviteSelection[] = ["people", "where", "share"];

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
    <motion.section className="max-w-2xl mx-auto space-y-5 px-4">
      <motion.button
        onClick={() => goBack(inviteProp)}
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        whileHover={{ x: -4, scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        transition={{
          opacity: { duration: 0.2 },
          x: { type: "spring", stiffness: 300, damping: 25 },
        }}
        className={`absolute left-0 top-0 m-8 cursor-pointer flex gap-x-1 ${
          inviteSelection === "share" ? "hidden" : "block"
        } items-center text-white/80 hover:text-white transition-colors`}
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

      {inviteSelection === "people" && (
        <InvitePeople
          setInviteSelection={setInviteSelection}
          selectedInvitedUser={selectedInvitedUser}
          setSelectedInvitedUser={setSelectedInvitedUser}
        />
      )}

      {inviteSelection === "where" && (
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
      )}

      {inviteSelection === "share" && (
        <GenerateQrCode
          onClose={onClose}
          inviteType={inviteType}
          inviteId={inviteId}
        />
      )}
    </motion.section>
  );
}
