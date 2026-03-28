import { PlusIcon } from "lucide-react";
import { motion } from "motion/react";
import React, { useState } from "react";

export default function ManageReferral() {
  const [hasApplied, setHasApplied] = useState<boolean | null>(null);

  return (
    <div className="flex-1 shrink-0 relative">
      <motion.div
        className="flex justify-between px-8 pb-4 pt-8 items-start z-20 text-sm backdrop-blur-[10px] bg-[#1b1b1b]/5 border-b border-white/5 shadow-sm absolute top-0 w-full"
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
      >
        <h1 className="tracking-[0.15em] font-normal uppercase text-[#555]">
          Refer a Friend.
        </h1>
      </motion.div>
      <div className="mx-auto h-full w-full text-center space-y-3">
        <motion.h2
          className="mt-24 tracking-wider text-xl font-light"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
        >
          Refer to <span className="text-4xl font-normal">brew.</span>
        </motion.h2>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.15 }}
        >
          <span className="opacity-50">brew is curated.</span>
          <br />
          <span className="opacity-50 text-xs">
            Referrals are reviewed to maintain quality.
          </span>
        </motion.div>
        <motion.form
          className="max-w-lg h-auto mt-4 mx-auto px-3.5 py-6 rounded-md space-y-4"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: {},
            visible: {
              transition: {
                staggerChildren: 0.07,
                delayChildren: 0.3,
              },
            },
          }}
        >
          <motion.div
            className="grid grid-cols-2 gap-4"
            variants={{
              hidden: { opacity: 0, y: 8 },
              visible: {
                opacity: 1,
                y: 0,
                transition: { duration: 0.4, ease: [0.25, 0.1, 0.25, 1] },
              },
            }}
          >
            <div className="text-left space-y-1.5">
              <label className="text-xs text-white/50">First Name</label>
              <input
                type="text"
                className="border border-white/20 w-full rounded-sm p-3.5 text-xs bg-transparent focus:outline-0 focus:border-white/40 transition-colors"
              />
            </div>
            <div className="text-left space-y-1.5">
              <label className="text-xs text-white/50">Last Name</label>
              <input
                type="text"
                className="border border-white/20 w-full rounded-sm p-3.5 text-xs bg-transparent focus:outline-0 focus:border-white/40 transition-colors"
              />
            </div>
          </motion.div>
          <motion.div
            className="grid grid-cols-2 gap-4"
            variants={{
              hidden: { opacity: 0, y: 8 },
              visible: {
                opacity: 1,
                y: 0,
                transition: { duration: 0.4, ease: [0.25, 0.1, 0.25, 1] },
              },
            }}
          >
            <div className="text-left space-y-1.5">
              <label className="text-xs text-white/50">Email</label>
              <input
                type="email"
                className="border border-white/20 w-full rounded-sm p-3.5 text-xs bg-transparent focus:outline-0 focus:border-white/40 transition-colors"
              />
            </div>
            <div className="text-left space-y-1.5">
              <label className="text-xs text-white/50">Phone</label>
              <input
                type="tel"
                className="border border-white/20 w-full rounded-sm p-3.5 text-xs bg-transparent focus:outline-0 focus:border-white/40 transition-colors"
              />
            </div>
          </motion.div>
          <motion.div
            className="text-left space-y-1.5"
            variants={{
              hidden: { opacity: 0, y: 8 },
              visible: {
                opacity: 1,
                y: 0,
                transition: { duration: 0.4, ease: [0.25, 0.1, 0.25, 1] },
              },
            }}
          >
            <label className="text-xs text-white/50">Link to their work</label>
            <input
              type="url"
              placeholder="instagram, portfolio, soundcloud, etc..."
              className="border border-white/20 w-full rounded-sm p-3.5 text-xs bg-transparent placeholder:text-white/25 focus:outline-0 focus:border-white/40 transition-colors"
            />
          </motion.div>
          <motion.div
            className="text-left space-y-1.5"
            variants={{
              hidden: { opacity: 0, y: 8 },
              visible: {
                opacity: 1,
                y: 0,
                transition: { duration: 0.4, ease: [0.25, 0.1, 0.25, 1] },
              },
            }}
          >
            <label className="text-xs text-white/50">
              Tell us why they belong on brew...
            </label>
            <textarea
              maxLength={500}
              rows={5}
              className="border border-white/20 w-full rounded-sm p-3.5 text-xs bg-transparent focus:outline-0 focus:border-white/40 transition-colors resize-none"
            />
          </motion.div>
          <motion.div
            className="text-left flex items-center gap-x-4"
            variants={{
              hidden: { opacity: 0, y: 8 },
              visible: {
                opacity: 1,
                y: 0,
                transition: { duration: 0.4, ease: [0.25, 0.1, 0.25, 1] },
              },
            }}
          >
            <span className="text-xs text-white/50">
              Have they already applied?
            </span>
            <div className="flex gap-x-3">
              <motion.button
                type="button"
                onClick={() => setHasApplied(true)}
                className={`text-xs px-3 py-1.5 rounded-sm border cursor-pointer transition-colors ${
                  hasApplied === true
                    ? "border-white/40 bg-white/10 text-white"
                    : "border-white/15 text-white/40 hover:border-white/25"
                }`}
                whileTap={{ scale: 0.93 }}
              >
                yes
              </motion.button>
              <motion.button
                type="button"
                onClick={() => setHasApplied(false)}
                className={`text-xs px-3 py-1.5 rounded-sm border cursor-pointer transition-colors ${
                  hasApplied === false
                    ? "border-white/40 bg-white/10 text-white"
                    : "border-white/15 text-white/40 hover:border-white/25"
                }`}
                whileTap={{ scale: 0.93 }}
              >
                no
              </motion.button>
            </div>
          </motion.div>
          <motion.button
            type="submit"
            className="px-3.5 py-6 text-black bg-white w-full rounded-md text-sm font-medium cursor-pointer hover:bg-white/90 transition-colors"
            variants={{
              hidden: { opacity: 0, y: 8 },
              visible: {
                opacity: 1,
                y: 0,
                transition: { duration: 0.4, ease: [0.25, 0.1, 0.25, 1] },
              },
            }}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
          >
            Send Referral
          </motion.button>
        </motion.form>
      </div>
    </div>
  );
}
