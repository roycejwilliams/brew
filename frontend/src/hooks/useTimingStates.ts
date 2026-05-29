import { useEffect, useState } from "react";

interface TimeProp {
  eventCard: MomentProp | null;
}

export default function useTimingStates({ eventCard }: TimeProp) {
  const [activeEvent, setActive] = useState<"prequel" | "live" | "end">(() => {
    if (!eventCard?.moment_start) return "prequel";
    const now = new Date();
    const start = new Date(eventCard.moment_start);
    if (now < start) return "prequel";
    if (!eventCard.moment_end) return "live";
    const end = new Date(eventCard.moment_end);
    if (now <= end) return "live";
    return "end";
  });

  useEffect(() => {
    const timingStates = () => {
      const now = new Date();

      if (!eventCard?.moment_start) return;

      const start = new Date(eventCard.moment_start);
      if (now < start) {
        setActive("prequel");
        return;
      }
      if (!eventCard.moment_end) {
        setActive("live");
        return;
      }
      const end = new Date(eventCard.moment_end);
      if (now <= end) {
        setActive("live");
      } else {
        setActive("end");
      }
    };
    timingStates();
    const interval = setInterval(timingStates, 10_000);
    return () => clearInterval(interval);
  }, [eventCard?.moment_start, eventCard?.moment_end]);

  return { activeEvent };
}
