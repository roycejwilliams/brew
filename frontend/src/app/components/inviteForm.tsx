import { motion } from "motion/react";
import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { useCreateApplication } from "@/hooks/useApplications";
import Loading from "./loading";

interface Phase {
  state: "form" | "pending";
  setState: (state: "form" | "pending") => void;
  setIsLoading: (loading: boolean) => void;
}

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

  const inputClass =
    "w-full px-3 py-2.5 border border-white/10 text-sm rounded-md bg-white/5 text-white placeholder:text-white/25 focus:outline-none focus:border-white/30 focus:bg-white/8 transition-all";

  return (
    <>
      {isPending && (
        <motion.div
          key="loading"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="flex flex-col items-center py-10"
        >
          <Loading />
          <p className="text-sm text-white/40 mt-4 text-center">
            Submitting your application...
          </p>
        </motion.div>
      )}

      {state === "form" && (
        <motion.div
          key="form"
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="mt-5"
        >
          <h2 className="text-lg font-light tracking-wide text-center">
            Request Access.
          </h2>
          <p className="mt-1 text-sm text-white/40 text-center">
            BR3W is invite-only. Tell us who you are.
          </p>

          <div className="flex gap-x-2 mt-5">
            <input
              name="first_name"
              type="text"
              value={form.first_name}
              onChange={handleChange}
              className={inputClass}
              placeholder="First name"
              required
            />
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

          <div className="flex flex-col gap-y-2 mt-2">
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              className={inputClass}
              placeholder="Email"
              required
            />
            <input
              name="phone_number"
              type="tel"
              value={form.phone_number}
              onChange={handleChange}
              className={inputClass}
              placeholder="Phone number"
              required
            />
            <input
              name="work_link"
              type="url"
              value={form.work_link}
              onChange={handleChange}
              className={inputClass}
              placeholder="Portfolio or work link"
              required
            />
            <textarea
              name="reason"
              value={form.reason}
              onChange={handleChange}
              rows={2}
              className={`${inputClass} resize-none`}
              placeholder="Why do you want access?"
              required
            />
          </div>

          <button
            onClick={() => {
              createApplication(form, {
                onSuccess: () => setState("pending"),
                onError: () => setState("form"),
              });
            }}
            className="w-full mt-3 flex justify-between items-center px-3 py-2.5 bg-white/5 border border-white/10 rounded-md hover:bg-white/10 hover:border-white/20 transition-all cursor-pointer text-sm text-white/60 hover:text-white group"
          >
            <span>Submit application</span>
            <FontAwesomeIcon
              icon={faArrowRight}
              size="xs"
              className="group-hover:translate-x-0.5 transition-transform"
            />
          </button>

          <p className="text-xs mt-3 text-center text-white/20">
            By continuing, you agree to Brew&apos;s Terms & Privacy Policy.
          </p>
        </motion.div>
      )}

      {state === "pending" && (
        <motion.div
          key="pending"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
          className="flex flex-col items-center py-10"
        >
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
            className="w-12 h-12 rounded-full border border-white/15 flex justify-center items-center mb-4"
          >
            <div className="w-2 h-2 rounded-full bg-white/40" />
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.35, ease: "easeOut" }}
            className="text-lg font-light"
          >
            Application submitted.
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5, ease: "easeOut" }}
            className="text-sm text-white/40 mt-1 text-center max-w-50"
          >
            We&apos;ll review it and get back to you.
          </motion.p>
        </motion.div>
      )}
    </>
  );
}

export default InviteForm;
