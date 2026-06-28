"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { MapPin, LayoutDashboard, Landmark, LogIn, UserPlus, TrendingUp, LogOut, ChevronDown, MessageSquare } from "lucide-react";
import { getLoggedInUser, logoutUser } from "@/lib/auth";
export default function Navbar() {
    const pathname = usePathname();
    const router = useRouter();
    const [user, setUser] = useState(null);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    useEffect(() => {
        // Initial fetch
        setUser(getLoggedInUser());
        // Listen for custom login/logout events
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
    // Get dynamic dashboard link depending on user role
    const getDashboardLink = () => {
        if (!user)
            return "/dashboard";
        const role = user.role.toLowerCase();
        if (role === "landowner")
            return "/dashboard/landowner";
        if (role === "investor")
            return "/dashboard/investor";
        if (role === "builder")
            return "/dashboard/builder";
        return "/dashboard";
    };
    const navItems = [
        { name: "Listings", href: "/listings", icon: Landmark },
        { name: "AI Predictor", href: "/ai-price", icon: TrendingUp },
        ...(user ? [
            { name: "Inbox", href: "/inbox", icon: MessageSquare, badge: true },
            { name: "Dashboard", href: getDashboardLink(), icon: LayoutDashboard }
        ] : []),
    ];
    return (<header className="sticky top-0 z-50 w-full border-b border-slate-800 bg-black/75 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-md shadow-indigo-600/20 transition-transform group-hover:scale-105">
            <MapPin className="h-5.5 w-5.5"/>
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
            LandLink<span className="text-indigo-550">X</span>
          </span>
        </Link>

        {/* Desktop Nav Links */}
        <nav className="hidden md:flex items-center gap-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || (item.name === "Dashboard" && pathname.startsWith("/dashboard"));
            return (<Link key={item.href} href={item.href} className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 relative ${isActive
                    ? "bg-slate-900 text-indigo-400 shadow-sm shadow-slate-950"
                    : "text-slate-400 hover:text-white hover:bg-slate-900/60"}`}>
                <Icon className="h-4.5 w-4.5"/>
                <span>{item.name}</span>
                {item.badge && (<span className="absolute top-1 right-2.5 h-2 w-2 rounded-full bg-indigo-500 animate-pulse"></span>)}
              </Link>);
        })}
        </nav>

        {/* CTA or User Profile Menu */}
        <div className="flex items-center gap-3 relative">
          {user ? (<div className="relative">
              <button onClick={() => setDropdownOpen(!dropdownOpen)} className="flex items-center gap-2 px-3 py-1.5 rounded-xl hover:bg-slate-900 border border-transparent hover:border-slate-800 transition-all cursor-pointer">
                <div className="h-8 w-8 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-sm uppercase">
                  {user.name.charAt(0)}
                </div>
                <div className="hidden sm:flex flex-col text-left">
                  <span className="text-xs font-bold text-slate-200 leading-tight">{user.name}</span>
                  <span className="text-[10px] font-semibold text-indigo-400 uppercase tracking-wide">{user.role}</span>
                </div>
                <ChevronDown className="h-4 w-4 text-slate-400"/>
              </button>

              {dropdownOpen && (<div className="absolute right-0 mt-2 w-52 rounded-xl bg-slate-950 border border-slate-800 shadow-2xl py-1.5 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="px-4 py-2 border-b border-slate-850">
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Logged in as</p>
                    <p className="text-xs font-bold text-slate-300 truncate">{user.email}</p>
                  </div>
                  
                  <Link href={getDashboardLink()} onClick={() => setDropdownOpen(false)} className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-slate-400 hover:text-white hover:bg-slate-900 transition-colors">
                    <LayoutDashboard className="h-4 w-4"/>
                    My Dashboard
                  </Link>

                  <button onClick={handleLogout} className="flex w-full items-center gap-2 px-4 py-2.5 text-sm font-semibold text-rose-400 hover:bg-rose-950/20 transition-colors text-left cursor-pointer border-t border-slate-850">
                    <LogOut className="h-4 w-4"/>
                    Log Out
                  </button>
                </div>)}
            </div>) : (<>
              <Link href="/login" className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold text-slate-400 hover:text-white hover:bg-slate-900/60 transition-colors">
                <LogIn className="h-4.5 w-4.5"/>
                Sign In
              </Link>
              <Link href="/signup" className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-600/10 hover:shadow-indigo-600/25 transition-all duration-200">
                <UserPlus className="h-4.5 w-4.5"/>
                Register
              </Link>
            </>)}
        </div>

      </div>
    </header>);
}
