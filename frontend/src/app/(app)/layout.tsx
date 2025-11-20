import { Metadata } from "next";
import Nav from "../components/nav";

export const metadata: Metadata = {
  title: "",
  description: "",
};

export default function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="flex">
      <Nav />
      {children}
    </main>
  );
}
