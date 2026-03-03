import React from "react";
import { motion } from "motion/react";

interface HostMessageProp {
  hostMessage: string | null;
  hostTime: Date | string;
}

export default function HostMessage({
  hostMessage,
  hostTime,
}: HostMessageProp) {
  if (!hostMessage) return null;

  return (
    <motion.div
      whileHover={{ y: -2 }}
      transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
      className="w-full"
      style={{
        padding: "20px 24px",
        borderRadius: 14,
        background: "rgba(255,255,255,0.03)",
        border: "1px solid rgba(255,255,255,0.07)",
        boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
      }}
    >
      {/* Message body */}
      <p className="text-white/60 text-sm tracking-[-0.1px] leading-relaxed">
        {hostMessage}
      </p>

      {/* Footer */}
      <div
        className="flex items-center justify-between mt-4 pt-3"
        style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}
      >
        <div className="flex items-center gap-1.5">
          <span
            className="w-1 h-1 rounded-full"
            style={{ background: "rgba(74,222,128,0.6)" }}
          />
          <span className="text-white/20 text-[10px] tracking-widest uppercase font-medium">
            Host
          </span>
        </div>
        <span className="text-white/20 text-xs tracking-[-0.1px]">
          {hostTime.toString()}
        </span>
      </div>
    </motion.div>
  );
}
