import { Chip } from "@heroui/react";

interface VibeProp {
  vibes: string[];
}

export default function Vibe({ vibes }: VibeProp) {
  return (
    <section className="flex flex-col items-center gap-4">
      <p className="text-black/20 dark:text-white/20 text-[10px] tracking-widest uppercase font-medium">
        Vibes
      </p>
      <div className="flex flex-wrap gap-2 justify-center max-w-lg">
        {vibes.map((v) => (
          <Chip
            key={v}
            classNames={{
              base: "bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 hover:bg-black/8 dark:hover:bg-white/8 transition-all duration-200",
              content:
                "text-black/50 dark:text-white/50 text-[10px] tracking-[1.5px] uppercase font-medium px-1",
            }}
          >
            {v}
          </Chip>
        ))}
      </div>
    </section>
  );
}
