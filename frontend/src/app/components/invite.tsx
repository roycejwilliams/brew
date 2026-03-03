import { motion } from "motion/react";
import React, { useState } from "react";
import ChevronLeftIcon from "./icons/ChevronLeftIcon";
import { StaticImport } from "next/dist/shared/lib/get-img-props";
import InvitePeople from "./InvitePeople";
import InvitePurpose from "./InvitePurpose";
import GenerateQrCode from "./GenerateQrCode";
import InviteConfirm from "./InviteConfirm";

type InviteSelection = "people" | "where" | "share" | "refer";

type PurposeSelection = "moment" | "circle" | "brew" | null;

interface InviteProp {
  onGoBack?: () => void;
  onContinue?: () => void;
  inviteSelection: InviteSelection;
  setInviteSelection: (inviteSelection: InviteSelection) => void;
  onClose: () => void;
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

export default function Invite({
  onGoBack,
  inviteSelection,
  setInviteSelection,
  onClose,
}: InviteProp) {
  //holds the previous selections

  const [selectedInvitedUser, setSelectedInvitedUser] = useState<UserProp[]>(
    [],
  );

  const [selectPurpose, setSelectedPurpose] = useState<PurposeSelection | null>(
    null,
  );

  const [step, setStep] = useState<"destination" | "expectation">(
    "destination",
  );

  const inviteProp: InviteSelection[] = ["people", "where", "share"];

  const goBack = (steps: InviteSelection[]) => {
    if (!steps.includes(inviteSelection)) return;

    const position = steps.indexOf(inviteSelection);

    console.log("steps:", position);

    if (position === 0) {
      onGoBack?.();
      return;
    }

    if (
      inviteSelection === "where" &&
      (selectPurpose === "moment" ||
        selectPurpose === "circle" ||
        selectPurpose === "brew")
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
    <motion.section className="max-w-2xl  mx-auto my-a space-y-5 px-4">
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
        className={`absolute left-0 top-0 m-8 cursor-pointer flex gap-x-1 ${inviteSelection === "share" || inviteSelection === "refer" ? "hidden" : "block"} items-center text-white/80 hover:text-white transition-colors`}
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
        />
      )}

      {inviteSelection === "share" && <GenerateQrCode onClose={onClose} />}

      {inviteSelection === "refer" && <InviteConfirm onClose={onClose} />}
    </motion.section>
  );
}
