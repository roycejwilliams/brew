import { motion, AnimatePresence } from "motion/react";
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
  timestamp?: string;
}

export default function Notification({ onClose }: NotificationProp) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [empty, setEmpty] = useState<boolean>(false);

  useOutsideAlerter(ref, onClose);

  const notifications: Notification[] = [
    {
      id: 1,
      type: "eventAlert",
      text: "New meetup alert! Coffee & Code...",
      timestamp: "2m ago",
    },
    {
      id: 2,
      type: "update",
      text: "Pitch & Pour has updated its time to 7 PM.",
      timestamp: "1h ago",
    },
    {
      id: 3,
      type: "join",
      text: "Alex just joined Brew — invite them...",
      timestamp: "3h ago",
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      className="w-full h-screen absolute top-0 left-0 bg-black/40 backdrop-blur-xl z-50 flex justify-end items-center"
    >
      <motion.div
        ref={ref}
        initial={{ opacity: 0, x: 400 }}
        animate={{
          opacity: 1,
          x: 0,
          transition: {
            type: "spring",
            stiffness: 100,
            damping: 20,
            mass: 0.8,
          },
        }}
        exit={{
          opacity: 0,
          x: 400,
          transition: { duration: 0.3, ease: [0.16, 1, 0.3, 1] },
        }}
        className="w-full max-w-md h-screen bg-linear-to-b from-[#1c1c1c] via-[#1a1a1a] to-black relative rounded-tl-2xl rounded-bl-2xl shadow-2xl shadow-black/60 border-l border-t border-b border-white/10 overflow-hidden"
      >
        {/* Header gradient accent */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 0.3, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-white/20 to-transparent origin-left"
        />

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="px-8 pt-10 pb-6 border-b border-white/5"
        >
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-medium text-white/90">Signals</h2>
            {!empty && (
              <motion.span
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3, duration: 0.3 }}
                className="px-2.5 py-1 bg-white/10 border border-white/10 rounded-full text-xs text-white/60"
              >
                {notifications.length}
              </motion.span>
            )}
          </div>
        </motion.div>

        {/* Content */}
        <div className="h-[calc(100vh-120px)] overflow-hidden">
          <AnimatePresence mode="wait">
            {!empty ? (
              <motion.section
                key="notifications-list"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="h-full overflow-y-auto px-8 py-6 space-y-2"
              >
                {notifications.map((n, index) => (
                  <motion.div
                    key={n.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{
                      delay: 0.3 + index * 0.08,
                      duration: 0.4,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                    whileHover={{
                      x: 4,
                      backgroundColor: "rgba(255,255,255,0.04)",
                    }}
                    className="group relative p-4 rounded-lg border border-white/5 hover:border-white/10 bg-white/2 cursor-pointer transition-all duration-200"
                  >
                    {/* Hover gradient */}
                    <motion.div
                      initial={{ opacity: 0 }}
                      whileHover={{ opacity: 0.05 }}
                      className="absolute inset-0 bg-linear-to-r from-white/0 via-white/10 to-white/0 rounded-lg"
                    />

                    <div className="flex items-start gap-4 relative z-10">
                      {/* Icon */}
                      <motion.div
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        transition={{ duration: 0.2 }}
                        className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center shrink-0"
                      >
                        <FontAwesomeIcon
                          icon={NotificationIcon[n.type]}
                          className="text-sm text-white/70"
                        />
                      </motion.div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-white/90 leading-relaxed mb-1">
                          {n.text}
                        </p>
                        {n.timestamp && (
                          <p className="text-xs text-white/30">{n.timestamp}</p>
                        )}
                      </div>

                      {/* Unread indicator */}
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{
                          delay: 0.4 + index * 0.08,
                          duration: 0.2,
                        }}
                        className="w-2 h-2 rounded-full bg-white/60 shrink-0 mt-1.5"
                      />
                    </div>
                  </motion.div>
                ))}
              </motion.section>
            ) : (
              <motion.div
                key="empty-state"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                className="h-full flex flex-col justify-center items-center px-8"
              >
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.2, duration: 0.4 }}
                  className="w-20 h-20 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-6"
                >
                  <FontAwesomeIcon
                    icon={faMugHot}
                    className="text-3xl text-white/40"
                  />
                </motion.div>
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.3 }}
                  className="text-lg text-white/60 mb-2"
                >
                  It's Quiet Isn't It?
                </motion.p>
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 0.3 }}
                  className="text-sm text-white/30 max-w-xs text-center"
                >
                  You're all caught up. New notifications will appear here.
                </motion.p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </motion.div>
  );
}
