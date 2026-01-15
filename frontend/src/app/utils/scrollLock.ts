"use client";
import React, { useEffect } from "react";

export const ScrollLock = (state: boolean) => {
  useEffect(() => {
    if (state) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "scroll";
    }

    return () => {
      document.body.style.overflow = "scroll";
    };
  }, [state]);
};
