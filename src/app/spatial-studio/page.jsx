"use client";

import Navbar from "@/components/Navbar";
import LandCanvas3D from "@/components/LandCanvas3D";
import AIFeasibilityStudio from "@/components/AIFeasibilityStudio";
import TNLandGovHub from "@/components/TNLandGovHub";
import { useRouter } from "next/navigation";
import { getLoggedInUser } from "@/lib/auth";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Sparkles, Layers, ShieldCheck, MapPin, ArrowRight, CheckCircle2, DollarSign, Lock, Award, FileText, ChevronRight } from "lucide-react";

export default function SpatialStudioPage() {
  const router = useRouter();
  const [properties, setProperties] = useState([]);
  const [selectedPropertyId, setSelectedPropertyId] = useState("");
  const [activeVertical, setActiveVertical] = useState("commercial");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const user = getLoggedInUser();
    if (!user) {
      router.push("/signup");
    }
  }, [router]);

  useEffect(() => {
    async function loadProperties() {
      try {
        const res = await fetch("/api/properties");
        if (res.ok) {
          const data = await res.json();
          setProperties(data);
          if (data.length > 0) {
            setSelectedPropertyId(data[0].id);
          }
        }
      } catch (err) {
        console.error("Failed to load properties for studio:", err);
      } finally {
        setLoading(false);
      }
    }
    loadProperties();
  }, []);

  const selectedProperty = properties.find((p) => String(p.id) === String(selectedPropertyId)) || properties[0];

  return (
    <div className="min-h-screen text-white font-sans pb-16">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
        
        {/* Header Block */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800/80 pb-6">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-extrabold uppercase tracking-wider mb-3">
              <Sparkles className="h-3.5 w-3.5 text-cyan-400 animate-spin" style={{ animationDuration: "4s" }} />
              <span>World-First Spatial 3D & AI Feasibility Studio</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
              Interactive 3D Land & Development Engine
            </h1>
            <p className="text-slate-400 font-medium text-sm mt-1 max-w-2xl">
              Visualize 3D topography elevation, test building massing volumes, analyze soil & groundwater heatmaps, cross-verify TN TamilNilam land deeds, and generate institutional due-diligence briefs in real-time.
            </p>
          </div>

          {/* Property Selector Dropdown */}
          <div className="flex items-center gap-3">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider shrink-0">Select Parcel:</label>
            <select
              value={selectedPropertyId}
              onChange={(e) => setSelectedPropertyId(e.target.value)}
              className="px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 font-bold text-xs text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/20 cursor-pointer"
            >
              {properties.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.title.length > 35 ? p.title.substring(0, 35) + "..." : p.title} (₹{(p.price / 10000000).toFixed(1)} Cr)
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* 3D Spatial Canvas Section */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Layers className="h-5 w-5 text-indigo-600" />
              Real-Time 3D Spatial Topography & Building Massing
            </h2>
            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
              Live WebGL Acceleration
            </span>
          </div>

          <LandCanvas3D selectedProperty={selectedProperty} activeVertical={activeVertical} />
        </section>

        {/* TamilNilam & Govt Revenue Verification Hub */}
        <section className="space-y-4">
          <TNLandGovHub property={selectedProperty} />
        </section>

        {/* AI Feasibility & Highest-and-Best-Use Engine */}
        <section className="space-y-4">
          <AIFeasibilityStudio
            property={selectedProperty}
            activeVertical={activeVertical}
            setActiveVertical={setActiveVertical}
          />
        </section>

        {/* Multi-Party Deal Room CTA Banner */}
        <section className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-8 sm:p-10 shadow-2xl text-white relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-3 max-w-2xl relative z-10">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 text-xs font-bold uppercase tracking-wider">
              <ShieldCheck className="h-3.5 w-3.5" />
              <span>Smart Escrow & Deal Room</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-black tracking-tight leading-tight">
              Ready to execute deal terms with cryptographic verification?
            </h3>
            <p className="text-slate-300 font-medium text-xs sm:text-sm leading-relaxed">
              Connect directly with verified landowners, submit advance token escrow proposals, and sign digital deal certificates.
            </p>
          </div>

          <Link href="/inbox" className="shrink-0 relative z-10">
            <button className="flex items-center gap-2.5 px-8 py-4 rounded-xl bg-indigo-600 hover:bg-indigo-505 text-white font-bold text-sm shadow-xl shadow-indigo-600/30 hover:scale-[1.02] transition-all cursor-pointer border-0">
              Open Negotiation Deal Room
              <ArrowRight className="h-4.5 w-4.5" />
            </button>
          </Link>
        </section>

      </main>
    </div>
  );
}

