import type { Metadata } from "next";
import { chillax } from "../../public/fonts/chillax";
import "@heroui/styles";
import "./globals.css";
import "mapbox-gl/dist/mapbox-gl.css";
import { Providers } from "@/providers/providers";

export const metadata: Metadata = {
  title: "B R 3 W",
  description: "If you know, you know.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${chillax.className} antialiased`}>
        {" "}
        <Providers>{children} </Providers>
      </body>
    </html>
  );
}
