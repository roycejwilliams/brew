import React from "react";

export const ToggleState = (
  setState: React.Dispatch<React.SetStateAction<boolean>>
) => {
  setState((prev) => !prev);
};
