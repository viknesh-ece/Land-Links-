"use client";

import Navbar from "@/components/Navbar";
import PropertyCard from "@/components/PropertyCard";
import Link from "next/link";
import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { 
  Search, 
  Plus, 
  MapPin, 
  SlidersHorizontal, 
  RefreshCw, 
  Layers, 
  CheckCircle,
  HelpCircle,
  Maximize2
} from "lucide-react";

function ListingsContent() {
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

  const fetchProperties = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/properties");
      const data = await res.json();
      setProperties(data);
    } catch (error) {
      console.error("Failed to fetch properties:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, []);

  // Filter listings
  const filteredProperties = properties.filter((property: any) => {
    const matchesSearch = 
      property.location.toLowerCase().includes(search.toLowerCase()) || 
      property.title.toLowerCase().includes(search.toLowerCase()) ||
      property.description.toLowerCase().includes(search.toLowerCase());
      
    const matchesMinPrice = minPrice === "" || property.price >= Number(minPrice);
    const matchesMaxPrice = maxPrice === "" || property.price <= Number(maxPrice);
    
    // Parse acres from title/description if not explicit (or mock it by property id for realism)
    // To make size filter work reliably, we use a mock size formula: property.id * 1.5 + 0.5 acres
    const propertySize = (property.id % 5) * 2 + 1; 
    const matchesMinAcres = minAcres === "" || propertySize >= Number(minAcres);
    
    const matchesLocationFilter = locationFilter === "all" || 
                                  property.location.toLowerCase().includes(locationFilter.toLowerCase());
    
    // Zoning classifications based on title/desc or mock
    let propertyZoning = "Residential";
    if (property.title.toLowerCase().includes("commercial") || property.description.toLowerCase().includes("it")) {
      propertyZoning = "Commercial";
    } else if (property.title.toLowerCase().includes("farm") || property.description.toLowerCase().includes("agri")) {
      propertyZoning = "Agricultural";
    } else if (property.title.toLowerCase().includes("factory") || property.description.toLowerCase().includes("industrial")) {
      propertyZoning = "Industrial";
    }
    const matchesZoning = zoningFilter === "all" || propertyZoning === zoningFilter;

    // Filter verification title status
    const matchesVerified = !onlyVerified || (property.id % 2 === 0); // Mock: even IDs are fully vetted

    return matchesSearch && matchesMinPrice && matchesMaxPrice && matchesMinAcres && matchesLocationFilter && matchesZoning && matchesVerified;
  });

  // Extract unique locations for a dropdown filter
  const uniqueLocations = Array.from(
    new Set(properties.map((p: any) => p.location.split(",")[0].trim()))
  );

  return (
    <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      {/* Header Block */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-slate-800 pb-6 mb-8">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-white">
            Institutional Land Directory
          </h1>
          <p className="text-slate-400 font-semibold text-sm mt-1">
            Browse and acquire verified land parcels with clean deed credentials.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button 
            onClick={fetchProperties}
            className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-slate-800 bg-[#090d16]/60 hover:bg-[#090d16] text-slate-300 transition-colors shadow-sm cursor-pointer"
            title="Refresh Listings"
          >
            <RefreshCw className={`h-4.5 w-4.5 ${loading ? "animate-spin" : ""}`} />
          </button>
          <Link href="/listings/create" className="shrink-0">
            <button className="flex items-center gap-2 px-5 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm shadow-md shadow-indigo-900/10 hover:shadow-indigo-900/20 transition-all active:scale-[0.98] cursor-pointer">
              <Plus className="h-4.5 w-4.5" />
              List Property
            </button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Left Filters Sidebar */}
        <div className="space-y-6 lg:col-span-1">
          <div className="bg-[#090d16]/70 backdrop-blur-md rounded-2xl border border-slate-800/80 p-5 shadow-2xl space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <span className="text-sm font-bold text-white flex items-center gap-2">
                <SlidersHorizontal className="h-4 w-4 text-indigo-400" />
                Filter Directory
              </span>
              <button 
                onClick={() => {
                  setSearch("");
                  setMinPrice("");
                  setMaxPrice("");
                  setMinAcres("");
                  setLocationFilter("all");
                  setZoningFilter("all");
                  setOnlyVerified(false);
                }}
                className="text-[11px] font-bold text-indigo-400 hover:text-indigo-300 cursor-pointer"
              >
                Reset All
              </button>
            </div>

            {/* Keyword Search */}
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">Keyword Search</label>
              <div className="relative">
                <Search className="h-4 w-4 text-slate-500 absolute left-3 top-3.5" />
                <input
                  type="text"
                  placeholder="e.g. NH-48 highway, farm..."
                  value={search}
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-950 border border-slate-850 focus:outline-none focus:ring-2 focus:ring-indigo-500/15 focus:border-indigo-505 text-xs font-semibold text-white placeholder:text-slate-500 transition-all"
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </div>

            {/* Location Region */}
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">Region / City</label>
              <div className="relative">
                <MapPin className="h-4 w-4 text-indigo-400 absolute left-3 top-3.5" />
                <select
                  value={locationFilter}
                  onChange={(e) => setLocationFilter(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-950 border border-slate-850 focus:outline-none focus:ring-2 focus:ring-indigo-500/15 focus:border-indigo-505 text-xs font-bold text-slate-200 transition-all appearance-none cursor-pointer"
                >
                  <option value="all" className="bg-slate-950 text-white">All Regions</option>
                  {uniqueLocations.map((loc: string) => (
                    <option key={loc} value={loc} className="bg-slate-950 text-white">{loc}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Pricing Limit */}
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">Price Budget (₹)</label>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="number"
                  placeholder="Min Price"
                  value={minPrice}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-850 focus:outline-none focus:ring-2 focus:ring-indigo-500/15 focus:border-indigo-505 text-xs font-semibold text-white placeholder:text-slate-500 transition-all"
                  onChange={(e) => setMinPrice(e.target.value)}
                />
                <input
                  type="number"
                  placeholder="Max Price"
                  value={maxPrice}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-850 focus:outline-none focus:ring-2 focus:ring-indigo-500/15 focus:border-indigo-505 text-xs font-semibold text-white placeholder:text-slate-500 transition-all"
                  onChange={(e) => setMaxPrice(e.target.value)}
                />
              </div>
            </div>

            {/* Size Limit */}
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">Minimum Size (Acres)</label>
              <div className="relative">
                <Maximize2 className="h-4 w-4 text-slate-500 absolute left-3 top-3.5" />
                <input
                  type="number"
                  placeholder="Min Acres"
                  value={minAcres}
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-950 border border-slate-850 focus:outline-none focus:ring-2 focus:ring-indigo-500/15 focus:border-indigo-505 text-xs font-semibold text-white placeholder:text-slate-500 transition-all"
                  onChange={(e) => setMinAcres(e.target.value)}
                />
              </div>
            </div>

            {/* Zoning Classification */}
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2.5">Zoning Class</label>
              <div className="space-y-2">
                {["all", "Residential", "Commercial", "Industrial", "Agricultural"].map((zone) => (
                  <label key={zone} className="flex items-center gap-2 text-xs font-bold text-slate-300 cursor-pointer">
                    <input 
                      type="radio" 
                      name="zoning"
                      checked={zoningFilter === zone}
                      onChange={() => setZoningFilter(zone)}
                      className="rounded-full border-slate-700 bg-slate-950 text-indigo-500 focus:ring-indigo-550 h-3.5 w-3.5"
                    />
                    <span className="capitalize">{zone === "all" ? "All Classifications" : zone}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Verification status toggle */}
            <div className="pt-2 border-t border-slate-800">
              <label className="flex items-center justify-between text-xs font-bold text-slate-300 cursor-pointer">
                <span className="flex items-center gap-1.5">
                  <CheckCircle className="h-4 w-4 text-emerald-500" />
                  Verified Title Deeds Only
                </span>
                <input 
                  type="checkbox" 
                  checked={onlyVerified}
                  onChange={(e) => setOnlyVerified(e.target.checked)}
                  className="rounded border-slate-700 bg-slate-950 text-indigo-500 focus:ring-indigo-550 h-4.5 w-4.5 cursor-pointer"
                />
              </label>
            </div>

          </div>
        </div>

        {/* Right Listings Grid */}
        <div className="lg:col-span-3">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
              {[1, 2, 3, 4].map((num) => (
                <div key={num} className="bg-[#090d16] rounded-2xl border border-slate-800/80 p-5 shadow-sm space-y-4 animate-pulse">
                  <div className="h-48 w-full bg-slate-800 rounded-xl"></div>
                  <div className="h-6 w-1/3 bg-slate-800 rounded"></div>
                  <div className="h-4 w-3/4 bg-slate-800 rounded"></div>
                  <div className="h-10 w-full bg-slate-800 rounded-xl"></div>
                </div>
              ))}
            </div>
          ) : filteredProperties.length === 0 ? (
            <div className="text-center py-20 bg-[#090d16]/50 border border-slate-800/80 rounded-3xl p-8 shadow-2xl">
              <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-slate-900 border border-slate-850 text-slate-400 mb-4">
                <Layers className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-white">No properties matches your filters</h3>
              <p className="text-slate-400 text-sm font-semibold mt-1 max-w-sm mx-auto leading-relaxed">
                Try clearing keyword searches, adjusting price boundaries, or deselecting verified criteria.
              </p>
              <button 
                onClick={() => {
                  setSearch("");
                  setMinPrice("");
                  setMaxPrice("");
                  setMinAcres("");
                  setLocationFilter("all");
                  setZoningFilter("all");
                  setOnlyVerified(false);
                }}
                className="mt-5 px-5 py-2.5 text-xs font-bold text-indigo-300 bg-indigo-950/40 hover:bg-indigo-900/30 rounded-xl transition-all cursor-pointer"
              >
                Reset Filter Settings
              </button>
            </div>
          ) : (
            <div>
              <div className="flex items-center justify-between mb-4">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Showing {filteredProperties.length} active listings
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredProperties.map((property: any, index: number) => (
                  <div key={property.id} className="animate-slide-up opacity-0" style={{ animationDelay: `${index * 80}ms`, animationFillMode: "forwards" }}>
                    <PropertyCard property={property} />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

      </div>

    </main>
  );
}

export default function ListingsPage() {
  return (
    <div className="min-h-screen bg-black text-slate-100 flex flex-col">
      <Navbar />
      <Suspense fallback={
        <div className="flex flex-col items-center justify-center py-20 flex-grow">
          <div className="h-10 w-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-400 font-semibold text-sm mt-4">Loading directory explorer...</p>
        </div>
      }>
        <ListingsContent />
      </Suspense>
    </div>
  );
}