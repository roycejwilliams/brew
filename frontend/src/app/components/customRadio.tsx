import React from "react";
import { RadioProps } from "@heroui/react";
import { Radio } from "@heroui/react";

interface CustomRadioProps extends RadioProps {
  children?: React.ReactNode;
}

export default function CustomRadio({
  children,
  ...otherProps
}: CustomRadioProps) {
  return (
    <Radio
      {...otherProps}
      classNames={{
        base: `
      flex gap-4 cursor-pointer 
      rounded-full border border-white/20 p-2
      hover:opacity-75 transition
      data-[selected=true]:bg-[#98473E] data-[selected=true]:text-white
    `,
        control: "relative", // completely hides the blue dot
        wrapper: "hidden", // optional: hide wrapper too
        label: "text-xs",
      }}
    >
      {children}
    </Radio>
  );
}
