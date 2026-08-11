"use client";
import { MapPin, Phone, Heart, Trash2, ArrowUpRight, ShieldCheck, Mail, User, X, Layers, Compass, DollarSign, Send, Building, TrendingUp, FileText, CheckCircle2, RotateCw, Award, Activity, ExternalLink, Zap, Satellite, Navigation } from "lucide-react";
import { useState } from "react";
import { useLanguage } from "@/context/LanguageContext";
import ThreeDTilt from "@/components/ThreeDTilt";
import GovDocVerifierModal from "@/components/GovDocVerifierModal";
import TNLandGovHub from "@/components/TNLandGovHub";
import GISSatelliteModal from "@/components/GISSatelliteModal";

export default function PropertyCard({ property }) {
    const { lang, t } = useLanguage();
    const [isSaved, setIsSaved] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [showContact, setShowContact] = useState(false);
    const [showDetails, setShowDetails] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [showGISSatellite, setShowGISSatellite] = useState(false);

    const handleDelete = async () => {
        setDeleting(true);
        try {
            const res = await fetch(`/api/properties/${property.id}`, {
                method: "DELETE",
            });
            const data = await res.json();
            setShowDeleteConfirm(false);
            window.location.reload();
        }
        catch (err) {
            console.error(err);
            alert("Failed to delete property");
        }
        finally {
            setDeleting(false);
        }
    };

    const fallbackImages = [
        "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=800&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1502082553048-f009c37129b9?w=800&auto=format&fit=crop&q=80"
    ];
    const idStr = String(property.id);
    const hash = idStr.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const imageIndex = hash % fallbackImages.length;
    const imageUrl = property.image && property.image.startsWith("http")
        ? property.image
        : fallbackImages[imageIndex];

    const formattedPrice = new Intl.NumberFormat("en-IN", {
        maximumFractionDigits: 0
    }).format(property.price);

    return (
      <>
        <ThreeDTilt className="h-full">
          <div className="group bg-slate-900/90 rounded-2xl border border-slate-800/80 hover:border-cyan-500/50 overflow-hidden shadow-xl hover:shadow-cyan-500/10 transition-all duration-300 flex flex-col h-full relative backdrop-blur-md">
            <div className="relative h-52 w-full overflow-hidden bg-slate-950">
              <img src={imageUrl} alt={property.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy"/>
              
              <div className="absolute top-3 left-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-emerald-500/90 text-white text-[10px] font-black shadow-md backdrop-blur-md uppercase tracking-wider">
                <ShieldCheck className="h-3.5 w-3.5"/>
                <span>{property.verificationStatus || t.verification?.verified || "Vetted Title"}</span>
              </div>

              <button onClick={() => setIsSaved(!isSaved)} className={`absolute top-3 right-3 h-8.5 w-8.5 rounded-lg flex items-center justify-center border transition-all cursor-pointer ${isSaved
                  ? "bg-rose-600 border-rose-500 text-white scale-105"
                  : "bg-slate-900/80 border-slate-700 text-slate-300 hover:text-rose-400 hover:bg-slate-900"}`}>
                <Heart className={`h-4.5 w-4.5 ${isSaved ? "fill-current" : ""}`}/>
              </button>
            </div>

            <div className="p-5 flex flex-col flex-grow text-slate-100">
              <div className="flex items-start justify-between gap-2 mb-2">
                <span className="text-xl font-black text-cyan-400">
                  ₹ {formattedPrice}
                </span>
                <span className="inline-flex items-center gap-1 text-[10px] font-extrabold text-cyan-300 bg-cyan-950/60 border border-cyan-800/50 px-2 py-0.5 rounded-md">
                  {lang === "ta" ? `நில எண் #${property.id}` : `Parcel #${property.id}`}
                </span>
              </div>

              <h3 className="text-base font-bold text-white group-hover:text-cyan-300 transition-colors line-clamp-1 mb-2">
                {property.title}
              </h3>

              <div className="flex items-center gap-1 text-slate-400 text-xs font-semibold mb-3">
                <MapPin className="h-3.5 w-3.5 text-cyan-400 shrink-0"/>
                <span className="line-clamp-1">{property.location}</span>
              </div>

              <p className="text-slate-300 font-normal text-xs leading-relaxed line-clamp-2 mb-5 flex-grow">
                {property.description}
              </p>

              <div className="grid grid-cols-4 gap-2 pt-4 border-t border-slate-800">
                <button onClick={() => setShowDetails(true)} className="col-span-2 flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold transition-all cursor-pointer border-0 shadow-md shadow-cyan-600/20">
                  <span>{lang === "ta" ? "விவரங்கள்" : "Details"}</span>
                  <ArrowUpRight className="h-3.5 w-3.5"/>
                </button>

                <button onClick={() => setShowContact(true)} className="flex items-center justify-center rounded-xl bg-slate-800 hover:bg-emerald-600/30 text-slate-300 hover:text-emerald-300 border border-slate-700 hover:border-emerald-500/50 text-xs font-semibold py-2 px-2 transition-all cursor-pointer" title="Contact Owner">
                  <Phone className="h-3.5 w-3.5"/>
                </button>

                <button onClick={() => setShowDeleteConfirm(true)} className="flex items-center justify-center rounded-xl bg-slate-800 hover:bg-rose-600/30 text-slate-300 hover:text-rose-300 border border-slate-700 hover:border-rose-500/50 text-xs font-semibold py-2 px-2 transition-all cursor-pointer" title="Delete Listing">
                  <Trash2 className="h-3.5 w-3.5"/>
                </button>
              </div>
            </div>
          </div>
        </ThreeDTilt>

        {showDetails && (<DetailsModal property={property} imageUrl={imageUrl} formattedPrice={formattedPrice} onClose={() => setShowDetails(false)} onOpenContact={() => { setShowDetails(false); setShowContact(true); }}/>)}

        {showContact && (
          <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-fade-in">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-sm w-full p-6 shadow-2xl animate-scale-in relative text-white">
              <button onClick={() => setShowContact(false)} className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors cursor-pointer border-0 bg-transparent">
                <X className="h-5 w-5"/>
              </button>
              
              <div className="text-center mb-6">
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-400 mb-3 border border-emerald-500/30">
                  <Phone className="h-5 w-5"/>
                </div>
                <h3 className="text-lg font-bold text-white">Direct Contact Details</h3>
                <p className="text-xs text-slate-400 font-semibold mt-1">Connect directly with the principal owner</p>
              </div>

              <div className="space-y-3 mb-6 bg-slate-950/80 p-4 rounded-2xl border border-slate-800">
                <div className="flex items-center gap-3">
                  <User className="h-4 w-4 text-indigo-400"/>
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Representative</p>
                    <p className="text-sm font-bold text-white">Rajesh Kumar (Owner)</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="h-4 w-4 text-emerald-400"/>
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Phone</p>
                    <p className="text-sm font-bold text-emerald-400">+91 98765 43210</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="h-4 w-4 text-sky-400"/>
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Email</p>
                    <p className="text-sm font-bold text-slate-300">rajesh.kumar@example.com</p>
                  </div>
                </div>
              </div>

              <button onClick={() => setShowContact(false)} className="w-full py-3 bg-slate-800 hover:bg-slate-700 text-white text-sm font-bold rounded-xl transition-all border border-slate-700 cursor-pointer">
                Close
              </button>
            </div>
          </div>
        )}

        {showDeleteConfirm && (
          <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-fade-in">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-sm w-full p-6 shadow-2xl animate-scale-in text-center text-white">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-500/10 text-rose-400 mb-3 border border-rose-500/30">
                <Trash2 className="h-5 w-5"/>
              </div>
              <h3 className="text-lg font-bold text-white">Remove Listing?</h3>
              <p className="text-xs text-slate-400 font-semibold mt-1 mb-6 px-4">
                Are you sure you want to delete &quot;{property.title}&quot;? This action is permanent and cannot be undone.
              </p>

              <div className="flex gap-3">
                <button onClick={() => setShowDeleteConfirm(false)} className="flex-1 py-3 border border-slate-700 text-slate-300 hover:bg-slate-800 text-sm font-bold rounded-xl transition-all cursor-pointer bg-transparent">
                  Cancel
                </button>
                <button onClick={handleDelete} disabled={deleting} className="flex-1 py-3 bg-rose-600 hover:bg-rose-700 text-white text-sm font-bold rounded-xl transition-all cursor-pointer disabled:opacity-50 border-0 shadow-lg shadow-rose-600/30">
                  {deleting ? "Deleting..." : "Delete"}
                </button>
              </div>
            </div>
          </div>
        )}
      </>
    );
}

// FULL-SCREEN EXECUTIVE COMMAND CENTER DETAILS MODAL
function DetailsModal({ property, imageUrl, formattedPrice, onClose, onOpenContact }) {
    const [offerPrice, setOfferPrice] = useState(property.price);
    const [submittingOffer, setSubmittingOffer] = useState(false);
    const [activeTab, setActiveTab] = useState("gis");
    const [floors, setFloors] = useState(4);
    const [footprint, setFootprint] = useState(50);
    const [simulateYear, setSimulateYear] = useState(2026);
    const [soilUse, setSoilUse] = useState("residential");
    const [verifyingDoc, setVerifyingDoc] = useState(null);
    const [showGISSatellite, setShowGISSatellite] = useState(false);

    const handleSubmitOffer = () => {
        setSubmittingOffer(true);
        setTimeout(() => {
            localStorage.setItem("pending_offer_property", JSON.stringify({
                title: property.title,
                price: property.price,
                location: property.location,
                offerPrice: Number(offerPrice),
                ownerName: "Rajesh Kumar"
            }));
            onClose();
            window.location.href = "/inbox";
        }, 150);
    };

    return (
      <>
        {/* Full-Screen Backdrop */}
        <div className="fixed inset-0 bg-slate-950/90 backdrop-blur-2xl z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 overflow-y-auto animate-fade-in">
          
          {/* Main Full-Width Command Center Window */}
          <div className="bg-slate-900 border border-slate-700/80 text-white rounded-3xl max-w-7xl w-full h-[92vh] max-h-[920px] overflow-hidden shadow-2xl animate-scale-in flex flex-col lg:flex-row relative my-auto">
            
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 h-10 w-10 rounded-full bg-slate-800/90 text-slate-300 hover:text-white flex items-center justify-center hover:bg-slate-700 transition-all cursor-pointer border border-slate-700/80 z-20 shadow-lg"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Left Column: High-Impact GIS Command Studio (60% Width) */}
            <div className="w-full lg:w-7/12 p-6 border-b lg:border-b-0 lg:border-r border-slate-800 flex flex-col justify-between bg-slate-900/95 overflow-y-auto">
              
              <div className="space-y-4">
                
                {/* Media Banner Header */}
                <div className="relative h-48 sm:h-56 rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 shadow-xl shrink-0 group">
                  <img src={imageUrl} alt={property.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-60" />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent"></div>
                  
                  <div className="absolute top-4 left-4 flex items-center gap-2">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/90 backdrop-blur-md text-white text-xs font-black uppercase tracking-wider shadow-lg">
                      <ShieldCheck className="h-4 w-4" />
                      100% Vetted Legal Title
                    </span>
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/80 backdrop-blur-md text-white text-xs font-bold">
                      Parcel #{property.id}
                    </span>
                  </div>

                  <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                    <div>
                      <h4 className="text-lg font-black text-white drop-shadow-md">{property.title}</h4>
                      <p className="text-xs font-bold text-slate-300 flex items-center gap-1.5 mt-0.5">
                        <MapPin className="h-3.5 w-3.5 text-indigo-400" /> {property.location}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => setShowGISSatellite(true)}
                      className="bg-indigo-600/95 hover:bg-indigo-500 text-white backdrop-blur-md px-3.5 py-2 rounded-xl border border-indigo-400/40 text-xs font-black flex items-center gap-2 shadow-lg shadow-indigo-600/40 transition-all cursor-pointer hover:scale-105 active:scale-95"
                      title="Click to view live Google Maps satellite overlay"
                    >
                      <Satellite className="h-4 w-4 text-cyan-300 animate-pulse" />
                      <span>GIS Satellite Overlay</span>
                      <ExternalLink className="h-3 w-3 opacity-80" />
                    </button>
                  </div>
                </div>

                {/* Command Center Tabs */}
                <div className="flex border-b border-slate-800 pb-3 gap-2 overflow-x-auto shrink-0 pt-1">
                  {[
                    { id: "gis", label: "🌐 GIS Map Vectors" },
                    { id: "geotech", label: "🧪 Soil Profile" },
                    { id: "3d", label: "🏢 3D Massing" },
                    { id: "proximity", label: "📈 Growth Corridor" },
                    { id: "documents", label: "🛡️ Vetted Deeds" },
                    { id: "tn_gov", label: "🏛️ TN Land Registry" }
                  ].map(tab => (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setActiveTab(tab.id)}
                      className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap border ${
                        activeTab === tab.id
                          ? "bg-indigo-600 border-indigo-500 text-white shadow-lg shadow-indigo-600/40 scale-[1.03]"
                          : "bg-slate-800/80 border-slate-700/60 text-slate-400 hover:text-white hover:bg-slate-800"
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>

                {/* TAB 1: GIS Map Vectors */}
                {activeTab === "gis" && (
                  <div className="space-y-4 animate-fade-in">
                    
                    {/* Live Satellite & Google Maps Quick Actions */}
                    <div className="flex flex-wrap items-center justify-between gap-2 p-3.5 bg-gradient-to-r from-indigo-950/60 via-slate-900 to-indigo-950/60 rounded-2xl border border-indigo-500/40 shadow-xl">
                      <div className="flex items-center gap-2">
                        <Satellite className="h-4 w-4 text-cyan-400 animate-pulse" />
                        <span className="text-xs font-black text-white">Live GIS Google Maps Satellite Integration</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setShowGISSatellite(true)}
                          className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-black transition-all shadow-md shadow-indigo-600/30 flex items-center gap-1.5 cursor-pointer"
                        >
                          <Layers className="h-3.5 w-3.5 text-cyan-300" />
                          <span>Launch Satellite HUD</span>
                        </button>
                        <a
                          href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(property.location || property.title)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
                        >
                          <Navigation className="h-3.5 w-3.5 text-blue-400" />
                          <span>Google Maps</span>
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                        <Compass className="h-4 w-4 text-indigo-400" /> Boundary Survey Coordinates
                      </h4>
                      <span className="text-xs font-extrabold text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-3 py-1 rounded-full uppercase tracking-wider">
                        100% Cleared Deeds
                      </span>
                    </div>

                    {/* High-Tech Vector Canvas */}
                    <div className="relative">
                      <svg viewBox="0 0 200 200" className="w-full h-56 sm:h-64 rounded-2xl bg-slate-950 border border-slate-800 relative overflow-hidden shadow-2xl">
                        <defs>
                          <pattern id="grid_dark_lg" width="20" height="20" patternUnits="userSpaceOnUse">
                            <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(99, 102, 241, 0.15)" strokeWidth="1" />
                          </pattern>
                        </defs>
                        <rect width="100%" height="100%" fill="url(#grid_dark_lg)" />
                        <circle cx="100" cy="100" r="80" fill="none" stroke="rgba(99, 102, 241, 0.2)" strokeWidth="1" strokeDasharray="3 3" />
                        <polygon points="45,45 155,35 135,145 55,125" fill="rgba(99, 102, 241, 0.15)" stroke="#6366f1" strokeWidth="3" strokeLinejoin="round" />
                        <circle cx="100" cy="85" r="6" fill="#10b981" />
                        <circle cx="100" cy="85" r="12" fill="none" stroke="#10b981" strokeWidth="2" className="animate-pulse" />
                        <text x="114" y="88" fill="#10b981" fontSize="10" fontWeight="bold">Survey Pt #402</text>
                        <text x="80" y="24" fill="#818cf8" fontSize="9" fontWeight="bold">110m (North)</text>
                        <text x="144" y="90" fill="#818cf8" fontSize="9" fontWeight="bold">115m (East)</text>
                        <text x="78" y="148" fill="#818cf8" fontSize="9" fontWeight="bold">80m (South)</text>
                        <text x="10" y="90" fill="#818cf8" fontSize="9" fontWeight="bold">95m (West)</text>
                      </svg>
                    </div>

                    {/* Metrics Grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs font-semibold bg-slate-950 p-4 rounded-2xl border border-slate-800">
                      <div className="space-y-0.5">
                        <p className="text-[10px] text-slate-400 uppercase font-extrabold">Zoning</p>
                        <p className="text-white font-bold">Residential Sector 4</p>
                      </div>
                      <div className="space-y-0.5">
                        <p className="text-[10px] text-slate-400 uppercase font-extrabold">FSI Limit</p>
                        <p className="text-indigo-400 font-extrabold">2.5 Max</p>
                      </div>
                      <div className="space-y-0.5">
                        <p className="text-[10px] text-slate-400 uppercase font-extrabold">Road Approach</p>
                        <p className="text-white font-bold">12m Main Width</p>
                      </div>
                      <div className="space-y-0.5">
                        <p className="text-[10px] text-slate-400 uppercase font-extrabold">Soil Class</p>
                        <p className="text-emerald-400 font-bold">Red Loamy Soil</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* TAB 2: Soil Profile */}
                {activeTab === "geotech" && (
                  <div className="space-y-4 animate-fade-in">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                        <Compass className="h-4 w-4 text-indigo-400" /> Geotechnical Soil Strata Profile
                      </h4>
                      <select
                        value={soilUse}
                        onChange={(e) => setSoilUse(e.target.value)}
                        className="bg-slate-950 border border-slate-700/80 rounded-xl px-3 py-1 text-xs font-bold text-white focus:outline-none focus:border-indigo-500 cursor-pointer"
                      >
                        <option value="residential">Multi-story Residential (G+8)</option>
                        <option value="warehouse">Industrial Warehousing</option>
                        <option value="coconut">Coconut Plantation (Agri)</option>
                      </select>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
                      <div className="sm:col-span-4 h-56 bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden relative flex flex-col shrink-0 shadow-2xl">
                        <div className="h-[20%] bg-gradient-to-b from-amber-700 to-amber-800 border-b border-amber-900/40 relative flex items-center justify-center">
                          <span className="text-[8px] font-bold text-amber-100/80 absolute right-2 top-1">0m - 1.5m</span>
                          <span className="text-xs font-bold text-amber-50">Clay Topsoil</span>
                        </div>
                        <div className="h-[45%] bg-gradient-to-b from-amber-900/60 to-amber-950 border-b border-amber-800/40 relative flex items-center justify-center">
                          <span className="text-[8px] font-bold text-amber-300/80 absolute right-2 top-1">1.5m - 5m</span>
                          <span className="text-xs font-bold text-amber-200">Sandy Silt</span>
                          <div className="absolute top-[60%] left-0 right-0 border-t border-dashed border-sky-400 flex items-center justify-center">
                            <span className="text-[8px] font-black text-sky-300 bg-slate-900 px-1.5 rounded -mt-2">Water Table (4.2m)</span>
                          </div>
                        </div>
                        <div className="flex-grow bg-gradient-to-b from-slate-800 to-slate-900 relative flex items-center justify-center">
                          <span className="text-[8px] font-bold text-slate-400 absolute right-2 top-1">5m - 10m+</span>
                          <span className="text-xs font-bold text-slate-200">Hard Bedrock</span>
                        </div>
                      </div>

                      <div className="sm:col-span-8 space-y-3">
                        <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-2.5 text-xs font-semibold">
                          <div className="flex justify-between">
                            <span className="text-slate-400">Bearing Capacity (SBC):</span>
                            <span className="text-indigo-400 font-black text-sm">210 kN/m²</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-400">Suitability Match:</span>
                            <span className="text-emerald-400 bg-emerald-500/20 border border-emerald-500/40 px-3 py-0.5 rounded-full font-black text-xs">
                              92% (Excellent)
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-400">Foundation Strategy:</span>
                            <span className="text-white font-bold">Medium Pile / Raft Footing</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-400">Water Table Depth:</span>
                            <span className="text-sky-400 font-black">4.2 Meters</span>
                          </div>
                        </div>

                        <div className="p-3.5 bg-indigo-950/60 border border-indigo-500/30 rounded-2xl text-xs text-indigo-300 leading-relaxed font-semibold">
                          💡 SBC of 210 kN/m² is fully compliant for G+8 housing layout with raft foundations. Hard bedrock at 5m depth provides rock-solid structural support.
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* TAB 3: 3D Massing */}
                {activeTab === "3d" && (
                  <div className="space-y-4 animate-fade-in">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                        <Building className="h-4 w-4 text-indigo-400" /> 3D Massing & Floor Height Simulator
                      </h4>
                      <span className="text-xs font-extrabold text-emerald-400 bg-emerald-500/20 border border-emerald-500/40 px-3 py-1 rounded-full uppercase tracking-wider">
                        FSI Compliant
                      </span>
                    </div>

                    <div className="relative">
                      <svg viewBox="0 0 200 160" className="w-full h-56 sm:h-64 rounded-2xl bg-slate-950 border border-slate-800">
                        <defs>
                          <pattern id="grid3d_lg" width="20" height="20" patternUnits="userSpaceOnUse">
                            <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(99, 102, 241, 0.15)" strokeWidth="1" />
                          </pattern>
                        </defs>
                        <rect width="100%" height="100%" fill="url(#grid3d_lg)" />
                        
                        <polygon points="30,110 100,70 170,110 100,150" fill="rgba(99, 102, 241, 0.05)" stroke="#6366f1" strokeWidth="2" strokeDasharray="3 3" />
                        
                        {(() => {
                          const bWidth = 20 + (footprint / 100) * 35;
                          const bHeight = floors * 5.5;
                          const cx = 100;
                          const cy = 110;

                          const tX1 = cx;
                          const tY1 = cy - bHeight - bWidth * 0.4;
                          const tX2 = cx + bWidth;
                          const tY2 = cy - bHeight;
                          const tX3 = cx;
                          const tY3 = cy - bHeight + bWidth * 0.4;
                          const tX4 = cx - bWidth;
                          const tY4 = cy - bHeight;

                          const bX1 = cx;
                          const bY1 = cy - bWidth * 0.4;
                          const bX2 = cx + bWidth;
                          const bY2 = cy;
                          const bX3 = cx;
                          const bY3 = cy + bWidth * 0.4;
                          const bX4 = cx - bWidth;
                          const bY4 = cy;

                          return (
                            <g className="transition-all duration-300">
                              <polygon points={`${bX1},${bY1} ${bX2},${bY2} ${bX3},${bY3} ${bX4},${bY4}`} fill="rgba(0, 0, 0, 0.35)" />
                              <polygon points={`${bX4},${bY4} ${tX4},${tY4} ${tX1},${tY1} ${bX1},${bY1}`} fill="#4338ca" stroke="#6366f1" strokeWidth="1" />
                              <polygon points={`${bX1},${bY1} ${tX1},${tY1} ${tX2},${tY2} ${bX2},${bY2}`} fill="#312e81" stroke="#6366f1" strokeWidth="1" />
                              <polygon points={`${tX1},${tY1} ${tX2},${tY2} ${tX3},${tY3} ${tX4},${tY4}`} fill="#6366f1" stroke="#818cf8" strokeWidth="1" />
                            </g>
                          );
                        })()}
                        
                        <text x="10" y="20" fill="#94a3b8" fontSize="8" fontWeight="bold">Max Height Limit: G+10</text>
                        <text x="125" y="20" fill="#818cf8" fontSize="8" fontWeight="bold">FSI: {((footprint / 100) * floors).toFixed(2)} / 2.50</text>
                      </svg>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-xs font-bold uppercase tracking-wider text-slate-400">
                      <div className="space-y-2 bg-slate-950 p-3 rounded-2xl border border-slate-800">
                        <div className="flex justify-between text-white">
                          <span>Floor Height: G+{floors}</span>
                        </div>
                        <input type="range" min="1" max="10" step="1" value={floors} onChange={(e) => setFloors(Number(e.target.value))} className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500" />
                      </div>
                      <div className="space-y-2 bg-slate-950 p-3 rounded-2xl border border-slate-800">
                        <div className="flex justify-between text-white">
                          <span>Building Area: {footprint}%</span>
                        </div>
                        <input type="range" min="20" max="80" step="5" value={footprint} onChange={(e) => setFootprint(Number(e.target.value))} className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500" />
                      </div>
                    </div>
                  </div>
                )}

                {/* TAB 4: Growth Corridor */}
                {activeTab === "proximity" && (
                  <div className="space-y-4 animate-fade-in">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                        <TrendingUp className="h-4 w-4 text-indigo-400" /> Infrastructure Proximity Vectors
                      </h4>
                      <span className="text-xs font-extrabold text-emerald-400 bg-emerald-500/20 border border-emerald-500/40 px-3 py-1 rounded-full uppercase tracking-wider">
                        High-Growth Corridor
                      </span>
                    </div>

                    <div className="space-y-2.5">
                      {[
                        { name: "NH-48 Highway Bypass", dist: "1.2 km", status: "Under Construction", year: 2027, color: "text-amber-400 bg-amber-500/20 border-amber-500/40" },
                        { name: "Metro Phase 3 Station", dist: "2.4 km", status: "Approved Hub", year: 2029, color: "text-indigo-400 bg-indigo-500/20 border-indigo-500/40" },
                        { name: "IT Tech Park Corridor", dist: "3.5 km", status: "Operational", year: 2026, color: "text-emerald-400 bg-emerald-500/20 border-emerald-500/40" }
                      ].map((infra, idx) => {
                        const isActive = simulateYear >= infra.year;
                        return (
                          <div key={idx} className="flex justify-between items-center p-3.5 border border-slate-800 rounded-2xl bg-slate-950 text-xs font-bold">
                            <div>
                              <p className="text-white text-sm font-black">{infra.name}</p>
                              <p className="text-xs text-slate-400 font-semibold mt-0.5">Distance: {infra.dist}</p>
                            </div>
                            <span className={`text-xs font-extrabold px-3 py-1 rounded-full border \${isActive ? infra.color : "text-slate-500 bg-slate-900 border-slate-800"}`}>
                              {isActive ? infra.status : `Unannounced (Est: ${infra.year})`}
                            </span>
                          </div>
                        );
                      })}
                    </div>

                    <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2">
                      <div className="flex justify-between text-xs font-bold uppercase tracking-wider text-slate-400">
                        <span>Simulate Timeline: {simulateYear}</span>
                        <span className="text-emerald-400 font-black text-sm">
                          Est Value: ₹ {((property.price * (1 + (simulateYear - 2026) * 0.12)) / 10000000).toFixed(2)} Cr
                        </span>
                      </div>
                      <input type="range" min="2026" max="2032" step="1" value={simulateYear} onChange={(e) => setSimulateYear(Number(e.target.value))} className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500" />
                    </div>
                  </div>
                )}

                {/* TAB 5: Vetted Deeds */}
                {activeTab === "documents" && (
                  <div className="space-y-4 animate-fade-in">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                        <FileText className="h-4 w-4 text-indigo-400" /> Vetted Registry Documents
                      </h4>
                      <span className="text-xs font-extrabold text-emerald-400 bg-emerald-500/20 border border-emerald-500/40 px-3 py-1 rounded-full uppercase tracking-wider">
                        Verified Legal Title
                      </span>
                    </div>

                    <div className="space-y-3">
                      {[
                        { name: "Original Land Deed (Sale Deed/EC)", filename: property.landDeed || "Land_Deed_Certificate_EC.pdf", type: "Original Deed" },
                        { name: "Soil Quality & Geotech Audit", filename: property.soilReport || "Soil_Mechanics_Report_BH1.pdf", type: "Soil Report" },
                        { name: "Patta Chitta Registry Record", filename: property.pattaDocument || "Patta_Chitta_Government_Record.pdf", type: "Patta Record" }
                      ].map((doc, idx) => (
                        <div key={idx} className="flex justify-between items-center p-3.5 border border-slate-800 rounded-2xl bg-slate-950 gap-3">
                          <div>
                            <p className="text-white font-bold text-xs">{doc.name}</p>
                            <p className="text-[10px] text-slate-400 font-mono mt-0.5">{doc.filename}</p>
                          </div>
                          <div className="flex gap-2 shrink-0">
                            <button
                              type="button"
                              onClick={() => setVerifyingDoc(doc)}
                              className="px-3 py-2 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 border border-emerald-500/40 text-xs font-extrabold transition-all cursor-pointer shadow-sm"
                            >
                              Verify with TN Govt
                            </button>
                            <button 
                              type="button"
                              onClick={() => {
                                const docContent = `
==================================================
           LANDLINKX DOCUMENT DOWNLOAD
==================================================
Property ID: ${property.id}
Property Title: ${property.title}
Document Category: ${doc.type}
Reference Name: ${doc.filename}
Audit Hash: SHA256-${Math.floor(1000000 + Math.random() * 9000000)}
Verification Status: SUCCESSFUL & VETTED BY LANDLINKX
==================================================
`;
                                const blob = new Blob([docContent], { type: "text/plain" });
                                const url = URL.createObjectURL(blob);
                                const link = window.document.createElement("a");
                                link.href = url;
                                link.download = doc.filename;
                                link.click();
                              }}
                              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all cursor-pointer border-0 shadow-md shadow-indigo-600/30"
                            >
                              Download
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* TAB 6: TN Land Registry */}
                {activeTab === "tn_gov" && (
                  <div className="animate-fade-in space-y-4 max-h-[500px] overflow-y-auto pr-1">
                    <TNLandGovHub property={property} />
                  </div>
                )}

              </div>

              {/* Bottom Quick Stats */}
              <div className="pt-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400 font-bold shrink-0">
                <span>GIS Ref: 13.245° N, 77.712° E</span>
                <span className="text-emerald-400">Title Audit: 100% Cleared</span>
                <span>FSI Rating: 2.50 Max</span>
              </div>
            </div>

            {/* Right Column: Executive Deal Room & Bidding Studio (40% Width) */}
            <div className="w-full lg:w-5/12 p-6 flex flex-col justify-between bg-slate-950 text-white overflow-y-auto">
              
              <div className="space-y-6">
                
                {/* Price Display */}
                <div>
                  <span className="text-4xl font-black bg-gradient-to-r from-emerald-400 via-teal-300 to-indigo-400 bg-clip-text text-transparent tracking-tight">
                    ₹ {formattedPrice}
                  </span>
                  <h3 className="text-2xl font-black text-white mt-2 leading-snug">{property.title}</h3>
                  <p className="text-xs font-bold text-slate-400 mt-2 flex items-center gap-1.5">
                    <MapPin className="h-4 w-4 text-indigo-400 shrink-0" /> {property.location}
                  </p>
                </div>

                {/* Quick Attributes Badge Grid */}
                <div className="grid grid-cols-2 gap-2.5">
                  <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 text-center">
                    <p className="text-[10px] font-extrabold text-slate-400 uppercase">Plot Acreage</p>
                    <p className="text-base font-black text-white mt-0.5">10.0 Acres</p>
                  </div>
                  <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 text-center">
                    <p className="text-[10px] font-extrabold text-slate-400 uppercase">Permissible FSI</p>
                    <p className="text-base font-black text-indigo-400 mt-0.5">2.5 Limit</p>
                  </div>
                </div>

                <div className="h-px bg-slate-800"></div>

                {/* Description Box */}
                <div>
                  <h4 className="text-xs font-extrabold uppercase tracking-widest text-slate-400 mb-2">Executive Description</h4>
                  <p className="text-slate-300 text-xs leading-relaxed bg-slate-900/90 p-4 rounded-2xl border border-slate-800/90 font-medium">
                    {property.description}
                  </p>
                </div>

                <div className="h-px bg-slate-800"></div>

                {/* High-Tech Bidding Studio */}
                <div className="bg-gradient-to-br from-slate-900 to-slate-925 p-5 rounded-2xl border border-slate-800 space-y-4 shadow-2xl">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-400 flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-emerald-400" /> Enter Offer Bid
                    </span>
                    <span className="text-lg font-black text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-3.5 py-1 rounded-xl">
                      ₹ {new Intl.NumberFormat("en-IN").format(offerPrice)}
                    </span>
                  </div>
                  
                  <input
                    type="range"
                    min={property.price * 0.8}
                    max={property.price * 1.2}
                    step={50000}
                    value={offerPrice}
                    className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                    onChange={(e) => setOfferPrice(Number(e.target.value))}
                  />

                  <div className="flex justify-between text-[10px] text-slate-500 font-black uppercase tracking-wider">
                    <span>-20% MIN</span>
                    <span className="text-indigo-400 font-black">MARKET PRICE</span>
                    <span>+20% MAX</span>
                  </div>
                </div>

              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 mt-6 pt-4 border-t border-slate-800">
                <button
                  onClick={onOpenContact}
                  className="flex-grow py-4 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-black rounded-2xl border border-slate-700 transition-all cursor-pointer text-center"
                >
                  Contact Owner
                </button>
                
                <button
                  onClick={handleSubmitOffer}
                  disabled={submittingOffer}
                  className="flex-grow py-4 bg-gradient-to-r from-indigo-600 via-indigo-500 to-emerald-500 hover:opacity-95 text-white text-xs font-black rounded-2xl shadow-2xl shadow-indigo-600/40 transition-all cursor-pointer flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50 border-0"
                >
                  <Send className="h-4 w-4" /> 
                  {submittingOffer ? "Initiating Deal Room..." : "Submit Bid & Open Deal Room"}
                </button>
              </div>

            </div>

          </div>
        </div>

        {verifyingDoc && (
          <GovDocVerifierModal
            property={property}
            docItem={verifyingDoc}
            onClose={() => setVerifyingDoc(null)}
          />
        )}

        {showGISSatellite && (
          <GISSatelliteModal
            property={property}
            onClose={() => setShowGISSatellite(false)}
          />
        )}
      </>
    );
}
