import { AnimatePresence, motion } from "motion/react";
import React, { useRef, useState } from "react";
import { useOutsideAlerter } from "../utils/outsideAlert";
import StartMoment from "./startMoment";
import Asterisk from "./icons/AsterikIcon";
import { CloseIcon } from "./icons";
import Invite from "./invite";
import CreateMoment from "./CreateMoment";

type CreateMomentStage = "start" | "circle" | "people" | "nearby" | "confirm";
type InviteSelection = "people" | "where" | "share" | "refer";

interface CreateModalProp {
  onClose: () => void;
}

const EASE = [0.16, 1, 0.3, 1] as const;

function CreateModal({ onClose }: CreateModalProp) {
  const cardActionRef = useRef<HTMLDivElement>(null);

  const [cardAction, setCardAction] = useState<"create" | "invite" | null>(
    null,
  );

  //Allows you to switch between each modal depending on selection
  const [selectedModal, setSelectedModal] =
    useState<CreateMomentStage>("start");

  const [inviteSelection, setInviteSelection] =
    useState<InviteSelection>("people");

  useOutsideAlerter(cardActionRef, onClose);

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="w-full h-screen  fixed left-0 top-0 bg-linear-to-br from-black/80 to-[#535353] backdrop-blur-sm z-80"
    >
      {cardAction === null && (
        <motion.button
          onClick={onClose}
          initial={{ opacity: 0, x: -8 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, ease: EASE }}
          whileHover={{ x: -2 }}
          whileTap={{ scale: 0.94 }}
          className="fixed top-0 left-0 m-6 z-50 flex items-center gap-2 cursor-pointer group"
        >
          <div
            className="flex items-center justify-center transition-all duration-200"
            style={{
              width: 36,
              height: 36,
              borderRadius: "50%",
              background: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(255,255,255,0.1)",
            }}
          >
            <CloseIcon color="#fff" size={14} />
          </div>
          <span className="text-white/30 text-xs tracking-[-0.1px] opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            Close
          </span>
        </motion.button>
      )}

      <div className="mx-auto text-center mt-10 mb-4 flex flex-col justify-center items-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 0.75, ease: "easeInOut" }}
          className="mx-auto text-center text-6xl"
        >
          <Asterisk size={48} color="white" />
        </motion.div>

        <motion.h1
          key={cardAction ?? "default"}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="text-3xl font-normal mt-2"
        >
          {cardAction === "create"
            ? "Start a moment"
            : cardAction === "invite"
              ? "Invite"
              : "Create a moment."}
        </motion.h1>

        <motion.h3
          key={`${cardAction === "create" && `sub-${cardAction}-${selectedModal}`}
          ${cardAction === "invite" && `sub-${cardAction}-${inviteSelection}`}`}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="text-base mt-0 font-light"
        >
          {cardAction === "create" &&
            selectedModal === "start" &&
            "Set something in motion."}
          {cardAction === "invite" &&
            "Start with people. We’ll figure out the rest."}
          {cardAction === null && "Turn a passing idea into a real plan."}
        </motion.h3>

        {cardAction === null && (
          <motion.p
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="text-base mt-2"
          >
            Invite people, set the tone, and see what happens.
          </motion.p>
        )}
      </div>

      <motion.div
        className={`w-full h-fit mx-auto ${cardAction === "create" || cardAction === "invite" ? "mt-2" : "mt-24"}`}
      >
        <AnimatePresence mode="sync">
          {cardAction === "create" ? (
            //start moment
            <StartMoment
              setSelectedModal={setSelectedModal}
              selectedModal={selectedModal}
              onGoBack={() => {
                setCardAction(null);
              }}
            /> //invite
          ) : cardAction === "invite" ? (
            <Invite
              onGoBack={() => {
                setCardAction(null);
              }}
              inviteSelection={inviteSelection}
              setInviteSelection={setInviteSelection}
              onClose={onClose}
            />
          ) : (
            //Create moment
            <CreateMoment setCardAction={setCardAction} />
          )}
        </AnimatePresence>
      </motion.div>
    </motion.section>
  );
}

export default CreateModal;
