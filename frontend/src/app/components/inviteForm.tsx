import { motion, AnimatePresence } from "motion/react";
import React, { useState } from "react";
import { useCreateApplication } from "@/hooks/useApplications";

interface Phase {
  state: "form" | "pending";
  setState: (state: "form" | "pending") => void;
  setIsLoading: (loading: boolean) => void;
}

const EASE = [0.25, 0.1, 0.25, 1] as const;

const inputClass =
  "w-full px-4 py-3 bg-white/5 rounded-md border border-white/10 focus:outline-none focus:border-white/25 text-white/90 placeholder:text-white/20 text-sm transition-all duration-200";

function InviteForm({ state, setState }: Phase) {
  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone_number: "",
    work_link: "",
    reason: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const { mutate: createApplication, isPending } = useCreateApplication();

  return (
    <AnimatePresence mode="wait">
      {state === "form" && !isPending && (
        <motion.div
          key="form"
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.25, ease: EASE }}
          className="flex flex-col gap-5"
        >
          {/* Name row */}
          <div className="flex gap-2">
            <div className="flex flex-col gap-2 flex-1">
              <p className="text-[10px] tracking-[3px] uppercase text-white/25">
                First
              </p>
              <input
                name="first_name"
                type="text"
                value={form.first_name}
                onChange={handleChange}
                className={inputClass}
                placeholder="First name"
                required
              />
            </div>
            <div className="flex flex-col gap-2 flex-1">
              <p className="text-[10px] tracking-[3px] uppercase text-white/25">
                Last
              </p>
              <input
                name="last_name"
                type="text"
                value={form.last_name}
                onChange={handleChange}
                className={inputClass}
                placeholder="Last name"
                required
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <p className="text-[10px] tracking-[3px] uppercase text-white/25">
              Email
            </p>
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              className={inputClass}
              placeholder="your@email.com"
              required
            />
          </div>

          <div className="flex flex-col gap-2">
            <p className="text-[10px] tracking-[3px] uppercase text-white/25">
              Phone
            </p>
            <input
              name="phone_number"
              type="tel"
              value={form.phone_number}
              onChange={handleChange}
              className={inputClass}
              placeholder="Phone number"
              required
            />
          </div>

          <div className="flex flex-col gap-2">
            <p className="text-[10px] tracking-[3px] uppercase text-white/25">
              Work
            </p>
            <input
              name="work_link"
              type="url"
              value={form.work_link}
              onChange={handleChange}
              className={inputClass}
              placeholder="Portfolio or work link"
              required
            />
          </div>

          <div className="flex flex-col gap-2">
            <p className="text-[10px] tracking-[3px] uppercase text-white/25">
              Why
            </p>
            <textarea
              name="reason"
              value={form.reason}
              onChange={handleChange}
              rows={3}
              className={`${inputClass} resize-none`}
              placeholder="Why do you want access?"
              required
            />
          </div>

          <motion.button
            onClick={() =>
              createApplication(form, {
                onSuccess: () => setState("pending"),
                onError: () => setState("form"),
              })
            }
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            className="w-full flex justify-between items-center px-4 py-3 border border-white/10 rounded-md hover:bg-white/5 hover:border-white/20 transition-all cursor-pointer text-sm text-white/50 hover:text-white"
          >
            <span>Submit application</span>
            <span className="text-white/25">→</span>
          </motion.button>

          <p className="text-[11px] text-center text-white/20 tracking-[-0.1px]">
            By continuing, you agree to BR3W&apos;s Terms & Privacy Policy.
          </p>
        </motion.div>
      )}

      {isPending && (
        <motion.div
          key="loading"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25, ease: EASE }}
          className="flex flex-col items-center gap-4 py-10"
        >
          <div className="w-8 h-8 rounded-full border-2 border-white/10 border-t-white/40 animate-spin" />
          <p className="text-sm text-white/30 tracking-[-0.1px]">
            Submitting your application...
          </p>
        </motion.div>
      )}

      {state === "pending" && (
        <motion.div
          key="pending"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4, ease: EASE }}
          className="flex flex-col items-center gap-4 py-6"
        >
          <div
            className="w-24 h-px"
            style={{ background: "rgba(255,255,255,0.08)" }}
          >
            <motion.div
              className="h-full"
              style={{ background: "rgba(255,255,255,0.3)" }}
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{ duration: 2, ease: "linear" }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default InviteForm;
