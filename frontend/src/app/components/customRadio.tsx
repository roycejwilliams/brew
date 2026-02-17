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
      rounded-md border border-white/8 px-4 py-3
      hover:border-white/12 hover:bg-white/[0.02] transition-all duration-200
      data-[selected=true]:bg-[#98473E]/10 data-[selected=true]:border-[#98473E]/30 data-[selected=true]:text-white
    `,
        control: "relative",
        wrapper: "hidden",
        label: "text-sm text-white/90 data-[selected=true]:text-white",
      }}
    >
      {children}
    </Radio>
  );
}
