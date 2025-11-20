import React from "react";
import { Switch, SwitchProps, cn } from "@heroui/react";

interface CustomSwitch extends SwitchProps {
  children?: React.ReactNode;
}

export default function CustomSwitch({ children }: CustomSwitch) {
  return <Switch>{children}</Switch>;
}
