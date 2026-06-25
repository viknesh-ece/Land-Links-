import type { Metadata } from "next";
// @ts-ignore
import "./globals.css";

export const metadata: Metadata = {
  title: "LandLinkX | India's Premier Next-Gen Land Marketplace",
  description: "Direct landowner transactions, AI-powered price valuation prediction, and verified clear deeds for builders, investors, and land sellers.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className="antialiased"
      >
        {children}
      </body>
    </html>
  );
}
