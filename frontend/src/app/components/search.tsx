"use client";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { SearchIcon } from "./icons";
import useDebounce from "../hooks/useDebounce";

type MomentSelectionProp = "start" | "circle" | "people" | "nearby" | "confirm";

interface SearchMapProps {
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  onFocus?: () => void;
  autoFocus?: boolean;
  selectedModal: MomentSelectionProp;
}

export default function SearchMap({
  placeholder,
  value,
  onChange,
  onFocus,
  autoFocus = false,
  selectedModal,
}: SearchMapProps) {
  placeholder =
    selectedModal === "circle"
      ? "Set the scene"
      : selectedModal === "people"
        ? "Curate the room"
        : "Find a vibe...";

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (onChange) {
      //this becomes a string because of our interface definition
      onChange(e.target.value);
    }
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="flex justify-evenly mx-auto items-center"
    >
      <motion.div
        whileFocus={{ scale: 1.01 }}
        transition={{ duration: 0.2 }}
        className="w-full px-5 py-3.5 bg-[#1c1c1c] backdrop-blur-xl  mx-auto flex items-center gap-3 shadow-2xl shadow-black/20"
      >
        <motion.div
          initial={{ opacity: 0.5 }}
          animate={{ opacity: 0.4 }}
          whileHover={{ opacity: 0.6 }}
          transition={{ duration: 0.2 }}
          className="w-fit h-fit flex justify-center items-center"
        >
          <SearchIcon size={18} color="currentColor" />
        </motion.div>
        <input
          type="text"
          id="search"
          value={value}
          onChange={handleChange}
          onFocus={onFocus}
          autoFocus={autoFocus}
          className="text-white/90 flex-1 text-sm placeholder:text-sm block p-0 bg-transparent placeholder:text-white/30 focus:outline-none transition-all"
          placeholder={placeholder}
          required
        />
      </motion.div>
    </motion.section>
  );
}
