import { motion } from "motion/react";
import { useRouter } from "next/navigation";

interface DoneScreenProp {
  momentId: string | null;
  onClose: () => void;
}

const EASE = [0.16, 1, 0.3, 1] as const;

export default function DoneScreen({ momentId, onClose }: DoneScreenProp) {
  const router = useRouter();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex flex-col items-center justify-center  min-h-[50vh] gap-10"
    >
      {/* Check */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, ease: EASE }}
        className="w-16 h-16 rounded-full flex items-center  justify-center"
        style={{
          background: "rgba(255,255,255,0.05)",
          border: "1px solid rgba(255,255,255,0.1)",
        }}
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <motion.path
            d="M5 13l4 4L19 7"
            stroke="rgba(255,255,255,0.7)"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.4, delay: 0.3, ease: EASE }}
          />
        </svg>
      </motion.div>

      {/* Text */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, ease: EASE }}
        className="flex flex-col items-center gap-2"
      >
        <h2 className="text-white/90 text-xl font-medium tracking-[-0.3px]">
          Moment created.
        </h2>
        <p className="text-white/30 text-sm tracking-[-0.1px]">
          It&apos;s set. Now let it unfold.
        </p>
      </motion.div>

      {/* Actions */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35, ease: EASE }}
        className="flex items-center gap-4"
      >
        <button
          onClick={onClose}
          className="px-5 py-2.5 text-sm text-white/40 hover:text-white/70 transition-colors cursor-pointer"
        >
          Close
        </button>
        <button
          onClick={() => {
            onClose();
            router.push(`/moments/${momentId}`);
          }}
          className="px-5 py-2.5 text-sm text-white/90 bg-white/5 border border-white/10 rounded-md hover:bg-white/10 hover:border-white/20 transition-all cursor-pointer"
        >
          View Moment →
        </button>
      </motion.div>
    </motion.div>
  );
}
