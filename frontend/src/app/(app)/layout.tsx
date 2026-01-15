import { Metadata } from "next";
import Nav from "../components/nav";
import ClientUi from "../components/ClientUi";

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
    <main>
      <div className="relative flex-1 overflow-hidden">
        <Nav />
        {children}
        <ClientUi />
      </div>{" "}
    </main>
  );
}
