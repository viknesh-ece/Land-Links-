"use client";

import { useState } from "react";
import { 
  X, Check, AlertTriangle, XCircle, FileText, ShieldCheck, Download, 
  ZoomIn, ZoomOut, RotateCcw, Printer, Search, Eye, Sparkles, 
  ExternalLink, QrCode, Lock, Stamp, Database, Layers, CheckCircle2, ShieldAlert
} from "lucide-react";

export default function AdminDocumentInspectorModal({ doc, property, onClose, onVerifyToggle }) {
  const [activeTab, setActiveTab] = useState("preview"); // preview | ocr | forensics | registry
  const [zoomLevel, setZoomLevel] = useState(100);

  if (!doc) return null;

  const getDocTypeColor = (type) => {
    switch (type) {
      case "Revenue Title": return "text-emerald-400 border-emerald-500/30 bg-emerald-500/10";
      case "Ownership Deed": return "text-cyan-400 border-cyan-500/30 bg-cyan-500/10";
      case "Legal Clearance": return "text-blue-400 border-blue-500/30 bg-blue-500/10";
      case "Survey Map": return "text-amber-400 border-amber-500/30 bg-amber-500/10";
      case "Engineering Survey": return "text-purple-400 border-purple-500/30 bg-purple-500/10";
      default: return "text-teal-400 border-teal-500/30 bg-teal-500/10";
    }
  };

  const getSamplePdfLink = () => {
    if (doc.id === "patta") return "/demo_documents/1_ORIGINAL_TamilNilam_Patta_Pollachi_55210.pdf";
    if (doc.id === "deed") return "/demo_documents/1_ORIGINAL_TamilNilam_Patta_Pollachi_55210.pdf";
    if (doc.id === "ec") return "/demo_documents/1_ORIGINAL_TamilNilam_Patta_Pollachi_55210.pdf";
    return "/demo_documents/1_ORIGINAL_TamilNilam_Patta_Pollachi_55210.pdf";
  };

  return (
    <div className="fixed inset-0 bg-slate-950/90 backdrop-blur-xl z-50 flex items-center justify-center p-2 sm:p-4 overflow-y-auto animate-fade-in">
      <div className="bg-slate-900 border border-slate-700/80 rounded-3xl max-w-5xl w-full p-4 sm:p-6 shadow-2xl space-y-5 animate-scale-in text-white my-auto max-h-[92vh] flex flex-col">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4 shrink-0">
          <div className="flex items-center gap-3">
            <div className="h-11 w-11 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shrink-0">
              <FileText className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-black text-white">{doc.title}</h2>
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase border ${getDocTypeColor(doc.type)}`}>
                  {doc.type}
                </span>
                {doc.verified && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center gap-1">
                    <CheckCircle2 className="h-3 w-3" /> Verified
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400 font-mono mt-0.5">
                {doc.fileName} • {doc.fileSize} • Parcel: {property?.title || "Tamil Nadu Land Parcel"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto">
            <a
              href={getSamplePdfLink()}
              download={doc.fileName}
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
              title="Download Original Document PDF"
            >
              <Download className="h-3.5 w-3.5 text-cyan-400" />
              <span>Download PDF</span>
            </a>

            <button
              onClick={onClose}
              className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-all cursor-pointer border-0"
              title="Close Inspector"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 border-b border-slate-800 pb-2 shrink-0">
          {[
            { id: "preview", label: "📄 Document Visual Scan", icon: Eye },
            { id: "ocr", label: "🔍 OCR Entities Matrix", icon: Search },
            { id: "forensics", label: "🧬 Binary EXIF Forensics", icon: Layers },
            { id: "registry", label: "🏛️ TamilNilam Cross-Match", icon: Database },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
                  isActive
                    ? "bg-cyan-600 text-white shadow-lg shadow-cyan-600/30"
                    : "bg-slate-950 text-slate-400 hover:text-white border border-slate-800"
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Content Area */}
        <div className="flex-1 overflow-y-auto pr-1 space-y-4">
          
          {/* TAB 1: VISUAL DOCUMENT SCAN */}
          {activeTab === "preview" && (
            <div className="space-y-3">
              {/* Zoom & View Controls Toolbar */}
              <div className="flex items-center justify-between bg-slate-950 px-4 py-2 rounded-2xl border border-slate-800 text-xs">
                <div className="flex items-center gap-2 text-slate-400 font-bold">
                  <span>Page 1 of 1</span>
                  <span>•</span>
                  <span className="text-emerald-400 font-mono">2400 x 3300 px (300 DPI High-Res Scan)</span>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => setZoomLevel(prev => Math.max(70, prev - 15))}
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                    title="Zoom Out"
                  >
                    <ZoomOut className="h-3.5 w-3.5" />
                  </button>
                  <span className="text-[11px] font-mono font-bold text-cyan-300 px-2">{zoomLevel}%</span>
                  <button
                    onClick={() => setZoomLevel(prev => Math.min(150, prev + 15))}
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                    title="Zoom In"
                  >
                    <ZoomIn className="h-3.5 w-3.5" />
                  </button>
                  <button
                    onClick={() => setZoomLevel(100)}
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors ml-1"
                    title="Reset Zoom"
                  >
                    <RotateCcw className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>

              {/* Document Visual Render Container */}
              <div className="bg-slate-950 p-4 sm:p-8 rounded-3xl border border-slate-800 flex justify-center overflow-x-auto">
                <div 
                  className="bg-white text-slate-900 rounded-xl shadow-2xl p-6 sm:p-10 font-serif border border-slate-300 transition-transform origin-top"
                  style={{ 
                    width: "100%", 
                    maxWidth: "680px", 
                    minHeight: "780px",
                    transform: `scale(${zoomLevel / 100})`
                  }}
                >
                  
                  {/* PATTA / REVENUE TITLE TEMPLATE */}
                  {doc.id === "patta" && (
                    <div className="space-y-5 text-[11px] leading-relaxed">
                      <div className="text-center space-y-1 border-b-2 border-slate-800 pb-4">
                        <div className="w-12 h-12 mx-auto rounded-full bg-slate-100 border border-slate-300 flex items-center justify-center font-bold text-slate-700 mb-1">
                          🏛️
                        </div>
                        <h1 className="text-base font-bold uppercase tracking-wider text-slate-900 font-sans">தமிழ்நாடு அரசு (GOVERNMENT OF TAMIL NADU)</h1>
                        <p className="text-xs font-semibold text-slate-700">வருவாய் மற்றும் பேரிடர் மேலாண்மைத் துறை</p>
                        <p className="text-xs font-bold text-slate-800">நில உரிமை விபரங்கள் : இ. எண் 10(1) பிரிவு (Form 10(1) Patta/Chitta Extract)</p>
                      </div>

                      <div className="grid grid-cols-2 gap-3 bg-slate-50 p-3 rounded-lg border border-slate-200 text-[11px] font-sans">
                        <div><span className="text-slate-500 font-semibold">மாவட்டம் (District):</span> <span className="font-bold text-slate-900">Coimbatore (கோயம்புத்தூர்)</span></div>
                        <div><span className="text-slate-500 font-semibold">வட்டம் (Taluk):</span> <span className="font-bold text-slate-900">Pollachi (பொள்ளாச்சி)</span></div>
                        <div><span className="text-slate-500 font-semibold">கிராமம் (Village):</span> <span className="font-bold text-slate-900">Anaimalai (ஆனைமலை)</span></div>
                        <div><span className="text-slate-500 font-semibold">பட்டா எண் (Patta No):</span> <span className="font-bold text-emerald-700 text-xs">55210</span></div>
                        <div className="col-span-2"><span className="text-slate-500 font-semibold">உரிமையாளர் பெயர் (Owner):</span> <span className="font-bold text-slate-900 text-xs">K. Palanisamy Gounder</span></div>
                      </div>

                      {/* Revenue Ledger Table */}
                      <table className="w-full border-collapse border border-slate-400 text-center text-[10px] font-sans">
                        <thead>
                          <tr className="bg-slate-200 text-slate-800 font-bold">
                            <th className="border border-slate-400 p-2">புல எண் (Survey)</th>
                            <th className="border border-slate-400 p-2">உட்பிரிவு (Sub-Div)</th>
                            <th className="border border-slate-400 p-2">புன்செய் (Dry Ha-Ar)</th>
                            <th className="border border-slate-400 p-2">நன்செய் (Wet)</th>
                            <th className="border border-slate-400 p-2">தீர்வை (Tax ₹)</th>
                            <th className="border border-slate-400 p-2">குறிப்புரைகள் (Remarks)</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr className="bg-white">
                            <td className="border border-slate-400 p-2 font-bold">214</td>
                            <td className="border border-slate-400 p-2 font-bold">1B</td>
                            <td className="border border-slate-400 p-2 font-bold">3 - 03.50 (7.50 Acres)</td>
                            <td className="border border-slate-400 p-2">--</td>
                            <td className="border border-slate-400 p-2">18.50</td>
                            <td className="border border-slate-400 p-2 font-bold text-emerald-700">Clean Title (0 Encumbrance)</td>
                          </tr>
                        </tbody>
                      </table>

                      {/* Digital Sign Seal & QR Code */}
                      <div className="flex items-center justify-between border-t border-slate-300 pt-4 mt-6">
                        <div className="flex items-center gap-3">
                          <div className="w-14 h-14 bg-slate-100 border border-slate-400 flex items-center justify-center text-xs font-mono font-bold">
                            [QR Code]
                          </div>
                          <div className="text-[9px] font-sans text-slate-600 space-y-0.5">
                            <p className="font-bold text-slate-900">TamilNilam Ref: 12/04/018/055210/99812</p>
                            <p>Certified by eservices.tn.gov.in</p>
                            <p>Printed: 10-08-2026 09:45:00 AM</p>
                          </div>
                        </div>

                        <div className="text-right font-sans text-[10px]">
                          <div className="inline-block border border-emerald-600 bg-emerald-50 text-emerald-800 px-3 py-1.5 rounded text-center">
                            <p className="font-bold">Digitally Signed By</p>
                            <p className="font-mono text-[9px]">S. MUTHUVEL P (Tahsildar)</p>
                            <p className="text-[8px] text-slate-500">SHA256: 8a4b2c1d9e7f...VALID</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* ENCUMBRANCE CERTIFICATE (EC) TEMPLATE */}
                  {doc.id === "ec" && (
                    <div className="space-y-5 text-[11px] leading-relaxed">
                      <div className="text-center space-y-1 border-b-2 border-slate-800 pb-4">
                        <div className="w-12 h-12 mx-auto rounded-full bg-slate-100 border border-slate-300 flex items-center justify-center font-bold text-slate-700 mb-1">
                          ⚖️
                        </div>
                        <h1 className="text-base font-bold uppercase tracking-wider text-slate-900 font-sans">GOVERNMENT OF TAMIL NADU - REGISTRATION DEPARTMENT</h1>
                        <p className="text-xs font-semibold text-slate-700">Sub-Registrar Office, Pollachi (STAR 2.0 Electronic Search)</p>
                        <p className="text-xs font-bold text-slate-800">Form No. 15 - Certificate of Encumbrance on Property (வில்லங்கச் சான்றிதழ்)</p>
                      </div>

                      <div className="grid grid-cols-2 gap-3 bg-slate-50 p-3 rounded-lg border border-slate-200 text-[11px] font-sans">
                        <div><span className="text-slate-500 font-semibold">Application No:</span> <span className="font-bold text-slate-900">EC-2026-POL-8821</span></div>
                        <div><span className="text-slate-500 font-semibold">Search Period:</span> <span className="font-bold text-slate-900">01-Jan-2011 to 10-Aug-2026 (15 Years)</span></div>
                        <div><span className="text-slate-500 font-semibold">Village / Survey No:</span> <span className="font-bold text-slate-900">Anaimalai • Survey #214/1B</span></div>
                        <div><span className="text-slate-500 font-semibold">Search Result:</span> <span className="font-bold text-emerald-700 text-xs">NIL ENCUMBRANCE (0 Mortgages)</span></div>
                      </div>

                      <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-lg text-center font-sans space-y-1">
                        <p className="text-xs font-bold text-emerald-900">CERTIFICATE OF NIL ENCUMBRANCE</p>
                        <p className="text-[10px] text-emerald-800">
                          Having examined the entries in Book I and indexes relating to Survey #214/1B for the period of 15 years, no adverse transactions, court attachments, or mortgage liabilities were found.
                        </p>
                      </div>

                      <div className="flex items-center justify-between border-t border-slate-300 pt-4 mt-6 font-sans">
                        <div className="text-[9px] text-slate-500">
                          <p>Issued under Section 57 of Registration Act 1908</p>
                          <p className="font-mono">Document Token: TN-SRO-POL-2026-CLEARED</p>
                        </div>
                        <div className="text-right text-[10px]">
                          <p className="font-bold text-slate-900">Sub-Registrar (In-Charge)</p>
                          <p className="text-slate-600">Sub-Registrar Office, Pollachi</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* SALE DEED / OWNERSHIP DEED TEMPLATE */}
                  {doc.id === "deed" && (
                    <div className="space-y-5 text-[11px] leading-relaxed">
                      <div className="text-center space-y-1 border-b-2 border-slate-800 pb-4">
                        <div className="p-2 border border-slate-400 bg-amber-50 inline-block font-sans text-xs font-bold text-amber-900 mb-1">
                          INDIA NON-JUDICIAL • TAMIL NADU GOVERNMENT STAMP DUTY ₹ 100
                        </div>
                        <h1 className="text-base font-bold uppercase tracking-wider text-slate-900 font-sans">ABSOLUTE SALE DEED (கிரையப் பத்திரம்)</h1>
                        <p className="text-xs font-mono font-semibold text-slate-700">Document No: 441/2024 • Registered at SRO Pollachi</p>
                      </div>

                      <div className="space-y-2 text-[10px] font-serif leading-relaxed text-slate-800">
                        <p>
                          This DEED OF ABSOLUTE SALE is made on this 15th day of March 2024 by <b>K. Palanisamy Gounder</b>, residing at Anaimalai, Pollachi (hereinafter called the VENDOR) in favor of the BUYER with free and marketable title.
                        </p>
                        <div className="p-3 bg-slate-50 border border-slate-300 rounded font-sans text-[10px] space-y-1">
                          <p className="font-bold text-slate-900">SCHEDULE OF PROPERTY:</p>
                          <p>All that piece and parcel of agricultural coconut grove land situated at Anaimalai Village, Pollachi Taluk, Coimbatore District, comprised in <b>Survey No. 214/1B</b>, measuring an extent of <b>7.50 Acres</b>.</p>
                          <p className="text-slate-600">Boundaries: North by Panchayat Road, South by Coconut Farm, East by Channel, West by Survey #214/1A.</p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between border-t border-slate-300 pt-4 mt-6 font-sans text-[10px]">
                        <div>
                          <p className="font-bold text-slate-900">Vendor Signature:</p>
                          <p className="font-mono text-xs italic text-slate-700">K. Palanisamy Gounder</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-slate-900">Sub-Registrar Seal:</p>
                          <p className="text-emerald-700 font-bold">REGISTERED (Book 1, Vol 142)</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* FMB SKETCH MAP TEMPLATE */}
                  {doc.id === "fmb" && (
                    <div className="space-y-5 text-[11px] leading-relaxed">
                      <div className="text-center space-y-1 border-b-2 border-slate-800 pb-3">
                        <h1 className="text-base font-bold uppercase tracking-wider text-slate-900 font-sans">FIELD MEASUREMENT BOOK (FMB SKETCH)</h1>
                        <p className="text-xs font-semibold text-slate-700">புல வரைபடம் • Revenue Department, Tamil Nadu</p>
                        <p className="text-xs font-mono text-slate-800">Village: Anaimalai • Taluk: Pollachi • Survey No: 214</p>
                      </div>

                      {/* Vector Boundary Canvas Rendering */}
                      <div className="bg-slate-100 border-2 border-dashed border-slate-400 rounded-xl p-8 flex flex-col items-center justify-center space-y-4">
                        <div className="relative w-64 h-52 border-2 border-slate-800 bg-white flex items-center justify-center shadow-inner">
                          <div className="absolute top-2 left-2 text-[9px] font-mono font-bold text-slate-600">Stone #1 (NW)</div>
                          <div className="absolute top-2 right-2 text-[9px] font-mono font-bold text-slate-600">Stone #2 (NE)</div>
                          <div className="absolute bottom-2 left-2 text-[9px] font-mono font-bold text-slate-600">Stone #4 (SW)</div>
                          <div className="absolute bottom-2 right-2 text-[9px] font-mono font-bold text-slate-600">Stone #3 (SE)</div>

                          <div className="text-center font-sans">
                            <p className="text-xs font-bold text-cyan-800">Sub-Division 214/1B</p>
                            <p className="text-[10px] text-slate-600">7.50 Acres (3.035 Ha)</p>
                            <p className="text-[9px] font-mono text-emerald-700 font-bold mt-1">G-Line: 184.5m • F-Line: 162.0m</p>
                          </div>

                          <div className="absolute -top-3 bg-slate-800 text-white text-[8px] font-mono px-2 py-0.5 rounded">
                            North Access Road (40 Ft Width)
                          </div>
                        </div>

                        <div className="flex gap-4 text-[10px] font-sans text-slate-700">
                          <span>📐 Total Perimeter: 693.0 Meters</span>
                          <span>•</span>
                          <span>🧭 Orientation: True North 0.0°</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between border-t border-slate-300 pt-3 text-[10px] font-sans">
                        <span className="text-slate-500">Surveyed by Head Surveyor, Pollachi Taluk</span>
                        <span className="font-bold text-slate-900">Vector Status: CAD-VERIFIED-2026</span>
                      </div>
                    </div>
                  )}

                  {/* SOIL & KYC DEFAULT TEMPLATES */}
                  {doc.id !== "patta" && doc.id !== "ec" && doc.id !== "deed" && doc.id !== "fmb" && (
                    <div className="space-y-4 text-[11px] leading-relaxed">
                      <div className="text-center space-y-1 border-b-2 border-slate-800 pb-4">
                        <h1 className="text-base font-bold uppercase tracking-wider text-slate-900 font-sans">{doc.title}</h1>
                        <p className="text-xs font-semibold text-slate-700">Official Certified Audit Exhibit</p>
                      </div>

                      <div className="p-6 bg-slate-50 border border-slate-300 rounded-xl space-y-3 font-sans">
                        <div className="flex justify-between border-b border-slate-200 pb-2">
                          <span className="text-slate-500">Document Type:</span>
                          <span className="font-bold text-slate-900">{doc.type}</span>
                        </div>
                        <div className="flex justify-between border-b border-slate-200 pb-2">
                          <span className="text-slate-500">Target Parcel:</span>
                          <span className="font-bold text-slate-900">{property?.title || "Coimbatore Land Parcel"}</span>
                        </div>
                        <div className="flex justify-between border-b border-slate-200 pb-2">
                          <span className="text-slate-500">Verification Hash:</span>
                          <span className="font-mono text-emerald-700 font-bold">{doc.hash}</span>
                        </div>
                        <div>
                          <span className="text-slate-500 block mb-1">Technical Specification:</span>
                          <p className="font-bold text-slate-800 bg-white p-3 rounded border border-slate-200">{doc.details}</p>
                        </div>
                      </div>
                    </div>
                  )}

                </div>
              </div>
            </div>
          )}

          {/* TAB 2: OCR ENTITY MATRIX */}
          {activeTab === "ocr" && (
            <div className="space-y-4">
              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black uppercase tracking-wider text-cyan-400 flex items-center gap-2">
                    <Search className="h-4 w-4" />
                    OCR Machine Learning Field Extractions
                  </span>
                  <span className="text-[10px] font-mono text-emerald-400 font-bold">Avg OCR Confidence: 99.4%</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {[
                    { field: "Registered Owner Name", value: "K. Palanisamy Gounder", match: "100% Match with eKYC", status: "PASSED" },
                    { field: "Survey & Sub-Division No", value: "214 / 1B", match: "Matched in TamilNilam A-Register", status: "PASSED" },
                    { field: "Patta Ledger Number", value: "55210", match: "Active in Revenue Database", status: "PASSED" },
                    { field: "Revenue Village & Taluk", value: "Anaimalai, Pollachi", match: "Official Revenue Circle 04", status: "PASSED" },
                    { field: "Land Area Extent", value: "7.50 Acres (3.035 Ha)", match: "Matches FMB Vector Area", status: "PASSED" },
                    { field: "Encumbrance Status", value: "NIL Encumbrance", match: "0 Mortgages in 15-Yr Search", status: "PASSED" }
                  ].map((item, i) => (
                    <div key={i} className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold text-slate-400 uppercase">{item.field}</span>
                        <span className="text-[9px] font-black text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30">
                          {item.status}
                        </span>
                      </div>
                      <p className="text-xs font-black text-white">{item.value}</p>
                      <p className="text-[10px] font-mono text-cyan-300">{item.match}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: BINARY & FORENSIC EXIF ANALYSIS */}
          {activeTab === "forensics" && (
            <div className="space-y-4">
              <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-4 font-mono text-xs">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <span className="font-bold text-cyan-300 flex items-center gap-2">
                    <ShieldCheck className="h-4 w-4 text-emerald-400" />
                    Zero-Trust Forensic Integrity Report
                  </span>
                  <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                    AUTHENTIC (0 TAMPERING DETECTED)
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-slate-300">
                  <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 space-y-1">
                    <span className="text-[10px] text-slate-500 uppercase">PDF Producer / Generator:</span>
                    <p className="font-bold text-emerald-400">Apache FOP 2.8 / TN e-Governance Agency</p>
                  </div>
                  <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 space-y-1">
                    <span className="text-[10px] text-slate-500 uppercase">EXIF Graphic Editor Scan:</span>
                    <p className="font-bold text-emerald-400">0 Photoshop / Canva Signatures Found (CLEARED)</p>
                  </div>
                  <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 space-y-1">
                    <span className="text-[10px] text-slate-500 uppercase">Perceptual Hash (pHash):</span>
                    <p className="font-bold text-cyan-300">phash_9a8b7c6d5e4f3a2b1c (Unique Ledger Record)</p>
                  </div>
                  <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 space-y-1">
                    <span className="text-[10px] text-slate-500 uppercase">SHA-256 Cryptographic Checksum:</span>
                    <p className="font-bold text-white break-all text-[11px]">{doc.hash}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: TAMILNILAM REGISTRY CROSS-MATCH */}
          {activeTab === "registry" && (
            <div className="space-y-4">
              <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-4 text-xs font-mono">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <span className="font-bold text-cyan-300 flex items-center gap-2">
                    <Database className="h-4 w-4 text-cyan-400" />
                    Tamil Nadu Government Live Registry Cross-Match (eservices.tn.gov.in)
                  </span>
                  <span className="text-[10px] font-bold text-emerald-400">STATUS: MATCHED</span>
                </div>

                <div className="space-y-2 text-slate-300">
                  <p>&gt; Querying Pollachi Taluk Revenue A-Register for Survey #214/1B...</p>
                  <p>&gt; Verified Registered Owner: <span className="text-emerald-400 font-bold">K. Palanisamy Gounder</span></p>
                  <p>&gt; Encumbrance Status: <span className="text-emerald-400 font-bold">0 Pending Court Suits / 0 Bank Mortgages</span></p>
                  <p>&gt; Digital Stamp: <span className="text-cyan-300 font-bold">VALID_TN_GOVT_STAMP (Authenticated)</span></p>
                  <p>&gt; Guideline Value: <span className="text-white font-bold">₹ 1,450 / Sq.Ft</span></p>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Footer Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-t border-slate-800 pt-4 shrink-0">
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                onVerifyToggle(doc.id);
                onClose();
              }}
              className={`px-5 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 transition-all cursor-pointer shadow-lg ${
                doc.verified
                  ? "bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700"
                  : "bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-emerald-600/30"
              }`}
            >
              <Check className="h-4 w-4" />
              <span>{doc.verified ? "Revoke Verification" : "Approve & Mark as Verified"}</span>
            </button>

            <button
              onClick={() => {
                alert(`Document ${doc.fileName} flagged for secondary legal review.`);
                onClose();
              }}
              className="px-4 py-2.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 font-bold text-xs transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <AlertTriangle className="h-3.5 w-3.5" />
              <span>Flag Discrepancy</span>
            </button>
          </div>

          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs transition-all cursor-pointer border-0"
          >
            Close Inspection
          </button>
        </div>

      </div>
    </div>
  );
}
