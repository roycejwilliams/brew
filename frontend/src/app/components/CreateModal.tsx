import { AnimatePresence, motion } from "motion/react";
import React, { useRef, useState } from "react";
import { useOutsideAlerter } from "../utils/outsideAlert";
import StartMoment from "./startMoment";
import Asterisk from "./icons/AsterikIcon";
import { CloseIcon } from "./icons";
import Invite from "./invite";
import CreateMoment from "./CreateMoment";

type CreateMomentStage = "start" | "circle" | "people" | "nearby" | "confirm";
type InviteSelection = "people" | "where" | "share";

interface CreateModalProp {
  onClose: () => void;
}

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
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          whileTap={{ scale: 0.95 }}
          transition={{
            type: "spring",
            stiffness: 300,
            damping: 25,
          }}
          className="absolute left-0 top-0 m-8 cursor-pointer flex gap-x-1 items-center text-white/80 hover:text-white transition-colors group"
        >
          <motion.span
            className="inline-block"
            whileHover={{ rotate: 90 }}
            transition={{ duration: 0.2 }}
          >
            <CloseIcon size={18} />
          </motion.span>
          close
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
