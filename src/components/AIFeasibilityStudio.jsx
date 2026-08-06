"use client";

import { useState } from "react";
import { Sparkles, TrendingUp, Building, ArrowUpRight, ShieldCheck, Download, CheckCircle2, DollarSign, Layers, Clock, Zap, AlertCircle, Send } from "lucide-react";

export default function AIFeasibilityStudio({ property, activeVertical: parentVertical, setActiveVertical: parentSetVertical }) {
  const [internalVertical, setInternalVertical] = useState("commercial");
  const [downloading, setDownloading] = useState(false);

  const activeVertical = parentVertical || internalVertical;
  const setActiveVertical = (val) => {
    setInternalVertical(val);
    if (parentSetVertical) parentSetVertical(val);
  };

  const price = property?.price || 45000000;
  const acres = 10;
  const location = property?.location || "Coimbatore, Tamil Nadu";

  const verticals = {
    commercial: {
      title: "Commercial IT / Tech Park",
      icon: Building,
      badgeColor: "bg-cyan-500/20 border-cyan-500/40 text-cyan-400",
      accentBg: "bg-gradient-to-r from-cyan-500 to-indigo-600",
      fsi: "3.5 FSI",
      estimatedInvestment: "₹ 85 Cr",
      roi5Yr: "+28.4%",
      paybackMonths: "42 Months",
      suitabilityScore: 96,
      highlights: [
        "Proximity to Highway Node (1.2 km)",
        "High-density IT Zoning Approval",
        "Load-bearing Soil Capacity: 280 kN/m²",
        "Fiber Optic Substation Available"
      ],
      description: "Highest revenue yield. Excellent match for grade-A office space, tech incubation parks, or co-working towers."
    },
    industrial: {
      title: "Industrial & Logistics Park",
      icon: Zap,
      badgeColor: "bg-amber-500/20 border-amber-500/40 text-amber-400",
      accentBg: "bg-amber-600",
      fsi: "2.1 FSI",
      estimatedInvestment: "₹ 48 Cr",
      roi5Yr: "+22.1%",
      paybackMonths: "36 Months",
      suitabilityScore: 91,
      highlights: [
        "Heavy Vehicle Access (4-Lane Highway)",
        "11kV Industrial Power Grid Access",
        "Groundwater Table: 18m Depth",
        "Clear Industrial Pollution Clearance"
      ],
      description: "Low upfront capital intensity. Prime candidate for e-commerce fulfillment centers or light assembly plants."
    },
    residential: {
      title: "High-Rise Residential Enclave",
      icon: TrendingUp,
      badgeColor: "bg-emerald-500/20 border-emerald-500/40 text-emerald-400",
      accentBg: "bg-emerald-600",
      fsi: "2.8 FSI",
      estimatedInvestment: "₹ 62 Cr",
      roi5Yr: "+24.8%",
      paybackMonths: "48 Months",
      suitabilityScore: 88,
      highlights: [
        "Nearby Metro Connectivity (2.4 km)",
        "Residential Zone Conversion Ready",
        "Greenery & Solar Index: 92/100",
        "Municipal Water Line Available"
      ],
      description: "Strong retail buyer demand. High absorption rate for luxury apartments and gated villa communities."
    },
    agri: {
      title: "Eco Hydroponic & Solar Estate",
      icon: Layers,
      badgeColor: "bg-purple-500/20 border-purple-500/40 text-purple-400",
      accentBg: "bg-purple-600",
      fsi: "0.5 FSI",
      estimatedInvestment: "₹ 12 Cr",
      roi5Yr: "+16.5%",
      paybackMonths: "28 Months",
      suitabilityScore: 78,
      highlights: [
        "Rich Organic Alluvial Topsoil",
        "Active Borewell with High Discharge",
        "High Solar Irradiance Index",
        "Zero Pollution / Low Regulation Risk"
      ],
      description: "Sustainable eco-investment. Immediate cash flow from solar power PPA contracts and organic farming."
    }
  };

  const activeData = verticals[activeVertical] || verticals.commercial;

  const handleDownloadReport = () => {
    setDownloading(true);
    setTimeout(() => {
      setDownloading(false);
      const briefText = `
====================================================================
           LANDLINKX AI FEASIBILITY & DUE-DILIGENCE BRIEF
====================================================================
Property Title:         ${property?.title || "Prime Commercial Land"}
Location:               ${location}
Target Vertical:        ${activeData.title}
Suitability Score:      ${activeData.suitabilityScore} / 100
Permissible FSI Rating: ${activeData.fsi}
Est Capital Outlay:     ${activeData.estimatedInvestment}
Projected 5-Yr ROI:     ${activeData.roi5Yr}
Breakeven Horizon:      ${activeData.paybackMonths}

KEY SUITABILITY HIGHLIGHTS:
--------------------------------------------------------------------
${activeData.highlights.map((h, i) => `${i + 1}. ${h}`).join("\n")}

STRATEGIC RECOMMENDATION:
${activeData.description}
====================================================================
`;
      const blob = new Blob([briefText], { type: "text/plain" });
      const url = URL.createObjectURL(blob);
      const a = window.document.createElement("a");
      a.href = url;
      a.download = `AI_Feasibility_Brief_${activeVertical}_Parcel.txt`;
      a.click();
    }, 600);
  };

  const handleOpenDealRoom = () => {
    window.location.href = "/inbox";
  };

  return (
    <div className="bg-slate-900/85 backdrop-blur-2xl border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl text-white space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-extrabold uppercase tracking-wider mb-2">
            <Sparkles className="h-3.5 w-3.5 text-cyan-400" />
            AI Highest-and-Best-Use (HBU) Evaluation Engine
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            Predictive Investment & Development Feasibility
          </h3>
          <p className="text-xs text-slate-400 font-medium mt-1">
            Simulate financial ROI, capital payback periods, and regulatory suitability across development verticals.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={handleDownloadReport}
            disabled={downloading}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-black text-xs shadow-md transition-all cursor-pointer border border-slate-700 active:scale-95 disabled:opacity-50"
          >
            <Download className="h-4 w-4 text-cyan-400" />
            <span>{downloading ? "Generating Brief..." : "Download Feasibility Brief"}</span>
          </button>

          <button
            type="button"
            onClick={handleOpenDealRoom}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-black text-xs shadow-lg shadow-cyan-500/30 transition-all cursor-pointer border-0 active:scale-95"
          >
            <Send className="h-4 w-4" />
            <span>Open Deal Room</span>
          </button>
        </div>
      </div>

      {/* Development Vertical Selection Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {Object.keys(verticals).map((vKey) => {
          const item = verticals[vKey];
          const Icon = item.icon;
          const isSelected = activeVertical === vKey;

          return (
            <button
              key={vKey}
              type="button"
              onClick={() => setActiveVertical(vKey)}
              className={`p-4 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between h-28 relative ${
                isSelected
                  ? "bg-gradient-to-r from-cyan-500 to-indigo-600 border-cyan-400 text-white shadow-xl shadow-cyan-500/30 scale-[1.03]"
                  : "bg-slate-950 border-slate-800 text-slate-300 hover:bg-slate-800 hover:border-slate-700"
              }`}
            >
              <div className="flex items-center justify-between w-full">
                <Icon className={`h-5 w-5 ${isSelected ? "text-white" : "text-cyan-400"}`} />
                <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${isSelected ? "bg-white/20 text-white" : "bg-cyan-500/10 text-cyan-300 border border-cyan-500/30"}`}>
                  {item.suitabilityScore}% Match
                </span>
              </div>

              <div>
                <p className={`text-xs font-black line-clamp-1 ${isSelected ? "text-white" : "text-white"}`}>{item.title}</p>
                <p className={`text-[10px] font-bold mt-0.5 ${isSelected ? "text-cyan-100" : "text-slate-400"}`}>{item.fsi} | {item.roi5Yr} ROI</p>
              </div>
            </button>
          );
        })}
      </div>

      {/* Selected Vertical Feasibility Metrics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 p-5 rounded-2xl bg-slate-950 border border-slate-800">
        <div className="space-y-1 border-r border-slate-800/80 pr-3">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
            <DollarSign className="h-3.5 w-3.5 text-cyan-400" />
            Est. Capital Outlay
          </span>
          <p className="text-2xl font-black text-white">{activeData.estimatedInvestment}</p>
          <p className="text-xs text-slate-400 font-semibold">Total Development Cost</p>
        </div>

        <div className="space-y-1 border-r border-slate-800/80 pr-3">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
            <TrendingUp className="h-3.5 w-3.5 text-emerald-400" />
            Projected 5-Yr ROI
          </span>
          <p className="text-2xl font-black text-emerald-400">{activeData.roi5Yr}</p>
          <p className="text-xs text-slate-400 font-semibold">Internal Rate of Return (IRR)</p>
        </div>

        <div className="space-y-1 border-r border-slate-800/80 pr-3">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
            <Sparkles className="h-3.5 w-3.5 text-cyan-400" />
            AI Suitability Score
          </span>
          <p className="text-2xl font-black text-cyan-300">{activeData.suitabilityScore} / 100</p>
          <p className="text-xs text-slate-400 font-semibold">Algorithmic Match Index</p>
        </div>

        <div className="space-y-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
            <Clock className="h-3.5 w-3.5 text-amber-400" />
            Capital Payback Horizon
          </span>
          <p className="text-2xl font-black text-white">{activeData.paybackMonths}</p>
          <p className="text-xs text-slate-400 font-semibold">Breakeven Period</p>
        </div>
      </div>

      {/* Detailed Analysis Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-2">
        <div className="space-y-4">
          <h4 className="text-sm font-black text-white flex items-center gap-2">
            <ShieldCheck className="h-4.5 w-4.5 text-cyan-400" />
            Strategic Feasibility Recommendation
          </h4>
          <p className="text-xs text-slate-300 font-medium leading-relaxed bg-slate-950 p-4 rounded-2xl border border-slate-800 shadow-sm">
            {activeData.description}
          </p>

          <div className="space-y-2">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Zoning & FSI Capacity</span>
            <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-950 border border-slate-800">
              <span className="text-xs font-bold text-slate-300">Maximum Permissible FSI Rating</span>
              <span className="text-xs font-black text-cyan-300 bg-cyan-500/10 px-3 py-1 rounded-xl border border-cyan-500/30">
                {activeData.fsi}
              </span>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <h4 className="text-sm font-black text-white flex items-center gap-2">
            <CheckCircle2 className="h-4.5 w-4.5 text-emerald-400" />
            Key Site Suitability Highlights
          </h4>
          <div className="space-y-2">
            {activeData.highlights.map((h, i) => (
              <div key={i} className="flex items-center gap-2.5 p-3 rounded-2xl bg-slate-950 border border-slate-800 text-xs font-bold text-slate-200 shadow-sm">
                <div className="h-5.5 w-5.5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-500/40">
                  <CheckCircle2 className="h-4 w-4" />
                </div>
                <span>{h}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

    </div>
  );
}