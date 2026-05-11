import { AnimatePresence, motion } from "motion/react";
import CircleScene from "./CircleScene";
import CircleSignal from "./CircleSignal";
import CircleControls from "./circleControls";
import SelectAction from "./selectAction";
import { useGetCirclesWithMembers } from "@/hooks/useCircles";
import { useUserStore } from "@/stores/useUserStore";

interface CircleSelection {
  activeIndex: number;
  setActiveCircle: React.Dispatch<React.SetStateAction<number>>;
  selectedCircle: CircleProp | null;
  setSelectedCircleProp: (selectedCircle: CircleProp | null) => void;
  setSelectedModal: (selectedModal: "confirm") => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setForm: React.Dispatch<React.SetStateAction<any>>;
}

export default function Circle({
  activeIndex,
  selectedCircle,
  setActiveCircle,
  setSelectedCircleProp,
  setSelectedModal,
  setForm,
}: CircleSelection) {
  const { user } = useUserStore();
  const { data: getAllCircles } = useGetCirclesWithMembers(user?.id as string);

  const nextSignal = () => {
    setActiveCircle((i) => (i + 1) % getAllCircles?.data.data.length);
  };

  const prevSignal = () => {
    setActiveCircle(
      (i) =>
        (i - 1 + getAllCircles?.data.data.length) %
        getAllCircles?.data.data.length,
    );
  };

  return (
    <AnimatePresence mode="sync">
      <motion.section key="circle" className=" text-center space-y-5 relative">
        <motion.div
          key={selectedCircle ? "selected-header" : "browse-header"}
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 4 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="mb-6 space-y-1"
        >
          {selectedCircle ? (
            <>
              <h2 className="text-lg font-medium text-white/90">
                Inviting your circle
              </h2>
              <p className="text-sm text-white/40">
                Sending to{" "}
                <span className="text-white/70 font-medium">
                  {selectedCircle.circle_name}
                </span>
              </p>
            </>
          ) : (
            <>
              <h2 className="text-lg font-medium text-white/90">
                Share with your circle
              </h2>
              <p className="text-sm text-white/40">
                Invite people you already trust
              </p>
            </>
          )}
        </motion.div>

        {/* MIDDLE — persistent */}
        <CircleScene
          circles={getAllCircles?.data.data}
          circleIndex={activeIndex}
          markerIndex={activeIndex}
          selectedCircle={selectedCircle}
        />

        <AnimatePresence mode="wait">
          {/* CONTROLS — presence */}
          {selectedCircle === null && (
            <>
              <CircleSignal
                circles={getAllCircles?.data.data}
                activeIndex={activeIndex}
              />
              <CircleControls nextMarker={nextSignal} prevMarker={prevSignal} />
            </>
          )}
        </AnimatePresence>

        <SelectAction
          selectedCircle={selectedCircle}
          onSelect={() => {
            const circle = getAllCircles?.data.data[activeIndex];
            setSelectedCircleProp(circle);
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            setForm((prev: any) => ({ ...prev, circle_id: circle?.id }));
          }}
          onContinue={() => setSelectedModal("confirm")}
        />

        {/* CTA — persistent */}
      </motion.section>
    </AnimatePresence>
  );
}
