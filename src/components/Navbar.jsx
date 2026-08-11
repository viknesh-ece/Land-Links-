"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { MapPin, LayoutDashboard, Landmark, LogIn, UserPlus, TrendingUp, LogOut, ChevronDown, MessageSquare, ShieldCheck, Home, Sparkles, Globe, ShieldAlert } from "lucide-react";
import { getLoggedInUser, logoutUser } from "@/lib/auth";
import { useLanguage } from "@/context/LanguageContext";

export default function Navbar() {
    const pathname = usePathname();
    const router = useRouter();
    const [user, setUser] = useState(null);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const { lang, toggleLanguage, t } = useLanguage();

    useEffect(() => {
        setUser(getLoggedInUser());
        const handleAuthChange = () => {
            setUser(getLoggedInUser());
        };
        window.addEventListener("auth-change", handleAuthChange);
        return () => {
            window.removeEventListener("auth-change", handleAuthChange);
        };
    }, []);

    const handleLogout = () => {
        logoutUser();
        setUser(null);
        setDropdownOpen(false);
        router.push("/");
    };

    const getDashboardLink = () => {
        if (!user) return "/dashboard";
        const role = user.role.toLowerCase();
        if (role === "landowner") return "/dashboard/landowner";
        if (role === "investor") return "/dashboard/investor";
        if (role === "builder") return "/dashboard/builder";
        return "/dashboard";
    };

    const navItems = [
        { name: t.navHome || "Home", href: "/", icon: Home },
        { name: t.navSpatial || "3D Spatial Studio", href: "/spatial-studio", icon: Sparkles, highlight: true },
        { name: t.navListings || "Land Marketplace", href: "/listings", icon: Landmark },
        { name: t.navValuation || "AI Land Valuation", href: "/ai-price", icon: TrendingUp },
        { name: lang === "ta" ? "டெமோ ஆவணங்கள்" : "Demo Playground", href: "/admin/analytics", icon: Sparkles },
        { name: lang === "ta" ? "நிர்வாகி தணிக்கை" : "Admin Audit", href: "/admin/dashboard", icon: ShieldAlert },
        ...(user ? [
            { name: t.navInbox || "Inbox", href: "/inbox", icon: MessageSquare, badge: true },
            { name: lang === "ta" ? "டாஷ்போர்டு" : "Dashboard", href: getDashboardLink(), icon: LayoutDashboard }
        ] : []),
    ];

    return (
      <header className="sticky top-0 z-50 w-full border-b border-emerald-100/90 bg-white/95 backdrop-blur-2xl shadow-sm">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-600 via-teal-600 to-emerald-800 text-white shadow-md shadow-emerald-600/25 transition-transform group-hover:scale-105">
              <MapPin className="h-5.5 w-5.5"/>
            </div>
            <span className="text-xl font-black text-emerald-950 tracking-tight">
              {t.brandName || "LandLink"}<span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-600 font-black">X</span>
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href || (item.name === "Dashboard" && pathname.startsWith("/dashboard"));
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all duration-200 relative ${
                    isActive
                      ? "bg-gradient-to-r from-emerald-600 to-teal-700 text-white shadow-md shadow-emerald-600/25 scale-[1.02]"
                      : item.highlight
                      ? "bg-emerald-50 border border-emerald-200 text-emerald-800 hover:bg-emerald-100"
                      : "text-emerald-900/80 hover:text-emerald-950 hover:bg-emerald-50/80"
                  }`}
                >
                  <Icon className="h-4 w-4"/>
                  <span>{item.name}</span>
                  {item.badge && (<span className="absolute top-1.5 right-2 h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>)}
                </Link>
              );
          })}
          </nav>

          {/* Language Switcher & User Profile Menu */}
          <div className="flex items-center gap-3 relative">
            
            {/* Tamil / English Toggle Button */}
            <button
              onClick={toggleLanguage}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-emerald-200 hover:border-emerald-500 text-emerald-800 hover:text-emerald-950 text-xs font-black transition-all cursor-pointer shadow-sm"
              title="Toggle Tamil / English Language"
            >
              <Globe className="h-4 w-4 text-emerald-600" />
              <span>{lang === "en" ? "தமிழ்" : "English"}</span>
            </button>

            {user ? (
              <div className="relative">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-xl hover:bg-emerald-50 border border-transparent hover:border-emerald-200 transition-all cursor-pointer text-emerald-950"
                >
                  <div className="h-8.5 w-8.5 rounded-full bg-gradient-to-r from-emerald-600 to-teal-700 text-white flex items-center justify-center font-black text-sm uppercase shadow-sm">
                    {user.name.charAt(0)}
                  </div>
                  <div className="hidden sm:flex flex-col text-left">
                    <span className="text-xs font-bold text-emerald-950 leading-tight flex items-center gap-1">
                      {user.name}
                      <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" title="Verified User"/>
                    </span>
                    <span className="text-[10px] font-extrabold text-emerald-600 uppercase tracking-wide">
                      {user.role}
                    </span>
                  </div>
                  <ChevronDown className="h-4 w-4 text-emerald-700"/>
                </button>

                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-52 rounded-2xl bg-white border border-emerald-100 shadow-xl py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150 text-emerald-950">
                    <div className="px-4 py-2 border-b border-emerald-50">
                      <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider">Logged in as</p>
                      <p className="text-xs font-bold text-emerald-950 truncate">{user.email}</p>
                    </div>
                    
                    <Link
                      href={getDashboardLink()}
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-2 px-4 py-2.5 text-xs font-bold text-emerald-900 hover:text-emerald-600 hover:bg-emerald-50 transition-colors"
                    >
                      <LayoutDashboard className="h-4 w-4 text-emerald-600"/>
                      {lang === "ta" ? "என் டாஷ்போர்டு" : "My Dashboard"}
                    </Link>

                    <Link
                      href="/admin/dashboard"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-2 px-4 py-2.5 text-xs font-bold text-amber-700 hover:bg-amber-50 transition-colors"
                    >
                      <ShieldAlert className="h-4 w-4"/>
                      {lang === "ta" ? "நிர்வாகி தணிக்கை" : "Admin Audit Queue"}
                    </Link>

                    <Link
                      href="/listings/create"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-2 px-4 py-2.5 text-xs font-bold text-emerald-700 hover:bg-emerald-50 transition-colors"
                    >
                      <Landmark className="h-4 w-4"/>
                      {t.actions?.publishListing || "+ List New Property"}
                    </Link>

                    <div className="border-t border-emerald-50 my-1"></div>

                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-2 w-full text-left px-4 py-2.5 text-xs font-bold text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer border-0 bg-transparent"
                    >
                      <LogOut className="h-4 w-4"/>
                      {t.navLogout || "Sign Out"}
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  href="/login"
                  className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-emerald-900 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition-all"
                >
                  <LogIn className="h-4 w-4"/>
                  <span>{t.navLogin || "Sign In"}</span>
                </Link>
                <Link
                  href="/signup"
                  className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-black bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white rounded-xl shadow-md shadow-emerald-600/25 transition-all uppercase tracking-wider"
                >
                  <UserPlus className="h-4 w-4"/>
                  <span>{t.navSignup || "Sign Up"}</span>
                </Link>
              </div>
            )}

          </div>

        </div>
      </header>
    );
}
