import localFont from "next/font/local";

export const chillax = localFont({
  src: [
    { path: "./Chillax-Extralight.woff2", weight: "200", style: "normal" },
    { path: "./Chillax-Light.woff2", weight: "300", style: "normal" },
    { path: "./Chillax-Regular.woff2", weight: "400", style: "normal" },
    { path: "./Chillax-Medium.woff2", weight: "500", style: "normal" },
    { path: "./Chillax-Semibold.woff2", weight: "600", style: "normal" },
    { path: "./Chillax-Bold.woff2", weight: "700", style: "normal" },
  ],
  variable: "--font-chillax",
  display: "swap",
});
