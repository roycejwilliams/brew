import { motion } from "motion/react";
import React, { useRef, useState } from "react";
import { useOutsideAlerter } from "../utils/outsideAlert";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMugHot } from "@fortawesome/free-solid-svg-icons";
import { NotificationType, NotificationIcon } from "../utils/notificationsIcon";

interface NotificationProp {
  onClose: () => void;
}

interface Notification {
  id: number;
  type: NotificationType;
  text: string;
}

export default function Notification({ onClose }: NotificationProp) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [empty, setEmpty] = useState<boolean>();

  useOutsideAlerter(ref, onClose);

  const notifications: Notification[] = [
    { id: 1, type: "eventAlert", text: "New meetup alert! Coffee & Code..." },
    {
      id: 2,
      type: "update",
      text: "Pitch & Pour has updated its time to 7 PM.",
    },
    { id: 3, type: "join", text: "Alex just joined Brew — invite them..." },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="w-full h-screen bg-linear-to-b absolute top-0 left-0 bg-black/10 backdrop-blur-md z-50 flex justify-end items-center"
    >
      {" "}
      <motion.div
        ref={ref}
        initial={{ opacity: 0, x: 200 }}
        animate={{
          opacity: 1,
          x: 0,
          transition: {
            type: "spring",
            stiffness: 120,
            damping: 18,
            delay: 0.2,
          },
        }}
        exit={{
          opacity: 0,
          x: 200,
          transition: { duration: 0.25, ease: "easeIn" },
        }}
        transition={{
          delay: 0.2,
          ease: "easeInOut",
        }}
        className="w-1/3 h-screen bg-linear-to-b from-[#2b2b2b] to-black relative rounded-tl-2xl rounded-bl-2xl shadow-sm border border-white/10 p-8"
      >
        <h2 className="text-2xl mt-8">Notifications</h2>
        {!empty ? (
          <>
            <section className="mt-4 p-4 overflow-y-auto">
              {notifications.map((n) => (
                <div
                  key={n.id}
                  className="flex items-center justify-between py-4 border-b border-white/10"
                >
                  <div className="flex items-center gap-3">
                    <FontAwesomeIcon
                      icon={NotificationIcon[n.type]}
                      className="text-sm text-white/80"
                    />
                    <p className="text-sm text-white/90">{n.text}</p>
                  </div>
                </div>
              ))}{" "}
            </section>
          </>
        ) : (
          <div className="h-5/6 mt-4 flex flex-col justify-center items-center">
            <FontAwesomeIcon icon={faMugHot} className="text-3xl" />{" "}
            <p className="mt-4">It&apos;s Quiet Isn&apos;t It?</p>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}
