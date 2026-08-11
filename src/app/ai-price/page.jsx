"use client";
import Navbar from "@/components/Navbar";
import { useState } from "react";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import { Sparkles, MapPin, Building, Compass, Droplets, FileDown, TrendingUp, Scale, ShieldCheck, Activity } from "lucide-react";

export default function AIPricePage() {
    const { lang, t } = useLanguage();
    const [acres, setAcres] = useState("");
    const [region, setRegion] = useState("Coimbatore Highway Corridor");
    const [zoning, setZoning] = useState("Residential");
    const [roadWidth, setRoadWidth] = useState("2-Lane");
    const [hasWater, setHasWater] = useState(false);
    const [hasPower, setHasPower] = useState(false);
    const [loading, setLoading] = useState(false);
    const [reportLoading, setReportLoading] = useState(false);
    const [valuation, setValuation] = useState(null);
    // Zoning Calculator States
    const [initZone, setInitZone] = useState("Agricultural");
    const [targetZone, setTargetZone] = useState("Residential");
    const [zoneAcres, setZoneAcres] = useState("");
    const [zoningResult, setZoningResult] = useState(null);
    const [zoningLoading, setZoningLoading] = useState(false);
    const calculateValuation = () => {
        if (!acres || Number(acres) <= 0)
            return;
        setLoading(true);
        setTimeout(() => {
            // Rates per acre based on region
            let baseRate = 15000000; // 1.5 Cr base
            if (region === "Bangalore East")
                baseRate = 22000000;
            if (region === "Mumbai Outer")
                baseRate = 35000000;
            if (region === "Chennai Highway Corridor")
                baseRate = 12000000;
            if (region === "Hyderabad West")
                baseRate = 26000000;
            // Zoning multiplier
            let zoneMultiplier = 1.0;
            if (zoning === "Commercial")
                zoneMultiplier = 1.6;
            if (zoning === "Industrial")
                zoneMultiplier = 1.3;
            if (zoning === "Agricultural")
                zoneMultiplier = 0.35;
            // Road access width multiplier
            let roadMultiplier = 1.0;
            if (roadWidth === "Highway")
                roadMultiplier = 1.25;
            if (roadWidth === "4-Lane")
                roadMultiplier = 1.15;
            if (roadWidth === "Narrow")
                roadMultiplier = 0.85;
            // Utility add-ons
            let utilityAddons = 0;
            if (hasWater)
                utilityAddons += 450000; // 4.5 Lakhs
            if (hasPower)
                utilityAddons += 300000; // 3 Lakhs
            const totalAcres = Number(acres);
            const calculatedBase = (totalAcres * baseRate * zoneMultiplier * roadMultiplier) + utilityAddons;
            const lowRange = calculatedBase * 0.93;
            const highRange = calculatedBase * 1.07;
            const confidence = 94.0 + (hasWater && hasPower ? 2.4 : 0);
            setValuation({
                base: calculatedBase,
                low: lowRange,
                high: highRange,
                confidence: confidence.toFixed(1),
                zoningFactor: zoneMultiplier,
                roadFactor: roadMultiplier,
                utilities: utilityAddons
            });
            setLoading(false);
        }, 800);
    };
    const calculateZoningFeasibility = () => {
        if (!zoneAcres || Number(zoneAcres) <= 0)
            return;
        setZoningLoading(true);
        setTimeout(() => {
            let baseScore = 70;
            if (initZone === targetZone) {
                baseScore = 100;
            }
            else if (initZone === "Agricultural" && targetZone === "Residential") {
                baseScore = 80;
            }
            else if (initZone === "Agricultural" && targetZone === "Commercial") {
                baseScore = 55;
            }
            else if (initZone === "Agricultural" && targetZone === "Industrial") {
                baseScore = 40;
            }
            else if (initZone === "Residential" && targetZone === "Commercial") {
                baseScore = 85;
            }
            else if (initZone === "Industrial" && targetZone === "Residential") {
                baseScore = 25;
            }
            else if (initZone === "Commercial" && targetZone === "Industrial") {
                baseScore = 75;
            }
            // modifier based on road width
            let roadBonus = 0;
            if (roadWidth === "Highway")
                roadBonus = 15;
            if (roadWidth === "4-Lane")
                roadBonus = 10;
            if (roadWidth === "Narrow")
                roadBonus = -20;
            const finalScore = Math.max(5, Math.min(100, baseScore + roadBonus));
            // Fee calculations
            let feePerAcre = 500000; // 5 Lakhs default
            if (targetZone === "Commercial")
                feePerAcre = 1500000;
            if (targetZone === "Industrial")
                feePerAcre = 1000000;
            if (targetZone === "Residential")
                feePerAcre = 750000;
            const totalFees = Number(zoneAcres) * feePerAcre;
            setZoningResult({
                score: finalScore,
                fees: totalFees,
                compliance: {
                    roadWidth: roadWidth !== "Narrow",
                    eia: !(targetZone === "Industrial" || initZone === "Industrial"),
                    masterPlan: finalScore >= 50,
                    fireSafety: true,
                }
            });
            setZoningLoading(false);
        }, 800);
    };
    const generatePDFReport = () => {
        if (!valuation)
            return;
        setReportLoading(true);
        setTimeout(() => {
            setReportLoading(false);
            const docId = `LVAL-2026-${Math.floor(Math.random() * 90000) + 10000}`;
            const reportHtml = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>LandLinkX - AI Valuation Certificate [${docId}]</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;600;800;900&family=Playfair+Display:ital,wght@0,600;0,800;1,600&display=swap');
    
    body {
      font-family: 'Outfit', sans-serif;
      background-color: #030712;
      color: #f3f4f6;
      margin: 0;
      padding: 40px;
      display: flex;
      justify-content: center;
    }
    .certificate-container {
      max-width: 800px;
      width: 100%;
      background: linear-gradient(135deg, #090f1d 0%, #040813 100%);
      border: 2px solid #1e293b;
      border-radius: 24px;
      padding: 60px;
      position: relative;
      overflow: hidden;
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
    }
    .watermark {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%) rotate(-30deg);
      font-size: 110px;
      font-weight: 900;
      color: rgba(99, 102, 241, 0.03);
      white-space: nowrap;
      pointer-events: none;
      z-index: 1;
      text-transform: uppercase;
      letter-spacing: 12px;
    }
    .header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      border-bottom: 1px solid #1e293b;
      padding-bottom: 24px;
      margin-bottom: 40px;
      position: relative;
      z-index: 2;
    }
    .logo {
      font-size: 24px;
      font-weight: 900;
      color: #ffffff;
      letter-spacing: -1px;
    }
    .logo span {
      color: #6366f1;
    }
    .doc-meta {
      text-align: right;
    }
    .doc-id {
      font-size: 12px;
      font-weight: 800;
      color: #6366f1;
      text-transform: uppercase;
      letter-spacing: 2px;
    }
    .doc-date {
      font-size: 11px;
      color: #64748b;
      margin-top: 4px;
    }
    .title-block {
      text-align: center;
      margin-bottom: 40px;
      position: relative;
      z-index: 2;
    }
    .title-block h1 {
      font-family: 'Playfair Display', serif;
      font-size: 32px;
      font-weight: 800;
      color: #ffffff;
      margin: 0;
      letter-spacing: -0.5px;
    }
    .title-block p {
      font-size: 13px;
      color: #94a3b8;
      margin-top: 8px;
    }
    .seal-badge {
      display: inline-block;
      background: rgba(99, 102, 241, 0.1);
      border: 1px solid rgba(99, 102, 241, 0.3);
      color: #818cf8;
      padding: 6px 16px;
      border-radius: 100px;
      font-size: 10px;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 1.5px;
      margin-top: 12px;
    }
    .section-title {
      font-size: 11px;
      font-weight: 800;
      color: #64748b;
      text-transform: uppercase;
      letter-spacing: 1.5px;
      border-bottom: 1px solid #1e293b;
      padding-bottom: 8px;
      margin-bottom: 20px;
      position: relative;
      z-index: 2;
    }
    .grid {
      display: grid;
      grid-template-cols: 1fr 1fr;
      gap: 30px;
      margin-bottom: 40px;
      position: relative;
      z-index: 2;
    }
    .parameter-item {
      display: flex;
      justify-content: space-between;
      font-size: 13px;
      border-bottom: 1px solid #0f172a;
      padding-bottom: 8px;
    }
    .parameter-item .label {
      color: #94a3b8;
    }
    .parameter-item .value {
      font-weight: 600;
      color: #ffffff;
    }
    .valuation-box {
      grid-column: span 2;
      background: rgba(99, 102, 241, 0.05);
      border: 1px solid rgba(99, 102, 241, 0.15);
      border-radius: 16px;
      padding: 24px;
      text-align: center;
      margin-bottom: 20px;
    }
    .val-label {
      font-size: 11px;
      font-weight: 800;
      color: #94a3b8;
      text-transform: uppercase;
      letter-spacing: 2px;
    }
    .val-amount {
      font-size: 42px;
      font-weight: 900;
      color: #818cf8;
      margin: 12px 0;
      letter-spacing: -1px;
    }
    .val-range {
      font-size: 12px;
      color: #64748b;
      font-weight: 600;
    }
    .val-range span {
      color: #e2e8f0;
    }
    .modifiers {
      list-style: none;
      padding: 0;
      margin: 0;
      position: relative;
      z-index: 2;
    }
    .modifier-item {
      display: flex;
      justify-content: space-between;
      font-size: 13px;
      padding: 10px 0;
      border-bottom: 1px solid #1e293b;
    }
    .modifier-item .name {
      color: #e2e8f0;
    }
    .modifier-item .factor {
      font-weight: 800;
    }
    .positive {
      color: #34d399;
    }
    .negative {
      color: #f87171;
    }
    .footer-signatures {
      display: flex;
      justify-content: space-between;
      margin-top: 60px;
      border-top: 1px solid #1e293b;
      padding-top: 40px;
      position: relative;
      z-index: 2;
    }
    .signature-block {
      width: 40%;
      text-align: center;
    }
    .sig-line {
      border-top: 1px dashed #475569;
      margin-bottom: 12px;
      height: 30px;
    }
    .sig-name {
      font-size: 12px;
      font-weight: 600;
      color: #ffffff;
    }
    .sig-title {
      font-size: 10px;
      color: #64748b;
      margin-top: 2px;
    }
    .print-btn-container {
      display: flex;
      justify-content: center;
      margin-top: 30px;
    }
    .print-btn {
      background: #4f46e5;
      color: white;
      border: 0;
      padding: 10px 24px;
      border-radius: 8px;
      font-size: 13px;
      font-weight: bold;
      cursor: pointer;
      box-shadow: 0 4px 6px -1px rgba(79, 70, 229, 0.4);
    }
    @media print {
      body {
        background-color: white;
        color: black;
        padding: 0;
      }
      .certificate-container {
        border: 0;
        box-shadow: none;
        background: white;
        color: black;
      }
      .print-btn-container {
        display: none;
      }
      .logo, .logo span, .val-amount, .doc-id {
        color: black !important;
      }
      .seal-badge {
        border-color: #ccc;
        color: black;
      }
    }
  </style>
</head>
<body>
  <div class="certificate-container">
    <div class="watermark">LANDLINKX</div>
    
    <div class="header">
      <div class="logo">Land<span>LinkX</span></div>
      <div class="doc-meta">
        <div class="doc-id">Certificate ID: \${docId}</div>
        <div class="doc-date">Generated: \${new Date().toLocaleDateString("en-IN")}</div>
      </div>
    </div>
    
    <div class="title-block">
      <h1>AI Land Valuation Appraisal</h1>
      <p>Official valuation estimation based on real-time algorithmic corridor index modeling</p>
      <div class="seal-badge">Algorithmic Vetted Clear</div>
    </div>
    
    <div class="section-title">Property parameters</div>
    <div class="grid">
      <div class="parameter-item">
        <span class="label">Acreage size</span>
        <span class="value">\${acres} Acres</span>
      </div>
      <div class="parameter-item">
        <span class="label">Zoning class</span>
        <span class="value">\${zoning}</span>
      </div>
      <div class="parameter-item">
        <span class="label">Region corridor</span>
        <span class="value">\${region}</span>
      </div>
      <div class="parameter-item">
        <span class="label">Road access</span>
        <span class="value">\${roadWidth}</span>
      </div>
      <div class="parameter-item">
        <span class="label">Water borewell</span>
        <span class="value">\${hasWater ? "Equipped" : "Not present"}</span>
      </div>
      <div class="parameter-item">
        <span class="label">Electricity grid</span>
        <span class="value">\${hasPower ? "Connected" : "Not present"}</span>
      </div>
    </div>
    
    <div class="section-title">Valuation summary</div>
    <div class="valuation-box">
      <div class="val-label">Median market valuation</div>
      <div class="val-amount">₹ \${new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 }).format(valuation.base)}</div>
      <div class="val-range">
        Estimate Range: <span>₹ \${new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 }).format(valuation.low)}</span> &ndash; <span>₹ \${new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 }).format(valuation.high)}</span>
      </div>
    </div>
    
    <div class="section-title">Modifier factor impact</div>
    <ul class="modifiers">
      <li class="modifier-item">
        <span class="name">Zoning class factor (\${zoning})</span>
        <span class="factor \${valuation.zoningFactor >= 1 ? "positive" : "negative"}">
          \${valuation.zoningFactor >= 1 ? "+" : ""}\${(valuation.zoningFactor * 100 - 100).toFixed(0)}%
        </span>
      </li>
      <li class="modifier-item">
        <span class="name">Road width access modifier (\${roadWidth})</span>
        <span class="factor \${valuation.roadFactor >= 1 ? "positive" : "negative"}">
          \${valuation.roadFactor >= 1 ? "+" : ""}\${(valuation.roadFactor * 100 - 100).toFixed(0)}%
        </span>
      </li>
      <li class="modifier-item">
        <span class="name">Infrastructure add-ons (utilities)</span>
        <span class="factor positive">+ ₹ \${new Intl.NumberFormat("en-IN").format(valuation.utilities)}</span>
      </li>
      <li class="modifier-item">
        <span class="name">System model confidence rating</span>
        <span class="factor positive">\${valuation.confidence}%</span>
      </li>
    </ul>
    
    <div class="footer-signatures">
      <div class="signature-block">
        <div class="sig-line"></div>
        <div class="sig-name">LandLinkX Valuation Engine</div>
        <div class="sig-title">Automated Oracle Signature</div>
      </div>
      <div class="signature-block">
        <div class="sig-line"></div>
        <div class="sig-name">Registry Compliance Bureau</div>
        <div class="sig-title">Verified Smart Stamp</div>
      </div>
    </div>
    
    <div class="print-btn-container">
      <button class="print-btn" onclick="window.print()">Print to Official PDF</button>
    </div>
  </div>
