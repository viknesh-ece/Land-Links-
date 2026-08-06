"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { MapPin, LayoutDashboard, Landmark, LogIn, UserPlus, TrendingUp, LogOut, ChevronDown, MessageSquare, ShieldCheck, Home, Sparkles } from "lucide-react";
import { getLoggedInUser, logoutUser } from "@/lib/auth";

export default function Navbar() {
    const pathname = usePathname();
    const router = useRouter();
    const [user, setUser] = useState(null);
    const [dropdownOpen, setDropdownOpen] = useState(false);

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
        { name: "Home", href: "/", icon: Home },
        { name: "3D Spatial Studio", href: "/spatial-studio", icon: Sparkles, highlight: true },
        { name: "Listings", href: "/listings", icon: Landmark },
        { name: "AI Predictor", href: "/ai-price", icon: TrendingUp },
        ...(user ? [
            { name: "Inbox", href: "/inbox", icon: MessageSquare, badge: true },
            { name: "Dashboard", href: getDashboardLink(), icon: LayoutDashboard }
        ] : []),
    ];

    return (
      <header className="sticky top-0 z-50 w-full border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-2xl shadow-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-400 via-indigo-500 to-purple-600 text-white shadow-lg shadow-cyan-500/25 transition-transform group-hover:scale-105">
              <MapPin className="h-5.5 w-5.5"/>
            </div>
            <span className="text-xl font-black text-white tracking-tight">
              LandLink<span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-indigo-400 font-black">X</span>
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
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all duration-200 relative ${
                    isActive
                      ? "bg-gradient-to-r from-cyan-500 to-indigo-600 text-white shadow-lg shadow-cyan-500/25 scale-[1.02]"
                      : item.highlight
                      ? "bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 hover:bg-cyan-500/20"
                      : "text-slate-300 hover:text-white hover:bg-slate-900"
                  }`}
                >
                  <Icon className="h-4 w-4"/>
                  <span>{item.name}</span>
                  {item.badge && (<span className="absolute top-1.5 right-2 h-2 w-2 rounded-full bg-cyan-400 animate-pulse"></span>)}
                </Link>
              );
          })}
          </nav>

          {/* CTA or User Profile Menu */}
          <div className="flex items-center gap-3 relative">
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-xl hover:bg-slate-900 border border-transparent hover:border-slate-800 transition-all cursor-pointer text-white"
                >
                  <div className="h-8.5 w-8.5 rounded-full bg-gradient-to-r from-cyan-500 to-indigo-600 text-white flex items-center justify-center font-black text-sm uppercase shadow-sm">
                    {user.name.charAt(0)}
                  </div>
                  <div className="hidden sm:flex flex-col text-left">
                    <span className="text-xs font-bold text-white leading-tight flex items-center gap-1">
                      {user.name}
                      <ShieldCheck className="h-3.5 w-3.5 text-cyan-400" title="Verified User"/>
                    </span>
                    <span className="text-[10px] font-extrabold text-cyan-400 uppercase tracking-wide">
                      {user.role}
                    </span>
                  </div>
                  <ChevronDown className="h-4 w-4 text-slate-400"/>
                </button>

                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-52 rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150 text-white">
                    <div className="px-4 py-2 border-b border-slate-800">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Logged in as</p>
                      <p className="text-xs font-bold text-slate-200 truncate">{user.email}</p>
                    </div>
                    
                    <Link
                      href={getDashboardLink()}
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-2 px-4 py-2.5 text-xs font-bold text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
                    >
                      <LayoutDashboard className="h-4 w-4"/>
                      My Dashboard
                    </Link>

                    <button
                      onClick={handleLogout}
                      className="flex w-full items-center gap-2 px-4 py-2.5 text-xs font-bold text-rose-400 hover:bg-rose-500/10 transition-colors text-left cursor-pointer border-t border-slate-800"
                    >
                      <LogOut className="h-4 w-4"/>
                      Log Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link href="/login" className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-slate-300 hover:text-white hover:bg-slate-900 transition-colors">
                  <LogIn className="h-4 w-4"/>
                  Sign In
                </Link>
                <Link href="/signup" className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-extrabold bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white shadow-lg shadow-cyan-500/25 transition-all duration-200 border-0">
                  <UserPlus className="h-4 w-4"/>
                  Register
                </Link>
              </>
            )}
          </div>

        </div>
      </header>
    );
}
