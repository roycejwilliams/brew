import type { Metadata, Viewport } from "next";
import { chillax } from "../../public/fonts/chillax";
import "@heroui/styles";
import "./globals.css";
import "mapbox-gl/dist/mapbox-gl.css";
import { Providers } from "@/providers/providers";

export const viewport: Viewport = {
  viewportFit: "cover",
  width: "device-width",
  initialScale: 1,
  themeColor: "#0c0c0c",
};

export const metadata: Metadata = {
  title: "B R 3 W",
  description: "If you know, you know.",
  icons: {
    icon: [
      {
        url: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 48 48'><line x1='24' y1='4' x2='24' y2='44' stroke='white' stroke-width='3' stroke-linecap='round'/><line x1='4' y1='24' x2='44' y2='24' stroke='white' stroke-width='3' stroke-linecap='round'/><line x1='9.86' y1='9.86' x2='38.14' y2='38.14' stroke='white' stroke-width='3' stroke-linecap='round'/><line x1='38.14' y1='9.86' x2='9.86' y2='38.14' stroke='white' stroke-width='3' stroke-linecap='round'/></svg>",
        type: "image/svg+xml",
      },
    ],
    apple: "/apple-icon-76x76.png",
  },
  openGraph: {
    title: "B R 3 W",
    description: "If you know, you know.",
    url: "https://br3w.app",
    siteName: "BR3W",
    images: [
      {
        url: "/site-logo.jpg",
        width: 1200,
        height: 630,
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "BR3W",
    description: "If you know, you know.",
    images: ["/site-logo.jpg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${chillax.className} antialiased`}>
        <div className="fixed inset-0 -z-10 bg-[#0c0c0c]" />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
