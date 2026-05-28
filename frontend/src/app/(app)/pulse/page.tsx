import type { Viewport } from "next";
import Map from "../../components/BrewMap";

export const dynamic = "force-dynamic";

export const viewport: Viewport = {
  themeColor: "#0c0c0c",
};

export default function Discover() {
  return <Map />;
}
