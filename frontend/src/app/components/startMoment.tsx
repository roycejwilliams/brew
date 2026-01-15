import { RadioGroup } from "@heroui/radio";
import React, { use, useRef, useState } from "react";
import CustomRadio from "./customRadio";

export default function StartMoment() {
  const time = [
    {
      value: "tonight",
      date: "Tonight",
    },
    {
      value: "tomorrow",
      date: "Tomorrow",
    },
    {
      value: "weekend",
      date: "This Weekend",
    },
    {
      value: "pickTime",
      date: "Pick Time +",
    },
  ];

  const typeInvite = [
    {
      value: "circle",
      type: "Circle",
    },
    {
      value: "people",
      type: "People",
    },
    {
      value: "nearby",
      type: "Anyone Nearby",
    },
  ];

  const [reveal, setReveal] = useState<boolean>(false);

  const customRadio = useRef<HTMLButtonElement>(null);

  const revealComponentOnClick = (e: boolean) => {};

  return (
    <section className="mx-auto max-w-md text-[#cecece]/75">
      <div className="flex flex-col">
        <label className="text-lg">What&apos;s the move?</label>
        <input
          type="text"
          id="move"
          placeholder={`"Ramen Tonight"`}
          required
          className="mt-4 border py-2 px-4 rounded-md bg-[#636363]/20 border-white/30 backdrop-blur-2xl focus:outline-none placeholder:text-white/30 placeholder:text-sm"
        ></input>
      </div>
      <div className="mt-8">
        <RadioGroup
          disableAnimation
          orientation="horizontal"
          label="When?"
          size="lg"
          classNames={{
            label: "mb-2 text-base",
            wrapper: "flex gap-6 mt-4   text-white",
          }}
        >
          {time.map((when, i) => (
            <CustomRadio key={i} value={when.value}>
              {when.date}
            </CustomRadio>
          ))}
        </RadioGroup>
      </div>
      <div className="mt-8">
        <RadioGroup
          disableAnimation
          orientation="horizontal"
          label="Who?"
          size="lg"
          classNames={{
            label: "mb-2 text-base",
            wrapper: "flex gap-6 mt-4   text-white",
          }}
        >
          {typeInvite.map((invite, i) => (
            <CustomRadio key={i} value={invite.value}>
              {invite.type}
            </CustomRadio>
          ))}
        </RadioGroup>
      </div>
    </section>
  );
}
