"use client";
import React, { useEffect } from "react";
import Map from "../../components/BrewMap";

export const dynamic = "force-dynamic";

export default function Discover() {
  useEffect(() => {
    document.body.style.backgroundColor = "transparent";
    return () => {
      document.body.style.backgroundColor = "#0c0c0c";
    };
  }, []);

  return <Map />;
}
