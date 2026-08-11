"use client";
import Navbar from "@/components/Navbar";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getLoggedInUser } from "@/lib/auth";
import { useLanguage } from "@/context/LanguageContext";
import { ArrowRight, MapPin, TrendingUp, Building, ShieldCheck, Users, CheckCircle2, Sparkles, Search, ChevronRight, Star, Layers, ArrowUpRight } from "lucide-react";
import PropertyCard from "@/components/PropertyCard";
import ThreeDTilt from "@/components/ThreeDTilt";

export default function Home() {
    const router = useRouter();
    const { lang, t } = useLanguage();
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
        { value: t.hero?.stat1Value || "₹480 Cr+", label: t.hero?.stat1Label || "Capital Invested", desc: t.hero?.stat1Desc || "Across primary development corridors" },
        { value: t.hero?.stat2Value || "2,850+", label: t.hero?.stat2Label || "Acres Listed", desc: t.hero?.stat2Desc || "Vetted agricultural, commercial & IT parks" },
        { value: t.hero?.stat3Value || "1,400+", label: t.hero?.stat3Label || "Verified Owners", desc: t.hero?.stat3Desc || "100% direct landowners with clear titles" },
        { value: t.hero?.stat4Value || "520+", label: t.hero?.stat4Label || "Registered Builders", desc: t.hero?.stat4Desc || "Top A-grade developers active on platform" },
    ];

    const roles = [
        {
            title: t.roles?.titleForLandowners || "For Landowners",
            description: t.roles?.descForLandowners || "Unlock the true value of your asset. List properties with zero broker commission, upload surveys, FMB maps, and receive binding offers directly from principal builders.",
            icon: MapPin,
            color: "bg-blue-50 border-blue-200 text-blue-600",
            features: lang === "ta" 
              ? ["பட்டா & FMB எல்லை வரைபடங்கள்", "நேரடி பில்டர் ஒப்பந்தங்கள்", "0% தரகு கமிஷன்"]
              : ["Upload Surveys & Boundary Maps", "Manage Direct Buyer Inquiries", "List Zoning & Utility Connections"],
            link: "/signup?role=Landowner"
        },
        {
            title: t.roles?.titleForInvestors || "For Investors",
            description: t.roles?.descForInvestors || "Acquire high-growth land deals. Search verified parcels, inspect AI valuation indices, review title diligence, and purchase pre-vetted land directly.",
            icon: TrendingUp,
            color: "bg-emerald-50 border-emerald-200 text-emerald-600",
            features: lang === "ta"
              ? ["100% சரிபார்க்கப்பட்ட பட்டா", "உடனடி புதிய நில அறிவிப்புகள்", "AI நில மதிப்பீட்டு அறிக்கைகள்"]
              : ["Save Searches & Properties", "Instant New Listing Alerts", "Purchase AI Development Reports"],
            link: "/signup?role=Investor"
        },
        {
            title: t.roles?.titleForBuilders || "For Builders & Developers",
            description: t.roles?.descForBuilders || "Find your next flagship development plot. Access CAD survey boundaries, zoning feasibility reports, utility infrastructure scores, and negotiate directly with verified landowners.",
            icon: Building,
            color: "bg-purple-50 border-purple-200 text-purple-600",
            features: lang === "ta"
              ? ["நிறுவன சுயவிவரம்", "CAD வரைபடங்கள் & அனுமதிகள்", "பாதுகாப்பான நேரடி அரட்டை"]
              : ["Professional Company Profile", "Portfolio & Licensing Uploads", "Secure Internal Messaging Only"],
            link: "/signup?role=Builder"
        }
    ];

    const features = [
        {
            icon: Sparkles,
            title: t.homeSections?.feature1Title || "5-Layer Anti-Fraud Forensics",
            description: t.homeSections?.feature1Desc || "Automated OCR extraction, EXIF binary tamper analysis, and TamilNilam revenue registry cross-matching."
        },
        {
            icon: ShieldCheck,
            title: t.homeSections?.feature2Title || "Live GIS Satellite & CAD Maps",
            description: t.homeSections?.feature2Desc || "High-resolution Google Maps satellite telemetry with vector FMB survey polygon boundaries."
        },
        {
            icon: Users,
            title: t.homeSections?.feature3Title || "Smart Escrow & P2P Negotiation",
            description: t.homeSections?.feature3Desc || "Direct encrypted buyer-seller deal room with milestone deposit escrow and digital signature pads."
        }
    ];

    const testimonials = [
        {
            quote: lang === "ta"
              ? "லேண்ட்-லிங்க்ஸ் மூலம் எங்கள் நிலம் கையகப்படுத்தும் காலம் 9 மாதங்களில் இருந்து வெறும் 25 நாட்களாக குறைந்தது. சரிபார்க்கப்பட்ட பட்டா மற்றும் நேரடி உரிமையாளர் தொடர்புகள் எங்களுக்கு பல கோடிகளை மிச்சப்படுத்தின."
              : "LandLinkX cut down our site acquisition cycle from 9 months to just 25 days. Finding vetted titles with verified landowner contacts directly saved us crores.",
            author: "Aditya Hegde",
            role: lang === "ta" ? "துணைத் தலைவர், ஸ்டெர்லிங் இன்ஃப்ராஸ்ட்ரக்சர்" : "VP Land Acquisition, Sterling Infrastructure",
            rating: 5
        },
        {
            quote: lang === "ta"
              ? "தனிப்பட்ட நில உரிமையாளராக, உள்ளூர் தரகர்கள் 2% கமிஷன் கேட்பதால் சோர்வடைந்தேன். எனது 4 ஏக்கரை இங்கு பட்டியலிட்டு, AI மதிப்பீட்டைப் பெற்று, நேரடியாக ஏ-கிரேடு டெவலப்பருக்கு விற்றேன்."
              : "As a private landowner, I was exhausted by local brokers inflating quotes and demanding 2% commissions. Listed my 4 acres here, got an AI valuation, and sold to an A-grade developer directly.",
            author: "Radha Krishnan",
            role: lang === "ta" ? "நில உரிமையாளர், பொள்ளாச்சி" : "Landowner, Pollachi Corridor",
            rating: 5
        }
    ];

    if (!authChecked) {
        return (
          <div className="min-h-screen bg-slate-50 text-slate-900 flex items-center justify-center p-4 font-sans">
            <div className="text-center space-y-4">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 border border-blue-200 animate-pulse">
                <MapPin className="h-6 w-6" />
              </div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                Redirecting to Register Page...
              </p>
            </div>
          </div>
        );
    }

    return (
    <div className="min-h-screen text-slate-900 font-sans selection:bg-blue-600 selection:text-white pb-16">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-16 pb-20 md:pt-24 md:pb-28">
        
        {/* Soft Ambient Light Glows */}
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-blue-100/60 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-10 right-10 w-[450px] h-[450px] bg-indigo-100/50 rounded-full blur-3xl pointer-events-none"></div>
        
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            
            {/* Tagline Badge */}
            <div className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-black uppercase tracking-wider mb-6 shadow-sm">
              <Sparkles className="h-4 w-4 text-blue-600 animate-spin" style={{ animationDuration: "3s" }}/>
              <span>{t.hero?.badge || "Tamil Nadu Zero-Trust Land Marketplace"}</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight text-slate-900 leading-[1.15] mb-6">
              {lang === "ta" ? (
                t.hero?.title
              ) : (
                <>
                  The Smarter Way to Transact <br className="hidden sm:inline"/>
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-600">
                    Land, Capital, & Vision
                  </span>
                </>
              )}
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-slate-600 font-medium max-w-3xl mx-auto mb-10 leading-relaxed">
              {t.hero?.subtitle || "Eliminate counterfeit deeds, court disputes, and 2-3% middleman brokerage. Transact directly with government-verified landowners across prime growth corridors."}
            </p>

            {/* Clean Light Search Box */}
            <div className="bg-white border border-slate-200/90 p-3 rounded-2xl shadow-xl max-w-3xl mx-auto mb-12 flex flex-col md:flex-row gap-2.5">
              <div className="flex-1 relative flex items-center">
                <Search className="h-4.5 w-4.5 text-blue-600 left-3 absolute"/>
                <input 
                  type="text" 
                  placeholder={t.actions?.searchPlaceholder || "Search by district, survey no, or keyword..."}
                  value={searchQuery} 
                  onChange={(e) => setSearchQuery(e.target.value)} 
                  className="w-full pl-9 pr-3 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-blue-500 font-medium text-slate-900 placeholder:text-slate-400"
                />
              </div>
              <div className="h-px md:h-8 w-full md:w-px bg-slate-200 self-center"></div>
              <div className="flex-1 relative flex items-center">
                <MapPin className="h-4.5 w-4.5 text-indigo-600 left-3 absolute"/>
                <input 
                  type="text" 
                  placeholder={t.actions?.locationPlaceholder || "All Tamil Nadu Districts"}
                  value={searchLocation} 
                  onChange={(e) => setSearchLocation(e.target.value)} 
                  className="w-full pl-9 pr-3 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-blue-500 font-medium text-slate-900 placeholder:text-slate-400"
                />
              </div>
              <Link 
                href={`/listings?search=${encodeURIComponent(searchQuery + " " + searchLocation)}`} 
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-black text-sm px-6 py-3 rounded-xl shadow-md shadow-blue-600/25 active:scale-[0.98] transition-all flex items-center justify-center gap-2 whitespace-nowrap cursor-pointer border-0"
              >
                <span>{t.actions?.search || "Search Listings"}</span>
                <ArrowRight className="h-4 w-4"/>
              </Link>
            </div>

            {/* Hero Quick Actions */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/spatial-studio" className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl text-base font-black bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg shadow-blue-600/20 hover:scale-[1.02] transition-all duration-200">
                <span>{lang === "ta" ? "3D நில வரைபடத்தை தொடங்கு" : "Launch 3D Spatial Studio"}</span>
                <Sparkles className="h-5 w-5 text-blue-200 animate-spin" style={{ animationDuration: "5s" }}/>
              </Link>
              <Link href="/listings/create" className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl text-base font-bold bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 shadow-md hover:scale-[1.02] transition-all duration-200">
                <span>{t.hero?.listLand || "List Your Property"}</span>
                <ArrowRight className="h-5 w-5 text-blue-600"/>
              </Link>
            </div>

          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="relative -mt-8 pb-16 z-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-3xl border border-slate-200/90 p-8 md:p-12 shadow-xl">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12 divide-y md:divide-y-0 lg:divide-x divide-slate-100">
              {stats.map((stat, idx) => (
                <div key={idx} className="pt-6 first:pt-0 md:pt-0 lg:px-6 text-center md:text-left transition-all duration-300 hover:scale-[1.03] cursor-default group">
                  <p className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 tracking-tight">{stat.value}</p>
                  <p className="text-sm font-bold text-slate-900 mt-2">{stat.label}</p>
                  <p className="text-xs text-slate-500 font-medium mt-1 leading-normal">{stat.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Live Featured Listings Section */}
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-12">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-black uppercase tracking-wider mb-3">
                <CheckCircle2 className="h-3.5 w-3.5"/>
                <span>{t.verification?.tamilNilamPassed || "Verified Deals"}</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
                {t.homeSections?.featuredTitle || "Featured Verified Parcels"}
              </h2>
              <p className="text-slate-500 font-medium mt-2 max-w-xl text-sm">
                {t.homeSections?.featuredSubtitle || "Explore real estate investment-ready lots with fully validated titles, deeds, and zoning classifications."}
              </p>
            </div>
            <Link href="/listings" className="mt-4 md:mt-0 inline-flex items-center gap-1 text-sm font-bold text-blue-600 hover:text-blue-700 hover:gap-2 transition-all">
              <span>{t.homeSections?.viewAllListings || `View All listings (${properties.length || 3}+)`}</span>
              <ChevronRight className="h-4.5 w-4.5"/>
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3].map((num) => (
                <div key={num} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4 animate-pulse">
                  <div className="h-48 w-full bg-slate-100 rounded-xl"></div>
                  <div className="h-6 w-1/3 bg-slate-100 rounded"></div>
                  <div className="h-4 w-3/4 bg-slate-100 rounded"></div>
                  <div className="h-10 w-full bg-slate-100 rounded-xl"></div>
                </div>
              ))}
            </div>
          ) : properties.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 p-8 shadow-sm">
              <Layers className="h-12 w-12 text-slate-400 mx-auto mb-4"/>
              <h3 className="text-lg font-bold text-slate-900">No Listings in Database Yet</h3>
              <p className="text-slate-500 text-sm max-w-md mx-auto mt-1">
                Be the first to list your land on India's premier digital platform.
              </p>
              <Link href="/listings/create" className="mt-5 inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md transition-all">
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
      <section className="py-20 border-y border-slate-200/80 bg-slate-50/50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              {lang === "ta" ? "அனைத்து பயனர் பணியிடங்கள்" : "Tailored Ecosystem Workspaces"}
            </h2>
            <p className="text-slate-500 font-medium mt-4 text-sm">
              {lang === "ta"
                ? "நில உரிமையாளர், உள்ளூர் பில்டர் அல்லது நிறுவன முதலீட்டு நிதி என எதுவாக இருந்தாலும் தனிப்பயன் போர்ட்டல்."
                : "Whether you are a private landowner, local developer, or institutional asset fund, LandLinkX provides a custom portal."}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {roles.map((role, idx) => {
              const Icon = role.icon;
              return (
                <ThreeDTilt key={idx} className="flex flex-col h-full">
                  <div className="flex flex-col bg-white border border-slate-200 rounded-3xl p-8 hover:border-blue-300 hover:shadow-xl transition-all duration-300 h-full shadow-sm">
                    <div className={`inline-flex h-12 w-12 items-center justify-center rounded-2xl border ${role.color} mb-6 shadow-sm`}>
                      <Icon className="h-6 w-6"/>
                    </div>
                    <h3 className="text-2xl font-black text-slate-900 mb-3">{role.title}</h3>
                    <p className="text-slate-600 text-sm leading-relaxed mb-8 flex-grow">{role.description}</p>
                    
                    <ul className="space-y-3.5 mb-8">
                      {role.features.map((feat, fidx) => (
                        <li key={fidx} className="flex items-center gap-2.5 text-xs text-slate-700 font-bold">
                          <CheckCircle2 className="h-4.5 w-4.5 text-emerald-600 shrink-0"/>
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>

                    <Link href={role.link} className="flex items-center justify-center gap-2 w-full py-3.5 rounded-xl border border-blue-200 bg-blue-50 hover:bg-blue-100 text-blue-700 font-black text-xs transition-all duration-200 shadow-sm uppercase tracking-wider">
                      <span>{lang === "ta" ? "பணியிடத்திற்குள் செல்க" : "Enter Workspace"}</span>
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
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold uppercase tracking-wider mb-6">
                <Sparkles className="h-3.5 w-3.5 text-blue-600 animate-pulse"/>
                <span>{lang === "ta" ? "AI மதிப்பீட்டு கால்குலேட்டர்" : "Try Mini Calculator"}</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900 mb-6">
                {t.homeSections?.valuationTitle || "Instant Automated Land Valuation"}
              </h2>
              <p className="text-slate-600 font-medium leading-relaxed mb-8 text-sm">
                {t.homeSections?.valuationSubtitle || "Curious about your property's market value? Input basic variables into our interactive estimator."}
              </p>

              <div className="space-y-6">
                {features.map((feat, idx) => {
                  const Icon = feat.icon;
                  return (
                    <div key={idx} className="flex gap-4">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 border border-blue-100 text-blue-600 shadow-sm">
                        <Icon className="h-5.5 w-5.5"/>
                      </div>
                      <div>
                        <h4 className="text-base font-bold text-slate-900">{feat.title}</h4>
                        <p className="text-xs text-slate-500 font-medium mt-1 leading-relaxed">{feat.description}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Interactive Calculator Form Block */}
            <ThreeDTilt>
              <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xl relative">
                <div className="flex justify-between items-center border-b border-slate-100 pb-4 mb-6">
                  <span className="text-xs text-slate-500 font-mono flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping"></span>
                    valuation-model-v2.5
                  </span>
                  <span className="text-xs font-bold text-blue-700 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded">Confidence: 96.4%</span>
                </div>

                <form onSubmit={handleQuickCalculate} className="space-y-5">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                      {t.homeSections?.quickAcresLabel || "Acres Area"}
                    </label>
                    <input 
                      type="number" 
                      step="0.01" 
                      placeholder="e.g. 2.5" 
                      required 
                      value={quickAcres} 
                      onChange={(e) => setQuickAcres(e.target.value)} 
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:bg-white focus:outline-none focus:border-blue-500 text-slate-900 placeholder:text-slate-400 font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                      {t.homeSections?.quickZoningLabel || "Zoning Classification"}
                    </label>
                    <select 
                      value={quickZoning} 
                      onChange={(e) => setQuickZoning(e.target.value)} 
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:bg-white focus:outline-none focus:border-blue-500 text-slate-900 font-semibold cursor-pointer"
                    >
                      <option value="Residential" className="text-slate-900 bg-white">{lang === "ta" ? "குடியிருப்பு மண்டலம்" : "Residential Development"}</option>
                      <option value="Commercial" className="text-slate-900 bg-white">{lang === "ta" ? "வணிக / ஐடி பூங்கா" : "Commercial / IT Park"}</option>
                      <option value="Industrial" className="text-slate-900 bg-white">{lang === "ta" ? "தொழில்துறை மண்டலம்" : "Industrial Zone"}</option>
                      <option value="Agricultural" className="text-slate-900 bg-white">{lang === "ta" ? "விவசாய நிலம்" : "Agricultural Land"}</option>
                    </select>
                  </div>

                  <button 
                    type="submit" 
                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-black text-xs py-3.5 px-4 rounded-xl shadow-md shadow-blue-600/25 active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer border-0 uppercase tracking-wider"
                  >
                    <Sparkles className="h-4.5 w-4.5 text-blue-200"/>
                    <span>{t.homeSections?.estimateBtn || "Estimate Valuation"}</span>
                  </button>
                </form>

                {quickValuation !== null && (
                  <div className="mt-6 p-4 rounded-2xl bg-slate-50 border border-slate-200 text-center animate-in fade-in zoom-in-95 duration-200">
                    <p className="text-xs font-bold text-blue-600 uppercase tracking-wider">{t.homeSections?.estimatedValue || "Estimated Base Value"}</p>
                    <p className="text-3xl font-black text-slate-900 mt-1">
                      ₹ {new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 }).format(quickValuation)}
                    </p>
                    <p className="text-[10px] text-slate-500 mt-1">*Based on regional registrar baseline indices.</p>
                    <Link href="/ai-price" className="mt-3.5 inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-700 transition-colors">
                      <span>{lang === "ta" ? "முழு அறிக்கையை பார்வையிடுங்கள்" : "Generate Full Audit Report"}</span>
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
      <section className="py-20 bg-slate-50/50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              {lang === "ta" ? "முன்னணி பில்டர்கள் மற்றும் உரிமையாளர்களின் நம்பிக்கை" : "Trusted by Top Developers & Landowners"}
            </h2>
            <p className="text-slate-500 font-medium mt-3 text-sm">
              {lang === "ta" ? "தரகர் செலவின்றி நிலங்களை வாங்குவது எப்படி என்பதை பாருங்கள்." : "See how builders and landlords are completely bypassing standard agent costs."}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {testimonials.map((test, idx) => (
              <div key={idx} className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
                <div>
                  <div className="flex gap-1 mb-5">
                    {[...Array(test.rating)].map((_, i) => (
                      <Star key={i} className="h-4.5 w-4.5 text-amber-400 fill-current"/>
                    ))}
                  </div>
                  <p className="text-slate-700 text-sm font-medium italic leading-relaxed">
                    "{test.quote}"
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    <h5 className="text-sm font-bold text-slate-900">{test.author}</h5>
                    <p className="text-xs text-slate-500 font-medium mt-0.5">{test.role}</p>
                  </div>
                  <ShieldCheck className="h-6 w-6 text-emerald-600"/>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-300 py-16 border-t border-slate-800 relative">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8 border-b border-slate-800 pb-12 mb-12">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold">
                  <MapPin className="h-4.5 w-4.5"/>
                </div>
                <span className="text-xl font-black text-white tracking-wide">{t.brandName || "LandLinkX"}</span>
              </div>
              <p className="text-slate-400 text-xs max-w-sm font-medium leading-relaxed">
                {t.tagline || "India's next-gen ecosystem digitalizing land transactions with transparent titles and AI-powered valuations."}
              </p>
            </div>

            <div className="flex flex-wrap gap-8 lg:gap-16 text-xs font-bold">
              <div>
                <h6 className="text-white text-xs font-black uppercase tracking-wider mb-4">{t.navListings || "Marketplace"}</h6>
                <div className="flex flex-col gap-2.5 text-slate-400">
                  <Link href="/listings" className="hover:text-blue-400 transition-colors">{t.navListings || "Listings Directory"}</Link>
                  <Link href="/ai-price" className="hover:text-blue-400 transition-colors">{t.navValuation || "AI Price Predictor"}</Link>
                  <Link href="/signup" className="hover:text-blue-400 transition-colors">{t.actions?.publishListing || "Register Asset"}</Link>
                </div>
              </div>
              <div>
                <h6 className="text-white text-xs font-black uppercase tracking-wider mb-4">{lang === "ta" ? "பயனர் பகுதி" : "User Portal"}</h6>
                <div className="flex flex-col gap-2.5 text-slate-400">
                  <Link href="/login" className="hover:text-blue-400 transition-colors">{t.navLogin || "Sign In"}</Link>
                  <Link href="/signup" className="hover:text-blue-400 transition-colors">{t.navSignup || "Create Account"}</Link>
                  <Link href="/dashboard" className="hover:text-blue-400 transition-colors">{lang === "ta" ? "டாஷ்போர்டு" : "Portals Dashboard"}</Link>
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-between text-xs font-medium text-slate-400">
            <p>&copy; {new Date().getFullYear()} LandLinkX Inc. {lang === "ta" ? "அனைத்து உரிமைகளும் பாதுகாக்கப்பட்டவை." : "All rights reserved."}</p>
            <p className="mt-2 sm:mt-0 hover:text-slate-200 transition-colors cursor-pointer">
              {lang === "ta" ? "சேவை விதிமுறைகள் | தனியுரிமைக் கொள்கை | சட்ட தணிக்கை விதிமுறை" : "Terms of Service | Privacy Policy | Legal Diligence Charter"}
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
