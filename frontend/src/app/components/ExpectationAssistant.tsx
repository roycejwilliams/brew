import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import OrbitDots from "./icons/OrbitDots";

type Phase = "input" | "loading" | "result";
type InviteSelection = "people" | "where" | "share";

interface InviteSelectionProp {
  setInviteSelection: (inviteSelection: InviteSelection) => void;
}

const SUGGESTIONS = [
  "Close friends who want to hang when it makes sense, no pressure.",
  "A small group to make plans occasionally and stay connected.",
  "A shared space for people I trust to coordinate things naturally.",
];

const EXPECTATION_TAGS = ["Casual", "Flexible", "Regular", "Open", "Committed"];

export default function ExpectationAssistant({
  setInviteSelection,
}: InviteSelectionProp) {
  const [phase, setPhase] = useState<Phase>("input");
  const [prompt, setPrompt] = useState("");
  const [selected, setSelected] = useState<string[]>([]);

  const handleSubmit = () => {
    if (!prompt.trim()) return;
    setPhase("loading");
    setTimeout(() => setPhase("result"), 2200);
  };

  const toggleTag = (tag: string) => {
    setSelected((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag],
    );
  };

  return (
    <div className="w-full flex flex-col items-center gap-y-6">
      <AnimatePresence mode="wait">
        {/* INPUT */}
        {phase === "input" && (
          <motion.div
            key="input"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
            className="w-full flex flex-col gap-5"
          >
            <div className="text-center space-y-1">
              <p className="text-white text-sm font-medium tracking-[-0.2px]">
                Let us help you set the room.
              </p>
              <p className="text-white/35 text-sm tracking-[-0.1px]">
                Use our AI assistant to generate the tone of the room.
              </p>
            </div>

            <div
              className="flex items-center gap-2 w-full rounded-xl px-4 py-3 transition-all duration-200"
              style={{
                background: "rgba(255,255,255,0.05)",
                border: prompt.trim()
                  ? "1px solid rgba(255,255,255,0.18)"
                  : "1px solid rgba(255,255,255,0.08)",
              }}
            >
              <input
                type="text"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                placeholder="Describe the vibe…"
                className="flex-1 bg-transparent text-white placeholder-white/20 text-sm tracking-[-0.2px] outline-none"
              />
              <motion.button
                whileTap={{ scale: 0.93 }}
                onClick={handleSubmit}
                className="flex items-center justify-center rounded-md cursor-pointer transition-all duration-200"
                style={{
                  width: 30,
                  height: 30,
                  background: prompt.trim()
                    ? "rgba(255,255,255,0.12)"
                    : "rgba(255,255,255,0.05)",
                }}
              >
                <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                  <path
                    d="M2 6.5h9M7.5 2.5l4 4-4 4"
                    stroke={
                      prompt.trim()
                        ? "rgba(255,255,255,0.9)"
                        : "rgba(255,255,255,0.25)"
                    }
                    strokeWidth="1.4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </motion.button>
            </div>

            <div className="flex flex-col gap-2">
              {SUGGESTIONS.map((s, i) => (
                <motion.button
                  key={i}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    delay: 0.06 + i * 0.05,
                    duration: 0.25,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  whileTap={{ scale: 0.99 }}
                  onClick={() => setPrompt(s)}
                  className="text-left text-white/30 text-sm tracking-[-0.1px] transition-colors duration-150 hover:text-white/55 cursor-pointer"
                >
                  {s}
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}

        {/* LOADING */}
        {phase === "loading" && (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col items-center gap-5 py-10"
          >
            <OrbitDots />
            <p className="text-white/35 text-sm tracking-[-0.1px]">
              Reading the room…
            </p>
          </motion.div>
        )}

        {/* RESULT */}
        {phase === "result" && (
          <motion.div
            key="result"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="w-full flex flex-col gap-16"
          >
            <div className="text-center">
              <p className="text-white text-sm font-medium tracking-[-0.2px]">
                How should this Circle feel?
              </p>
            </div>

            <div className="flex flex-wrap justify-center gap-2 w-1/2 mx-auto">
              {EXPECTATION_TAGS.map((tag, i) => (
                <motion.button
                  key={tag}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    delay: i * 0.06,
                    duration: 0.25,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  whileTap={{ scale: 0.96 }}
                  onClick={() => toggleTag(tag)}
                  className="px-5 py-2.5 rounded-md text-sm font-medium tracking-[-0.1px] cursor-pointer transition-all duration-200"
                  style={{
                    background: selected.includes(tag)
                      ? "rgba(255,255,255,0.12)"
                      : "rgba(255,255,255,0.05)",
                    border: selected.includes(tag)
                      ? "1px solid rgba(255,255,255,0.25)"
                      : "1px solid rgba(255,255,255,0.08)",
                    color: selected.includes(tag)
                      ? "rgba(255,255,255,0.95)"
                      : "rgba(255,255,255,0.45)",
                  }}
                >
                  {tag}
                </motion.button>
              ))}
            </div>
            {/* Invite Note */}
            <div className="flex flex-col gap-2">
              <p className="text-white/25 text-xs tracking-wide uppercase font-medium">
                Invite Note (optional)
              </p>

              <div
                className="w-full rounded-md px-4 py-4 transition-all duration-200"
                style={{
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.08)",
                }}
              >
                <textarea
                  rows={3}
                  placeholder="Describe how this Circle should feel…"
                  className="w-full resize-none bg-transparent text-white placeholder-white/20 text-sm tracking-[-0.3px] outline-none"
                />
              </div>

              <p className="text-white/20 text-xs tracking-[-0.1px] px-1">
                We'll use this to suggest expectations.
              </p>
            </div>

            <AnimatePresence>
              {selected.length > 0 && (
                <motion.button
                  onClick={() => setInviteSelection("share")}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 4 }}
                  whileTap={{ scale: 0.97 }}
                  transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                  className="w-full py-4 rounded-md text-sm font-medium tracking-[-0.2px] cursor-pointer hover:opacity-90 transition-opacity duration-200"
                  style={{ background: "#ffffff", color: "#111111" }}
                >
                  Invite them.
                </motion.button>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
