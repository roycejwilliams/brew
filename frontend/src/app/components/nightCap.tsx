import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import Comments from "./comments";
import { SendIcon, MicrophoneIcon } from "./icons";

const EASE = [0.16, 1, 0.3, 1] as const;

const mockComments = [
  {
    id: "1",
    comment: "Didn't expect tonight to feel like this. Grateful.",
    createdAt: "11:42 PM",
    profileImage: "/profile_2.png",
  },
  {
    id: "2",
    comment: "The music, the conversations — everything landed.",
    createdAt: "11:51 PM",
    profileImage: "/profile_3.png",
  },
  {
    id: "3",
    comment: "One of those nights you want to remember.",
    createdAt: "12:03 AM",
    profileImage: "/profile_4.png",
  },
  {
    id: "4",
    comment:
      "I didn't come in with expectations tonight, and I think that's why it landed the way it did. Conversations felt unforced, time moved slower than usual, and for a moment it didn't feel like everyone was rushing toward the next thing. Grateful for the people I crossed paths with — even the quiet exchanges mattered more than I expected.",
    createdAt: "12:17 AM",
    profileImage: "/profile_1.png",
  },
];

export default function NightCap() {
  const [comments, setComments] = useState<string[]>([]);
  const [value, setValue] = useState("");
  const hasComments = mockComments.length > 0;
  const canSubmit = value.trim().length > 0;

  return (
    <section className="flex flex-col gap-10">
      {/* Header */}
      <div className="flex flex-col items-end gap-2 text-right">
        <p className="text-white/20 text-[10px] tracking-widest uppercase font-medium">
          Night Cap
        </p>
        <h2
          className="text-white font-semibold tracking-[-0.5px] leading-tight"
          style={{ fontSize: 28 }}
        >
          {!hasComments ? "Leave something behind" : "Add to the night"}
        </h2>
        <p className="text-white/35 text-sm tracking-[-0.1px] leading-relaxed max-w-xs">
          {!hasComments
            ? "The night's winding down. Share a thought before it fades."
            : "A few thoughts are already here. Add yours before the night closes."}
        </p>
      </div>

      {/* Compose */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: EASE }}
        className="w-full overflow-hidden"
        style={{
          borderRadius: 14,
          border: "1px solid rgba(255,255,255,0.07)",
          background: "rgba(255,255,255,0.03)",
        }}
      >
        <textarea
          name="nightcap"
          rows={5}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Share your night…"
          className="w-full bg-transparent px-5 pt-5 pb-3 text-white text-sm placeholder-white/20 resize-none outline-none tracking-[-0.1px] leading-relaxed"
          style={{ transition: "border-color 0.2s" }}
        />

        <div
          className="px-5 py-4 flex items-center justify-between"
          style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
        >
          <motion.button
            type="button"
            whileTap={{ scale: 0.92 }}
            className="cursor-pointer transition-colors duration-200"
          >
            <MicrophoneIcon size={18} color="#fff" />
          </motion.button>

          <motion.button
            type="submit"
            whileTap={{ scale: canSubmit ? 0.95 : 1 }}
            disabled={!canSubmit}
            className="flex items-center justify-center rounded-full cursor-pointer transition-all duration-200"
            style={{
              width: 34,
              height: 34,
              background: canSubmit ? "#ffffff" : "rgba(255,255,255,0.07)",
              border: canSubmit ? "none" : "1px solid rgba(255,255,255,0.08)",
            }}
          >
            <SendIcon size={14} color={canSubmit ? "#111111" : "#fff"} />
          </motion.button>
        </div>
      </motion.div>

      {/* Comments */}
      <div className="flex flex-col gap-3">
        <AnimatePresence>
          {hasComments ? (
            mockComments.map((comment, i) => (
              <motion.div
                key={comment.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: i * 0.06, ease: EASE }}
              >
                <Comments
                  comment={comment.comment}
                  profileId={comment.profileImage}
                  createdAt={comment.createdAt}
                />
              </motion.div>
            ))
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3, ease: EASE }}
              className="text-sm tracking-[-0.1px] px-5 py-4"
              style={{
                borderRadius: 12,
                border: "1px solid rgba(255,255,255,0.06)",
                background: "rgba(255,255,255,0.02)",
                color: "rgba(255,255,255,0.25)",
              }}
            >
              Leave a note from the night.
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
