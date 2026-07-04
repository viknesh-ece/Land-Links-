"use client";
import { MapPin, Phone, Heart, Trash2, ArrowUpRight, ShieldCheck, Mail, User, X, Layers, Compass, DollarSign, Send, Building, TrendingUp, FileText } from "lucide-react";
import { useState } from "react";
import ThreeDTilt from "@/components/ThreeDTilt";
export default function PropertyCard({ property }) {
    const [isSaved, setIsSaved] = useState(false);
    const [deleting, setDeleting] = useState(false);
    // Custom Modals State
    const [showContact, setShowContact] = useState(false);
    const [showDetails, setShowDetails] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
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
    // Get a high quality placeholder image based on property ID
    const fallbackImages = [
        "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=600&auto=format&fit=crop&q=60",
        "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=600&auto=format&fit=crop&q=60",
        "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=600&auto=format&fit=crop&q=60",
        "https://images.unsplash.com/photo-1502082553048-f009c37129b9?w=600&auto=format&fit=crop&q=60"
    ];
    const idStr = String(property.id);
    const hash = idStr.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const imageIndex = hash % fallbackImages.length;
    const imageUrl = property.image && property.image.startsWith("http")
        ? property.image
        : fallbackImages[imageIndex];
    // Formatter for price
    const formattedPrice = new Intl.NumberFormat("en-IN", {
        maximumFractionDigits: 0
    }).format(property.price);
    return (<><ThreeDTilt className="h-full">
      <div className="group bg-white/70 rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col h-full relative">
      
      {/* Property Image & Badges */}
      <div className="relative h-52 w-full overflow-hidden bg-slate-100">
        <img src={imageUrl} alt={property.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy"/>
        
        {/* Verified Badge */}
        <div className="absolute top-3 left-3 inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-500/95 text-white text-[10px] font-bold shadow-sm backdrop-blur-sm uppercase tracking-wider">
          <ShieldCheck className="h-3.5 w-3.5"/>
          <span>Vetted Title</span>
        </div>

        {/* Saved Heart Button */}
        <button onClick={() => setIsSaved(!isSaved)} className={`absolute top-3 right-3 h-8.5 w-8.5 rounded-lg flex items-center justify-center border transition-all cursor-pointer ${isSaved
            ? "bg-rose-600 border-rose-650 text-white scale-105"
            : "bg-white/85 border-slate-200 text-slate-650 hover:text-rose-500 hover:bg-white"}`}>
          <Heart className={`h-4.5 w-4.5 ${isSaved ? "fill-current" : ""}`}/>
        </button>
      </div>

      {/* Card Body */}
      <div className="p-5 flex flex-col flex-grow">
        
        {/* Price & Location Title */}
        <div className="flex items-start justify-between gap-2 mb-2">
          <span className="text-xl font-black text-indigo-600">
            ₹ {formattedPrice}
          </span>
          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-slate-500 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded-md">
            Parcel #{property.id}
          </span>
        </div>

        {/* Title */}
        <h3 className="text-base font-bold text-slate-800 group-hover:text-indigo-600 transition-colors line-clamp-1 mb-2">
          {property.title}
        </h3>

        {/* Location Text */}
        <div className="flex items-center gap-1 text-slate-500 text-xs font-semibold mb-3">
          <MapPin className="h-3.5 w-3.5 text-indigo-500 shrink-0"/>
          <span className="line-clamp-1">{property.location}</span>
        </div>

        {/* Description */}
        <p className="text-slate-600 font-medium text-xs leading-relaxed line-clamp-2 mb-5 flex-grow">
          {property.description}
        </p>

        {/* Action Buttons */}
        <div className="grid grid-cols-4 gap-2 pt-4 border-t border-slate-200">
          <button onClick={() => setShowDetails(true)} className="col-span-2 flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-lg bg-indigo-50 hover:bg-indigo-600 text-indigo-600 hover:text-white text-xs font-bold transition-all cursor-pointer border-0">
            Details
            <ArrowUpRight className="h-3.5 w-3.5"/>
          </button>

          <button onClick={() => setShowContact(true)} className="flex items-center justify-center rounded-lg bg-slate-55 hover:bg-emerald-50 text-slate-600 hover:text-emerald-600 border border-slate-200 hover:border-emerald-250 text-xs font-semibold py-2 px-2 transition-all cursor-pointer" title="Contact Owner">
            <Phone className="h-3.5 w-3.5"/>
          </button>

          <button onClick={() => setShowDeleteConfirm(true)} className="flex items-center justify-center rounded-lg bg-slate-55 hover:bg-rose-50 text-slate-600 hover:text-rose-600 border border-slate-200 hover:border-rose-250 text-xs font-semibold py-2 px-2 transition-all cursor-pointer" title="Delete Listing">
            <Trash2 className="h-3.5 w-3.5"/>
          </button>
        </div>

      </div>
      </div>
    </ThreeDTilt>

      {/* Modal 1: Details */}
      {showDetails && (<DetailsModal property={property} imageUrl={imageUrl} formattedPrice={formattedPrice} onClose={() => setShowDetails(false)} onOpenContact={() => { setShowDetails(false); setShowContact(true); }}/>)}
      {/* Modal 2: Contact Owner */}
      {showContact && (<div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-sm w-full p-6 shadow-2xl animate-scale-in relative">
            <button onClick={() => setShowContact(false)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer border-0 bg-transparent">
              <X className="h-5 w-5"/>
            </button>
            
            <div className="text-center mb-6">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 mb-3 border border-emerald-200">
                <Phone className="h-5 w-5"/>
              </div>
              <h3 className="text-lg font-bold text-slate-800">Direct Contact Details</h3>
              <p className="text-xs text-slate-500 font-semibold mt-1">Connect directly with the principal owner</p>
            </div>

            <div className="space-y-3 mb-6 bg-slate-50 p-4 rounded-2xl border border-slate-200">
              <div className="flex items-center gap-3">
                <User className="h-4 w-4 text-slate-500"/>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Representative</p>
                  <p className="text-sm font-bold text-slate-700">Rajesh Kumar (Owner)</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-slate-500"/>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Phone</p>
                  <p className="text-sm font-bold text-indigo-650">+91 98765 43210</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-slate-500"/>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Email</p>
                  <p className="text-sm font-bold text-slate-700">rajesh.kumar@example.com</p>
                </div>
              </div>
            </div>

            <button onClick={() => setShowContact(false)} className="w-full py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-bold rounded-xl transition-all border-0 cursor-pointer">
              Close
            </button>
          </div>
        </div>)}

      {/* Modal 3: Delete Confirmation */}
      {showDeleteConfirm && (<div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-sm w-full p-6 shadow-2xl animate-scale-in text-center">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-50 text-rose-600 mb-3 border border-rose-200">
              <Trash2 className="h-5 w-5"/>
            </div>
            <h3 className="text-lg font-bold text-slate-805">Remove Listing?</h3>
            <p className="text-xs text-slate-600 font-semibold mt-1 mb-6 px-4">
              Are you sure you want to delete &quot;{property.title}&quot;? This action is permanent and cannot be undone.
            </p>

            <div className="flex gap-3">
              <button onClick={() => setShowDeleteConfirm(false)} className="flex-1 py-3 border border-slate-200 text-slate-600 hover:bg-slate-50 text-sm font-bold rounded-xl transition-all cursor-pointer bg-transparent">
                Cancel
              </button>
              <button onClick={handleDelete} disabled={deleting} className="flex-1 py-3 bg-rose-600 hover:bg-rose-700 text-white text-sm font-bold rounded-xl transition-all cursor-pointer disabled:opacity-50 border-0">
                {deleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>)}
    </>);
}
function DetailsModal({ property, imageUrl, formattedPrice, onClose, onOpenContact }) {
    const [offerPrice, setOfferPrice] = useState(property.price);
    const [submittingOffer, setSubmittingOffer] = useState(false);
    const [activeTab, setActiveTab] = useState("gis");
    const [floors, setFloors] = useState(4);
    const [footprint, setFootprint] = useState(50);
    const [simulateYear, setSimulateYear] = useState(2026);
    const [soilUse, setSoilUse] = useState("residential");
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
    return (<div className="fixed inset-0 bg-slate-900/50 backdrop-blur-md z-50 flex items-center justify-center p-4 overflow-y-auto animate-fade-in">
      <div className="bg-white border border-slate-200 rounded-3xl max-w-4xl w-full overflow-hidden shadow-2xl animate-scale-in flex flex-col md:flex-row">
        
        {/* Left Column: Interactive Tabbed Specifications Panel */}
        <div className="w-full md:w-1/2 p-6 border-b md:border-b-0 md:border-r border-slate-200 flex flex-col gap-4 min-h-[380px]">
          
          {/* Tab Navigation */}
          <div className="flex border-b border-slate-200 pb-2 mb-1 gap-1 overflow-x-auto shrink-0">
            {[
            { id: "gis", label: "GIS Map" },
            { id: "geotech", label: "Soil Report" },
            { id: "3d", label: "3D Site" },
            { id: "proximity", label: "Growth Trend" },
            { id: "documents", label: "Vetted Documents" }
        ].map(tab => (<button key={tab.id} type="button" onClick={() => setActiveTab(tab.id)} className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider border transition-all cursor-pointer whitespace-nowrap ${activeTab === tab.id
                ? "bg-indigo-50 border-indigo-200 text-indigo-650 font-bold"
                : "border-transparent text-slate-500 hover:text-slate-805"}`}>
                {tab.label}
              </button>))}
          </div>
          {/* TAB 1: GIS Map */}
          {activeTab === "gis" && (<div className="flex-grow flex flex-col gap-3 animate-fade-in">
              <div className="relative h-32 rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 shrink-0">
                <img src={imageUrl} alt={property.title} className="w-full h-full object-cover opacity-60"/>
                <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent"></div>
                <div className="absolute bottom-3 left-3 flex items-center gap-1 bg-white/80 backdrop-blur-md px-2.5 py-1 rounded-lg border border-slate-200 text-[10px] font-bold text-slate-700">
                  <Layers className="h-3.5 w-3.5 text-indigo-600"/>
                  <span>GIS Satellite Overlay</span>
                </div>
              </div>

              <div className="flex-grow flex flex-col gap-2.5">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1">
                    <Compass className="h-4 w-4 text-indigo-500"/> Boundary dimensions
                  </h4>
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-250 px-2 py-0.5 rounded">
                    Cleared Deeds
                  </span>
                </div>

                {/* Custom SVG GIS Map */}
                <svg viewBox="0 0 200 200" className="w-full h-36 rounded-xl bg-slate-50 border border-slate-200 relative overflow-hidden">
                  <defs>
                    <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                      <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(99, 102, 241, 0.08)" strokeWidth="1"/>
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#grid)"/>
                  <circle cx="100" cy="100" r="80" fill="none" stroke="rgba(99, 102, 241, 0.1)" strokeWidth="1" strokeDasharray="2 2"/>
                  <polygon points="45,45 155,35 135,145 55,125" fill="rgba(99, 102, 241, 0.05)" stroke="#4f46e5" strokeWidth="2" strokeLinejoin="round"/>
                  <circle cx="100" cy="85" r="4" fill="#10b981"/>
                  <circle cx="100" cy="85" r="8" fill="none" stroke="#10b981" strokeWidth="1" className="animate-pulse"/>
                  <text x="110" y="88" fill="#10b981" fontSize="8" fontWeight="bold">Survey Pt #402</text>
                  <text x="85" y="28" fill="#818cf8" fontSize="7" fontWeight="bold">110m (North)</text>
                  <text x="145" y="90" fill="#818cf8" fontSize="7" fontWeight="bold">115m (East)</text>
                  <text x="80" y="142" fill="#818cf8" fontSize="7" fontWeight="bold">80m (South)</text>
                  <text x="15" y="90" fill="#818cf8" fontSize="7" fontWeight="bold">95m (West)</text>
                </svg>

                {/* GIS details list */}
                <div className="grid grid-cols-2 gap-2 text-xs font-semibold text-slate-705 bg-slate-50/80 p-2.5 rounded-xl border border-slate-200">
                  <div className="flex items-center gap-1">
                    <span className="text-slate-500">Zoning:</span>
                    <span className="text-slate-800">Residential Sector 4</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-slate-500">FSI Max:</span>
                    <span className="text-slate-800">2.5 Limit</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-slate-500">Road Width:</span>
                    <span className="text-slate-800">12m Approach</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-slate-500">Soil:</span>
                    <span className="text-slate-800">Red Loamy Soil</span>
                  </div>
                </div>
              </div>
            </div>)}

          {/* TAB 2: Geotech Soil Analyzer */}
          {activeTab === "geotech" && (<div className="flex-grow flex flex-col gap-3 animate-fade-in">
              <div className="flex justify-between items-center">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1">
                  <Compass className="h-4 w-4 text-indigo-500"/> Geotechnical soil profile
                </h4>
                <span className="text-[10px] font-bold text-indigo-650 bg-indigo-50 border border-indigo-200 px-2 py-0.5 rounded">
                  Borehole BH-1 Vetted
                </span>
              </div>

              {/* Crop & Construction Suitability Select */}
              <div className="shrink-0 bg-slate-50 p-2.5 rounded-xl border border-slate-200/60">
                <label className="block text-[9px] font-bold uppercase tracking-wider text-slate-500 mb-1">Select Analysis Category</label>
                <select
                  value={soilUse}
                  onChange={(e) => setSoilUse(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1 text-xs font-bold text-slate-800 focus:outline-none focus:border-indigo-500 cursor-pointer"
                >
                  <option value="residential">Multi-story Residential (G+8)</option>
                  <option value="warehouse">Industrial Warehousing</option>
                  <option value="coconut">Coconut Plantation (Agri)</option>
                  <option value="paddy">Paddy Cultivation (Agri)</option>
                </select>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 flex-grow items-center">
                {/* Vertical Soil Diagram */}
                <div className="sm:col-span-4 h-48 bg-slate-100 rounded-xl border border-slate-200 overflow-hidden relative flex flex-col shrink-0">
                  {/* Clay Topsoil: 0 - 1.5m */}
                  <div className="h-[20%] bg-gradient-to-b from-amber-700 to-amber-800 border-b border-amber-800/10 relative flex items-center justify-center">
                    <span className="text-[7px] font-bold text-amber-100/80 absolute right-1.5 top-0.5">0m - 1.5m</span>
                    <span className="text-[9px] font-semibold text-amber-50">Clay Topsoil</span>
                  </div>
                  {/* Sandy Silt: 1.5m - 5m */}
                  <div className="h-[45%] bg-gradient-to-b from-amber-200 to-amber-300 border-b border-amber-400/10 relative flex items-center justify-center">
                    <span className="text-[7px] font-bold text-slate-600/80 absolute right-1.5 top-0.5">1.5m - 5m</span>
                    <span className="text-[9px] font-semibold text-slate-800">Sandy Silt</span>
                    {/* Water table line */}
                    <div className="absolute top-[60%] left-0 right-0 border-t border-dashed border-sky-500/80 flex items-center justify-center">
                      <span className="text-[7px] font-bold text-sky-600 bg-white px-1 rounded -mt-2">Water Table (4.2m)</span>
                    </div>
                  </div>
                  {/* Bedrock: 5m - 10m */}
                  <div className="flex-grow bg-gradient-to-b from-slate-300 to-slate-400 relative flex items-center justify-center">
                    <span className="text-[7px] font-bold text-slate-650 absolute right-1.5 top-0.5">5m - 10m+</span>
                    <span className="text-[9px] font-semibold text-slate-800">Hard Bedrock</span>
                  </div>
                </div>
 
                {/* Soil parameters */}
                <div className="sm:col-span-8 space-y-2">
                  <div className="p-3 bg-slate-50/80 rounded-xl border border-slate-200 space-y-1.5 text-xs font-semibold text-slate-700">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Bearing Capacity (SBC):</span>
                      <span className="text-indigo-650 font-bold">210 kN/m²</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Suitability Index:</span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${
                        soilUse === "residential" || soilUse === "warehouse"
                          ? "text-emerald-700 bg-emerald-50 border border-emerald-150"
                          : soilUse === "coconut"
                          ? "text-indigo-700 bg-indigo-50 border border-indigo-150"
                          : "text-rose-700 bg-rose-50 border border-rose-150"
                      }`}>
                        {soilUse === "residential" ? "92% (Excellent)" : soilUse === "warehouse" ? "95% (Excellent)" : soilUse === "coconut" ? "74% (Good)" : "35% (Unsuitable)"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Foundation Strategy:</span>
                      <span className="text-slate-800 font-bold">
                        {soilUse === "residential" ? "Medium Pile / Raft" : soilUse === "warehouse" ? "Isolated Strip Footing" : "N/A (Sandy Topsoil)"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Water Table Depth:</span>
                      <span className="text-sky-655 font-bold">4.2 Meters</span>
                    </div>
                  </div>
 
                  <div className="p-2.5 bg-indigo-50 border border-indigo-200 rounded-xl">
                    <p className="text-[10px] text-indigo-700 leading-relaxed font-semibold">
                      💡 {soilUse === "residential"
                        ? "SBC of 210 kN/m² is fully compliant for G+8 housing layout with raft foundations."
                        : soilUse === "warehouse"
                        ? "High SBC bedrock at 5m provides exceptional support for heavy industrial machinery storage loads."
                        : soilUse === "coconut"
                        ? "Sandy topsoil allows decent aeration for deep roots. Water table at 4.2m is optimal for tree growth."
                        : "Water table at 4.2m is too deep. Sandy topsoil fails to retain standing surface water needed for paddy."
                      }
                    </p>
                  </div>
                </div>
              </div>
            </div>)}

          {/* TAB 3: 3D Site Plan Visualizer */}
          {activeTab === "3d" && (<div className="flex-grow flex flex-col gap-3 animate-fade-in">
              <div className="flex justify-between items-center">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1">
                  <Building className="h-4 w-4 text-indigo-500"/> 3D Site Plan visualizer
                </h4>
                {((footprint / 100) * floors) > 2.5 ? (<span className="text-[10px] font-bold text-rose-700 bg-rose-50 border border-rose-250 px-2 py-0.5 rounded flex items-center gap-1">
                    FSI Exceeded
                  </span>) : (<span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-250 px-2 py-0.5 rounded flex items-center gap-1">
                    FSI Compliant
                  </span>)}
              </div>

              {/* 3D Isometric SVG */}
              <div className="relative">
                <svg viewBox="0 0 200 160" className="w-full h-36 rounded-xl bg-slate-50 border border-slate-200">
                  <defs>
                    <pattern id="grid3d" width="20" height="20" patternUnits="userSpaceOnUse">
                      <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(99, 102, 241, 0.08)" strokeWidth="1"/>
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#grid3d)"/>
                  
                  {/* Lot Boundary (Isometric projection coordinates) */}
                  <polygon points="30,110 100,70 170,110 100,150" fill="rgba(0,0,0,0.01)" stroke="#cbd5e1" strokeWidth="1.5" strokeDasharray="3 3"/>
                  
                  {/* Isometric Building representation based on sliders */}
                  {(() => {
                const bWidth = 20 + (footprint / 100) * 35; // scales building footprint
                const bHeight = floors * 5.5; // scales height
                const cx = 100;
                const cy = 110;
                // Coordinates of building top face
                const tX1 = cx;
                const tY1 = cy - bHeight - bWidth * 0.4;
                const tX2 = cx + bWidth;
                const tY2 = cy - bHeight;
                const tX3 = cx;
                const tY3 = cy - bHeight + bWidth * 0.4;
                const tX4 = cx - bWidth;
                const tY4 = cy - bHeight;
                // Coordinates of building bottom face
                const bX1 = cx;
                const bY1 = cy - bWidth * 0.4;
                const bX2 = cx + bWidth;
                const bY2 = cy;
                const bX3 = cx;
                const bY3 = cy + bWidth * 0.4;
                const bX4 = cx - bWidth;
                const bY4 = cy;
                return (<g className="transition-all duration-300">
                        {/* Shadow on ground */}
                        <polygon points={`${bX1},${bY1} ${bX2},${bY2} ${bX3},${bY3} ${bX4},${bY4}`} fill="rgba(0, 0, 0, 0.15)"/>
                        
                        {/* Left wall */}
                        <polygon points={`${bX4},${bY4} ${tX4},${tY4} ${tX1},${tY1} ${bX1},${bY1}`} fill="#312e81" stroke="#4f46e5" strokeWidth="0.5"/>
                        
                        {/* Right wall */}
                        <polygon points={`${bX1},${bY1} ${tX1},${tY1} ${tX2},${tY2} ${bX2},${bY2}`} fill="#1e1b4b" stroke="#4f46e5" strokeWidth="0.5"/>
                        
                        {/* Top roof */}
                        <polygon points={`${tX1},${tY1} ${tX2},${tY2} ${tX3},${tY3} ${tX4},${tY4}`} fill="#4338ca" stroke="#818cf8" strokeWidth="0.5"/>
                      </g>);
            })()}
                  
                  {/* Labels */}
                  <text x="10" y="16" fill="#64748b" fontSize="6.5" fontWeight="bold">Max Height Limit: G+10</text>
                  <text x="135" y="16" fill="#4f46e5" fontSize="6.5" fontWeight="bold">FSI: {((footprint / 100) * floors).toFixed(2)} / 2.50</text>
                </svg>
              </div>

              {/* Visualizer Sliders */}
              <div className="grid grid-cols-2 gap-4 text-[9px] font-bold uppercase tracking-wider text-slate-500">
                <div className="space-y-1.5">
                  <div className="flex justify-between">
                    <span>Floor Height: G+{floors}</span>
                  </div>
                  <input type="range" min="1" max="10" step="1" value={floors} onChange={(e) => setFloors(Number(e.target.value))} className="w-full h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"/>
                </div>
                <div className="space-y-1.5">
                  <div className="flex justify-between">
                    <span>Building Area: {footprint}%</span>
                  </div>
                  <input type="range" min="20" max="80" step="5" value={footprint} onChange={(e) => setFootprint(Number(e.target.value))} className="w-full h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"/>
                </div>
              </div>
            </div>)}

          {/* TAB 4: Growth Corridor Proximity */}
          {activeTab === "proximity" && (<div className="flex-grow flex flex-col gap-3 animate-fade-in">
              <div className="flex justify-between items-center">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1">
                  <TrendingUp className="h-4 w-4 text-indigo-500"/> Infrastructure proximity
                </h4>
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-250 px-2 py-0.5 rounded">
                  High-Growth Zone
                </span>
              </div>

              {/* Infrastructure items */}
              <div className="space-y-2 max-h-36 overflow-y-auto pr-1">
                {[
                { name: "NH-48 Highway Bypass", dist: "1.2 km", status: "Under Construction", year: 2027, color: "text-amber-700 bg-amber-50 border-amber-200" },
                { name: "Metro Phase 3 Station", dist: "2.4 km", status: "Approved Hub", year: 2029, color: "text-indigo-700 bg-indigo-50 border-indigo-200" },
                { name: "IT Tech Park Corridor", dist: "3.5 km", status: "Operational", year: 2026, color: "text-emerald-700 bg-emerald-50 border-emerald-250" }
            ].map((infra, idx) => {
                const isActive = simulateYear >= infra.year;
                return (<div key={idx} className="flex justify-between items-center p-2.5 border border-slate-200 rounded-xl bg-slate-50/80 text-xs font-bold">
                      <div>
                        <p className="text-slate-800">{infra.name}</p>
                        <p className="text-[9px] text-slate-550 font-semibold">Distance: {infra.dist}</p>
                      </div>
                      <span className={`text-[9px] px-2 py-0.5 rounded border ${isActive ? infra.color : "text-slate-500 bg-slate-100 border-slate-200"}`}>
                        {isActive ? infra.status : `Unannounced (Est: ${infra.year})`}
                      </span>
                    </div>);
            })}
              </div>

              {/* appreciation simulation slider */}
              <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200 space-y-1.5">
                <div className="flex justify-between text-[9px] font-bold uppercase tracking-wider text-slate-500">
                  <span>Simulate Timeline: {simulateYear}</span>
                  <span className="text-emerald-650 font-black">
                    Est Value: ₹ {((property.price * (1 + (simulateYear - 2026) * 0.12)) / 10000000).toFixed(2)} Cr
                  </span>
                </div>
                <input type="range" min="2026" max="2032" step="1" value={simulateYear} onChange={(e) => setSimulateYear(Number(e.target.value))} className="w-full h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"/>
              </div>
            </div>)}

          {/* TAB 5: Vetted Documents */}
          {activeTab === "documents" && (
            <div className="flex-grow flex flex-col gap-3.5 animate-fade-in text-xs font-semibold text-slate-705">
              <div className="flex justify-between items-center shrink-0">
                <h4 className="text-[10px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                  <FileText className="h-4 w-4 text-indigo-500"/> Vetted Registry Documents
                </h4>
                <span className="text-[9px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-250 px-2 py-0.5 rounded uppercase tracking-wider">
                  Verified Legal Title
                </span>
              </div>

              <div className="space-y-2.5 max-h-48 overflow-y-auto pr-1 flex-grow">
                {[
                  { name: "Original Land Deed (Sale Deed/EC)", filename: property.landDeed || "Land_Deed_Certificate_EC.pdf", type: "Original Deed" },
                  { name: "Soil Quality & Geotech Audit", filename: property.soilReport || "Soil_Mechanics_Report_BH1.pdf", type: "Soil Report" },
                  { name: "Patta Chitta Registry Record", filename: property.pattaDocument || "Patta_Chitta_Government_Record.pdf", type: "Patta Record" }
                ].map((doc, idx) => (
                    <div key={idx} className="flex justify-between items-center p-3 border border-slate-200 rounded-xl bg-slate-50/80">
                      <div>
                        <p className="text-slate-800 font-bold text-xs">{doc.name}</p>
                        <p className="text-[9.5px] text-slate-500 font-mono mt-0.5">{doc.filename}</p>
                      </div>
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
                          const link = document.createElement("a");
                          link.href = url;
                          link.download = doc.filename;
                          link.click();
                        }}
                        className="px-3 py-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-650 text-indigo-650 hover:text-white border border-indigo-200 text-[10px] font-bold transition-all cursor-pointer border-0"
                      >
                        Download
                      </button>
                    </div>
                  ))}
              </div>
            </div>
          )}

        </div>

        {/* Right Column: details content and bidding panel */}
        <div className="w-full md:w-1/2 p-6 flex flex-col justify-between relative">
          <button onClick={onClose} className="absolute top-4 right-4 h-8 w-8 rounded-full bg-slate-100 text-slate-500 hover:text-slate-800 flex items-center justify-center hover:bg-slate-200 transition-all cursor-pointer border border-slate-200">
            <X className="h-4 w-4"/>
          </button>

          <div className="space-y-4">
            <div>
              <span className="text-2xl font-black text-indigo-600">₹ {formattedPrice}</span>
              <h3 className="text-xl font-bold text-slate-900 mt-1">{property.title}</h3>
              <p className="text-xs text-slate-500 font-semibold mt-1 flex items-center gap-1">
                <MapPin className="h-3.5 w-3.5 text-indigo-500"/> {property.location}
              </p>
            </div>

            <div className="h-px bg-slate-200"></div>

            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">Description</h4>
              <p className="text-slate-650 text-xs leading-relaxed max-h-24 overflow-y-auto">
                {property.description}
              </p>
            </div>

            <div className="h-px bg-slate-200"></div>

            {/* Bidding panel */}
            <div className="bg-slate-50/80 p-4 rounded-2xl border border-slate-200 space-y-3.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-505 flex items-center gap-1">
                  <DollarSign className="h-4 w-4 text-indigo-600"/> Enter Offer Bid
                </span>
                <span className="text-xs font-black text-indigo-650">
                  ₹ {new Intl.NumberFormat("en-IN").format(offerPrice)}
                </span>
              </div>
              <input type="range" min={property.price * 0.8} max={property.price * 1.2} step={50000} value={offerPrice} className="w-full h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600" onChange={(e) => setOfferPrice(Number(e.target.value))}/>
              <div className="flex justify-between text-[9px] text-slate-500 font-bold uppercase tracking-wider">
                <span>-20% min</span>
                <span>Market Price</span>
                <span>+20% max</span>
              </div>
            </div>
          </div>

          <div className="flex gap-2.5 mt-6">
            <button onClick={onOpenContact} className="flex-grow py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl border border-slate-200 transition-all cursor-pointer text-center">
              Contact Agent
            </button>
            <button onClick={handleSubmitOffer} disabled={submittingOffer} className="flex-grow py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-lg shadow-indigo-600/10 transition-all cursor-pointer flex items-center justify-center gap-1.5 active:scale-95 disabled:opacity-50 border-0">
              <Send className="h-3.5 w-3.5"/> 
              {submittingOffer ? "Initiating Chat..." : "Submit Bid"}
            </button>
          </div>

        </div>

      </div>
    </div>);
}
