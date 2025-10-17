import type { Metadata } from "next";
import { chillax } from "../../public/fonts/chillax";
import "./globals.css";

export const metadata: Metadata = {
  title: "Brew",
  description: "If you know, you know.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${chillax.className} antialiased`}>{children}</body>
    </html>
  );
}
