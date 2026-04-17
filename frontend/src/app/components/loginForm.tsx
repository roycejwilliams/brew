import React, { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight, faCheck } from "@fortawesome/free-solid-svg-icons";
import { useLookUpUser } from "@/hooks/useApplications";
import { useVerifyUser } from "@/hooks/useUser";

interface Phase {
  state: "form" | "verify" | "success";
  setState: (state: "form" | "verify" | "success") => void;
}

function LoginForm({ state, setState }: Phase) {
  const inputsRef = useRef<Array<HTMLInputElement | null>>([]);
  const [email, setEmail] = useState<string>("");
  const [userId, setUserId] = useState("");
  const [otp, setOtp] = useState<string[]>(Array(6).fill(""));
  const [otpError, setOtpError] = useState(false);

  //mutate triggers the mutation, mutate becomes the argument
  const { mutate: lookUpUser, isPending } = useLookUpUser();
  const { mutate: verifyOtp } = useVerifyUser();

  useEffect(() => {
    if (otp.every((digit) => digit !== "") && otp.length === 6) {
      setOtpError(false);
      verifyOtp(
        { id: userId, otp_code: otp.join("") },
        {
          onSuccess: () => setState("success"),
          onError: () => {
            setOtpError(true);
            setOtp(Array(6).fill(""));
            inputsRef.current[0]?.focus();
          },
        },
      );
    }
  }, [otp]);

  const handleChange = (value: string, index: number) => {
    if (!/^[0-9]?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < otp.length - 1) {
      // this is saying if the value is valid
      inputsRef.current[index + 1]?.focus(); // and the index < otp.length then just go to the next inputRef.
    }
  };

  const handleKeyDown = (
    // enables certain buttons to be clicked during completion
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number,
  ) => {
    if (
      !/^[0-9]?$/.test(e.key) &&
      e.key != "Backspace" &&
      e.key != "Tab" &&
      e.key != "Delete"
    ) {
      e.preventDefault();
    }

    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();

    const paste = e.clipboardData.getData("text").slice(0, 6).split("");

    setOtp((prev) =>
      prev.map((_, i) =>
        paste[i] && /^[0-9]?$/.test(paste[i]) ? paste[i] : "",
      ),
    );
  };

  return (
    <>
      {state === "form" && (
        <motion.div
          key="email"
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="mt-5"
        >
          <h2 className="text-lg font-light tracking-wide text-center">
            Welcome back.
          </h2>
          <p className="mt-1 text-sm text-white/40 text-center">
            Your circle. Your vision. Your momentum.
          </p>

          <div className="flex gap-x-2 items-center mt-5">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2.5 border border-white/10 text-sm rounded-md bg-white/5 text-white placeholder:text-white/25 focus:outline-none focus:border-white/30 transition-all"
              placeholder="Enter your email"
              required
            />
            <button
              onClick={() =>
                lookUpUser(email, {
                  onSuccess: (response) => {
                    setUserId(response.data.data.id);
                    setState("verify");
                  },
                })
              }
              disabled={isPending || !email}
              className="w-10 h-10 shrink-0 flex  justify-center items-center border border-white/10 bg-white/5 cursor-pointer rounded-md hover:bg-white/10 hover:border-white/20 transition-all group"
            >
              <FontAwesomeIcon
                icon={faArrowRight}
                size="xs"
                className="text-white/50 group-hover:text-white group-hover:translate-x-0.5 transition-all"
              />
            </button>
          </div>

          <p className="text-xs mt-5 text-center text-white/20">
            By continuing, you agree to Brew&apos;s Terms & Privacy Policy.
          </p>
        </motion.div>
      )}

      {state === "verify" && (
        <motion.div
          key="verify"
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="mt-5"
        >
          <h2 className="text-lg font-light tracking-wide text-center">
            Check your inbox.
          </h2>
          <p className="mt-1 text-sm text-white/40 text-center">
            We sent a code to{" "}
            <span className="text-white/60">{email || "your email"}</span>.
          </p>

          <div className="flex justify-between items-center mt-6 gap-x-2">
            {otp.map((digit, i) => (
              <input
                key={i}
                ref={(el) => {
                  inputsRef.current[i] = el;
                }}
                type="text"
                inputMode="numeric"
                value={digit}
                maxLength={1}
                onChange={(e) => handleChange(e.target.value, i)}
                onKeyDown={(e) => handleKeyDown(e, i)}
                onPaste={(e) => handlePaste(e)}
                required
                className="w-12 h-14 text-2xl text-white text-center bg-white/5 border border-white/10 rounded-md focus:outline-none focus:border-white/30 transition-all"
              />
            ))}
          </div>

          <button
            onClick={() => setState("form")}
            className="text-xs text-white/25 mt-4 w-full text-center hover:text-white/40 transition-colors cursor-pointer"
          >
            Wrong email? Go back
          </button>

          <p className="text-xs mt-3 text-center text-white/20">
            By continuing, you agree to Brew&apos;s Terms & Privacy Policy.
          </p>
        </motion.div>
      )}

      {state === "success" && (
        <motion.div
          key="success"
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
            <FontAwesomeIcon
              icon={faCheck}
              size="sm"
              className="text-white/70"
            />
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.35, ease: "easeOut" }}
            className="text-lg font-light"
          >
            You&apos;re in.
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5, ease: "easeOut" }}
            className="text-sm text-white/40 mt-1"
          >
            Taking you there now.
          </motion.p>
        </motion.div>
      )}
      {otpError && state === "verify" && (
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 4 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="mt-4 px-4 py-3 rounded-md border border-red-500/15 bg-red-500/5 text-center"
        >
          <p className="text-xs text-red-400/70 tracking-wide">
            Incorrect code. Try again.
          </p>
        </motion.div>
      )}
    </>
  );
}

export default LoginForm;
