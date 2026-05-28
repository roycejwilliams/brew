import type { Viewport } from "next";
import AppLayoutClient from "./AppLayoutClient";

export const viewport: Viewport = {
  themeColor: "#0c0c0c",
};

export default function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <AppLayoutClient>{children}</AppLayoutClient>;
}
