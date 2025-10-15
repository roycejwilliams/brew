import React from "react";
import { motion } from "motion/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faApple } from "@fortawesome/free-brands-svg-icons";
import { faPhone } from "@fortawesome/free-solid-svg-icons";

function LoginForm() {
  return (
    <motion.div
      key="login"
      layout
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{
        duration: 0.4,
        ease: "easeInOut",
      }}
    >
      <h2 className="text-center mt-8 text-lg">Log In to Keep Building. </h2>
      <p className="text-center mt-4 text-sm">
        Your circle. Your vision. Your momentum.
      </p>
      <input
        type="text"
        id="first_name"
        className=" border mt-8 w-full px-4 border-gray-300/30 text-gray-900 text-sm rounded-full placeholder:text-xs block mx-auto p-2.5 bg-transparent placeholder:text-white/50 focus:border-none"
        placeholder="email"
        required
      />
      <p className="text-center mt-4 text-xs">
        or
        <br />
        <br />
        continue with
      </p>
      <div className="flex justify-center gap-8 mx-auto mt-4">
        <button className=" cursor-pointer bg-black w-10 h-10 rounded-full shadow border border-white/10">
          <FontAwesomeIcon icon={faApple} />{" "}
        </button>
        <button className=" cursor-pointer bg-black w-10 h-10 rounded-full shadow border border-white/10">
          <FontAwesomeIcon icon={faPhone} />
        </button>
      </div>
      <p className="text-xs mt-8 text-center">
        By continuing, you agree to Brew&apos;s Terms & Privacy Policy.
      </p>
    </motion.div>
  );
}

export default LoginForm;
