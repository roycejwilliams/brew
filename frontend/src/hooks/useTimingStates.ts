import { useEffect, useState } from "react";

interface TimeProp {
  eventCard: MomentProp | null;
}

export default function useTimingStates({ eventCard }: TimeProp) {
  const [activeEvent, setActive] = useState<"prequel" | "live" | "end">(() => {
    if (!eventCard?.moment_start || !eventCard?.moment_end) return "prequel";
    const now = new Date();
    const start = new Date(eventCard.moment_start);
    const end = new Date(eventCard.moment_end);
    if (now < start) return "prequel";
    if (now >= start && now <= end) return "live";
    return "end";
  });

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
    timingStates();
    const interval = setInterval(timingStates, 60_000);
    return () => clearInterval(interval);
  }, [eventCard?.moment_start, eventCard?.moment_end]);

  return { activeEvent };
}
