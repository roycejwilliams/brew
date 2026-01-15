import React, { useState } from "react";
import FaqItem from "./faqItem";

function EventFAQ() {
  const eventFaq = [
    {
      faq: "Is there a dress expectation?",
      description:
        "Think effortless and refined — clean silhouettes, warm tones, and pieces that feel lived-in yet elevated. If it feels like you could walk into Mulberry Street with confidence, you’re in the right place.",
    },
    {
      faq: "Can I transfer my invite?",
      description:
        "Yes — you can transfer your spot through the app before the event begins. Once doors open, the guest list is set.",
    },
    {
      faq: "What’s the vibe of the night?",
      description:
        "Warm lighting, curated sound, textured spaces, and a crowd that values intention. Inspired by downtown evenings — simple, stylish, quietly memorable.",
    },
    {
      faq: "Are photos allowed?",
      description:
        "Lightly. Capture moments that feel honest, but be present. The real atmosphere lives in conversation, not the camera roll.",
    },
  ];

  const [activeIndex, setActiveIndex] = useState<number>(0);

  return (
    <section className="min-h-screen py-24 w-full overflow-hidden inset-0 grid xl:grid-cols-2 grid-cols-1 xl:grid-rows-1 grid-rows-2  ">
      <div className="xl:col-span-1    ">
        <h2 className="text-8xl font-medium">Before You Arrive</h2>
      </div>
      <div className="xl:col-span-1 place-content-center place-self-center w-full">
        <ul className="flex flex-col space-y-6 h-full w-full mt-40">
          {eventFaq.map((items, i) => (
            <div key={i}>
              <FaqItem
                question={items.faq}
                description={items.description}
                onToggle={() => setActiveIndex(i)}
                isActive={activeIndex === i}
              />
            </div>
          ))}
        </ul>
      </div>
    </section>
  );
}

export default EventFAQ;
