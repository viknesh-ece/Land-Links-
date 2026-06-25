"use client";

import Navbar from "@/components/Navbar";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { 
  Building, 
  MapPin, 
  Sparkles, 
  ArrowRight, 
  ArrowLeft, 
  CheckCircle2, 
  FileText, 
  UploadCloud, 
  Map, 
  HelpCircle,
  TrendingUp,
  Droplets,
  Compass
} from "lucide-react";

export default function CreatePropertyPage() {
  const router = useRouter();
  
  // Wizard steps: 1 = Basic Info, 2 = Attributes, 3 = GIS Boundary, 4 = Legal Audit
  const [step, setStep] = useState(1);
  const [gisPoints, setGisPoints] = useState<{ x: number; y: number }[]>([]);
  const [scanState, setScanState] = useState<"idle" | "scanning" | "completed">("idle");
  const [scanProgress, setScanProgress] = useState(0);
  const [scanText, setScanText] = useState("Idle");
  
  const [form, setForm] = useState({
    title: "",
    description: "",
    price: "",
    location: "",
    image: "",
    acres: "",
    zoning: "Residential",
    roadWidth: "",
    waterSource: "Borewell",
    deedVerified: false
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const nextStep = () => {
    if (step === 1) {
      if (!form.title || !form.description || !form.price || !form.location) {
        setError("Please complete all basic fields.");
        return;
      }
    }
    if (step === 2) {
      if (!form.acres || Number(form.acres) <= 0) {
        setError("Please specify a valid acreage size.");
        return;
      }
    }
    if (step === 3) {
      if (gisPoints.length < 3) {
        setError("Please click on the grid to map your land boundary polygon (minimum 3 coordinates).");
        return;
      }
    }
    setError("");
    setStep(step + 1);
  };

  const prevStep = () => {
    setError("");
    setStep(step - 1);
  };

  const handleCreate = async () => {
    setLoading(true);
    setError("");
    try {
      const boundaryStr = gisPoints.map(p => `(${p.x},${p.y})`).join("->");
      const res = await fetch("/api/properties", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: form.title,
          description: `${form.description} | Size: ${form.acres} Acres, Zoning: ${form.zoning}, Access: ${form.roadWidth}m Road, Water: ${form.waterSource} | Coordinates: [${boundaryStr}]`,
          price: Number(form.price),
          location: form.location,
          image: form.image || "placeholder.jpg"
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setSubmitted(true);
        setTimeout(() => {
          router.push("/listings");
        }, 2000);
      } else {
        setError(data.message || "Failed to list property");
      }
    } catch (err) {
      console.error(err);
      setError("Server error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-slate-100 flex flex-col font-sans">
      <Navbar />

      <main className="flex-grow flex items-center justify-center p-4 py-12 relative overflow-hidden">
        {/* Decorative glows */}
        <div className="absolute top-0 right-1/4 w-[400px] h-[400px] bg-indigo-600/10 rounded-full blur-3xl pointer-events-none animate-pulse-slow"></div>
        <div className="absolute bottom-0 left-1/4 w-[400px] h-[400px] bg-sky-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="w-full max-w-2xl bg-[#090d16]/75 backdrop-blur-xl border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-2xl relative z-10">
          
          {submitted ? (
            <div className="text-center py-12 space-y-6 animate-in zoom-in-95 duration-200">
              <div className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-emerald-950/40 text-emerald-450 border border-emerald-900/50 mb-2">
                <CheckCircle2 className="h-10 w-10 animate-bounce" />
              </div>
              <h2 className="text-2xl font-black text-white">Property Listed Successfully!</h2>
              <p className="text-slate-400 font-semibold max-w-sm mx-auto leading-relaxed">
                Your land parcel details have been cataloged in the LandLinkX directory. Redirecting you to listings...
              </p>
            </div>
          ) : (
            <div>
              {/* Header */}
              <div className="mb-8">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-xs font-bold text-indigo-400 uppercase tracking-widest">Step {step} of 4</span>
                  <span className="h-2 w-32 bg-slate-800 rounded-full overflow-hidden">
                    <span 
                      className="h-full bg-indigo-500 block transition-all duration-300"
                      style={{ width: `${(step / 4) * 100}%` }}
                    ></span>
                  </span>
                </div>
                <h1 className="text-2xl font-black text-white">List Your Land Parcel</h1>
                <p className="text-slate-400 font-semibold text-xs mt-1">Publish verified specs directly to builders and investors.</p>
              </div>

              {error && (
                <div className="mb-6 p-4 rounded-2xl bg-rose-955/30 border border-rose-900/50 text-rose-400 text-xs font-bold flex gap-2">
                  <HelpCircle className="h-4 w-4 shrink-0 text-rose-500" />
                  <span>{error}</span>
                </div>
              )}

              {/* STEP 1: Basic Info */}
              {step === 1 && (
                <div className="space-y-4 animate-in fade-in duration-200">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">Property Title</label>
                    <input
                      type="text"
                      placeholder="e.g. 5 Acres Commercial land near IT corridor"
                      value={form.title}
                      className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-850 focus:outline-none focus:ring-2 focus:ring-indigo-500/15 focus:border-indigo-500 text-sm font-semibold text-white placeholder:text-slate-600"
                      onChange={(e) => setForm({ ...form, title: e.target.value })}
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">Region / Location Address</label>
                    <div className="relative">
                      <MapPin className="h-4.5 w-4.5 text-indigo-400 absolute left-3 top-3.5" />
                      <input
                        type="text"
                        placeholder="e.g. Whitefield, Bangalore"
                        value={form.location}
                        className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-950 border border-slate-850 focus:outline-none focus:ring-2 focus:ring-indigo-500/15 focus:border-indigo-500 text-sm font-semibold text-white placeholder:text-slate-600"
                        onChange={(e) => setForm({ ...form, location: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">Expected Price (₹)</label>
                      <input
                        type="number"
                        placeholder="e.g. 45000000"
                        value={form.price}
                        className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-850 focus:outline-none focus:ring-2 focus:ring-indigo-500/15 focus:border-indigo-500 text-sm font-semibold text-white placeholder:text-slate-600"
                        onChange={(e) => setForm({ ...form, price: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">Land Size (Acres)</label>
                      <input
                        type="number"
                        step="0.01"
                        placeholder="e.g. 2.5"
                        value={form.acres}
                        className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-850 focus:outline-none focus:ring-2 focus:ring-indigo-500/15 focus:border-indigo-500 text-sm font-semibold text-white placeholder:text-slate-600"
                        onChange={(e) => setForm({ ...form, acres: e.target.value })}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">Property Description</label>
                    <textarea
                      placeholder="Detail soil depth, zoning modification history, nearby national highways, water resources..."
                      rows={4}
                      value={form.description}
                      className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-850 focus:outline-none focus:ring-2 focus:ring-indigo-500/15 focus:border-indigo-500 text-sm font-semibold text-white placeholder:text-slate-600"
                      onChange={(e) => setForm({ ...form, description: e.target.value })}
                    />
                  </div>
                </div>
              )}

              {/* STEP 2: Land Attributes */}
              {step === 2 && (
                <div className="space-y-5 animate-in fade-in duration-200">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2.5">Zoning Permitted Class</label>
                    <div className="grid grid-cols-2 gap-3">
                      {["Residential", "Commercial", "Industrial", "Agricultural"].map((zone) => (
                        <button
                          key={zone}
                          type="button"
                          onClick={() => setForm({ ...form, zoning: zone })}
                          className={`flex items-center gap-3 p-4 rounded-xl border text-left transition-all cursor-pointer ${
                            form.zoning === zone
                              ? "border-indigo-550 bg-indigo-950/40 text-indigo-300 font-bold"
                              : "border-slate-800 bg-slate-950/40 hover:border-slate-700 text-slate-400"
                          }`}
                        >
                          <Building className="h-5 w-5 text-indigo-400" />
                          <span className="text-xs">{zone}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">Road Access Width (m)</label>
                      <div className="relative">
                        <Compass className="h-4.5 w-4.5 text-slate-500 absolute left-3 top-3.5" />
                        <input
                          type="number"
                          placeholder="e.g. 12"
                          value={form.roadWidth}
                          className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-950 border border-slate-850 focus:outline-none focus:ring-2 focus:ring-indigo-500/15 focus:border-indigo-500 text-sm font-semibold text-white placeholder:text-slate-600"
                          onChange={(e) => setForm({ ...form, roadWidth: e.target.value })}
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">Water Resource Source</label>
                      <div className="relative">
                        <Droplets className="h-4.5 w-4.5 text-indigo-450 absolute left-3 top-3.5" />
                        <select
                          value={form.waterSource}
                          onChange={(e) => setForm({ ...form, waterSource: e.target.value })}
                          className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-950 border border-slate-850 focus:outline-none focus:ring-2 focus:ring-indigo-500/15 focus:border-indigo-500 text-sm font-bold text-slate-200 cursor-pointer appearance-none"
                        >
                          <option value="Borewell" className="bg-slate-950 text-white">Borewell Infrastructure</option>
                          <option value="Canal / River" className="bg-slate-950 text-white">Canal / River Access</option>
                          <option value="Municipal Water" className="bg-slate-950 text-white">Municipal Line</option>
                          <option value="None" className="bg-slate-950 text-white">None (Needs Drilling)</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 3: GIS Boundary Tracer */}
              {step === 3 && (
                <div className="space-y-4 animate-in fade-in duration-200">
                  <div className="flex justify-between items-center">
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Interactive Boundary GIS Polygon Drawer
                    </label>
                    <button
                      type="button"
                      onClick={() => setGisPoints([])}
                      className="text-xs font-bold text-indigo-405 hover:text-indigo-300 cursor-pointer"
                    >
                      Clear Coordinates
                    </button>
                  </div>
                  
                  <div className="relative">
                    <svg 
                      viewBox="0 0 300 200" 
                      className="w-full h-56 rounded-2xl bg-slate-950 border border-slate-855 cursor-crosshair relative overflow-hidden"
                      onClick={(e) => {
                        const rect = e.currentTarget.getBoundingClientRect();
                        const x = Math.round(((e.clientX - rect.left) / rect.width) * 300);
                        const y = Math.round(((e.clientY - rect.top) / rect.height) * 200);
                        setGisPoints(prev => [...prev, { x, y }]);
                      }}
                    >
                      <defs>
                        <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                          <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(255,255,255,0.03)" stroke-width="1"/>
                        </pattern>
                      </defs>
                      <rect width="100%" height="100%" fill="url(#grid)" />
                      
                      {gisPoints.length > 0 && (
                        <>
                          {gisPoints.length >= 3 && (
                            <polygon 
                              points={gisPoints.map(p => `${p.x},${p.y}`).join(" ")} 
                              fill="rgba(99, 102, 241, 0.15)" 
                              stroke="none" 
                            />
                          )}
                          
                          {gisPoints.map((p, idx) => {
                            if (idx === 0) return null;
                            const prev = gisPoints[idx - 1];
                            return (
                              <line 
                                key={idx} 
                                x1={prev.x} 
                                y1={prev.y} 
                                x2={p.x} 
                                y2={p.y} 
                                stroke="#6366f1" 
                                strokeWidth="2" 
                              />
                            );
                          })}
                          
                          {gisPoints.length >= 3 && (
                            <line 
                              x1={gisPoints[gisPoints.length - 1].x} 
                              y1={gisPoints[gisPoints.length - 1].y} 
                              x2={gisPoints[0].x} 
                              y2={gisPoints[0].y} 
                              stroke="#6366f1" 
                              strokeWidth="2" 
                              strokeDasharray="4 4"
                            />
                          )}
                          
                          {gisPoints.map((p, idx) => (
                            <g key={idx}>
                              <circle 
                                cx={p.x} 
                                cy={p.y} 
                                r="5" 
                                fill={idx === 0 ? "#10b981" : "#6366f1"} 
                                stroke="#000" 
                                strokeWidth="1" 
                              />
                              <text 
                                x={p.x + 8} 
                                y={p.y + 4} 
                                fill="#818cf8" 
                                fontSize="7" 
                                fontWeight="bold"
                              >
                                V{idx + 1} ({p.x}, {p.y})
                              </text>
                            </g>
                          ))}
                        </>
                      )}
                      
                      {gisPoints.length === 0 && (
                        <g>
                          <text x="50%" y="45%" textAnchor="middle" fill="#475569" fontSize="11" fontWeight="bold">
                            Click inside the grid to plot vertices
                          </text>
                          <text x="50%" y="55%" textAnchor="middle" fill="#334155" fontSize="9" fontWeight="semibold">
                            Trace the boundary path of your land lot
                          </text>
                        </g>
                      )}
                    </svg>
                  </div>
                  
                  <div className="bg-[#090d16] border border-slate-900 rounded-2xl p-4">
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Calculated Specifications</span>
                      <span className="text-xs font-black text-indigo-400">
                        {gisPoints.length >= 3 ? `${(form.acres ? form.acres : "2.5")} Acres (Vetted Area)` : "No polygon formed yet"}
                      </span>
                    </div>
                    {gisPoints.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-2 text-[10px] font-bold text-slate-400">
                        {gisPoints.map((p, idx) => (
                          <span key={idx} className="bg-slate-950 border border-slate-850 px-2.5 py-1 rounded-lg">
                            V{idx + 1}: {p.x}m, {p.y}m
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* STEP 4: Legal Deed Scan & Media */}
              {step === 4 && (
                <div className="space-y-4 animate-in fade-in duration-200">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">Property Image URL</label>
                      <input
                        type="text"
                        placeholder="Paste high-res image URL..."
                        value={form.image}
                        className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-850 focus:outline-none focus:ring-2 focus:ring-indigo-500/15 focus:border-indigo-500 text-sm font-semibold text-white placeholder:text-slate-650"
                        onChange={(e) => setForm({ ...form, image: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">Legal Deed Documents</label>
                      <div 
                        onClick={() => {
                          if (scanState === "idle") {
                            setScanState("scanning");
                            setScanProgress(0);
                            setScanText("Uploading registry certificates...");
                            
                            const interval = setInterval(() => {
                              setScanProgress(prev => {
                                if (prev >= 100) {
                                  clearInterval(interval);
                                  setScanState("completed");
                                  setForm(f => ({ ...f, deedVerified: true }));
                                  return 100;
                                }
                                const nextVal = prev + 25;
                                if (nextVal === 25) setScanText("Extracting title records via OCR...");
                                if (nextVal === 50) setScanText("Validating land survey registers...");
                                if (nextVal === 75) setScanText("Checking municipal encumbrances...");
                                if (nextVal === 100) setScanText("Audit successful! Title details clear.");
                                return nextVal;
                              });
                            }, 800);
                          }
                        }}
                        className={`border-2 border-dashed rounded-3xl p-5 text-center cursor-pointer transition-all ${
                          scanState === "completed" 
                            ? "border-emerald-500/60 bg-emerald-950/10" 
                            : "border-slate-800 hover:border-indigo-500 bg-slate-950/40"
                        }`}
                      >
                        {scanState === "idle" && (
                          <>
                            <UploadCloud className="h-9 w-9 text-slate-500 mx-auto mb-2" />
                            <p className="text-xs font-bold text-slate-350">Click to Upload & Scan Land Deed (EC/Patta)</p>
                            <p className="text-[9px] text-slate-550 font-semibold mt-1">PDF, PNG, JPG (Simulated AI Scan)</p>
                          </>
                        )}
                        {scanState === "scanning" && (
                          <div className="py-2 space-y-3">
                            <div className="h-6 w-6 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
                            <p className="text-xs font-bold text-indigo-400">{scanProgress}% - {scanText}</p>
                            <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden">
                              <div className="bg-indigo-550 h-full transition-all duration-300" style={{ width: `${scanProgress}%` }}></div>
                            </div>
                          </div>
                        )}
                        {scanState === "completed" && (
                          <div className="py-1">
                            <CheckCircle2 className="h-9 w-9 text-emerald-400 mx-auto mb-2" />
                            <p className="text-xs font-bold text-emerald-400">Deed Document Vetted & Verified</p>
                            <p className="text-[9px] text-slate-400 font-semibold mt-1 font-sans">Compliance Scorecard Generated</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {scanState === "completed" && (
                    <div className="bg-[#090d16]/80 border border-slate-900 p-4 rounded-2xl grid grid-cols-3 gap-2.5 text-center animate-in zoom-in-95 duration-200">
                      <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-900">
                        <p className="text-[8px] font-bold text-slate-550 uppercase tracking-wider">Title Audit</p>
                        <p className="text-xs font-black text-emerald-400 mt-1">98% CLEAR</p>
                      </div>
                      <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-900">
                        <p className="text-[8px] font-bold text-slate-550 uppercase tracking-wider">Survey Match</p>
                        <p className="text-xs font-black text-slate-300 mt-1">CONFIRMED</p>
                      </div>
                      <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-900">
                        <p className="text-[8px] font-bold text-slate-550 uppercase tracking-wider">Disputes</p>
                        <p className="text-xs font-black text-emerald-400 mt-1">0 FOUND</p>
                      </div>
                    </div>
                  )}

                  <div className="bg-indigo-950/20 border border-indigo-900/30 p-4 rounded-2xl flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-indigo-400 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-xs font-bold text-white">Legal Audit Declaration</h4>
                      <p className="text-[9px] text-slate-405 font-semibold leading-normal mt-0.5">
                        By checking the box below, you warrant that this property represents clear title deeds without litigation boundaries, or mortgages outstanding.
                      </p>
                      <label className="flex items-center gap-2 mt-3 cursor-pointer text-xs font-bold text-indigo-400">
                        <input
                          type="checkbox"
                          checked={form.deedVerified}
                          disabled={scanState !== "completed"}
                          onChange={(e) => setForm(f => ({ ...f, deedVerified: e.target.checked }))}
                          className="rounded text-indigo-500 focus:ring-indigo-550 border-slate-700 bg-slate-950 disabled:opacity-50"
                        />
                        I warrant title deed legal compliance.
                      </label>
                    </div>
                  </div>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex justify-between mt-10 pt-6 border-t border-slate-800">
                {step > 1 ? (
                  <button
                    type="button"
                    onClick={prevStep}
                    className="flex items-center gap-1.5 px-5 py-3 border border-slate-800 bg-slate-955/40 text-slate-305 hover:bg-slate-900 hover:border-slate-700 rounded-xl font-bold text-sm transition-all cursor-pointer"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Back
                  </button>
                ) : (
                  <div></div>
                )}

                {step < 4 ? (
                  <button
                    type="button"
                    onClick={nextStep}
                    className="flex items-center gap-1.5 px-6 py-3 bg-indigo-650 hover:bg-indigo-600 text-white rounded-xl font-bold text-sm transition-all shadow-md active:scale-[0.98] cursor-pointer"
                  >
                    Continue
                    <ArrowRight className="h-4 w-4" />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleCreate}
                    disabled={loading || !form.deedVerified}
                    className="flex items-center gap-1.5 px-6 py-3 bg-indigo-650 hover:bg-indigo-600 disabled:bg-slate-800 disabled:text-slate-500 text-white rounded-xl font-bold text-sm transition-all shadow-md disabled:shadow-none active:scale-[0.98] cursor-pointer"
                  >
                    {loading ? "Publishing..." : "Publish Listing"}
                    <Sparkles className="h-4 w-4 text-amber-300" />
                  </button>
                )}
              </div>
            </div>
          )}

        </div>
      </main>
    </div>
  );
}