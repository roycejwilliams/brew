import { AnimatePresence, motion } from "motion/react";
import React, { useEffect, useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck } from "@fortawesome/free-solid-svg-icons";

interface Phase {
  state: "form" | "verify" | "success";
  setState: (state: "form" | "verify" | "success") => void;
}

const serverOtp: string[] = ["1", "2", "3", "4", "5", "6"];

function InviteForm({ state, setState }: Phase) {
  //handle keydowns
  const inputsRef = useRef<Array<HTMLInputElement | null>>([]); // holds the group of inputs
  const [otp, setOtp] = useState<string[]>(Array(6).fill("")); //

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
    index: number
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
        paste[i] && /^[0-9]?$/.test(paste[i]) ? paste[i] : ""
      )
    );
  };

  //basically now to activate the success look we need to take the e.target.value;

  if (otp === serverOtp) setState("success");

  useEffect(() => {
    // if serverOTP equals otp then success forms show
    if (otp.join("") === serverOtp.join("")) {
      setState("success");
    }
  }, [otp, serverOtp]);

  return (
    <>
      {state === "form" && (
        <motion.div
          key="form"
          layout
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{
            duration: 0.4,
            ease: "easeInOut",
          }}
        >
          <h2 className="text-center mt-8 text-lg">Verify your number</h2>
          <p className="text-center mt-4 text-sm">
            We take privacy very seriously and will never share your phone
            number with anyone.
          </p>
          <input
            type="text"
            id="phone"
            className=" border focus:outline mt-8 w-full px-4 border-gray-300/30 text-white text-sm rounded-full placeholder:text-xs block mx-auto p-2.5 bg-transparent placeholder:text-white/50 focus:border-none"
            placeholder="phone"
            required
          />

          <div className="flex items-center gap-x-4 mt-8">
            <p className="text-xs w-1/4 text-left flex-1">
              By continuing, you agree to Brew&apos;s Terms & Privacy Policy.
            </p>
            <button
              onClick={() => setState("verify")}
              className="rounded-full w-1/3 py-4 bg-[#19535F] shadow-md cursor-pointer"
            >
              Next
            </button>
          </div>
        </motion.div>
      )}

      {state === "verify" && (
        <motion.div
          key="verify"
          layout
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{
            duration: 0.4,
            ease: "easeInOut",
          }}
        >
          <h2 className="text-center mb-4 mt-8 text-lg">
            Enter the 6-digit verification code
          </h2>
          {/* One time password UI */}
          <form className="flex justify-around items-center">
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
                className="w-8 h-14 text-3xl focus:outline text-white flex text-center justify-center items-center border-b-[0.2px]"
              ></input>
            ))}
          </form>
          <div className="flex items-center gap-x-4 mt-4">
            <p className="text-xs  text-center flex-1">
              By continuing, you agree to Brew&apos;s Terms & Privacy Policy.
            </p>
          </div>
        </motion.div>
      )}

      {state === "success" && (
        <motion.div
          key="success"
          layout
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{
            duration: 0.4,
            ease: "easeInOut",
          }}
          className="z-10"
        >
          <h2 className="text-center relative mb-4 mt-8 text-lg">Success</h2>
          <div className="w-32 h-32 bg-gradient-to-b from-[#98473E] to-[#19535F]  shadow relative rounded-full border-white/15 flex justify-center items-center mx-auto">
            <FontAwesomeIcon icon={faCheck} />{" "}
          </div>
        </motion.div>
      )}
    </>
  );
}

export default InviteForm;
