"use client";

import Navbar from "@/components/Navbar";
import Link from "next/link";
import { useState, useEffect } from "react";
import { 
  ArrowRight, 
  MapPin, 
  TrendingUp, 
  Building, 
  ShieldCheck, 
  Users, 
  CheckCircle2, 
  Sparkles,
  Search,
  ChevronRight,
  ShieldAlert,
  Star,
  Layers,
  ArrowUpRight
} from "lucide-react";
import PropertyCard from "@/components/PropertyCard";

export default function Home() {
  const [properties, setProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [quickAcres, setQuickAcres] = useState("");
  const [quickZoning, setQuickZoning] = useState("Residential");
  const [quickValuation, setQuickValuation] = useState<number | null>(null);

  // Search input states
  const [searchQuery, setSearchQuery] = useState("");
  const [searchLocation, setSearchLocation] = useState("");

  useEffect(() => {
    async function fetchProperties() {
      try {
        const res = await fetch("/api/properties");
        if (res.ok) {
          const data = await res.json();
          // Take the 3 most recent properties
          setProperties(data.slice(-3));
        }
      } catch (err) {
        console.error("Failed to load featured properties", err);
      } finally {
        setLoading(false);
      }
    }
    fetchProperties();
  }, []);

  const handleQuickCalculate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickAcres || Number(quickAcres) <= 0) return;
    
    // Quick calculation index based on zoning
    let baseRate = 18000000; // 1.8 Cr base per acre
    if (quickZoning === "Commercial") baseRate = 35000000; // 3.5 Cr
    if (quickZoning === "Industrial") baseRate = 25000000; // 2.5 Cr
    if (quickZoning === "Agricultural") baseRate = 4500000; // 45 Lakhs

    const estimate = Number(quickAcres) * baseRate;
    setQuickValuation(estimate);
  };

  const stats = [
    { value: "₹480 Cr+", label: "Capital Invested", desc: "Across primary development corridors" },
    { value: "2,850+", label: "Acres Listed", desc: "Vetted agricultural, commercial & IT parks" },
    { value: "1,400+", label: "Verified Owners", desc: "100% direct landowners with clear titles" },
    { value: "520+", label: "Registered Builders", desc: "Top A-grade developers active on platform" },
  ];

  const roles = [
    {
      title: "For Landowners",
      description: "Unlock the true value of your asset. List your land parcel directly, generate automated AI-powered valuation reports, and negotiate with institutional developers without paying heavy brokerage fees.",
      icon: MapPin,
      color: "bg-indigo-950/40 text-indigo-400 border-indigo-900/50",
      features: ["Real-time Valuation Insights", "Zero Listing & Brokerage Fees", "Secure Direct Chat Channels"],
      link: "/signup?role=Landowner"
    },
    {
      title: "For Investors",
      description: "Aquire high-growth land deals. Review deep commercial soil maps, zoning permits, upcoming infrastructure plans, and opt into fractional co-investment syndicates.",
      icon: TrendingUp,
      color: "bg-emerald-950/40 text-emerald-400 border-emerald-900/50",
      features: ["High-Yield Growth Corridor Alerts", "Zoning Classification Audits", "Fractional Syndicated Asset Slots"],
      link: "/signup?role=Investor"
    },
    {
      title: "For Builders",
      description: "Find your next flagship project location. Filter parcels by highway accessibility, water table depth, load-bearing capacities, and review clear deed histories instantly.",
      icon: Building,
      color: "bg-amber-950/40 text-amber-400 border-amber-900/50",
      features: ["FSI/FAR Zoning Filters", "Deed & Ownership Legal Checks", "Immediate Landowner Escrow Contracts"],
      link: "/signup?role=Builder"
    }
  ];

  const features = [
    {
      icon: Sparkles,
      title: "AI-Powered Valuation Engine",
      description: "Our machine learning models digest recent state land registries, proximity to highways, infrastructure expansions, and soil profiles to deliver instant accurate pricing estimates."
    },
    {
      icon: ShieldCheck,
      title: "Verified Clean Ownership Deeds",
      description: "We enforce a rigid multi-tier legal audit verifying title deeds, survey boundaries, state encumbrance records, and litigation clearance logs before any listing goes live."
    },
    {
      icon: Users,
      title: "Direct Peer-to-Peer Transactions",
      description: "Eliminate middleman fees and high commissions. Connect directly with principal builders, legal representatives, and capital groups on our secure communication hub."
    }
  ];

  const testimonials = [
    {
      quote: "LandLinkX cut down our site acquisition cycle from 9 months to just 25 days. Finding vetted titles with verified landowner contacts directly saved us crores.",
      author: "Aditya Hegde",
      role: "VP Land Acquisition, Sterling Infrastructure",
      rating: 5
    },
    {
      quote: "As a private landowner, I was exhausted by local brokers inflating quotes and demanding 2% commissions. Listed my 4 acres here, got an AI valuation, and sold to an A-grade developer directly.",
      author: "Radha Krishnan",
      role: "Landowner, Bangalore East Corridor",
      rating: 5
    }
  ];

  return (
    <div className="min-h-screen bg-black text-slate-100 font-sans selection:bg-indigo-500 selection:text-white">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-16 pb-24 md:pt-24 md:pb-32 bg-black">
        {/* Glow Spheres */}
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-indigo-600/10 rounded-full blur-3xl pointer-events-none animate-pulse-slow"></div>
        <div className="absolute bottom-10 right-10 w-[500px] h-[500px] bg-sky-500/10 rounded-full blur-3xl pointer-events-none"></div>
        
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            {/* Tagline Badge */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-indigo-950/40 border border-indigo-900/60 text-indigo-450 text-xs font-bold uppercase tracking-wider mb-6">
              <Sparkles className="h-3.5 w-3.5 text-indigo-400 animate-spin" style={{ animationDuration: "3s" }} />
              <span>India's Premium Institutional Land Network</span>
            </div>

            <h1 className="text-4xl sm:text-6xl font-black tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent leading-[1.12] mb-6">
              The Smarter Way to Transact <br className="hidden sm:inline" />
              <span className="bg-gradient-to-r from-indigo-400 via-indigo-500 to-sky-400 bg-clip-text text-transparent">Land, Capital, & Vision</span>
            </h1>

            <p className="text-lg sm:text-xl text-slate-450 font-medium max-w-3xl mx-auto mb-10 leading-relaxed">
              Connect direct landowners, capital investors, and builders in one transparent digital marketplace. Powered by institutional AI valuations and 100% legal title diligence.
            </p>

            {/* Premium Search Box Mockup */}
            <div className="bg-[#090d16]/80 backdrop-blur-xl border border-slate-800 p-3 rounded-2xl shadow-xl max-w-3xl mx-auto mb-12 flex flex-col md:flex-row gap-2.5">
              <div className="flex-1 relative flex items-center">
                <Search className="h-4.5 w-4.5 text-slate-500 absolute left-3" />
                <input 
                  type="text" 
                  placeholder="Keyword (e.g. industrial, IT park, residential)..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-sm bg-transparent border-0 focus:ring-0 focus:outline-none font-medium text-white placeholder:text-slate-500"
                />
              </div>
              <div className="h-px md:h-8 w-full md:w-px bg-slate-800 self-center"></div>
              <div className="flex-1 relative flex items-center">
                <MapPin className="h-4.5 w-4.5 text-indigo-400 absolute left-3" />
                <input 
                  type="text" 
                  placeholder="Location / Region..." 
                  value={searchLocation}
                  onChange={(e) => setSearchLocation(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-sm bg-transparent border-0 focus:ring-0 focus:outline-none font-medium text-white placeholder:text-slate-500"
                />
              </div>
              <Link 
                href={`/listings?search=${encodeURIComponent(searchQuery + " " + searchLocation)}`}
                className="bg-indigo-650 hover:bg-indigo-600 text-white font-bold text-sm px-6 py-3 rounded-xl shadow-md shadow-indigo-900/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2 whitespace-nowrap cursor-pointer"
              >
                Search Listings
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            {/* Quick Actions */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/listings"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl text-base font-bold bg-indigo-600 hover:bg-indigo-500 text-white shadow-xl shadow-indigo-900/20 hover:shadow-indigo-900/35 hover:scale-[1.01] transition-all duration-200"
              >
                Browse Land Parcels
                <ArrowRight className="h-5 w-5" />
              </Link>
              <Link
                href="/ai-price"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl text-base font-bold bg-slate-900 hover:bg-slate-850 text-white shadow-lg hover:scale-[1.01] transition-all duration-200"
              >
                Calculate AI Price
                <Sparkles className="h-4 w-4 text-amber-400" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-black relative -mt-8 pb-16 z-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="bg-[#090d16]/80 rounded-3xl border border-slate-800/80 p-8 md:p-12 shadow-2xl backdrop-blur-md">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12 divide-y md:divide-y-0 lg:divide-x divide-slate-800">
              {stats.map((stat, idx) => (
                <div key={idx} className="pt-6 first:pt-0 md:pt-0 lg:px-6 text-center md:text-left">
                  <p className="text-4xl font-black text-indigo-400 tracking-tight">{stat.value}</p>
                  <p className="text-sm font-bold text-slate-200 mt-2">{stat.label}</p>
                  <p className="text-xs text-slate-400 font-medium mt-1 leading-normal">{stat.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Live Featured Listings Section */}
      <section className="py-20 bg-black">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-12">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-950/40 border border-emerald-900/60 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-3">
                <CheckCircle2 className="h-3.5 w-3.5" />
                <span>Verified Deals</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                Featured Verified Parcels
              </h2>
              <p className="text-slate-400 font-semibold mt-2 max-w-xl">
                Explore real estate investment-ready lots with fully validated titles, deeds, and zoning classifications.
              </p>
            </div>
            <Link
              href="/listings"
              className="mt-4 md:mt-0 inline-flex items-center gap-1 text-sm font-bold text-indigo-400 hover:text-indigo-355 hover:gap-2 transition-all"
            >
              View All listings ({properties.length || 3}+)
              <ChevronRight className="h-4.5 w-4.5" />
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3].map((num) => (
                <div key={num} className="bg-[#090d16] rounded-2xl border border-slate-800/80 p-5 shadow-sm space-y-4 animate-pulse">
                  <div className="h-48 w-full bg-slate-800 rounded-xl"></div>
                  <div className="h-6 w-1/3 bg-slate-800 rounded"></div>
                  <div className="h-4 w-3/4 bg-slate-800 rounded"></div>
                  <div className="h-10 w-full bg-slate-800 rounded-xl"></div>
                </div>
              ))}
            </div>
          ) : properties.length === 0 ? (
            <div className="text-center py-16 bg-[#090d16]/40 rounded-3xl border border-slate-800/60 p-8 shadow-sm">
              <Layers className="h-12 w-12 text-slate-500 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-white">No Listings in Database Yet</h3>
              <p className="text-slate-400 text-sm max-w-md mx-auto mt-1">
                Be the first to list your land on India's premier digital platform.
              </p>
              <Link
                href="/listings/create"
                className="mt-5 inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm shadow-md transition-all"
              >
                Add Your Property
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {properties.map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Stakeholders Workspaces */}
      <section className="py-20 bg-black border-y border-slate-900">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Tailored Ecosystem Workspaces
            </h2>
            <p className="text-slate-400 font-semibold mt-4">
              Whether you are a private landowner, local developer, or institutional asset fund, LandLinkX provides a custom portal.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {roles.map((role, idx) => {
              const Icon = role.icon;
              return (
                <div key={idx} className="flex flex-col bg-[#090d16]/30 border border-slate-800/60 rounded-3xl p-8 hover:shadow-2xl hover:scale-[1.01] hover:bg-[#090d16]/80 transition-all duration-300">
                  <div className={`inline-flex h-12 w-12 items-center justify-center rounded-2xl border ${role.color} mb-6 shadow-md`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-3">{role.title}</h3>
                  <p className="text-slate-400 text-sm leading-relaxed mb-8 flex-grow">{role.description}</p>
                  
                  <ul className="space-y-3.5 mb-8">
                    {role.features.map((feat, fidx) => (
                      <li key={fidx} className="flex items-center gap-2.5 text-sm text-slate-300 font-semibold">
                        <CheckCircle2 className="h-4.5 w-4.5 text-emerald-500 shrink-0" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>

                  <Link
                    href={role.link}
                    className="flex items-center justify-center gap-2 w-full py-3.5 rounded-xl border border-indigo-950/60 bg-indigo-950/20 hover:bg-indigo-600 text-indigo-300 hover:text-white font-bold text-sm transition-all duration-200 shadow-sm"
                  >
                    Enter Workspace
                    <ArrowUpRight className="h-4 w-4" />
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Mini Interactive AI Calculator Section */}
      <section className="py-20 bg-black text-white relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-indigo-600/10 rounded-full blur-3xl pointer-events-none"></div>
        
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-500/30 text-indigo-400 text-xs font-bold uppercase tracking-wider mb-6">
                <Sparkles className="h-3.5 w-3.5 text-amber-400 animate-pulse" />
                <span>Try Mini Calculator</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white mb-6">
                Instant Automated Land Valuation
              </h2>
              <p className="text-slate-400 font-semibold leading-relaxed mb-8">
                Curious about your property's market value? Input basic variables into our interactive estimator. For complete audits including NH connectivity modifiers and deep water statistics, visit our main tool.
              </p>

              <div className="space-y-6">
                {features.map((feat, idx) => {
                  const Icon = feat.icon;
                  return (
                    <div key={idx} className="flex gap-4">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-slate-900 text-indigo-400 border border-slate-800 shadow-inner">
                        <Icon className="h-5.5 w-5.5" />
                      </div>
                      <div>
                        <h4 className="text-base font-bold text-white">{feat.title}</h4>
                        <p className="text-sm text-slate-400 font-semibold mt-1 leading-relaxed">{feat.description}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Interactive Calculator Form Block */}
            <div className="bg-[#090d16]/80 backdrop-blur-md border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl relative">
              <div className="flex justify-between items-center border-b border-slate-800 pb-4 mb-6">
                <span className="text-xs text-slate-500 font-mono flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping"></span>
                  valuation-model-v2.5
                </span>
                <span className="text-xs font-bold text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-2 py-0.5 rounded">Confidence: 96.4%</span>
              </div>

              <form onSubmit={handleQuickCalculate} className="space-y-5">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">Acres Area</label>
                  <input 
                    type="number" 
                    step="0.01"
                    placeholder="e.g. 2.5" 
                    required
                    value={quickAcres}
                    onChange={(e) => setQuickAcres(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-indigo-500 text-white placeholder:text-slate-650 font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">Zoning Classification</label>
                  <select 
                    value={quickZoning}
                    onChange={(e) => setQuickZoning(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-indigo-500 text-white font-semibold cursor-pointer"
                  >
                    <option value="Residential">Residential Development</option>
                    <option value="Commercial">Commercial / IT Park</option>
                    <option value="Industrial">Industrial Zone</option>
                    <option value="Agricultural">Agricultural Land</option>
                  </select>
                </div>

                <button 
                  type="submit"
                  className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm py-3.5 px-4 rounded-xl shadow-lg active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer border-0"
                >
                  <Sparkles className="h-4.5 w-4.5 text-amber-300" />
                  Estimate Valuation
                </button>
              </form>

              {quickValuation !== null && (
                <div className="mt-6 p-4 rounded-2xl bg-indigo-950/40 border border-indigo-900/50 text-center animate-in fade-in zoom-in-95 duration-200">
                  <p className="text-xs font-bold text-indigo-400 uppercase tracking-wider">Estimated Base Value</p>
                  <p className="text-3xl font-black text-white mt-1">
                    ₹ {new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 }).format(quickValuation)}
                  </p>
                  <p className="text-[10px] text-slate-400 mt-1">*Based on regional registrar baseline indices.</p>
                  <Link 
                    href="/ai-price"
                    className="mt-3.5 inline-flex items-center gap-1.5 text-xs font-bold text-indigo-300 hover:text-white transition-colors"
                  >
                    Generate Full Audit Report
                    <ArrowRight className="h-3 w-3" />
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Trust & Testimonials */}
      <section className="py-20 bg-black">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Trusted by Top Developers & Landowners
            </h2>
            <p className="text-slate-400 font-semibold mt-3">
              See how builders and landlords are completely bypassing standard agent costs.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {testimonials.map((test, idx) => (
              <div key={idx} className="bg-[#090d16]/50 border border-slate-800/80 rounded-3xl p-8 shadow-2xl flex flex-col justify-between backdrop-blur-sm">
                <div>
                  <div className="flex gap-1 mb-5">
                    {[...Array(test.rating)].map((_, i) => (
                      <Star key={i} className="h-4.5 w-4.5 text-amber-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-slate-300 text-sm font-semibold italic leading-relaxed">
                    "{test.quote}"
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between">
                  <div>
                    <h5 className="text-sm font-bold text-white">{test.author}</h5>
                    <p className="text-xs text-slate-400 font-medium mt-0.5">{test.role}</p>
                  </div>
                  <ShieldCheck className="h-6 w-6 text-emerald-500" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black text-slate-400 py-16 border-t border-slate-900 relative">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8 border-b border-slate-900 pb-12 mb-12">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-600 text-white font-bold">
                  <MapPin className="h-4.5 w-4.5" />
                </div>
                <span className="text-xl font-bold text-white tracking-wide">LandLinkX</span>
              </div>
              <p className="text-slate-500 text-sm max-w-sm">
                India's next-gen ecosystem digitalizing land transactions with transparent titles and AI-powered valuations.
              </p>
            </div>

            <div className="flex flex-wrap gap-8 lg:gap-16 text-sm font-semibold">
              <div>
                <h6 className="text-white text-xs font-bold uppercase tracking-wider mb-4">Marketplace</h6>
                <div className="flex flex-col gap-2.5">
                  <Link href="/listings" className="hover:text-white transition-colors">Listings Directory</Link>
                  <Link href="/ai-price" className="hover:text-white transition-colors">AI Price Predictor</Link>
                  <Link href="/signup" className="hover:text-white transition-colors">Register Asset</Link>
                </div>
              </div>
              <div>
                <h6 className="text-white text-xs font-bold uppercase tracking-wider mb-4">User Portal</h6>
                <div className="flex flex-col gap-2.5">
                  <Link href="/login" className="hover:text-white transition-colors">Sign In</Link>
                  <Link href="/signup" className="hover:text-white transition-colors">Create Account</Link>
                  <Link href="/dashboard" className="hover:text-white transition-colors">Portals Dashboard</Link>
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-between text-xs font-semibold text-slate-500">
            <p>&copy; {new Date().getFullYear()} LandLinkX Inc. All rights reserved.</p>
            <p className="mt-2 sm:mt-0 hover:text-slate-400 transition-colors cursor-pointer">Terms of Service | Privacy Policy | Legal Diligence Charter</p>
          </div>
        </div>
      </footer>
    </div>
  );
}