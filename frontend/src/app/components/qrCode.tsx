import { AnimatePresence, motion } from "motion/react";
import React, { useRef, useState } from "react";
import { useOutsideAlerter } from "../utils/outsideAlert";
import CanvasQRcode from "./canvasQRcode";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faCopy, faSearch } from "@fortawesome/free-solid-svg-icons";

interface QRProps {
  onClose: () => void;
}

function QRCode({ onClose }: QRProps) {
  const ref = useRef<HTMLDivElement | null>(null);

  useOutsideAlerter(ref, onClose);

  const [sent, setSent] = useState<boolean>(false);
  const [loading, setLoading] = useState(false);

  const sendInvite = () => {
    setLoading(true);
    setSent(false);

    // Simulate API delay
    setTimeout(() => {
      setLoading(false);
      setSent(true);
    }, 2000);
  };

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="w-full h-screen bg-linear-to-b absolute top-0 left-0 bg-black/10 backdrop-blur-md z-50 flex justify-center items-center"
    >
      {" "}
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 200 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 200 }}
        transition={{ duration: 0.35, ease: "easeInOut", delay: 0.2 }}
        className="w-1/4 bg-linear-to-b from-[#2b2b2b] to-black relative rounded-2xl shadow-sm border border-white/10 p-8"
      >
        <div className="w-full flex justify-between items-center gap-4">
          <h2 className="text-2xl">Invite</h2>
        </div>

        <div className="overflow-hidden rounded-xl w-fit mt-4 mx-auto">
          <CanvasQRcode />
        </div>
        <AnimatePresence mode="wait">
          {" "}
          {sent ? (
            <motion.div
              key="sent"
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{ duration: 0.35, ease: "easeInOut" }}
            >
              <div className="w-24 h-24 bg-linear-to-b  my-4 shadow relative rounded-full border border-white/15 flex justify-center items-center mx-auto">
                <FontAwesomeIcon icon={faCheck} />{" "}
              </div>
              <p className="mt-2 text-sm text-center mx-auto">
                Invite Sent Successfully
              </p>
            </motion.div>
          ) : (
            <motion.div
              key="form"
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{
                duration: 0.4,
                ease: "easeInOut",
              }}
            >
              <div className="text-center mt-2 text-xs">
                {" "}
                <span>24/25 remain</span>
              </div>
              <button className=" w-fit mx-auto text-center py-2 px-4 border rounded-full bg-white shadow text-black flex gap-x-1 cursor-pointer gap-y-2 mt-4 items-center ">
                <FontAwesomeIcon icon={faCopy} />
                <span className=" text-xs">Copy Link</span>
              </button>
              <div className="mt-4 flex rounded-full items-center border p-2.5 text-white w-full px-4 gap-x-2 border-gray-300/30  bg-transparent">
                <FontAwesomeIcon icon={faSearch} />
                <input
                  type="search"
                  id="username"
                  className=" text-xs  placeholder:text-xs block mx-auto flex-1  placeholder:text-white/50 focus:outline-none"
                  placeholder="Invite with username or email"
                  required
                />
              </div>
              <button
                onClick={sendInvite}
                role="submit"
                className="mt-4 w-full text-center p-2 bg-white text-black rounded-full text-sm cursor-pointer"
              >
                {loading ? (
                  <span className="loading loading-ring loading-sm"></span>
                ) : (
                  "Send"
                )}
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.section>
  );
}

export default QRCode;
