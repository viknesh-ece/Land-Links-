// @ts-ignore
import "./globals.css";
import Animated3DBackground from "@/components/Animated3DBackground";

export const metadata = {
    title: "LandLinkX | India's Premier Next-Gen Land Marketplace",
    description: "Direct landowner transactions, AI-powered price valuation prediction, and verified clear deeds for builders, investors, and land sellers.",
};

export default function RootLayout({ children, }) {
    return (<html lang="en">
      <body className="antialiased bg-black min-h-screen text-slate-100 overflow-x-hidden">
        <Animated3DBackground />
        <div className="relative z-10 min-h-screen flex flex-col">
          {children}
        </div>
      </body>
    </html>);
}
