import { motion, AnimatePresence } from "motion/react";
import React, { useState } from "react";
import { useCreateApplication } from "@/hooks/useApplications";

interface Phase {
  state: "form" | "pending";
  setState: (state: "form" | "pending") => void;
  setIsLoading: (loading: boolean) => void;
}

const EASE = [0.22, 1, 0.36, 1] as const;

const inputClass =
  "w-full px-4 py-3 bg-white/5 rounded-md border border-white/10 focus:outline-none focus:border-white/25 text-white/90 placeholder:text-white/20 text-sm transition-colors duration-150";

function InviteForm({ state, setState }: Phase) {
  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const { mutate: createApplication, isPending } = useCreateApplication();

  return (
    <AnimatePresence mode="wait">
      {state === "form" && !isPending && (
        <motion.div
          key="form-invite"
          layout
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.22, ease: EASE }}
          className="flex flex-col gap-4"
        >
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

          <motion.button
            onClick={() =>
              createApplication(form as ApplicationProp, {
                onSuccess: () => setState("pending"),
                onError: () => setState("form"),
              })
            }
            whileTap={{ scale: 0.98 }}
            className="w-full flex justify-between items-center px-4 py-3 border border-white/10 rounded-md hover:bg-white/5 hover:border-white/20 transition-colors duration-150 cursor-pointer text-sm text-white/50 hover:text-white"
          >
            <span>Submit application</span>
            <span className="text-white/25">→</span>
          </motion.button>

          <p className="text-[11px] text-center text-white/20 tracking-[-0.1px]">
            By continuing, you agree to B R 3 W&apos;s Terms & Privacy Policy.
          </p>
        </motion.div>
      )}

      {state === "form" && isPending && (
        <motion.div
          key="loading"
          layout
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="flex flex-col items-center gap-4 py-10"
        >
          <div className="w-7 h-7 rounded-full border-2 border-white/10 border-t-white/40 animate-spin" />
          <p className="text-sm text-white/30 tracking-[-0.1px]">
            Submitting your application...
          </p>
        </motion.div>
      )}

      {state === "pending" && !isPending && (
        <motion.div
          key="pending"
          layout
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25, ease: EASE }}
          className="flex flex-col items-center gap-5 py-4"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.08, duration: 0.25, ease: EASE }}
            className="flex items-center justify-center w-12 h-12 rounded-full"
            style={{
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.1)",
            }}
          >
            <div
              className="w-2 h-2 rounded-full"
              style={{ background: "rgba(255,255,255,0.4)" }}
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.15, duration: 0.25, ease: EASE }}
            className="flex flex-col items-center gap-1.5 text-center"
          >
            <h3 className="text-white text-base font-medium tracking-[-0.3px]">
              Application submitted.
            </h3>
            <p className="text-white/30 text-sm tracking-[-0.1px] max-w-60 leading-relaxed">
              We review every application personally. You&apos;ll hear from us
              soon.
            </p>
          </motion.div>

          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.22, duration: 0.35, ease: EASE }}
            className="origin-left w-full"
            style={{
              height: 1,
              background:
                "linear-gradient(90deg, rgba(255,255,255,0.07) 0%, transparent 80%)",
            }}
          />

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.28, duration: 0.25 }}
            className="flex flex-col items-center gap-1"
          >
            <p className="text-[10px] tracking-[3px] uppercase text-white/20 font-medium">
              What&apos;s next
            </p>
            <p className="text-[11px] text-white/25 text-center tracking-[-0.1px]">
              We&apos;re reviewing it. If it&apos;s a fit, you&apos;ll hear from
              us.
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default InviteForm;
