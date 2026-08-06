"use client";
import Navbar from "@/components/Navbar";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getLoggedInUser } from "@/lib/auth";
import { ArrowRight, MapPin, TrendingUp, Building, ShieldCheck, Users, CheckCircle2, Sparkles, Search, ChevronRight, Star, Layers, ArrowUpRight } from "lucide-react";
import PropertyCard from "@/components/PropertyCard";
import ThreeDTilt from "@/components/ThreeDTilt";

export default function Home() {
    const router = useRouter();
    const [properties, setProperties] = useState([]);
    const [loading, setLoading] = useState(true);
    const [quickAcres, setQuickAcres] = useState("");
    const [quickZoning, setQuickZoning] = useState("Residential");
    const [quickValuation, setQuickValuation] = useState(null);
    
    // Search input states
    const [searchQuery, setSearchQuery] = useState("");
    const [searchLocation, setSearchLocation] = useState("");

    const [authChecked, setAuthChecked] = useState(false);

    useEffect(() => {
        const user = getLoggedInUser();
        if (!user) {
            router.push("/signup");
        } else {
            setAuthChecked(true);
        }
    }, [router]);

    useEffect(() => {
        if (!authChecked) return;
        async function fetchProperties() {
            try {
                const res = await fetch("/api/properties");
                if (res.ok) {
                    const data = await res.json();
                    if (Array.isArray(data)) {
                        setProperties(data.slice(-3));
                    } else {
                        setProperties([]);
                    }
                }
            }
            catch (err) {
                console.error("Failed to load featured properties", err);
                setProperties([]);
            }
            finally {
                setLoading(false);
            }
        }
        fetchProperties();
    }, [authChecked]);

    const handleQuickCalculate = (e) => {
        e.preventDefault();
        if (!quickAcres || Number(quickAcres) <= 0) return;
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
            description: "Unlock the true value of your asset. Create an account to list properties, upload photos, surveys, boundary maps, documents, utility connections, zoning information, pricing, and manage inquiries directly.",
            icon: MapPin,
            color: "bg-cyan-500/20 border-cyan-500/40 text-cyan-300",
            features: ["Upload Surveys & Boundary Maps", "Manage Direct Buyer Inquiries", "List Zoning & Utility Connections"],
            link: "/signup?role=Landowner"
        },
        {
            title: "For Investors",
            description: "Aquire high-growth land deals. Search properties, save searches and favorite listings, view detailed property pages, contact landowners, and purchase professional AI development reports.",
            icon: TrendingUp,
            color: "bg-emerald-500/20 border-emerald-500/40 text-emerald-300",
            features: ["Save Searches & Properties", "Instant New Listing Alerts", "Purchase AI Development Reports"],
            link: "/signup?role=Investor"
        },
        {
            title: "For Builders",
            description: "Find your next flagship project location. Create your company profile with logos, insurance records, active licensing, service areas, specialty fields, portfolio photos, and communicate securely.",
            icon: Building,
            color: "bg-purple-500/20 border-purple-500/40 text-purple-300",
            features: ["Professional Company Profile", "Portfolio & Licensing Uploads", "Secure Internal Messaging Only"],
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

    if (!authChecked) {
        return (
          <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-4 font-sans">
            <div className="text-center space-y-4">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 animate-pulse">
                <MapPin className="h-6 w-6" />
              </div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                Redirecting to Register Page...
              </p>
            </div>
          </div>
        );
    }

    return (
    <div className="min-h-screen text-white font-sans selection:bg-cyan-500 selection:text-white pb-16">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-16 pb-24 md:pt-24 md:pb-32">
        
        {/* Glow Aurora Orbs */}
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-cyan-500/15 rounded-full blur-3xl pointer-events-none animate-pulse"></div>
        <div className="absolute bottom-10 right-10 w-[500px] h-[500px] bg-purple-500/15 rounded-full blur-3xl pointer-events-none"></div>
        
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            
            {/* Tagline Badge */}
            <div className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-black uppercase tracking-wider mb-6">
              <Sparkles className="h-4 w-4 text-cyan-400 animate-spin" style={{ animationDuration: "3s" }}/>
              <span>India's Premium Institutional Land Network</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white leading-[1.12] mb-6">
              The Smarter Way to Transact <br className="hidden sm:inline"/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-indigo-300 to-purple-400">
                Land, Capital, & Vision
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-xl text-slate-300 font-medium max-w-3xl mx-auto mb-10 leading-relaxed">
              Connect direct landowners, capital investors, and builders in one transparent digital marketplace. Powered by institutional AI valuations and 100% legal title diligence.
            </p>

            {/* Search Box */}
            <div className="bg-slate-900/90 backdrop-blur-2xl border border-slate-700/80 p-3 rounded-2xl shadow-2xl max-w-3xl mx-auto mb-12 flex flex-col md:flex-row gap-2.5">
              <div className="flex-1 relative flex items-center">
                <Search className="h-4.5 w-4.5 text-cyan-400 left-3 absolute"/>
                <input 
                  type="text" 
                  placeholder="Keyword (e.g. industrial, IT park, residential)..." 
                  value={searchQuery} 
                  onChange={(e) => setSearchQuery(e.target.value)} 
                  className="w-full pl-9 pr-3 py-2.5 text-sm bg-slate-950/80 border-0 focus:ring-0 focus:outline-none font-medium text-white placeholder:text-slate-400"
                />
              </div>
              <div className="h-px md:h-8 w-full md:w-px bg-slate-800 self-center"></div>
              <div className="flex-1 relative flex items-center">
                <MapPin className="h-4.5 w-4.5 text-indigo-400 left-3 absolute"/>
                <input 
                  type="text" 
                  placeholder="Location / Region..." 
                  value={searchLocation} 
                  onChange={(e) => setSearchLocation(e.target.value)} 
                  className="w-full pl-9 pr-3 py-2.5 text-sm bg-slate-950/80 border-0 focus:ring-0 focus:outline-none font-medium text-white placeholder:text-slate-400"
                />
              </div>
              <Link 
                href={`/listings?search=${encodeURIComponent(searchQuery + " " + searchLocation)}`} 
                className="bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-black text-sm px-6 py-3 rounded-xl shadow-lg shadow-cyan-500/25 active:scale-[0.98] transition-all flex items-center justify-center gap-2 whitespace-nowrap cursor-pointer"
              >
                <span>Search Listings</span>
                <ArrowRight className="h-4 w-4"/>
              </Link>
            </div>

            {/* Hero Quick Actions */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/spatial-studio" className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl text-base font-black bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white shadow-xl shadow-cyan-500/30 hover:scale-[1.02] transition-all duration-200">
                <span>Launch 3D Spatial Studio</span>
                <Sparkles className="h-5 w-5 text-cyan-200 animate-spin" style={{ animationDuration: "5s" }}/>
              </Link>
              <Link href="/listings/create" className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl text-base font-bold bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 shadow-lg hover:scale-[1.02] transition-all duration-200">
                <span>List Your Property</span>
                <ArrowRight className="h-5 w-5 text-cyan-400"/>
              </Link>
            </div>

          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="relative -mt-8 pb-16 z-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="bg-slate-900/90 rounded-3xl border border-slate-800 p-8 md:p-12 shadow-2xl backdrop-blur-2xl">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12 divide-y md:divide-y-0 lg:divide-x divide-slate-800">
              {stats.map((stat, idx) => (
                <div key={idx} className="pt-6 first:pt-0 md:pt-0 lg:px-6 text-center md:text-left transition-all duration-300 hover:scale-[1.03] cursor-default group">
                  <p className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-indigo-400 tracking-tight">{stat.value}</p>
                  <p className="text-sm font-bold text-white mt-2">{stat.label}</p>
                  <p className="text-xs text-slate-400 font-medium mt-1 leading-normal">{stat.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Live Featured Listings Section */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-12">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-black uppercase tracking-wider mb-3">
                <CheckCircle2 className="h-3.5 w-3.5"/>
                <span>Verified Deals</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
                Featured Verified Parcels
              </h2>
              <p className="text-slate-400 font-medium mt-2 max-w-xl text-sm">
                Explore real estate investment-ready lots with fully validated titles, deeds, and zoning classifications.
              </p>
            </div>
            <Link href="/listings" className="mt-4 md:mt-0 inline-flex items-center gap-1 text-sm font-bold text-cyan-400 hover:text-cyan-300 hover:gap-2 transition-all">
              <span>View All listings ({properties.length || 3}+)</span>
              <ChevronRight className="h-4.5 w-4.5"/>
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3].map((num) => (
                <div key={num} className="bg-slate-900/80 rounded-2xl border border-slate-800 p-5 shadow-sm space-y-4 animate-pulse">
                  <div className="h-48 w-full bg-slate-800 rounded-xl"></div>
                  <div className="h-6 w-1/3 bg-slate-800 rounded"></div>
                  <div className="h-4 w-3/4 bg-slate-800 rounded"></div>
                  <div className="h-10 w-full bg-slate-800 rounded-xl"></div>
                </div>
              ))}
            </div>
          ) : properties.length === 0 ? (
            <div className="text-center py-16 bg-slate-900/80 rounded-3xl border border-slate-800 p-8 shadow-sm">
              <Layers className="h-12 w-12 text-slate-500 mx-auto mb-4"/>
              <h3 className="text-lg font-bold text-white">No Listings in Database Yet</h3>
              <p className="text-slate-400 text-sm max-w-md mx-auto mt-1">
                Be the first to list your land on India's premier digital platform.
              </p>
              <Link href="/listings/create" className="mt-5 inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-sm shadow-md transition-all">
                Add Your Property
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {properties.map((property) => (
                <PropertyCard key={property.id} property={property}/>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Stakeholders Workspaces */}
      <section className="py-20 border-y border-slate-800/80">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              Tailored Ecosystem Workspaces
            </h2>
            <p className="text-slate-400 font-medium mt-4 text-sm">
              Whether you are a private landowner, local developer, or institutional asset fund, LandLinkX provides a custom portal.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {roles.map((role, idx) => {
              const Icon = role.icon;
              return (
                <ThreeDTilt key={idx} className="flex flex-col h-full">
                  <div className="flex flex-col bg-slate-900/90 border border-slate-800 rounded-3xl p-8 hover:border-slate-700 transition-all duration-300 h-full shadow-2xl">
                    <div className={`inline-flex h-12 w-12 items-center justify-center rounded-2xl border ${role.color} mb-6 shadow-md`}>
                      <Icon className="h-6 w-6"/>
                    </div>
                    <h3 className="text-2xl font-black text-white mb-3">{role.title}</h3>
                    <p className="text-slate-400 text-sm leading-relaxed mb-8 flex-grow">{role.description}</p>
                    
                    <ul className="space-y-3.5 mb-8">
                      {role.features.map((feat, fidx) => (
                        <li key={fidx} className="flex items-center gap-2.5 text-xs text-slate-300 font-bold">
                          <CheckCircle2 className="h-4.5 w-4.5 text-emerald-400 shrink-0"/>
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>

                    <Link href={role.link} className="flex items-center justify-center gap-2 w-full py-3.5 rounded-xl border border-cyan-500/30 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 font-black text-xs transition-all duration-200 shadow-sm uppercase tracking-wider">
                      <span>Enter Workspace</span>
                      <ArrowUpRight className="h-4 w-4"/>
                    </Link>
                  </div>
                </ThreeDTilt>
              );
            })}
          </div>
        </div>
      </section>

      {/* Mini Interactive AI Calculator Section */}
      <section className="py-20 relative overflow-hidden">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-bold uppercase tracking-wider mb-6">
                <Sparkles className="h-3.5 w-3.5 text-cyan-400 animate-pulse"/>
                <span>Try Mini Calculator</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-white mb-6">
                Instant Automated Land Valuation
              </h2>
              <p className="text-slate-400 font-medium leading-relaxed mb-8 text-sm">
                Curious about your property's market value? Input basic variables into our interactive estimator. For complete audits including NH connectivity modifiers and deep water statistics, visit our main tool.
              </p>

              <div className="space-y-6">
                {features.map((feat, idx) => {
                  const Icon = feat.icon;
                  return (
                    <div key={idx} className="flex gap-4">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-slate-900 border border-slate-800 text-cyan-400 shadow-sm">
                        <Icon className="h-5.5 w-5.5"/>
                      </div>
                      <div>
                        <h4 className="text-base font-bold text-white">{feat.title}</h4>
                        <p className="text-xs text-slate-400 font-medium mt-1 leading-relaxed">{feat.description}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Interactive Calculator Form Block */}
            <ThreeDTilt>
              <div className="bg-slate-900/90 backdrop-blur-2xl border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl relative">
                <div className="flex justify-between items-center border-b border-slate-800 pb-4 mb-6">
                  <span className="text-xs text-slate-400 font-mono flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping"></span>
                    valuation-model-v2.5
                  </span>
                  <span className="text-xs font-bold text-cyan-300 bg-cyan-500/10 border border-cyan-500/30 px-2 py-0.5 rounded">Confidence: 96.4%</span>
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
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-cyan-500 text-white placeholder:text-slate-500 font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">Zoning Classification</label>
                    <select 
                      value={quickZoning} 
                      onChange={(e) => setQuickZoning(e.target.value)} 
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-cyan-500 text-white font-semibold cursor-pointer"
                    >
                      <option value="Residential" className="text-white bg-slate-900">Residential Development</option>
                      <option value="Commercial" className="text-white bg-slate-900">Commercial / IT Park</option>
                      <option value="Industrial" className="text-white bg-slate-900">Industrial Zone</option>
                      <option value="Agricultural" className="text-white bg-slate-900">Agricultural Land</option>
                    </select>
                  </div>

                  <button 
                    type="submit" 
                    className="w-full bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-black text-xs py-3.5 px-4 rounded-xl shadow-lg shadow-cyan-500/25 active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer border-0 uppercase tracking-wider"
                  >
                    <Sparkles className="h-4.5 w-4.5 text-cyan-200"/>
                    <span>Estimate Valuation</span>
                  </button>
                </form>

                {quickValuation !== null && (
                  <div className="mt-6 p-4 rounded-2xl bg-slate-950 border border-slate-800 text-center animate-in fade-in zoom-in-95 duration-200">
                    <p className="text-xs font-bold text-cyan-400 uppercase tracking-wider">Estimated Base Value</p>
                    <p className="text-3xl font-black text-white mt-1">
                      ₹ {new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 }).format(quickValuation)}
                    </p>
                    <p className="text-[10px] text-slate-400 mt-1">*Based on regional registrar baseline indices.</p>
                    <Link href="/ai-price" className="mt-3.5 inline-flex items-center gap-1.5 text-xs font-bold text-cyan-400 hover:text-cyan-300 transition-colors">
                      <span>Generate Full Audit Report</span>
                      <ArrowRight className="h-3 w-3"/>
                    </Link>
                  </div>
                )}
              </div>
            </ThreeDTilt>
          </div>
        </div>
      </section>

      {/* Trust & Testimonials */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              Trusted by Top Developers & Landowners
            </h2>
            <p className="text-slate-400 font-medium mt-3 text-sm">
              See how builders and landlords are completely bypassing standard agent costs.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {testimonials.map((test, idx) => (
              <div key={idx} className="bg-slate-900/85 border border-slate-800 rounded-3xl p-8 shadow-2xl flex flex-col justify-between backdrop-blur-2xl">
                <div>
                  <div className="flex gap-1 mb-5">
                    {[...Array(test.rating)].map((_, i) => (
                      <Star key={i} className="h-4.5 w-4.5 text-amber-400 fill-current"/>
                    ))}
                  </div>
                  <p className="text-slate-300 text-sm font-medium italic leading-relaxed">
                    "{test.quote}"
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between">
                  <div>
                    <h5 className="text-sm font-bold text-white">{test.author}</h5>
                    <p className="text-xs text-slate-400 font-medium mt-0.5">{test.role}</p>
                  </div>
                  <ShieldCheck className="h-6 w-6 text-emerald-400"/>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-950/90 text-slate-400 py-16 border-t border-slate-800/80 relative">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8 border-b border-slate-800/80 pb-12 mb-12">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 text-white font-bold">
                  <MapPin className="h-4.5 w-4.5"/>
                </div>
                <span className="text-xl font-black text-white tracking-wide">LandLinkX</span>
              </div>
              <p className="text-slate-400 text-xs max-w-sm font-medium leading-relaxed">
                India's next-gen ecosystem digitalizing land transactions with transparent titles and AI-powered valuations.
              </p>
            </div>

            <div className="flex flex-wrap gap-8 lg:gap-16 text-xs font-bold">
              <div>
                <h6 className="text-white text-xs font-black uppercase tracking-wider mb-4">Marketplace</h6>
                <div className="flex flex-col gap-2.5 text-slate-400">
                  <Link href="/listings" className="hover:text-cyan-400 transition-colors">Listings Directory</Link>
                  <Link href="/ai-price" className="hover:text-cyan-400 transition-colors">AI Price Predictor</Link>
                  <Link href="/signup" className="hover:text-cyan-400 transition-colors">Register Asset</Link>
                </div>
              </div>
              <div>
                <h6 className="text-white text-xs font-black uppercase tracking-wider mb-4">User Portal</h6>
                <div className="flex flex-col gap-2.5 text-slate-400">
                  <Link href="/login" className="hover:text-cyan-400 transition-colors">Sign In</Link>
                  <Link href="/signup" className="hover:text-cyan-400 transition-colors">Create Account</Link>
                  <Link href="/dashboard" className="hover:text-cyan-400 transition-colors">Portals Dashboard</Link>
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-between text-xs font-medium text-slate-400">
            <p>&copy; {new Date().getFullYear()} LandLinkX Inc. All rights reserved.</p>
            <p className="mt-2 sm:mt-0 hover:text-slate-200 transition-colors cursor-pointer">Terms of Service | Privacy Policy | Legal Diligence Charter</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
