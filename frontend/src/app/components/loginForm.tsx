import React, { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGoogle } from "@fortawesome/free-brands-svg-icons";
import {
  faArrowAltCircleRight,
  faCheck,
  faEnvelope,
  faPhone,
} from "@fortawesome/free-solid-svg-icons";
import { useSession, signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

interface Phase {
  state: "form" | "verify" | "success";
  setState: (state: "form" | "verify" | "success") => void;
}

const serverOtp: string[] = ["1", "2", "3", "4", "5", "6"];

function LoginForm({ state, setState }: Phase) {
  const { data: session } = useSession();
  const [isPhone, setIsPhone] = useState<boolean>(false);
  const inputsRef = useRef<Array<HTMLInputElement | null>>([]); // holds the group of inputs

  const [otp, setOtp] = useState<string[]>(Array(6).fill("")); //
  const router = useRouter();

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

  if (otp === serverOtp) setState("success");

  useEffect(() => {
    if (otp.join("") === serverOtp.join("")) {
      setState("success");

      const timeout = setTimeout(() => {
        router.push("/discover");
      }, 3000);

      return () => clearTimeout(timeout);
    }
  }, [otp]); // ✅ only depends on otp

  const openPhone = () => {
    setIsPhone((e) => !e);
  };

  console.log("LoginForm phase:", state);

  return (
    <>
      {state === "form" &&
        (isPhone ? (
          <motion.div
            key="phone"
            layoutId="form-container"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
          >
            <h2 className="text-center mt-8 text-lg">
              Log in with Phone Number
            </h2>
            <p className="text-center mt-4 text-sm">
              Phone number verification is used for security purposes only. We
              take privacy very seriously and will never share your phone number
              with anyone.
            </p>

            <div className="flex gap-x-4 items-center mt-8 ">
              <input
                type="text"
                id="phone_number"
                className="border text-white w-5/6 px-4 border-gray-300/30 text-sm rounded-full placeholder:text-xs block mx-auto p-2.5 bg-transparent placeholder:text-white/50 focus:outline-none"
                placeholder="enter phone number"
                required
              />
              <button
                type="button"
                onClick={() => setState("verify")}
                className="w-10 h-10 flex justify-center items-center border border-gray-300/30 cursor-pointer shadow rounded-full"
              >
                <FontAwesomeIcon icon={faArrowAltCircleRight} />
              </button>
            </div>

            <p className="text-center mt-4 text-xs">
              or
              <br />
              <br />
              continue with
            </p>
            <div className="flex justify-center gap-8 mx-auto mt-4">
              <button
                onClick={() => signIn("google", { callbackUrl: "/" })}
                className="cursor-pointer bg-black w-10 h-10 rounded-full shadow border border-white/10"
              >
                <FontAwesomeIcon
                  aria-label="Sign in with Google"
                  icon={faGoogle}
                />
              </button>
              <button
                onClick={openPhone}
                className="cursor-pointer bg-black w-10 h-10 rounded-full shadow border border-white/10"
              >
                <FontAwesomeIcon
                  aria-label="Sign in with Email"
                  icon={faEnvelope}
                />
              </button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="email"
            layoutId="form-container"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
          >
            <h2 className="text-center mt-8 text-lg">
              Log In to Keep Building.
            </h2>
            <p className="text-center mt-4 text-sm">
              Your circle. Your vision. Your momentum.
            </p>

            <div className="flex gap-x-4 items-center mt-8 ">
              <input
                type="text"
                id="email"
                className="border text-white w-5/6 px-4 border-gray-300/30 text-sm rounded-full placeholder:text-xs block mx-auto p-2.5 bg-transparent placeholder:text-white/50 focus:outline-none"
                placeholder="email"
                required
              />
              <button
                onClick={() => setState("verify")}
                className="w-10 h-10 flex justify-center items-center border border-gray-300/30 cursor-pointer shadow rounded-full"
              >
                <FontAwesomeIcon icon={faArrowAltCircleRight} />
              </button>
            </div>

            <p className="text-center mt-4 text-xs">
              or
              <br />
              <br />
              continue with
            </p>
            <div className="flex justify-center gap-8 mx-auto mt-4">
              <button
                onClick={() => signIn("google", { callbackUrl: "/" })}
                className="cursor-pointer bg-black w-10 h-10 rounded-full shadow border border-white/10"
              >
                <FontAwesomeIcon
                  aria-label="Sign in with Google"
                  icon={faGoogle}
                />
              </button>
              <button
                onClick={openPhone}
                className="cursor-pointer bg-black w-10 h-10 rounded-full shadow border border-white/10"
              >
                <FontAwesomeIcon icon={faPhone} />
              </button>
            </div>

            <p className="text-xs mt-8 text-center">
              By continuing, you agree to Brew&apos;s Terms & Privacy Policy.
            </p>
          </motion.div>
        ))}

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
          <div className="w-32 h-32 bg-liner-to-b from-[#98473E] to-[#19535F]  shadow relative rounded-full border-white/15 flex justify-center items-center mx-auto">
            <FontAwesomeIcon icon={faCheck} />{" "}
          </div>
        </motion.div>
      )}
    </>
  );
}

export default LoginForm;
