"use client";

import Navbar from "@/components/Navbar";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getLoggedInUser } from "@/lib/auth";
import Link from "next/link";
import { 
  Building, 
  MapPin, 
  Search, 
  SlidersHorizontal, 
  TrendingUp, 
  ShieldCheck, 
  FileText,
  Layers,
  ArrowUpRight,
  Map,
  Compass
} from "lucide-react";

export default function BuilderDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [matchingLands, setMatchingLands] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const activeUser = getLoggedInUser();
    if (!activeUser) {
      router.push("/login");
      return;
    }
    if (activeUser.role.toLowerCase() !== "builder") {
      router.push("/dashboard");
      return;
    }
    setUser(activeUser);

    async function fetchProperties() {
      try {
        const res = await fetch("/api/properties");
        if (res.ok) {
          const data = await res.json();
          // Show properties that are commercial/industrial or recent
          setMatchingLands(data.slice(0, 3));
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchProperties();
  }, [router]);

  if (!user) return null;

  const stats = [
    { label: "Matching Vetted Lots", value: matchingLands.length.toString(), icon: Layers, color: "text-indigo-400 bg-indigo-950/40 border-indigo-900/50" },
    { label: "Zoning Audits", value: "8 Completed", icon: ShieldCheck, color: "text-emerald-400 bg-emerald-950/40 border-emerald-900/50" },
    { label: "Active Site Demands", value: "3 Listed", icon: Building, color: "text-amber-400 bg-amber-950/40 border-amber-900/50" },
  ];

  return (
    <div className="min-h-screen bg-black text-slate-100 flex flex-col font-sans">
      <Navbar />

      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-800 pb-6">
          <div>
            <h1 className="text-3xl font-black text-white tracking-tight">
              Builder Developer Panel
            </h1>
            <p className="text-slate-400 font-semibold text-sm mt-1">
              Welcome back, {user.name} ({user.role}). Settle your next project location directly with verified landowners.
            </p>
          </div>
          <Link href="/listings" className="shrink-0">
            <button className="flex items-center gap-2 px-5 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm shadow-md transition-all active:scale-[0.98] cursor-pointer">
              <Compass className="h-4.5 w-4.5" />
              Explore Land Maps
            </button>
          </Link>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {stats.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <div key={idx} className="bg-[#090d16]/75 border border-slate-800/80 p-6 rounded-3xl shadow-2xl flex items-center gap-4">
                <div className={`h-12 w-12 rounded-2xl border ${stat.color} flex items-center justify-center`}>
                  <Icon className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-455 uppercase tracking-wider">{stat.label}</p>
                  <p className="text-xl font-black text-white mt-1">{stat.value}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Content Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Vetted Matches */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Building className="h-4.5 w-4.5 text-indigo-400" />
                Recommended Vetted Lots ({matchingLands.length})
              </h3>
              <Link href="/listings" className="text-xs font-bold text-indigo-400 hover:text-indigo-300">
                View all listings
              </Link>
            </div>

            {loading ? (
              <div className="space-y-3">
                {[1, 2].map((num) => (
                  <div key={num} className="bg-[#090d16] h-24 rounded-2xl border border-slate-800/80 animate-pulse"></div>
                ))}
              </div>
            ) : matchingLands.length === 0 ? (
              <div className="text-center py-12 bg-[#090d16]/50 rounded-3xl border border-slate-800/80 p-6 shadow-2xl">
                <p className="text-sm font-semibold text-slate-400 font-sans">No matching plots found in registry.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {matchingLands.map((prop) => (
                  <div key={prop.id} className="bg-[#090d16]/75 border border-slate-800 rounded-3xl p-5 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:shadow-2xl transition-all duration-300">
                    <div className="flex items-center gap-4">
                      <div className="h-16 w-16 rounded-2xl overflow-hidden bg-slate-800 shrink-0">
                        <img 
                          src={prop.image && prop.image.startsWith("http") ? prop.image : "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=100"} 
                          alt="" 
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div>
                        <h4 className="font-bold text-white text-sm line-clamp-1">{prop.title}</h4>
                        <p className="text-xs text-slate-400 font-semibold mt-0.5 flex items-center gap-1">
                          <MapPin className="h-3 w-3 text-indigo-400" /> {prop.location}
                        </p>
                        <span className="inline-flex mt-2 text-[10px] font-bold text-slate-300 bg-slate-955 border border-slate-800 px-2 py-0.5 rounded">
                          ₹ {new Intl.NumberFormat("en-IN").format(prop.price)}
                        </span>
                      </div>
                    </div>
                    <Link href="/listings" className="shrink-0">
                      <button className="flex items-center gap-1.5 px-4 py-2 border border-slate-800 hover:bg-slate-900 bg-slate-955/40 text-slate-305 rounded-xl text-xs font-bold transition-all cursor-pointer">
                        View Details
                        <ArrowUpRight className="h-3.5 w-3.5 text-indigo-400" />
                      </button>
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6 lg:col-span-1">
            
            {/* Quick Actions */}
            <div className="bg-[#090d16]/75 border border-slate-800 rounded-3xl p-5 shadow-2xl space-y-4">
              <h4 className="text-sm font-bold text-white border-b border-slate-800 pb-3">Developer Tools</h4>
              <div className="grid grid-cols-1 gap-2.5">
                <Link href="/ai-price">
                  <div className="flex items-center gap-3 p-3 border border-slate-850 rounded-xl hover:bg-slate-900 bg-slate-955/40 cursor-pointer">
                    <div className="h-8 w-8 rounded-lg bg-indigo-950/40 text-indigo-400 flex items-center justify-center shrink-0">
                      <TrendingUp className="h-4 w-4" />
                    </div>
                    <span className="text-xs font-bold text-slate-300">Valuation Modifiers Estimator</span>
                  </div>
                </Link>
                <div className="flex items-center gap-3 p-3 border border-slate-850 rounded-xl hover:bg-slate-900 bg-slate-955/40 cursor-pointer">
                  <div className="h-8 w-8 rounded-lg bg-emerald-950/40 text-emerald-400 flex items-center justify-center shrink-0">
                    <Compass className="h-4 w-4" />
                  </div>
                  <span className="text-xs font-bold text-slate-300">FSI Zoning Permitted Matrix</span>
                </div>
              </div>
            </div>

            {/* Site Requirements */}
            <div className="bg-[#090d16]/75 border border-slate-800 rounded-3xl p-5 shadow-2xl space-y-4">
              <h4 className="text-sm font-bold text-white border-b border-slate-800 pb-3">Active Site Requirements</h4>
              <div className="space-y-3.5 text-xs font-bold">
                {[
                  { region: "Bangalore East Corridor", demand: "Seeking 5-10 Acres commercial plot. Attached NH connectivity, clear deeds only." },
                  { region: "Mumbai Expansion Link", demand: "Seeking 15+ Acres industrial warehousing zoning. Water infrastructure required." }
                ].map((req, idx) => (
                  <div key={idx} className="space-y-1">
                    <div className="flex justify-between items-center text-indigo-400 uppercase tracking-wide text-[10px]">
                      <span>{req.region}</span>
                    </div>
                    <p className="text-[11px] text-slate-400 font-medium leading-relaxed bg-slate-955 border border-slate-850 p-2.5 rounded-xl">
                      {req.demand}
                    </p>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>

      </main>
    </div>
  );
}
