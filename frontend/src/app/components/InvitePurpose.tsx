import { ArrowUpRight } from "lucide-react";
import { motion } from "motion/react";
import Image from "next/image";
import { useState } from "react";
import Moments from "./Moments";
import { StaticImport } from "next/dist/shared/lib/get-img-props";

type PurposeSelection = "moment" | "circle" | "brew";

interface UserProp {
  id: string;
  username: string;
  phonenumber: string;
  email: string;
  profile: {
    fullname: string;
    avatarUrl: string | StaticImport;
  };
}

interface InviteMomentSelection {
  selectedPeople: UserProp[];
}

const purposes = [
  {
    id: "moment",
    title: "A Moment",
    description: "Something specific, happening soon.",
    image: "/moment.jpg",
  },
  {
    id: "circle",
    title: "A Circle",
    description: "A group you trust.",
    image: "/circle.jpg",
  },
  {
    id: "brew",
    title: "Brew",
    description: "Bring them into the network.",
    image: "/brew.jpg",
  },
];

export default function InvitePurpose({
  selectedPeople,
}: InviteMomentSelection) {
  const [selectPurpose, setSelectedPurpose] = useState<PurposeSelection | null>(
    null,
  );

  console.log(selectPurpose);

  if (selectPurpose === null) {
    return (
      <motion.section
        key="purpose"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        className="space-y-5 mx-auto my-auto w-full"
      >
        <motion.h2
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className=" text-white/50 text-center tracking-wide "
        >
          What is this invitation for?
        </motion.h2>

        <div className="rounded-2xl overflow-hidden border h-100 border-white/[0.07] divide-y divide-white/[0.07] shadow-2xl">
          {purposes.map((purpose, i) => (
            <motion.button
              onClick={() => setSelectedPurpose(purpose.id as PurposeSelection)}
              key={purpose.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                delay: 0.15 + i * 0.08,
                duration: 0.4,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="group relative text-left px-6 py-8 flex h-1/3 justify-between items-center cursor-pointer w-full overflow-hidden"
            >
              {/* Background image */}
              <Image
                src={purpose.image}
                alt={purpose.title}
                fill
                className="object-cover -z-20 brightness-[0.7] group-hover:brightness-[1] group-hover:scale-105 transition-all duration-700 ease-out"
              />

              {/* Left-anchored gradient so text is always legible */}
              <div className="absolute inset-0 -z-10 bg-linear-to-r from-black/80 via-black/50 to-black/10" />

              {/* Bottom vignette for extra depth */}
              <div className="absolute inset-0 -z-10 bg-linear-to-t from-black/40 to-transparent" />

              {/* Text */}
              <div className="space-y-1">
                <h3 className="text-sm  text-white tracking-[-0.01em] leading-snug">
                  {purpose.title}
                </h3>
                <p className="text-sm font-light text-white/50 group-hover:text-white/70 transition-colors duration-300">
                  {purpose.description}
                </p>
              </div>

              {/* Arrow */}
              <div className="ml-6 shrink-0 w-8 h-8 rounded-full border border-white/10 flex items-center justify-center bg-white/5 group-hover:bg-white/12 group-hover:border-white/20 transition-all duration-300">
                <ArrowUpRight
                  size={15}
                  className="text-white/50 group-hover:text-white group-hover:translate-x-px group-hover:-translate-y-px transition-all duration-300"
                />
              </div>
            </motion.button>
          ))}
        </div>
      </motion.section>
    );
  }

  if (selectPurpose === "moment") {
    return <Moments selectedPeople={selectedPeople} />;
  }

  if (selectPurpose === "circle") {
    return <div>circle works</div>;
  }

  if (selectPurpose === "brew") {
    return <div>brew works</div>;
  }
}
