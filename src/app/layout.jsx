import "./globals.css";
import Animated3DBackground from "@/components/Animated3DBackground";
import AICopilot from "@/components/AICopilot";
import { LanguageProvider } from "@/context/LanguageContext";

export const metadata = {
    title: "LandLinkX | India's Premier Next-Gen Land Marketplace",
    description: "Direct landowner transactions, AI-powered price valuation prediction, and verified clear deeds for builders, investors, and land sellers.",
};

export default function RootLayout({ children, }) {
    return (
    <html lang="en">
      <body className="antialiased bg-[#f8fafc] min-h-screen text-slate-900 overflow-x-hidden selection:bg-blue-600 selection:text-white">
        <LanguageProvider>
          <Animated3DBackground />
          <AICopilot />
          <div className="relative z-10 min-h-screen flex flex-col">
            {children}
          </div>
        </LanguageProvider>
      </body>
    </html>
    );
}
