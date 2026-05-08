import { useState } from "react";
import FaqItem from "./faqItem";

interface EventFAQProp {
  faqs: { question: string; answer: string }[];
}

function EventFAQ({ faqs }: EventFAQProp) {
  const [activeIndex, setActiveIndex] = useState<number>(0);

  return (
    <section className=" py-24 w-full overflow-hidden inset-0 grid xl:grid-cols-2 grid-cols-1 xl:grid-rows-1 grid-rows-2">
      <div className="xl:col-span-1">
        <h2 className="text-8xl font-medium">Before You Arrive</h2>
      </div>
      <div className="xl:col-span-1 place-content-center place-self-center w-full">
        <ul className="flex flex-col space-y-6 h-full w-full mt-40">
          {faqs.map((item, i) => (
            <div key={i}>
              <FaqItem
                question={item.question}
                description={item.answer}
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