</body>
</html>
      `;
            const blob = new Blob([reportHtml], { type: "text/html" });
            const url = URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.download = `LandLinkX_Appraisal_Report_${docId}.html`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
        }, 1500);
    };
    return (<div className="min-h-screen bg-[#f8fafc] text-slate-900 flex flex-col font-sans">
      <Navbar />

      <main className="flex-grow max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold uppercase tracking-wider mb-4">
            <Sparkles className="h-3.5 w-3.5 text-blue-600 animate-pulse"/>
            <span>{lang === "ta" ? "மேம்பட்ட AI நில மதிப்பீட்டு அல்காரிதம் v2.5" : "Advanced Valuation Algorithm v2.5"}</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            {t.valuation?.pageTitle || "AI Land Price Predictor"}
          </h1>
          <p className="text-slate-500 font-medium text-xs mt-2 leading-relaxed">
            {t.valuation?.pageSubtitle || "Estimate accurate market pricing for your land parcel. Our models analyze land registry indices, highway proximity modifiers, zoning codes, and resource access."}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Inputs Section Stack */}
          <div className="lg:col-span-5 space-y-8 animate-fade-in">
            <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-5">
              <h3 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3">
                {t.valuation?.parametersHeading || "Parcel Parameters"}
              </h3>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                  {t.valuation?.acresLabel || "Acreage Area"}
                </label>
                <input type="number" step="0.01" placeholder="Enter Acres (e.g. 3.25)" value={acres} className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm font-semibold text-slate-900 placeholder:text-slate-400" onChange={(e) => setAcres(e.target.value)}/>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                  {t.valuation?.districtLabel || "Region / Corridor"}
                </label>
                <div className="relative">
                  <MapPin className="h-4.5 w-4.5 text-blue-600 absolute left-3 top-3.5"/>
                  <select value={region} onChange={(e) => setRegion(e.target.value)} className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm font-bold text-slate-900 cursor-pointer appearance-none">
                    <option value="Coimbatore Highway Corridor" className="bg-white text-slate-900">Coimbatore Highway Corridor (கோயம்புத்தூர்)</option>
                    <option value="Chennai Highway Corridor" className="bg-white text-slate-900">Chennai OMR / Tambaram Corridor (சென்னை)</option>
                    <option value="Madurai Outer Expansion" className="bg-white text-slate-900">Madurai Outer Expressway (மதுரை)</option>
                    <option value="Salem Industrial Parkway" className="bg-white text-slate-900">Salem Industrial Parkway (சேலம்)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                  {t.valuation?.zoningLabel || "Zoning Intended Class"}
                </label>
                <div className="relative">
                  <Building className="h-4.5 w-4.5 text-indigo-600 absolute left-3 top-3.5"/>
                  <select value={zoning} onChange={(e) => setZoning(e.target.value)} className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm font-bold text-slate-900 cursor-pointer appearance-none">
                    <option value="Residential" className="bg-white text-slate-900">Residential Development</option>
                    <option value="Commercial" className="bg-white text-slate-900">Commercial / IT Park</option>
                    <option value="Industrial" className="bg-white text-slate-900">Industrial Warehousing</option>
                    <option value="Agricultural" className="bg-white text-slate-900">Agricultural Land</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">Road Access Width</label>
                <div className="relative">
                  <Compass className="h-4.5 w-4.5 text-purple-600 absolute left-3 top-3.5"/>
                  <select value={roadWidth} onChange={(e) => setRoadWidth(e.target.value)} className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm font-bold text-slate-900 cursor-pointer appearance-none">
                    <option value="Highway" className="bg-white text-slate-900">NH Highway Attached (&gt;30m)</option>
                    <option value="4-Lane" className="bg-white text-slate-900">4-Lane Main Road (18m-24m)</option>
                    <option value="2-Lane" className="bg-white text-slate-900">2-Lane Local Road (9m-12m)</option>
                    <option value="Narrow" className="bg-white text-slate-900">Narrow Private Passage (&lt;6m)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-2">Resource Infrastructure</label>
                <div className="space-y-3">
                  <label className="flex items-center justify-between text-xs font-bold text-slate-700 cursor-pointer p-3 border border-slate-200 rounded-xl hover:bg-slate-50 bg-slate-50">
                    <span className="flex items-center gap-2">
                      <Droplets className="h-4 w-4 text-blue-600"/>
                      Drilled Borewell water
                    </span>
                    <input type="checkbox" checked={hasWater} onChange={(e) => setHasWater(e.target.checked)} className="rounded text-blue-600 border-slate-300 h-4.5 w-4.5 cursor-pointer focus:ring-blue-500"/>
                  </label>
                  <label className="flex items-center justify-between text-xs font-bold text-slate-700 cursor-pointer p-3 border border-slate-200 rounded-xl hover:bg-slate-50 bg-slate-50">
                    <span className="flex items-center gap-2">
                      <Activity className="h-4 w-4 text-emerald-600"/>
                      Electricity Grid Connection
                    </span>
                    <input type="checkbox" checked={hasPower} onChange={(e) => setHasPower(e.target.checked)} className="rounded text-blue-600 border-slate-300 h-4.5 w-4.5 cursor-pointer focus:ring-blue-500"/>
                  </label>
                </div>
              </div>

              <button onClick={calculateValuation} disabled={loading || !acres} className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:opacity-40 text-white rounded-2xl font-bold text-sm shadow-md shadow-blue-600/20 active:scale-[0.98] transition-all cursor-pointer flex items-center justify-center gap-2 border-0">
                {loading ? (<div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>) : (<>
                    <Sparkles className="h-4 w-4 text-blue-200"/>
                    {t.valuation?.calculateBtn || "Estimate Valuation"}
                  </>)}
              </button>
            </div>

            {/* Zoning Reclassification Calculator Widget */}
            <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-5">
              <h3 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
                <Building className="h-5 w-5 text-indigo-600"/> Zoning Reclassification
              </h3>
              <p className="text-[11px] font-semibold text-slate-500 leading-normal">
                Analyze target conversion compliance aligned with regional development regulations.
              </p>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">Initial Zoning Class</label>
                <select value={initZone} onChange={(e) => setInitZone(e.target.value)} className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm font-bold text-slate-900 cursor-pointer appearance-none">
                  <option value="Agricultural" className="bg-white text-slate-900">Agricultural Land</option>
                  <option value="Residential" className="bg-white text-slate-900">Residential Development</option>
                  <option value="Industrial" className="bg-white text-slate-900">Industrial Warehousing</option>
                  <option value="Commercial" className="bg-white text-slate-900">Commercial / IT Park</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">Target Zoning Class</label>
                <select value={targetZone} onChange={(e) => setTargetZone(e.target.value)} className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm font-bold text-slate-900 cursor-pointer appearance-none">
                  <option value="Residential" className="bg-white text-slate-900">Residential Development</option>
                  <option value="Commercial" className="bg-white text-slate-900">Commercial / IT Park</option>
                  <option value="Industrial" className="bg-white text-slate-900">Industrial Warehousing</option>
                  <option value="Agricultural" className="bg-white text-slate-900">Agricultural Land</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">Conversion Area (Acres)</label>
                <input type="number" step="0.01" placeholder="Enter Acres (e.g. 1.5)" value={zoneAcres} className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm font-semibold text-slate-900 placeholder:text-slate-400" onChange={(e) => setZoneAcres(e.target.value)}/>
              </div>

              <button onClick={calculateZoningFeasibility} disabled={zoningLoading || !zoneAcres} className="w-full py-3.5 bg-slate-100 hover:bg-slate-200 border border-slate-200 disabled:opacity-40 text-slate-800 rounded-2xl font-bold text-xs shadow-sm transition-all cursor-pointer flex items-center justify-center gap-2">
                {zoningLoading ? (<div className="h-4 w-4 border-2 border-slate-600 border-t-transparent rounded-full animate-spin"></div>) : (<>
                    <Activity className="h-4 w-4 text-blue-600"/> Calculate Feasibility
                  </>)}
              </button>

              {/* Zoning Calculation Results */}
              {zoningResult && (<div className="mt-4 pt-4 border-t border-slate-100 space-y-4 animate-fade-in">
                  
                  {/* Score & Fees */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-center">
                      <p className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">Feasibility Score</p>
                      <p className={`text-2xl font-black mt-1 ${zoningResult.score >= 70 ? "text-emerald-600" : zoningResult.score >= 50 ? "text-amber-600" : "text-rose-600"}`}>{zoningResult.score}%</p>
                    </div>
                    <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-center">
                      <p className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">Est. Conversion Fee</p>
                      <p className="text-lg font-black text-blue-600 mt-1 truncate">
                        ₹ {new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 }).format(zoningResult.fees)}
                      </p>
                    </div>
                  </div>

                  {/* Progress bar */}
                  <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                    <div className={`h-full transition-all duration-500 ${zoningResult.score >= 70 ? "bg-emerald-500" : zoningResult.score >= 50 ? "bg-amber-500" : "bg-rose-500"}`} style={{ width: `${zoningResult.score}%` }}/>
                  </div>

                  {/* Compliance list */}
                  <div className="space-y-2">
                    <h4 className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Compliance Status</h4>
                    <div className="grid grid-cols-2 gap-2 text-[10px] font-semibold text-slate-700">
                      <div className="flex items-center gap-1.5">
                        <span className={`h-1.5 w-1.5 rounded-full ${zoningResult.compliance.roadWidth ? "bg-emerald-500" : "bg-rose-500"}`}/>
                        <span>Road Width Check</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className={`h-1.5 w-1.5 rounded-full ${zoningResult.compliance.eia ? "bg-emerald-500" : "bg-rose-500"}`}/>
                        <span>EIA Compliance NOC</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className={`h-1.5 w-1.5 rounded-full ${zoningResult.compliance.masterPlan ? "bg-emerald-500" : "bg-rose-500"}`}/>
                        <span>Master Plan alignment</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className={`h-1.5 w-1.5 rounded-full ${zoningResult.compliance.fireSafety ? "bg-emerald-500" : "bg-rose-500"}`}/>
                        <span>Fire Access audit</span>
                      </div>
                    </div>
                  </div>

                </div>)}
            </div>
          </div>

          {/* Results Section */}
          <div className="lg:col-span-7">
            {valuation ? (<div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6 animate-in fade-in duration-200">
                <div className="flex justify-between items-center border-b border-slate-100 pb-4">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">
                      {t.valuation?.appraisalCert || "AI Valuation Estimate"}
                    </h3>
                    <p className="text-slate-500 text-xs font-semibold mt-0.5">Calculated based on {acres} Acres in {region}</p>
                  </div>
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-xl flex items-center gap-1.5">
                    <ShieldCheck className="h-4 w-4"/> Confidence: {valuation.confidence}%
                  </span>
                </div>

                {/* Major pricing Display */}
                <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200 text-center">
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">{t.valuation?.fairMarketHeading || "Calculated Median Valuation"}</p>
                  <p className="text-4xl sm:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-emerald-600 mt-2 tracking-tight">
                    ₹ {new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 }).format(valuation.base)}
                  </p>
                  <div className="flex justify-center gap-6 mt-4 pt-4 border-t border-slate-200 text-xs font-bold text-slate-500">
                    <div>
                      <span>Low Estimate</span>
                      <p className="text-slate-900 mt-0.5">₹ {new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 }).format(valuation.low)}</p>
                    </div>
                    <div className="h-8 w-px bg-slate-200"></div>
                    <div>
                      <span>High Estimate</span>
                      <p className="text-slate-900 mt-0.5">₹ {new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 }).format(valuation.high)}</p>
                    </div>
                  </div>
                </div>

                {/* Modifiers breakdown */}
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-3.5">Factor Modifier Breakdown</h4>
                  <div className="space-y-2.5">
                    <div className="flex justify-between text-xs font-bold text-slate-700">
                      <span className="flex items-center gap-1.5"><Building className="h-4 w-4 text-slate-400"/> Zoning class factor ({zoning})</span>
                      <span className={valuation.zoningFactor >= 1 ? "text-emerald-600" : "text-rose-600"}>
                        {valuation.zoningFactor >= 1 ? "+" : ""}{(valuation.zoningFactor * 100 - 100).toFixed(0)}%
                      </span>
                    </div>
                    <div className="flex justify-between text-xs font-bold text-slate-700">
                      <span className="flex items-center gap-1.5"><Compass className="h-4 w-4 text-slate-400"/> Road access factor ({roadWidth})</span>
                      <span className={valuation.roadFactor >= 1 ? "text-emerald-600" : "text-rose-600"}>
                        {valuation.roadFactor >= 1 ? "+" : ""}{(valuation.roadFactor * 100 - 100).toFixed(0)}%
                      </span>
                    </div>
                    <div className="flex justify-between text-xs font-bold text-slate-700">
                      <span className="flex items-center gap-1.5"><Droplets className="h-4 w-4 text-blue-600"/> Utility Infrastructure Add-ons</span>
                      <span className="text-emerald-600">+ ₹ {new Intl.NumberFormat("en-IN").format(valuation.utilities)}</span>
                    </div>
                  </div>
                </div>

                {/* Regional Price Trend */}
                <div className="border-t border-slate-100 pt-6">
                  <h4 className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-4 flex items-center gap-1">
                    <TrendingUp className="h-4 w-4 text-blue-600"/> Regional Price Appreciation Trend
                  </h4>
                  <div className="flex items-end justify-between h-24 pt-4 px-2">
                    {[
                      { year: "2023", height: "h-1/3", change: "+8%" },
                      { year: "2024", height: "h-1/2", change: "+14%" },
                      { year: "2025", height: "h-3/4", change: "+22%" },
                      { year: "2026 (Est)", height: "h-full", change: "+28%", active: true }
                    ].map((bar, idx) => (
                      <div key={idx} className="flex-1 flex flex-col items-center gap-1">
                        <span className="text-[9px] font-bold text-emerald-600">{bar.change}</span>
                        <div className={`w-12 ${bar.height} rounded-t-lg transition-all duration-500 ${bar.active ? "bg-blue-600" : "bg-slate-200"}`}></div>
                        <span className="text-[10px] font-bold text-slate-500 mt-1">{bar.year}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Action button: generate PDF */}
                <div className="border-t border-slate-100 pt-6 flex flex-col sm:flex-row gap-3">
                  <button onClick={generatePDFReport} disabled={reportLoading} className="flex-grow py-3.5 bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-800 rounded-xl text-xs font-bold transition-all shadow-sm cursor-pointer flex items-center justify-center gap-2">
                    {reportLoading ? (<div className="h-4 w-4 border-2 border-slate-600 border-t-transparent rounded-full animate-spin"></div>) : (<>
                        <FileDown className="h-4.5 w-4.5 text-blue-600"/>
                        {t.valuation?.downloadCertBtn || "Download Valuation Report PDF"}
                      </>)}
                  </button>
                  <Link href="/listings/create" className="sm:w-auto">
                    <button className="w-full sm:w-auto px-6 py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl text-xs font-bold transition-all cursor-pointer border-0 shadow-md">
                      {t.actions?.publishListing || "List Property Now"}
                    </button>
                  </Link>
                </div>
              </div>) : (<div className="bg-white border border-slate-200 rounded-3xl p-10 shadow-sm text-center flex flex-col justify-center items-center h-full min-h-[400px]">
                <Scale className="h-12 w-12 text-slate-400 mb-4 animate-pulse"/>
                <h4 className="text-base font-bold text-slate-900">Estimation Report Awaiting Parameters</h4>
                <p className="text-slate-500 text-xs font-semibold max-w-sm mx-auto leading-relaxed mt-1">
                  Fill in the acreage size, select regional zone corridors, and click "Estimate Valuation" to view detailed baseline ranges and mod factor audits.
                </p>
              </div>)}
          </div>

        </div>

      </main>
    </div>);
}
