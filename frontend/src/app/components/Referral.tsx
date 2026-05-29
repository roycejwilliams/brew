import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useUserStore } from "@/stores/useUserStore";
import { useCreateReferral } from "@/hooks/useInvites";
import { useGetUser } from "@/hooks/useUser";

type InviteSelection = "people" | "where" | "share" | "refer";

interface ReferProp {
  setInvitedSelection: (inviteSelection: InviteSelection) => void;
}

export default function Referral({ setInvitedSelection }: ReferProp) {
  const [reason, setReason] = useState("");
  const [recipient, setRecipient] = useState("");

  const { user } = useUserStore();
  const { data: userData } = useGetUser(user?.id as string);
  const { mutate: createReferral, isPending } = useCreateReferral();

  const referralsAvailable = userData?.data.data.referrals_available ?? 3;
  const canSend =
    reason.trim().length > 0 &&
    recipient.trim().length > 0 &&
    referralsAvailable > 0;

  const handleSend = () => {
    if (!canSend) return;
    createReferral(
      { recipient, reason },
      { onSuccess: () => setInvitedSelection("refer") },
    );
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      className="flex flex-col items-center w-full px-6 py-10 gap-y-8"
    >
      <AnimatePresence mode="wait">
        <motion.div
          key="form"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col items-center w-full gap-y-8"
        >
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col items-center gap-2"
          >
            <h2 className="text-black dark:text-white text-xl font-medium tracking-[-0.3px] leading-tight">
              Refer to <span className="text-4xl tracking-[4px]">BR3W</span>
            </h2>
            <p className="text-black/40 dark:text-white/40 text-sm tracking-[-0.1px] text-center">
              Brew is curated. Referrals are reviewed to maintain quality.
            </p>

            {/* Referrals counter */}
            <motion.div
              className="flex items-center gap-3 mt-2 px-4 py-2.5 rounded-md"
              style={{
                background: "rgba(var(--fg),0.05)",
                border: "1px solid rgba(var(--fg),0.08)",
              }}
            >
              <span className="text-black dark:text-white font-medium tracking-[-0.5px] text-2xl">
                {referralsAvailable}
              </span>
              <div className="flex flex-col">
                <span className="text-black/60 dark:text-white/60 text-xs font-medium tracking-widest uppercase">
                  referrals left
                </span>
                <span className="text-black/20 dark:text-white/20 text-xs tracking-[-0.1px]">
                  use them wisely
                </span>
              </div>
            </motion.div>
          </motion.div>

          {/* Recipient */}
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.06, duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="w-full flex flex-col gap-3"
          >
            <p className="text-black/25 dark:text-white/25 text-xs tracking-wide uppercase font-medium">
              Their email or phone
            </p>
            <div
              className="w-full rounded-md transition-all duration-200"
              style={{
                background: "rgba(var(--fg),0.04)",
                border: recipient.trim()
                  ? "1px solid rgba(var(--fg),0.18)"
                  : "1px solid rgba(var(--fg),0.08)",
              }}
            >
              <input
                type="text"
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                placeholder="email or phone number"
                className="w-full bg-transparent text-black dark:text-white placeholder-black/20 dark:placeholder-white/20 text-sm tracking-[-0.2px] outline-none px-4 py-4"
              />
            </div>
          </motion.div>

          {/* Reason */}
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08, duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="w-full flex flex-col gap-3"
          >
            <p className="text-black/25 dark:text-white/25 text-xs tracking-wide uppercase font-medium">
              Why do they belong?
            </p>
            <div
              className="w-full rounded-md transition-all duration-200"
              style={{
                background: "rgba(var(--fg),0.04)",
                border: reason.trim()
                  ? "1px solid rgba(var(--fg),0.18)"
                  : "1px solid rgba(var(--fg),0.08)",
              }}
            >
              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Tell us why they belong on Brew..."
                rows={6}
                className="w-full bg-transparent text-black dark:text-white placeholder-black/20 dark:placeholder-white/20 text-sm tracking-[-0.2px] outline-none resize-none px-4 py-4"
                style={{ lineHeight: "1.6" }}
              />
            </div>
            <p className="text-black/20 dark:text-white/20 text-xs tracking-[-0.1px] text-center">
              Access is reviewed.
            </p>
          </motion.div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.14, duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="w-full"
          >
            <motion.button
              whileTap={{ scale: canSend ? 0.97 : 1 }}
              onClick={handleSend}
              disabled={!canSend || isPending}
              className="w-full py-4 rounded-md text-sm font-medium tracking-[-0.2px] transition-opacity duration-200 hover:opacity-90"
              style={{
                background: "#ffffff",
                color: "#111111",
                opacity: canSend ? 1 : 0.3,
                cursor: canSend ? "pointer" : "default",
              }}
            >
              {isPending ? "Sending..." : "Send Referral"}
            </motion.button>
          </motion.div>
        </motion.div>
      </AnimatePresence>
    </motion.section>
  );
}
