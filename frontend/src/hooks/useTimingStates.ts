import { useEffect, useState } from "react";

interface TimeProp {
  eventCard: MomentProp | null;
}

export default function useTimingStates({ eventCard }: TimeProp) {
  const [activeEvent, setActive] = useState<"prequel" | "live" | "end">(
    "prequel",
  );

  useEffect(() => {
    const timingStates = () => {
      const now = new Date();

      if (!eventCard?.moment_start || !eventCard?.moment_end) return;

      const start = new Date(eventCard.moment_start);
      const end = new Date(eventCard.moment_end);

      if (now < start) {
        setActive("prequel");
      } else if (now >= start && now <= end) {
        setActive("live");
      } else {
        setActive("end");
      }
    };
    // Run immediately on mount or when eventCard changes
    timingStates();
  }, [eventCard?.moment_start, eventCard?.moment_end]);

  return { activeEvent };
}
