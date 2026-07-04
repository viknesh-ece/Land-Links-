"use client";
import Navbar from "@/components/Navbar";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Building, MapPin, Sparkles, ArrowRight, ArrowLeft, CheckCircle2, UploadCloud, HelpCircle, Droplets, Compass } from "lucide-react";
export default function CreatePropertyPage() {
    const router = useRouter();
    // Wizard steps: 1 = Basic Info, 2 = Attributes, 3 = GIS Boundary, 4 = Legal Audit
    const [step, setStep] = useState(1);
    const [gisPoints, setGisPoints] = useState([]);
    const [deedFile, setDeedFile] = useState(null);
    const [soilFile, setSoilFile] = useState(null);
    const [pattaFile, setPattaFile] = useState(null);
    const [deedScanState, setDeedScanState] = useState("idle");
    const [soilScanState, setSoilScanState] = useState("idle");
    const [pattaScanState, setPattaScanState] = useState("idle");
    const [deedScanProgress, setDeedScanProgress] = useState(0);
    const [soilScanProgress, setSoilScanProgress] = useState(0);
    const [pattaScanProgress, setPattaScanProgress] = useState(0);
    const [deedScanText, setDeedScanText] = useState("Idle");
    const [soilScanText, setSoilScanText] = useState("Idle");
    const [pattaScanText, setPattaScanText] = useState("Idle");
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
                    image: form.image || "placeholder.jpg",
                    soilReport: soilFile ? soilFile.name : "Soil_Quality_Report.pdf",
                    landDeed: deedFile ? deedFile.name : "Original_Land_Deed.pdf",
                    pattaDocument: pattaFile ? pattaFile.name : "Patta_Chitta_Registry.pdf",
                    gisCoordinates: boundaryStr
                }),
            });
            const data = await res.json();
            if (res.ok) {
                setSubmitted(true);
                setTimeout(() => {
                    router.push("/listings");
                }, 2000);
            }
            else {
                setError(data.message || "Failed to list property");
            }
        }
        catch (err) {
            console.error(err);
            setError("Server error. Please try again.");
        }
        finally {
            setLoading(false);
        }
    };
    return (<div className="min-h-screen bg-transparent text-slate-800 flex flex-col font-sans">
      <Navbar />

      <main className="flex-grow flex items-center justify-center p-4 py-12 relative overflow-hidden">
        {/* Decorative glows */}
        <div className="absolute top-0 right-1/4 w-[400px] h-[400px] bg-indigo-600/10 rounded-full blur-3xl pointer-events-none animate-pulse-slow"></div>
        <div className="absolute bottom-0 left-1/4 w-[400px] h-[400px] bg-sky-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="w-full max-w-2xl bg-white/80 backdrop-blur-xl border border-slate-200 rounded-3xl p-6 sm:p-10 shadow-2xl relative z-10">
          
          {submitted ? (<div className="text-center py-12 space-y-6 animate-in zoom-in-95 duration-200">
               <div className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-emerald-50 text-emerald-700 border border-emerald-250 mb-2">
                <CheckCircle2 className="h-10 w-10 animate-bounce"/>
              </div>
              <h2 className="text-2xl font-black text-slate-900">Property Listed Successfully!</h2>
              <p className="text-slate-600 font-semibold max-w-sm mx-auto leading-relaxed">
                Your land parcel details have been cataloged in the LandLinkX directory. Redirecting you to listings...
              </p>
            </div>) : (<div>
              {/* Header */}
              <div className="mb-8">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-xs font-bold text-indigo-600 uppercase tracking-widest">Step {step} of 4</span>
                  <span className="h-2 w-32 bg-slate-200 rounded-full overflow-hidden">
                    <span className="h-full bg-indigo-600 block transition-all duration-300" style={{ width: `${(step / 4) * 100}%` }}></span>
                  </span>
                </div>
                <h1 className="text-2xl font-black text-slate-900">List Your Land Parcel</h1>
                <p className="text-slate-600 font-semibold text-xs mt-1">Publish verified specs directly to builders and investors.</p>
              </div>

              {error && (<div className="mb-6 p-4 rounded-2xl bg-rose-50 border border-rose-250 text-rose-700 text-xs font-bold flex gap-2">
                  <HelpCircle className="h-4 w-4 shrink-0 text-rose-500"/>
                  <span>{error}</span>
                </div>)}

              {/* STEP 1: Basic Info */}
              {step === 1 && (<div className="space-y-4 animate-scale-in">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">Property Title</label>
                    <input type="text" placeholder="e.g. 5 Acres Commercial land near IT corridor" value={form.title} className="w-full px-4 py-3 rounded-xl bg-white border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/15 focus:border-indigo-500 text-sm font-semibold text-slate-900 placeholder:text-slate-400" onChange={(e) => setForm({ ...form, title: e.target.value })}/>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">Region / Location Address</label>
                    <div className="relative">
                      <MapPin className="h-4.5 w-4.5 text-indigo-500 absolute left-3 top-3.5"/>
                      <input type="text" placeholder="e.g. Whitefield, Bangalore" value={form.location} className="w-full pl-10 pr-4 py-3 rounded-xl bg-white border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/15 focus:border-indigo-500 text-sm font-semibold text-slate-900 placeholder:text-slate-400" onChange={(e) => setForm({ ...form, location: e.target.value })}/>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">Expected Price (₹)</label>
                      <input type="number" placeholder="e.g. 45000000" value={form.price} className="w-full px-4 py-3 rounded-xl bg-white border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/15 focus:border-indigo-500 text-sm font-semibold text-slate-900 placeholder:text-slate-400" onChange={(e) => setForm({ ...form, price: e.target.value })}/>
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">Land Size (Acres)</label>
                      <input type="number" step="0.01" placeholder="e.g. 2.5" value={form.acres} className="w-full px-4 py-3 rounded-xl bg-white border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/15 focus:border-indigo-500 text-sm font-semibold text-slate-900 placeholder:text-slate-400" onChange={(e) => setForm({ ...form, acres: e.target.value })}/>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">Property Description</label>
                    <textarea placeholder="Detail soil depth, zoning modification history, nearby national highways, water resources..." rows={4} value={form.description} className="w-full px-4 py-3 rounded-xl bg-white border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/15 focus:border-indigo-500 text-sm font-semibold text-slate-900 placeholder:text-slate-400" onChange={(e) => setForm({ ...form, description: e.target.value })}/>
                  </div>
                </div>)}

              {/* STEP 2: Land Attributes */}
              {step === 2 && (<div className="space-y-5 animate-scale-in">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-2.5">Zoning Permitted Class</label>
                    <div className="grid grid-cols-2 gap-3">
                      {["Residential", "Commercial", "Industrial", "Agricultural"].map((zone) => (<button key={zone} type="button" onClick={() => setForm({ ...form, zoning: zone })} className={`flex items-center gap-3 p-4 rounded-xl border text-left transition-all cursor-pointer ${form.zoning === zone
                        ? "border-indigo-500 bg-indigo-50 text-indigo-700 font-bold"
                        : "border-slate-200 bg-white hover:border-slate-305 text-slate-500"}`}>
                          <Building className="h-5 w-5 text-indigo-500"/>
                          <span className="text-xs">{zone}</span>
                        </button>))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">Road Access Width (m)</label>
                      <div className="relative">
                        <Compass className="h-4.5 w-4.5 text-slate-400 absolute left-3 top-3.5"/>
                        <input type="number" placeholder="e.g. 12" value={form.roadWidth} className="w-full pl-10 pr-4 py-3 rounded-xl bg-white border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/15 focus:border-indigo-500 text-sm font-semibold text-slate-900 placeholder:text-slate-400" onChange={(e) => setForm({ ...form, roadWidth: e.target.value })}/>
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">Water Resource Source</label>
                      <div className="relative">
                        <Droplets className="h-4.5 w-4.5 text-indigo-500 absolute left-3 top-3.5"/>
                        <select value={form.waterSource} onChange={(e) => setForm({ ...form, waterSource: e.target.value })} className="w-full pl-10 pr-4 py-3 rounded-xl bg-white border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/15 focus:border-indigo-500 text-sm font-bold text-slate-800 cursor-pointer appearance-none">
                          <option value="Borewell" className="bg-white text-slate-800">Borewell Infrastructure</option>
                          <option value="Canal / River" className="bg-white text-slate-800">Canal / River Access</option>
                          <option value="Municipal Water" className="bg-white text-slate-800">Municipal Line</option>
                          <option value="None" className="bg-white text-slate-800">None (Needs Drilling)</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>)}

              {/* STEP 3: GIS Boundary Tracer */}
              {step === 3 && (<div className="space-y-4 animate-scale-in">
                  <div className="flex justify-between items-center">
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500">
                      Interactive Boundary GIS Polygon Drawer
                    </label>
                    <button type="button" onClick={() => setGisPoints([])} className="text-xs font-bold text-indigo-600 hover:text-indigo-805 cursor-pointer bg-transparent border-0">
                      Clear Coordinates
                    </button>
                  </div>
                  
                  <div className="relative">
                    <svg viewBox="0 0 300 200" className="w-full h-56 rounded-2xl bg-slate-50 border border-slate-200 cursor-crosshair relative overflow-hidden" onClick={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    const x = Math.round(((e.clientX - rect.left) / rect.width) * 300);
                    const y = Math.round(((e.clientY - rect.top) / rect.height) * 200);
                    setGisPoints(prev => [...prev, { x, y }]);
                }}>
                      <defs>
                        <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                          <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(99, 102, 241, 0.08)" strokeWidth="1"/>
                        </pattern>
                      </defs>
                      <rect width="100%" height="100%" fill="url(#grid)"/>
                      
                      {gisPoints.length > 0 && (<>
                          {gisPoints.length >= 3 && (<polygon points={gisPoints.map(p => `${p.x},${p.y}`).join(" ")} fill="rgba(99, 102, 241, 0.05)" stroke="none"/>)}
                          
                          {gisPoints.map((p, idx) => {
                        if (idx === 0)
                            return null;
                        const prev = gisPoints[idx - 1];
                        return (<line key={idx} x1={prev.x} y1={prev.y} x2={p.x} y2={p.y} stroke="#6366f1" strokeWidth="2"/>);
                    })}
                          
                          {gisPoints.length >= 3 && (<line x1={gisPoints[gisPoints.length - 1].x} y1={gisPoints[gisPoints.length - 1].y} x2={gisPoints[0].x} y2={gisPoints[0].y} stroke="#6366f1" strokeWidth="2" strokeDasharray="4 4"/>)}
                          
                          {gisPoints.map((p, idx) => (<g key={idx}>
                              <circle cx={p.x} cy={p.y} r="5" fill={idx === 0 ? "#10b981" : "#6366f1"} stroke="#000" strokeWidth="1"/>
                              <text x={p.x + 8} y={p.y + 4} fill="#6366f1" fontSize="7" fontWeight="bold">
                                V{idx + 1} ({p.x}, {p.y})
                              </text>
                            </g>))}
                        </>)}
                      
                      {gisPoints.length === 0 && (<g>
                          <text x="50%" y="45%" textAnchor="middle" fill="#94a3b8" fontSize="11" fontWeight="bold">
                            Click inside the grid to plot vertices
                          </text>
                          <text x="50%" y="55%" textAnchor="middle" fill="#64748b" fontSize="9" fontWeight="semibold">
                            Trace the boundary path of your land lot
                          </text>
                        </g>)}
                    </svg>
                  </div>
                  
                  <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4">
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Calculated Specifications</span>
                      <span className="text-xs font-black text-indigo-600">
                        {gisPoints.length >= 3 ? `${(form.acres ? form.acres : "2.5")} Acres (Vetted Area)` : "No polygon formed yet"}
                      </span>
                    </div>
                    {gisPoints.length > 0 && (<div className="mt-3 flex flex-wrap gap-2 text-[10px] font-bold text-slate-500">
                        {gisPoints.map((p, idx) => (<span key={idx} className="bg-white border border-slate-200 px-2.5 py-1 rounded-lg">
                            V{idx + 1}: {p.x}m, {p.y}m
                          </span>))}
                      </div>)}
                  </div>
                </div>)}              {/* STEP 4: Legal Deed Scan & Media */}
              {step === 4 && (<div className="space-y-6 animate-scale-in">
                  <div className="bg-slate-50 border border-slate-200 p-4 rounded-3xl">
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">Property Image URL</label>
                    <input type="text" placeholder="Paste high-res image URL..." value={form.image} className="w-full px-4 py-3 rounded-xl bg-white border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/15 focus:border-indigo-500 text-sm font-semibold text-slate-900 placeholder:text-slate-400" onChange={(e) => setForm({ ...form, image: e.target.value })}/>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {/* Document 1: Original Deed */}
                    <div className="space-y-2">
                      <label className="block text-[10px] font-black uppercase tracking-wider text-slate-500">1. Original Land Deed</label>
                      <input 
                        type="file" 
                        id="deed-file-input" 
                        accept=".pdf,.png,.jpg,.jpeg" 
                        className="hidden" 
                        onChange={(e) => {
                          const file = e.target.files[0];
                          if (!file) return;
                          setDeedFile(file);
                          setDeedScanState("scanning");
                          setDeedScanProgress(0);
                          setDeedScanText("Uploading deed...");
                          const interval = setInterval(() => {
                            setDeedScanProgress(prev => {
                              if (prev >= 100) {
                                clearInterval(interval);
                                setDeedScanState("completed");
                                return 100;
                              }
                              const nextVal = prev + 25;
                              if (nextVal === 50) setDeedScanText("OCR Boundary check...");
                              if (nextVal === 75) setDeedScanText("Verifying register...");
                              if (nextVal === 100) setDeedScanText("Deed Vetted!");
                              return nextVal;
                            });
                          }, 200);
                        }}
                      />
                      <div onClick={() => { if (deedScanState === "idle") document.getElementById("deed-file-input").click(); }} className={`border-2 border-dashed rounded-2xl p-4 text-center cursor-pointer transition-all h-36 flex flex-col justify-center ${deedScanState === "completed" ? "border-emerald-500 bg-emerald-50" : "border-slate-200 hover:border-indigo-500 bg-white"}`}>
                        {deedScanState === "idle" && (<>
                            <UploadCloud className="h-7 w-7 text-slate-400 mx-auto mb-1.5"/>
                            <p className="text-[10px] font-bold text-slate-600">Select Land Deed</p>
                            <p className="text-[8px] text-slate-500 mt-0.5">EC / Deed PDF</p>
                          </>)}
                        {deedScanState === "scanning" && (
                          <div className="space-y-2 text-center">
                            <div className="h-4 w-4 border-2 border-indigo-650 border-t-transparent rounded-full animate-spin mx-auto"></div>
                            <p className="text-[9px] font-black text-indigo-600">{deedScanProgress}%</p>
                            <p className="text-[8px] text-slate-500 font-semibold truncate px-1">{deedScanText}</p>
                          </div>
                        )}
                        {deedScanState === "completed" && (<>
                            <CheckCircle2 className="h-7 w-7 text-emerald-600 mx-auto mb-1.5"/>
                            <p className="text-[10px] font-bold text-emerald-700">Deed Verified</p>
                            <p className="text-[8px] text-slate-500 font-mono truncate px-1 mt-0.5">{deedFile ? deedFile.name : "deed.pdf"}</p>
                          </>)}
                      </div>
                    </div>

                    {/* Document 2: Soil Report */}
                    <div className="space-y-2">
                      <label className="block text-[10px] font-black uppercase tracking-wider text-slate-500">2. Soil Mechanics Report</label>
                      <input 
                        type="file" 
                        id="soil-file-input" 
                        accept=".pdf,.png,.jpg,.jpeg" 
                        className="hidden" 
                        onChange={(e) => {
                          const file = e.target.files[0];
                          if (!file) return;
                          setSoilFile(file);
                          setSoilScanState("scanning");
                          setSoilScanProgress(0);
                          setSoilScanText("Uploading soil report...");
                          const interval = setInterval(() => {
                            setSoilScanProgress(prev => {
                              if (prev >= 100) {
                                clearInterval(interval);
                                setSoilScanState("completed");
                                return 100;
                              }
                              const nextVal = prev + 25;
                              if (nextVal === 50) setSoilScanText("Analyzing SBC indices...");
                              if (nextVal === 75) setSoilScanText("Evaluating bedrock...");
                              if (nextVal === 100) setSoilScanText("Soil Verified!");
                              return nextVal;
                            });
                          }, 200);
                        }}
                      />
                      <div onClick={() => { if (soilScanState === "idle") document.getElementById("soil-file-input").click(); }} className={`border-2 border-dashed rounded-2xl p-4 text-center cursor-pointer transition-all h-36 flex flex-col justify-center ${soilScanState === "completed" ? "border-emerald-500 bg-emerald-50" : "border-slate-200 hover:border-indigo-500 bg-white"}`}>
                        {soilScanState === "idle" && (<>
                            <UploadCloud className="h-7 w-7 text-slate-400 mx-auto mb-1.5"/>
                            <p className="text-[10px] font-bold text-slate-600">Select Soil Report</p>
                            <p className="text-[8px] text-slate-500 mt-0.5">SBC / Geotech PDF</p>
                          </>)}
                        {soilScanState === "scanning" && (
                          <div className="space-y-2 text-center">
                            <div className="h-4 w-4 border-2 border-indigo-650 border-t-transparent rounded-full animate-spin mx-auto"></div>
                            <p className="text-[9px] font-black text-indigo-600">{soilScanProgress}%</p>
                            <p className="text-[8px] text-slate-500 font-semibold truncate px-1">{soilScanText}</p>
                          </div>
                        )}
                        {soilScanState === "completed" && (<>
                            <CheckCircle2 className="h-7 w-7 text-emerald-600 mx-auto mb-1.5"/>
                            <p className="text-[10px] font-bold text-emerald-700">Soil Verified</p>
                            <p className="text-[8px] text-slate-500 font-mono truncate px-1 mt-0.5">{soilFile ? soilFile.name : "soil_report.pdf"}</p>
                          </>)}
                      </div>
                    </div>

                    {/* Document 3: Patta Registry */}
                    <div className="space-y-2">
                      <label className="block text-[10px] font-black uppercase tracking-wider text-slate-500">3. Patta Registry Certificate</label>
                      <input 
                        type="file" 
                        id="patta-file-input" 
                        accept=".pdf,.png,.jpg,.jpeg" 
                        className="hidden" 
                        onChange={(e) => {
                          const file = e.target.files[0];
                          if (!file) return;
                          setPattaFile(file);
                          setPattaScanState("scanning");
                          setPattaScanProgress(0);
                          setPattaScanText("Uploading Patta registry...");
                          const interval = setInterval(() => {
                            setPattaScanProgress(prev => {
                              if (prev >= 100) {
                                clearInterval(interval);
                                setPattaScanState("completed");
                                return 100;
                              }
                              const nextVal = prev + 25;
                              if (nextVal === 50) setPattaScanText("Matching Chitta...");
                              if (nextVal === 75) setPattaScanText("Municipal checks...");
                              if (nextVal === 100) setPattaScanText("Patta Verified!");
                              return nextVal;
                            });
                          }, 200);
                        }}
                      />
                      <div onClick={() => { if (pattaScanState === "idle") document.getElementById("patta-file-input").click(); }} className={`border-2 border-dashed rounded-2xl p-4 text-center cursor-pointer transition-all h-36 flex flex-col justify-center ${pattaScanState === "completed" ? "border-emerald-500 bg-emerald-50" : "border-slate-200 hover:border-indigo-500 bg-white"}`}>
                        {pattaScanState === "idle" && (<>
                            <UploadCloud className="h-7 w-7 text-slate-400 mx-auto mb-1.5"/>
                            <p className="text-[10px] font-bold text-slate-600">Select Patta Certificate</p>
                            <p className="text-[8px] text-slate-500 mt-0.5">Chitta / Patta PDF</p>
                          </>)}
                        {pattaScanState === "scanning" && (
                          <div className="space-y-2 text-center">
                            <div className="h-4 w-4 border-2 border-indigo-650 border-t-transparent rounded-full animate-spin mx-auto"></div>
                            <p className="text-[9px] font-black text-indigo-600">{pattaScanProgress}%</p>
                            <p className="text-[8px] text-slate-500 font-semibold truncate px-1">{pattaScanText}</p>
                          </div>
                        )}
                        {pattaScanState === "completed" && (<>
                            <CheckCircle2 className="h-7 w-7 text-emerald-600 mx-auto mb-1.5"/>
                            <p className="text-[10px] font-bold text-emerald-700">Patta Verified</p>
                            <p className="text-[8px] text-slate-500 font-mono truncate px-1 mt-0.5">{pattaFile ? pattaFile.name : "patta.pdf"}</p>
                          </>)}
                      </div>
                    </div>
                  </div>

                  {deedScanState === "completed" && soilScanState === "completed" && pattaScanState === "completed" && (
                    <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl grid grid-cols-3 gap-2.5 text-center animate-in zoom-in-95 duration-200">
                      <div className="bg-white p-2.5 rounded-xl border border-slate-200">
                        <p className="text-[8px] font-bold text-slate-505 uppercase tracking-wider">Title Audit</p>
                        <p className="text-xs font-black text-emerald-600 mt-1">98% CLEAR</p>
                      </div>
                      <div className="bg-white p-2.5 rounded-xl border border-slate-200">
                        <p className="text-[8px] font-bold text-slate-505 uppercase tracking-wider">Survey Match</p>
                        <p className="text-xs font-black text-slate-800 mt-1">CONFIRMED</p>
                      </div>
                      <div className="bg-white p-2.5 rounded-xl border border-slate-200">
                        <p className="text-[8px] font-bold text-slate-505 uppercase tracking-wider">Disputes</p>
                        <p className="text-xs font-black text-emerald-600 mt-1">0 FOUND</p>
                      </div>
                    </div>
                  )}

                  <div className="bg-indigo-50 border border-indigo-200 p-4 rounded-2xl flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-indigo-600 shrink-0 mt-0.5"/>
                    <div>
                      <h4 className="text-xs font-bold text-indigo-950">Legal Audit Declaration</h4>
                      <p className="text-[9px] text-slate-650 font-semibold leading-normal mt-0.5">
                        By checking the box below, you warrant that this property represents clear title deeds without litigation boundaries, or mortgages outstanding.
                      </p>
                      <label className="flex items-center gap-2 mt-3 cursor-pointer text-xs font-bold text-indigo-600">
                        <input type="checkbox" checked={form.deedVerified} disabled={deedScanState !== "completed" || soilScanState !== "completed" || pattaScanState !== "completed"} onChange={(e) => setForm(f => ({ ...f, deedVerified: e.target.checked }))} className="rounded text-indigo-650 focus:ring-indigo-500 border-slate-300 bg-white disabled:opacity-50 h-4.5 w-4.5 cursor-pointer"/>
                        I warrant title deed legal compliance.
                      </label>
                    </div>
                  </div>
                </div>)}

              {/* Navigation Buttons */}
              <div className="flex justify-between mt-10 pt-6 border-t border-slate-200">
                {step > 1 ? (<button type="button" onClick={prevStep} className="flex items-center gap-1.5 px-5 py-3 border border-slate-200 bg-slate-100 text-slate-655 hover:bg-slate-205 rounded-xl font-bold text-sm transition-all cursor-pointer">
                    <ArrowLeft className="h-4 w-4"/>
                    Back
                  </button>) : (<div></div>)}

                {step < 4 ? (<button type="button" onClick={nextStep} className="flex items-center gap-1.5 px-6 py-3 bg-indigo-600 hover:bg-indigo-705 text-white rounded-xl font-bold text-sm transition-all shadow-md active:scale-[0.98] cursor-pointer border-0">
                    Continue
                    <ArrowRight className="h-4 w-4"/>
                  </button>) : (<button type="button" onClick={handleCreate} disabled={loading || !deedFile || !soilFile || !pattaFile || !form.deedVerified} className="flex items-center gap-1.5 px-6 py-3 bg-indigo-600 hover:bg-indigo-705 disabled:bg-slate-200 disabled:text-slate-400 text-white rounded-xl font-bold text-sm transition-all shadow-md disabled:shadow-none active:scale-[0.98] cursor-pointer border-0">
                    {loading ? "Publishing..." : "Publish Listing"}
                    <Sparkles className="h-4 w-4 text-amber-300"/>
                  </button>)}
              </div>
            </div>)}

        </div>
      </main>
    </div>);
}
