import React, { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useLookUpUser } from "@/hooks/useApplications";
import { useVerifyUser, useResendOtpToUser } from "@/hooks/useUser";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/stores/useUserStore";

interface Phase {
  state: "form" | "verify" | "success";
  setState: (state: "form" | "verify" | "success") => void;
  redirect?: string;
}

const EASE = [0.22, 1, 0.36, 1] as const;

const inputClass =
  "flex-1 px-4 py-3 bg-white/5 rounded-md border border-white/10 focus:outline-none focus:border-white/25 text-white/90 placeholder:text-white/20 text-sm transition-colors duration-150";

function LoginForm({ state, setState, redirect }: Phase) {
  const inputsRef = useRef<Array<HTMLInputElement | null>>([]);
  const [email, setEmail] = useState("");
  const [userId, setUserId] = useState("");
  const [otp, setOtp] = useState<string[]>(Array(6).fill(""));
  const [otpError, setOtpError] = useState(false);
  const [otpErrorMsg, setOtpErrorMsg] = useState("Incorrect code. Try again.");
  const [resendCooldown, setResendCooldown] = useState(0);
  const [resendSuccess, setResendSuccess] = useState(false);

  const { mutate: lookUpUser, isPending } = useLookUpUser();
  const { mutate: verifyOtp } = useVerifyUser();
  const { mutate: resendOtp, isPending: isResending } = useResendOtpToUser();
  const router = useRouter();
  const { setUser } = useUserStore();

  useEffect(() => {
    if (otp.every((d) => d !== "") && otp.length === 6) {
      setOtpError(false);
      verifyOtp(
        { id: userId, otp_code: otp.join("") },
        {
          onSuccess: () => {
            setUser({ id: userId } as UserProp);
            setState("success");
            setTimeout(() => router.push(redirect ?? "/pulse"), 3000);
          },
          onError: (err: unknown) => {
            const status = (err as { response?: { status?: number } })?.response?.status;
            if (status === 423 || status === 429) {
              setOtpErrorMsg("Account locked. Too many attempts. Contact support.");
            } else {
              setOtpErrorMsg("Incorrect code. Try again.");
            }
            setOtpError(true);
            setOtp(Array(6).fill(""));
            inputsRef.current[0]?.focus();
          },
        },
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [otp]);

  const handleOtpChange = (value: string, index: number) => {
    if (!/^[0-9]?$/.test(value)) return;
    const next = [...otp];
    next[index] = value;
    setOtp(next);
    if (value && index < 5) inputsRef.current[index + 1]?.focus();
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number,
  ) => {
    if (
      !/^[0-9]?$/.test(e.key) &&
      !["Backspace", "Tab", "Delete"].includes(e.key)
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
        paste[i] && /^[0-9]$/.test(paste[i]) ? paste[i] : "",
      ),
    );
  };

  const handleResend = () => {
    if (resendCooldown > 0 || isResending) return;
    resendOtp({ id: userId } as UserProp, {
      onSuccess: () => {
        setResendSuccess(true);
        setOtpError(false);
        setOtp(Array(6).fill(""));
        setResendCooldown(30);
        const interval = setInterval(() => {
          setResendCooldown((prev) => {
            if (prev <= 1) { clearInterval(interval); return 0; }
            return prev - 1;
          });
        }, 1000);
        setTimeout(() => setResendSuccess(false), 3000);
      },
    });
  };

  const handleSubmit = () => {
    if (!email || isPending) return;
    lookUpUser(email, {
      onSuccess: (res) => {
        setUserId(res.data.data.id);
        setState("verify");
      },
    });
  };

  return (
    <AnimatePresence mode="wait">
      {state === "form" && (
        <motion.div
          key="form-login"
          layout
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.22, ease: EASE }}
          className="flex flex-col gap-5"
        >
          <div className="flex flex-col gap-2">
            <p className="text-[10px] tracking-[3px] uppercase text-white/25">
              Email
            </p>
            <div className="flex gap-2">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                className={inputClass}
                placeholder="Enter your email"
              />
              <motion.button
                onClick={handleSubmit}
                disabled={isPending || !email}
                whileTap={{ scale: 0.96 }}
                className="w-11 h-11 shrink-0 flex justify-center items-center border border-white/10 bg-white/5 cursor-pointer rounded-md hover:bg-white/10 hover:border-white/20 transition-colors duration-150 disabled:opacity-30 disabled:cursor-not-allowed"
              >
                {isPending ? (
                  <div className="w-4 h-4 rounded-full border-2 border-white/20 border-t-white/60 animate-spin" />
                ) : (
                  <span className="text-white/50 text-sm">→</span>
                )}
              </motion.button>
            </div>
          </div>

          <p className="text-[10px] text-center text-white/20 tracking-[-0.1px] whitespace-nowrap">
            By continuing, you agree to B R 3 W&apos;s Terms & Privacy Policy.
          </p>
        </motion.div>
      )}

      {state === "verify" && (
        <motion.div
          key="verify"
          layout
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.22, ease: EASE }}
          className="flex flex-col gap-5"
        >
          <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-1 items-center">
              <p className="text-[10px] tracking-[3px] uppercase text-white/25">
                Verification code
              </p>
              <p className="text-[11px] text-white/20 tracking-[-0.1px]">
                We sent a 6-digit code to your email.
              </p>
            </div>
            <div className="flex gap-2 w-full">
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
                  onChange={(e) => handleOtpChange(e.target.value, i)}
                  onKeyDown={(e) => handleKeyDown(e, i)}
                  onPaste={handlePaste}
                  className="flex-1 h-12 w-full text-base font-medium text-white text-center rounded-md focus:outline-none transition-colors duration-150"
                  style={{
                    background: digit
                      ? "rgba(255,255,255,0.08)"
                      : "rgba(255,255,255,0.04)",
                    border: digit
                      ? "1px solid rgba(255,255,255,0.2)"
                      : "1px solid rgba(255,255,255,0.08)",
                    caretColor: "transparent",
                  }}
                />
              ))}
            </div>
          </div>

          <AnimatePresence>
            {otpError && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="px-4 py-3 rounded-md text-center"
                style={{
                  background: "rgba(239,68,68,0.05)",
                  border: "1px solid rgba(239,68,68,0.12)",
                }}
              >
                <p className="text-[11px] text-red-400/60 tracking-[-0.1px]">
                  {otpErrorMsg}
                </p>
              </motion.div>
            )}
            {resendSuccess && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="px-4 py-3 rounded-md text-center"
                style={{
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.08)",
                }}
              >
                <p className="text-[11px] text-white/40 tracking-[-0.1px]">
                  New code sent.
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex items-center justify-between">
            <button
              onClick={() => {
                setState("form");
                setOtp(Array(6).fill(""));
                setOtpError(false);
              }}
              className="text-[11px] text-white/20 text-center hover:text-white/40 transition-colors duration-150 cursor-pointer tracking-[-0.1px]"
            >
              Wrong email? Go back
            </button>
            <button
              onClick={handleResend}
              disabled={resendCooldown > 0 || isResending}
              className="text-[11px] text-white/20 hover:text-white/40 transition-colors duration-150 cursor-pointer tracking-[-0.1px] disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {isResending ? "Sending..." : resendCooldown > 0 ? `Resend in ${resendCooldown}s` : "Resend code"}
            </button>
          </div>

          <p className="text-[10px] text-center text-white/20 tracking-[-0.1px] whitespace-nowrap">
            By continuing, you agree to B R 3 W&apos;s Terms & Privacy Policy.
          </p>
        </motion.div>
      )}

      {state === "success" && (
        <motion.div
          key="success"
          layout
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
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
              transition={{ duration: 3, ease: "linear" }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default LoginForm;
