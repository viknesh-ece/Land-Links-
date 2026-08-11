"use client";
import Navbar from "@/components/Navbar";
import PropertyCard from "@/components/PropertyCard";
import Link from "next/link";
import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { getLoggedInUser } from "@/lib/auth";
import { useLanguage } from "@/context/LanguageContext";
import { Search, Plus, MapPin, SlidersHorizontal, RefreshCw, Layers, CheckCircle, Maximize2 } from "lucide-react";

function ListingsContent() {
    const router = useRouter();
    const { lang, t } = useLanguage();
    const searchParams = useSearchParams();
    const initialSearch = searchParams.get("search") || "";
    const [properties, setProperties] = useState([]);
    const [search, setSearch] = useState(initialSearch);
    const [loading, setLoading] = useState(true);
    const [minPrice, setMinPrice] = useState("");
    const [maxPrice, setMaxPrice] = useState("");
    const [minAcres, setMinAcres] = useState("");
    const [locationFilter, setLocationFilter] = useState("all");
    const [zoningFilter, setZoningFilter] = useState("all");
    const [onlyVerified, setOnlyVerified] = useState(false);

    useEffect(() => {
        const user = getLoggedInUser();
        if (!user) {
            router.push("/signup");
        }
    }, [router]);

    const fetchProperties = async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/properties");
            const data = await res.json();
            if (Array.isArray(data)) {
                setProperties(data);
            } else {
                setProperties([]);
            }
        }
        catch (error) {
            console.error("Failed to fetch properties:", error);
            setProperties([]);
        }
        finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProperties();
    }, []);

    // Filter listings
    const filteredProperties = properties.filter((property) => {
        const matchesSearch = property.location.toLowerCase().includes(search.toLowerCase()) ||
            property.title.toLowerCase().includes(search.toLowerCase()) ||
            property.description.toLowerCase().includes(search.toLowerCase());
        const matchesMinPrice = minPrice === "" || property.price >= Number(minPrice);
        const matchesMaxPrice = maxPrice === "" || property.price <= Number(maxPrice);
        const propertySize = (property.id % 5) * 2 + 1;
        const matchesMinAcres = minAcres === "" || propertySize >= Number(minAcres);
        const matchesLocationFilter = locationFilter === "all" ||
            property.location.toLowerCase().includes(locationFilter.toLowerCase());
        
        let propertyZoning = "Residential";
        if (property.title.toLowerCase().includes("commercial") || property.description.toLowerCase().includes("it")) {
            propertyZoning = "Commercial";
        }
        else if (property.title.toLowerCase().includes("farm") || property.description.toLowerCase().includes("agri")) {
            propertyZoning = "Agricultural";
        }
        else if (property.title.toLowerCase().includes("factory") || property.description.toLowerCase().includes("industrial")) {
            propertyZoning = "Industrial";
        }
        const matchesZoning = zoningFilter === "all" || propertyZoning === zoningFilter;
        const matchesVerified = !onlyVerified || (property.id % 2 === 0);
        return matchesSearch && matchesMinPrice && matchesMaxPrice && matchesMinAcres && matchesLocationFilter && matchesZoning && matchesVerified;
    });

    const uniqueLocations = Array.from(new Set(properties.map((p) => p.location.split(",")[0].trim())));

    return (
    <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      {/* Header Block */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-slate-200 pb-6 mb-8">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-slate-900">
            {t.marketplace?.pageTitle || "Institutional Land Directory"}
          </h1>
          <p className="text-slate-500 font-semibold text-sm mt-1">
            {t.marketplace?.pageSubtitle || "Browse and acquire verified land parcels with clean deed credentials."}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button onClick={fetchProperties} className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 transition-colors shadow-sm cursor-pointer" title="Refresh Listings">
            <RefreshCw className={`h-4.5 w-4.5 ${loading ? "animate-spin text-blue-600" : ""}`}/>
          </button>
          <Link href="/listings/create" className="shrink-0">
            <button className="flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-sm shadow-md shadow-blue-600/20 transition-all active:scale-[0.98] cursor-pointer border-0">
              <Plus className="h-4.5 w-4.5"/>
              <span>{t.actions?.publishListing || "List Property"}</span>
            </button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Left Filters Sidebar */}
        <div className="space-y-6 lg:col-span-1">
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <span className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <SlidersHorizontal className="h-4 w-4 text-blue-600"/>
                {t.marketplace?.filterHeading || "Filter Directory"}
              </span>
              <button onClick={() => {
                setSearch("");
                setMinPrice("");
                setMaxPrice("");
                setMinAcres("");
                setLocationFilter("all");
                setZoningFilter("all");
                setOnlyVerified(false);
              }} className="text-[11px] font-bold text-blue-600 hover:text-blue-700 cursor-pointer bg-transparent border-0">
                {t.actions?.resetFilters || "Reset All"}
              </button>
            </div>

            {/* Keyword Search */}
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-2">
                {lang === "ta" ? "முக்கிய சொல் தேடல்" : "Keyword Search"}
              </label>
              <div className="relative">
                <Search className="h-4 w-4 text-slate-400 absolute left-3 top-3.5"/>
                <input 
                  type="text" 
                  placeholder={t.actions?.searchPlaceholder || "e.g. NH-48 highway, farm..."} 
                  value={search} 
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 text-xs font-semibold text-slate-900 placeholder:text-slate-400 transition-all" 
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </div>

            {/* Location Region */}
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-2">
                {t.marketplace?.districtLabel || "Region / City"}
              </label>
              <div className="relative">
                <MapPin className="h-4 w-4 text-indigo-600 absolute left-3 top-3.5"/>
                <select value={locationFilter} onChange={(e) => setLocationFilter(e.target.value)} className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 text-xs font-bold text-slate-900 transition-all appearance-none cursor-pointer">
                  <option value="all" className="bg-white text-slate-900">{t.actions?.locationPlaceholder || "All Regions"}</option>
                  {uniqueLocations.map((loc) => (<option key={loc} value={loc} className="bg-white text-slate-900">{loc}</option>))}
                </select>
              </div>
            </div>

            {/* Pricing Limit */}
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-2">
                {t.marketplace?.priceRangeLabel || "Price Budget (₹)"}
              </label>
              <div className="grid grid-cols-2 gap-2">
                <input type="number" placeholder={t.actions?.minPrice || "Min Price"} value={minPrice} className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 text-xs font-semibold text-slate-900 placeholder:text-slate-400 transition-all" onChange={(e) => setMinPrice(e.target.value)}/>
                <input type="number" placeholder={t.actions?.maxPrice || "Max Price"} value={maxPrice} className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 text-xs font-semibold text-slate-900 placeholder:text-slate-400 transition-all" onChange={(e) => setMaxPrice(e.target.value)}/>
              </div>
            </div>

            {/* Size Limit */}
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-2">
                {t.marketplace?.acresRangeLabel || "Minimum Size (Acres)"}
              </label>
              <div className="relative">
                <Maximize2 className="h-4 w-4 text-slate-400 absolute left-3 top-3.5"/>
                <input type="number" placeholder={t.actions?.minAcres || "Min Acres"} value={minAcres} className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 text-xs font-semibold text-slate-900 placeholder:text-slate-400 transition-all" onChange={(e) => setMinAcres(e.target.value)}/>
              </div>
            </div>

            {/* Zoning Classification */}
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-2.5">
                {t.marketplace?.zoningLabel || "Zoning Class"}
              </label>
              <div className="space-y-2">
                {["all", "Residential", "Commercial", "Industrial", "Agricultural"].map((zone) => (
                  <label key={zone} className="flex items-center gap-2 text-xs font-bold text-slate-700 cursor-pointer">
                    <input type="radio" name="zoning" checked={zoningFilter === zone} onChange={() => setZoningFilter(zone)} className="rounded-full border-slate-300 text-blue-600 focus:ring-blue-500 h-3.5 w-3.5 cursor-pointer"/>
                    <span className="capitalize">
                      {zone === "all" ? (t.actions?.allZonings || "All Classifications") : (
                        zone === "Residential" ? (lang === "ta" ? "குடியிருப்பு" : "Residential") :
                        zone === "Commercial" ? (lang === "ta" ? "வணிகம்" : "Commercial") :
                        zone === "Industrial" ? (lang === "ta" ? "தொழில்துறை" : "Industrial") :
                        (lang === "ta" ? "விவசாயம்" : "Agricultural")
                      )}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Verification status toggle */}
            <div className="pt-2 border-t border-slate-100">
              <label className="flex items-center justify-between text-xs font-bold text-slate-700 cursor-pointer">
                <span className="flex items-center gap-1.5">
                  <CheckCircle className="h-4 w-4 text-emerald-600"/>
                  {lang === "ta" ? "சரிபார்க்கப்பட்ட பட்டா மட்டும்" : "Verified Title Deeds Only"}
                </span>
                <input type="checkbox" checked={onlyVerified} onChange={(e) => setOnlyVerified(e.target.checked)} className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 h-4.5 w-4.5 cursor-pointer"/>
              </label>
            </div>

          </div>
        </div>

        {/* Right Listings Grid */}
        <div className="lg:col-span-3">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
              {[1, 2, 3, 4].map((num) => (
                <div key={num} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4 animate-pulse">
                  <div className="h-48 w-full bg-slate-100 rounded-xl"></div>
                  <div className="h-6 w-1/3 bg-slate-100 rounded"></div>
                  <div className="h-4 w-3/4 bg-slate-100 rounded"></div>
                  <div className="h-10 w-full bg-slate-100 rounded-xl"></div>
                </div>
              ))}
            </div>
          ) : filteredProperties.length === 0 ? (
            <div className="text-center py-20 bg-white border border-slate-200 rounded-3xl p-8 shadow-sm">
              <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 border border-slate-200 text-slate-500 mb-4">
                <Layers className="h-6 w-6"/>
              </div>
              <h3 className="text-lg font-bold text-slate-900">{t.marketplace?.noResults || "No properties match your filters"}</h3>
              <p className="text-slate-500 text-sm font-medium mt-1 max-w-sm mx-auto leading-relaxed">
                {lang === "ta" ? "வடிகட்டிகளை மீட்டமைத்து மீண்டும் முயற்சிக்கவும்." : "Try clearing keyword searches, adjusting price boundaries, or deselecting verified criteria."}
              </p>
              <button onClick={() => {
                setSearch("");
                setMinPrice("");
                setMaxPrice("");
                setMinAcres("");
                setLocationFilter("all");
                setZoningFilter("all");
                setOnlyVerified(false);
              }} className="mt-5 px-5 py-2.5 text-xs font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-xl transition-all cursor-pointer">
                {t.actions?.resetFilters || "Reset Filter Settings"}
              </button>
            </div>
          ) : (
            <div>
              <div className="flex items-center justify-between mb-4">
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  {lang === "ta" ? `காட்டப்படும் நிலங்கள்: ${filteredProperties.length}` : `Showing ${filteredProperties.length} active listings`}
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredProperties.map((property, index) => (
                  <div key={property.id || index} className="animate-slide-up">
                    <PropertyCard property={property}/>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

      </div>

    </main>);
}

export default function ListingsPage() {
    return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 flex flex-col">
      <Navbar />
      <Suspense fallback={<div className="flex flex-col items-center justify-center py-20 flex-grow">
          <div className="h-10 w-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-500 font-semibold text-sm mt-4">Loading directory explorer...</p>
        </div>}>
        <ListingsContent />
      </Suspense>
    </div>);
}
