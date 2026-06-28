"use client";
import Navbar from "@/components/Navbar";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getLoggedInUser } from "@/lib/auth";
import Link from "next/link";
import { TrendingUp, MapPin, ShieldCheck, ArrowUpRight, PieChart, Users, Percent, Check, X } from "lucide-react";
export default function InvestorDashboard() {
    const router = useRouter();
    const [user, setUser] = useState(null);
    const [vettedDeals, setVettedDeals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [syndicates, setSyndicates] = useState([
        { id: "syn1", title: "Whitefield Retail JV Corridor", targetIrr: 26.4, minInvestment: 5000000, targetAmt: 120000000, raisedAmt: 96000000, developer: "Sterling Group" },
        { id: "syn2", title: "Hyderabad SEZ Tech Park Phase 2", targetIrr: 22.8, minInvestment: 10000000, targetAmt: 250000000, raisedAmt: 112500000, developer: "Capital Horizon" }
    ]);
    const [activeSyn, setActiveSyn] = useState(null);
    const [fundAmount, setFundAmount] = useState(0);
    const [fundState, setFundState] = useState("idle");
    const [fundText, setFundText] = useState("");
    const [stepIndex, setStepIndex] = useState(0);
    const formatAmount = (num) => {
        if (num >= 10000000) {
            return `₹${(num / 10000000).toFixed(2)} Cr`;
        }
        if (num >= 100000) {
            return `₹${(num / 100000).toFixed(2)} Lakhs`;
        }
        return `₹${num.toLocaleString("en-IN")}`;
    };
    const handleConfirmFund = () => {
        if (fundAmount < activeSyn.minInvestment)
            return;
        setFundState("processing");
        setStepIndex(0);
        setFundText("Accredited investor criteria verification...");
        setTimeout(() => {
            setStepIndex(1);
            setFundText("Handshaking with bank escrow ledger API...");
            setTimeout(() => {
                setStepIndex(2);
                setFundText("Writing fractional registry lease contract...");
                setTimeout(() => {
                    setStepIndex(3);
                    setFundState("success");
                    setFundText("");
                    // Update the syndicate's raised amount in the state
                    setSyndicates(prev => prev.map(s => {
                        if (s.id === activeSyn.id) {
                            return { ...s, raisedAmt: s.raisedAmt + fundAmount };
                        }
                        return s;
                    }));
                }, 800);
            }, 800);
        }, 800);
    };
    useEffect(() => {
        const activeUser = getLoggedInUser();
        if (!activeUser) {
            router.push("/login");
            return;
        }
        if (activeUser.role.toLowerCase() !== "investor") {
            router.push("/dashboard");
            return;
        }
        setUser(activeUser);
        async function fetchProperties() {
            try {
                const res = await fetch("/api/properties");
                if (res.ok) {
                    const data = await res.json();
                    setVettedDeals(data.slice(-3));
                }
            }
            catch (err) {
                console.error(err);
            }
            finally {
                setLoading(false);
            }
        }
        fetchProperties();
    }, [router]);
    if (!user)
        return null;
    const stats = [
        { label: "Portfolio Value", value: "₹18.4 Cr", icon: PieChart, color: "text-indigo-400 bg-indigo-950/40 border-indigo-900/50" },
        { label: "Projected IRR", value: "24.8% Average", icon: Percent, color: "text-emerald-400 bg-emerald-950/40 border-emerald-900/50" },
        { label: "Co-Investment Slots", value: "2 Active", icon: Users, color: "text-amber-400 bg-amber-950/40 border-amber-900/50" },
    ];
    return (<div className="min-h-screen bg-transparent text-slate-100 flex flex-col font-sans">
      <Navbar />

      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-800 pb-6">
          <div>
            <h1 className="text-3xl font-black text-white tracking-tight">
              Investor Asset Portal
            </h1>
            <p className="text-slate-400 font-semibold text-sm mt-1">
              Welcome back, {user.name} ({user.role}). Review capital yields and vetted joint ventures.
            </p>
          </div>
          <Link href="/listings" className="shrink-0">
            <button className="flex items-center gap-2 px-5 py-3 rounded-xl bg-indigo-650 hover:bg-indigo-600 text-white font-bold text-sm shadow-md transition-all active:scale-[0.98] cursor-pointer border-0">
              <TrendingUp className="h-4.5 w-4.5"/>
              Analyze High-Growth Corridors
            </button>
          </Link>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {stats.map((stat, idx) => {
            const Icon = stat.icon;
            return (<div key={idx} className="bg-[#090d16]/75 border border-slate-800/80 p-6 rounded-3xl shadow-2xl flex items-center gap-4">
                <div className={`h-12 w-12 rounded-2xl border ${stat.color} flex items-center justify-center`}>
                  <Icon className="h-6 w-6"/>
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">{stat.label}</p>
                  <p className="text-xl font-black text-white mt-1">{stat.value}</p>
                </div>
              </div>);
        })}
        </div>

        {/* Content Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Vetted Matching Deals */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <TrendingUp className="h-4.5 w-4.5 text-indigo-400"/>
                High-IRR Investment Leads ({vettedDeals.length})
              </h3>
              <Link href="/listings" className="text-xs font-bold text-indigo-400 hover:text-indigo-300">
                View deal catalog
              </Link>
            </div>

            {loading ? (<div className="space-y-3">
                {[1, 2].map((num) => (<div key={num} className="bg-[#090d16] h-24 rounded-2xl border border-slate-800/80 animate-pulse"></div>))}
              </div>) : vettedDeals.length === 0 ? (<div className="text-center py-12 bg-[#090d16]/50 rounded-3xl border border-slate-800/80 p-6 shadow-2xl">
                <p className="text-sm font-semibold text-slate-400">No active high-yield opportunities in database.</p>
              </div>) : (<div className="space-y-4">
                {vettedDeals.map((prop) => (<div key={prop.id} className="bg-[#090d16]/75 border border-slate-800 rounded-3xl p-5 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:shadow-2xl transition-all duration-300">
                    <div className="flex items-center gap-4">
                      <div className="h-16 w-16 rounded-2xl overflow-hidden bg-slate-800 shrink-0">
                        <img src={prop.image && prop.image.startsWith("http") ? prop.image : "https://images.unsplash.com/photo-1502082553048-f009c37129b9?w=100"} alt="" className="h-full w-full object-cover"/>
                      </div>
                      <div>
                        <h4 className="font-bold text-white text-sm line-clamp-1">{prop.title}</h4>
                        <p className="text-xs text-slate-400 font-semibold mt-0.5 flex items-center gap-1">
                          <MapPin className="h-3 w-3 text-indigo-405"/> {prop.location}
                        </p>
                        <span className="inline-flex mt-2 text-[10px] font-bold text-slate-300 bg-slate-955 border border-slate-800 px-2 py-0.5 rounded">
                          ₹ {new Intl.NumberFormat("en-IN").format(prop.price)}
                        </span>
                      </div>
                    </div>
                    <Link href="/listings" className="shrink-0">
                      <button className="flex items-center gap-1.5 px-4 py-2 border border-slate-800 hover:bg-slate-900 bg-slate-955/40 text-slate-300 rounded-xl text-xs font-bold transition-all cursor-pointer">
                        Initiate Review
                        <ArrowUpRight className="h-3.5 w-3.5 text-indigo-400"/>
                      </button>
                    </Link>
                  </div>))}
              </div>)}
          </div>

          {/* Sidebar */}
          <div className="space-y-6 lg:col-span-1">
            
            {/* Quick Actions */}
            <div className="bg-[#090d16]/75 border border-slate-800 rounded-3xl p-5 shadow-2xl space-y-4">
              <h4 className="text-sm font-bold text-white border-b border-slate-800 pb-3">Capital Tools</h4>
              <div className="grid grid-cols-1 gap-2.5">
                <Link href="/ai-price">
                  <div className="flex items-center gap-3 p-3 border border-slate-800 rounded-xl hover:bg-slate-900 bg-slate-955/40 cursor-pointer">
                    <div className="h-8 w-8 rounded-lg bg-indigo-950/40 text-indigo-400 flex items-center justify-center shrink-0">
                      <TrendingUp className="h-4 w-4"/>
                    </div>
                    <span className="text-xs font-bold text-slate-300">AI Registry Valuation Tool</span>
                  </div>
                </Link>
                <div className="flex items-center gap-3 p-3 border border-slate-800 rounded-xl hover:bg-slate-900 bg-slate-955/40 cursor-pointer">
                  <div className="h-8 w-8 rounded-lg bg-emerald-950/40 text-emerald-405 flex items-center justify-center shrink-0">
                    <ShieldCheck className="h-4 w-4"/>
                  </div>
                  <span className="text-xs font-bold text-slate-300">Registry Title Clearance Logs</span>
                </div>
              </div>
            </div>

            {/* Co-Investment Slots */}
            <div className="bg-[#090d16]/75 border border-slate-800 rounded-3xl p-5 shadow-2xl space-y-4">
              <h4 className="text-sm font-bold text-white border-b border-slate-800 pb-3">Active Co-Investment Syndicates</h4>
              <div className="space-y-4 text-xs font-bold">
                {syndicates.map((syn) => {
            const percentFunded = Math.min(100, Math.round((syn.raisedAmt / syn.targetAmt) * 100));
            return (<div key={syn.id} className="border border-slate-850 bg-slate-955/30 p-4 rounded-2xl space-y-3">
                      <div className="space-y-0.5">
                        <p className="text-xs font-bold text-white leading-tight">{syn.title}</p>
                        <p className="text-[10px] text-slate-500 font-semibold">{syn.developer} &bull; Developer partner</p>
                      </div>
                      
                      <div className="flex justify-between text-[11px]">
                        <span className="text-emerald-400 font-bold">{syn.targetIrr}% IRR Target</span>
                        <span className="text-indigo-405 font-bold">Min Slot: {formatAmount(syn.minInvestment)}</span>
                      </div>

                      {/* Progress Bar */}
                      <div className="space-y-1.5">
                        <div className="flex justify-between text-[10px] text-slate-400 font-semibold">
                          <span>{formatAmount(syn.raisedAmt)} raised</span>
                          <span>{percentFunded}%</span>
                        </div>
                        <div className="h-1.5 w-full bg-slate-950 rounded-full overflow-hidden border border-slate-850">
                          <div className="h-full bg-gradient-to-r from-indigo-500 to-indigo-650 rounded-full transition-all duration-500" style={{ width: `${percentFunded}%` }}/>
                        </div>
                        <p className="text-[9px] text-slate-500 font-semibold">Target Pool: {formatAmount(syn.targetAmt)}</p>
                      </div>

                      <button onClick={() => {
                    setActiveSyn(syn);
                    setFundAmount(syn.minInvestment);
                    setFundState("idle");
                    setStepIndex(0);
                    setFundText("");
                }} className="w-full py-2 bg-indigo-600/10 hover:bg-indigo-650 hover:text-white border border-indigo-600/30 text-indigo-400 text-xs font-bold rounded-xl transition-all cursor-pointer text-center">
                        Fund Joint-Venture Slot
                      </button>
                    </div>);
        })}
              </div>
            </div>

          </div>

        </div>

      </main>

      {/* Co-Investment Commitment Modal */}
      {activeSyn && (<div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-[#090d16] border border-slate-800 p-6 sm:p-8 rounded-3xl max-w-md w-full shadow-2xl relative space-y-6 animate-in zoom-in-95 duration-200">
            {/* Close Button */}
            <button onClick={() => fundState !== "processing" && setActiveSyn(null)} disabled={fundState === "processing"} className="absolute right-4 top-4 text-slate-400 hover:text-white disabled:opacity-30 cursor-pointer transition-all border-0 bg-transparent">
              <X className="h-5 w-5"/>
            </button>

            {fundState === "idle" && (<>
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-indigo-400 bg-indigo-950/40 border border-indigo-900/50 px-2.5 py-1 rounded-full uppercase tracking-wider">
                    Fractional Syndicate Placement
                  </span>
                  <h3 className="text-lg font-black text-white mt-2 leading-tight">
                    {activeSyn.title}
                  </h3>
                  <p className="text-xs text-slate-400 font-semibold">
                    Developer partner: {activeSyn.developer}
                  </p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                      Investment Commitment Amount (INR)
                    </label>
                    <input type="number" min={activeSyn.minInvestment} step={100000} value={fundAmount} onChange={(e) => setFundAmount(Number(e.target.value))} className="w-full px-4 py-3 rounded-xl bg-slate-955 border border-slate-850 focus:outline-none focus:ring-2 focus:ring-indigo-500/15 focus:border-indigo-500 text-sm font-semibold text-white placeholder:text-slate-600"/>
                    <p className="text-[10px] text-indigo-400 font-bold mt-1.5">
                      Minimum investment: {formatAmount(activeSyn.minInvestment)}
                    </p>
                  </div>

                  {/* Calculations breakdown */}
                  <div className="bg-slate-950 p-4 rounded-2xl border border-slate-850 space-y-2.5 text-xs font-bold">
                    <div className="flex justify-between text-slate-400">
                      <span>Pro-Rata Equity Share:</span>
                      <span className="text-slate-200">
                        {((fundAmount / activeSyn.targetAmt) * 100).toFixed(4)}%
                      </span>
                    </div>
                    <div className="flex justify-between text-slate-400">
                      <span>Target yield (IRR):</span>
                      <span className="text-emerald-405">{activeSyn.targetIrr}% / year</span>
                    </div>
                    <div className="h-px bg-slate-900 my-1"></div>
                    <div className="flex justify-between text-white">
                      <span>Projected Annual Return:</span>
                      <span className="text-indigo-400">
                        {formatAmount(fundAmount * (activeSyn.targetIrr / 100))}
                      </span>
                    </div>
                  </div>
                </div>

                {fundAmount < activeSyn.minInvestment && (<p className="text-xs font-bold text-rose-455 text-center bg-rose-955/20 border border-rose-900/40 p-2.5 rounded-xl">
                    Error: Amount is below the syndicate minimum slot.
                  </p>)}

                <button onClick={handleConfirmFund} disabled={fundAmount < activeSyn.minInvestment} className="w-full py-3.5 bg-indigo-650 hover:bg-indigo-600 disabled:bg-slate-800 disabled:text-slate-500 text-white rounded-2xl font-bold text-sm shadow-md transition-all active:scale-[0.98] cursor-pointer text-center border-0">
                  Verify KYC & Confirm Capital Call
                </button>
              </>)}

            {fundState === "processing" && (<div className="py-6 flex flex-col items-center justify-center text-center space-y-6">
                <div className="relative h-14 w-14 flex items-center justify-center">
                  <div className="absolute inset-0 border-4 border-indigo-500/10 rounded-full"></div>
                  <div className="absolute inset-0 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
                <div className="space-y-2">
                  <h4 className="text-base font-bold text-white">Escrow Placement in Progress</h4>
                  <p className="text-xs text-indigo-300 font-semibold max-w-xs mx-auto leading-relaxed">
                    {fundText}
                  </p>
                </div>

                {/* Animated timeline list */}
                <div className="w-full max-w-xs bg-slate-950 p-4 rounded-2xl border border-slate-850 text-left space-y-3">
                  {[
                    "Accredited KYC clearance check",
                    "Escrow banking ledger handshake",
                    "Lease registry smart contract allocation"
                ].map((step, idx) => {
                    const isDone = stepIndex > idx;
                    const isCurrent = stepIndex === idx;
                    return (<div key={idx} className="flex items-center gap-2.5 text-xs font-bold">
                        {isDone ? (<div className="h-4.5 w-4.5 rounded-full bg-emerald-950 border border-emerald-900 text-emerald-400 flex items-center justify-center shrink-0">
                            <Check className="h-3 w-3"/>
                          </div>) : isCurrent ? (<div className="h-4.5 w-4.5 rounded-full bg-indigo-950 border border-indigo-900 text-indigo-400 flex items-center justify-center shrink-0">
                            <div className="h-1.5 w-1.5 bg-indigo-400 rounded-full animate-ping"></div>
                          </div>) : (<div className="h-4.5 w-4.5 rounded-full bg-slate-900 border border-slate-800 text-slate-600 flex items-center justify-center shrink-0">
                            <span className="h-1 w-1 bg-slate-700 rounded-full"></span>
                          </div>)}
                        <span className={isDone ? "text-slate-400 font-medium" : isCurrent ? "text-indigo-300" : "text-slate-600"}>
                          {step}
                        </span>
                      </div>);
                })}
                </div>
              </div>)}

            {fundState === "success" && (<div className="py-6 flex flex-col items-center justify-center text-center space-y-5 animate-in fade-in duration-300">
                <div className="h-14 w-14 rounded-full bg-emerald-950/60 border border-emerald-900 text-emerald-405 flex items-center justify-center shrink-0 shadow-lg shadow-emerald-900/10">
                  <Check className="h-7 w-7"/>
                </div>
                <div className="space-y-2">
                  <h4 className="text-lg font-black text-white">Commitment Successful!</h4>
                  <p className="text-xs text-slate-400 font-semibold leading-relaxed max-w-xs mx-auto">
                    Successfully locked <span className="text-indigo-400">{formatAmount(fundAmount)}</span> into the escrow vault for <span className="text-slate-200">{activeSyn.title}</span>.
                  </p>
                  <p className="text-[10px] text-slate-505 font-bold bg-slate-950 border border-slate-900 px-3 py-1 rounded-full inline-block mt-2">
                    Tx ID: JV-ESC-{Math.floor(Math.random() * 900000) + 100000}
                  </p>
                </div>
                <button onClick={() => setActiveSyn(null)} className="w-full py-3 bg-slate-950 hover:bg-slate-900 border border-slate-850 hover:border-slate-700 text-slate-350 hover:text-white rounded-xl text-xs font-bold transition-all cursor-pointer text-center">
                  Close & View Dashboard
                </button>
              </div>)}
          </div>
        </div>)}
    </div>);
}
