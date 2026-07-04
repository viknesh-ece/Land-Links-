"use client";
import Navbar from "@/components/Navbar";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getLoggedInUser } from "@/lib/auth";
import Link from "next/link";
import { TrendingUp, MapPin, ShieldCheck, ArrowUpRight, PieChart, Users, Percent, Check, X, CreditCard, FileText, CheckCircle2 } from "lucide-react";
export default function InvestorDashboard() {
    const router = useRouter();
    const [user, setUser] = useState(null);
    const [vettedDeals, setVettedDeals] = useState([]);
    const [loading, setLoading] = useState(true);

    // Verification States
    const [showVerifyModal, setShowVerifyModal] = useState(false);
    const [verifyStep, setVerifyStep] = useState("form"); // "form" | "processing" | "success"
    const [cardNumber, setCardNumber] = useState("");
    const [expiry, setExpiry] = useState("");
    const [cvv, setCvv] = useState("");
    const [cardName, setCardName] = useState("");
    const [paymentError, setPaymentError] = useState("");

    const handleVerifyPayment = async (e) => {
        e.preventDefault();
        if (cardNumber.replace(/\s/g, "").length < 16 || expiry.length < 5 || cvv.length < 3 || !cardName) {
            setPaymentError("Please fill out all payment fields correctly.");
            return;
        }
        setPaymentError("");
        setVerifyStep("processing");

        setTimeout(async () => {
            try {
                const res = await fetch("/api/users/verify", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ userId: user.id })
                });
                const data = await res.json();
                if (res.ok) {
                    const updatedUser = { ...user, verified: true };
                    localStorage.setItem("landlinkx_user", JSON.stringify(updatedUser));
                    setUser(updatedUser);
                    window.dispatchEvent(new Event("auth-change"));
                    setVerifyStep("success");
                } else {
                    setPaymentError(data.message || "Verification failed");
                    setVerifyStep("form");
                }
            } catch (err) {
                console.error(err);
                setPaymentError("Server error. Please try again.");
                setVerifyStep("form");
            }
        }, 1200);
    };

    const handleDownloadReceipt = () => {
        const invoiceContent = `
========================================
         LANDLINKX TRANSACTION RECEIPT
========================================
Transaction ID: TXN-${Math.floor(10000000 + Math.random() * 90000000)}
Date: ${new Date().toLocaleDateString()}
Paid By: ${user.name} (${user.email})
Role: ${user.role}
Amount Paid: ₹9,999.00
Payment Method: Card ending in ${cardNumber.slice(-4)}
Status: SUCCESSFUL
Product: Yearly Premium Verification Subscription
========================================
   Thank you for choosing LandLinkX!
========================================
`;
        const blob = new Blob([invoiceContent], { type: "text/plain" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `landlinkx_receipt_${user.id}.txt`;
        link.click();
    };
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
        { label: "Portfolio Value", value: "₹18.4 Cr", icon: PieChart, color: "text-indigo-650 bg-indigo-50 border-indigo-200" },
        { label: "Projected IRR", value: "24.8% Average", icon: Percent, color: "text-emerald-705 bg-emerald-50 border-emerald-250" },
        { label: "Co-Investment Slots", value: "2 Active", icon: Users, color: "text-amber-705 bg-amber-50 border-amber-250" },
    ];
    return (<div className="min-h-screen bg-transparent text-slate-805 flex flex-col font-sans">
      <Navbar />

      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-205 pb-6">
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-2">
              Investor Asset Portal
              {user.verified ? (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold uppercase tracking-wider">
                  <ShieldCheck className="h-3.5 w-3.5"/> Verified Investor
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-slate-500/20 text-slate-400 border border-slate-500/30 text-[10px] font-bold uppercase tracking-wider">
                  Pending Verification
                </span>
              )}
            </h1>
            <p className="text-slate-605 font-semibold text-sm mt-1">
              Welcome back, {user.name} ({user.role}). Review capital yields and vetted joint ventures.
            </p>
          </div>
          <Link href="/listings" className="shrink-0">
            <button className="flex items-center gap-2 px-5 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-505 text-white font-bold text-sm shadow-md transition-all active:scale-[0.98] cursor-pointer border-0">
              <TrendingUp className="h-4.5 w-4.5"/>
              Analyze High-Growth Corridors
            </button>
          </Link>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {stats.map((stat, idx) => {
            const Icon = stat.icon;
            return (<div key={idx} className="bg-white/80 border border-slate-200 p-6 rounded-3xl shadow-2xl flex items-center gap-4">
                <div className={`h-12 w-12 rounded-2xl border ${stat.color} flex items-center justify-center`}>
                  <Icon className="h-6 w-6"/>
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">{stat.label}</p>
                  <p className="text-xl font-black text-slate-905 mt-1">{stat.value}</p>
                </div>
              </div>);
        })}
        </div>

        {/* Content Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Vetted Matching Deals */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-205 pb-3">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <TrendingUp className="h-4.5 w-4.5 text-indigo-650"/>
                High-IRR Investment Leads ({vettedDeals.length})
              </h3>
              <Link href="/listings" className="text-xs font-bold text-indigo-600 hover:text-indigo-805">
                View deal catalog
              </Link>
            </div>

            {loading ? (<div className="space-y-3">
                {[1, 2].map((num) => (<div key={num} className="bg-white/80 h-24 rounded-2xl border border-slate-200 animate-pulse"></div>))}
              </div>) : vettedDeals.length === 0 ? (<div className="text-center py-12 bg-white/50 rounded-3xl border border-slate-200 p-6 shadow-2xl">
                <p className="text-sm font-semibold text-slate-650">No active high-yield opportunities in database.</p>
              </div>) : (<div className="space-y-4">
                {vettedDeals.map((prop) => (<div key={prop.id} className="bg-white/85 border border-slate-200 rounded-3xl p-5 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:shadow-2xl transition-all duration-300">
                    <div className="flex items-center gap-4">
                      <div className="h-16 w-16 rounded-2xl overflow-hidden bg-slate-205 shrink-0">
                        <img src={prop.image && prop.image.startsWith("http") ? prop.image : "https://images.unsplash.com/photo-1502082553048-f009c37129b9?w=100"} alt="" className="h-full w-full object-cover"/>
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900 text-sm line-clamp-1">{prop.title}</h4>
                        <p className="text-xs text-slate-550 font-semibold mt-0.5 flex items-center gap-1">
                          <MapPin className="h-3 w-3 text-indigo-500"/> {prop.location}
                        </p>
                        <span className="inline-flex mt-2 text-[10px] font-bold text-slate-805 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded">
                          ₹ {new Intl.NumberFormat("en-IN").format(prop.price)}
                        </span>
                      </div>
                    </div>
                    <Link href="/listings" className="shrink-0">
                      <button className="flex items-center gap-1.5 px-4 py-2 border border-slate-202 hover:bg-slate-100 bg-white text-slate-700 rounded-xl text-xs font-bold transition-all cursor-pointer">
                        Initiate Review
                        <ArrowUpRight className="h-3.5 w-3.5 text-indigo-650"/>
                      </button>
                    </Link>
                  </div>))}
              </div>)}
          </div>

          {/* Sidebar */}
          <div className="space-y-6 lg:col-span-1">
            
            {/* Verification Status Upgrade Banner */}
            {!user.verified && (
              <div className="bg-gradient-to-br from-indigo-900/60 to-slate-900/80 border border-indigo-500/30 rounded-3xl p-5 shadow-2xl space-y-3.5 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/10 rounded-full blur-xl pointer-events-none"></div>
                <div className="flex items-start gap-3">
                  <div className="h-9 w-9 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center shrink-0 border border-indigo-500/30 animate-pulse">
                    <ShieldCheck className="h-5 w-5"/>
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-white uppercase tracking-wider">Accredited Verification</h4>
                    <p className="text-[10px] text-slate-300 font-semibold mt-1 leading-normal">
                      Verify your investor credentials, KYC status, and wallet bounds to unlock exclusive high-IRR developer deals.
                    </p>
                  </div>
                </div>
                <div className="flex justify-between items-center pt-1.5">
                  <span className="text-xs font-black text-indigo-300">₹9,999 / year</span>
                  <button onClick={() => { setShowVerifyModal(true); setVerifyStep("form"); }} className="px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-505 text-white font-bold text-[10px] uppercase tracking-wide border-0 cursor-pointer transition-all active:scale-[0.98]">
                    Get Verified
                  </button>
                </div>
              </div>
            )}

            {/* Quick Actions */}
            <div className="bg-white/80 border border-slate-202 rounded-3xl p-5 shadow-2xl space-y-4">
              <h4 className="text-sm font-bold text-slate-900 border-b border-slate-202 pb-3">Capital Tools</h4>
              <div className="grid grid-cols-1 gap-2.5">
                <Link href="/ai-price">
                  <div className="flex items-center gap-3 p-3 border border-slate-200 rounded-xl hover:bg-slate-50 bg-white cursor-pointer">
                    <div className="h-8 w-8 rounded-lg bg-indigo-50 text-indigo-650 flex items-center justify-center shrink-0">
                      <TrendingUp className="h-4 w-4"/>
                    </div>
                    <span className="text-xs font-bold text-slate-700">AI Registry Valuation Tool</span>
                  </div>
                </Link>
                <div onClick={() => { if(!user.verified) { setShowVerifyModal(true); setVerifyStep("form"); } }} className="flex items-center gap-3 p-3 border border-slate-200 rounded-xl hover:bg-slate-50 bg-white cursor-pointer">
                  <div className="h-8 w-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                    <ShieldCheck className="h-4 w-4"/>
                  </div>
                  <span className="text-xs font-bold text-slate-700">{user.verified ? "Accreditation Active" : "Registry Title Clearance Logs"}</span>
                </div>
              </div>
            </div>

            {/* Co-Investment Slots */}
            <div className="bg-white/80 border border-slate-202 rounded-3xl p-5 shadow-2xl space-y-4">
              <h4 className="text-sm font-bold text-slate-900 border-b border-slate-202 pb-3">Active Co-Investment Syndicates</h4>
              <div className="space-y-4 text-xs font-bold">
                {syndicates.map((syn) => {
            const percentFunded = Math.min(100, Math.round((syn.raisedAmt / syn.targetAmt) * 100));
            return (<div key={syn.id} className="border border-slate-200 bg-slate-50 p-4 rounded-2xl space-y-3">
                      <div className="space-y-0.5">
                        <p className="text-xs font-bold text-slate-805 leading-tight">{syn.title}</p>
                        <p className="text-[10px] text-slate-500 font-semibold">{syn.developer} &bull; Developer partner</p>
                      </div>
                      
                      <div className="flex justify-between text-[11px]">
                        <span className="text-emerald-700 font-bold">{syn.targetIrr}% IRR Target</span>
                        <span className="text-indigo-600 font-bold">Min Slot: {formatAmount(syn.minInvestment)}</span>
                      </div>

                      {/* Progress Bar */}
                      <div className="space-y-1.5">
                        <div className="flex justify-between text-[10px] text-slate-505 font-semibold">
                          <span>{formatAmount(syn.raisedAmt)} raised</span>
                          <span>{percentFunded}%</span>
                        </div>
                        <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
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
                }} className="w-full py-2 bg-indigo-50 hover:bg-indigo-600 hover:text-white border border-indigo-200 text-indigo-655 text-xs font-bold rounded-xl transition-all cursor-pointer text-center">
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
      {activeSyn && (<div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white border border-slate-200 p-6 sm:p-8 rounded-3xl max-w-md w-full shadow-2xl relative space-y-6 animate-in zoom-in-95 duration-200">
            {/* Close Button */}
            <button onClick={() => fundState !== "processing" && setActiveSyn(null)} disabled={fundState === "processing"} className="absolute right-4 top-4 text-slate-405 hover:text-slate-700 disabled:opacity-30 cursor-pointer transition-all border-0 bg-transparent">
              <X className="h-5 w-5"/>
            </button>

            {fundState === "idle" && (<>
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-indigo-650 bg-indigo-50 border border-indigo-200 px-2.5 py-1 rounded-full uppercase tracking-wider">
                    Fractional Syndicate Placement
                  </span>
                  <h3 className="text-lg font-black text-slate-900 mt-2 leading-tight">
                    {activeSyn.title}
                  </h3>
                  <p className="text-xs text-slate-655 font-semibold">
                    Developer partner: {activeSyn.developer}
                  </p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-550 mb-2">
                      Investment Commitment Amount (INR)
                    </label>
                    <input type="number" min={activeSyn.minInvestment} step={100000} value={fundAmount} onChange={(e) => setFundAmount(Number(e.target.value))} className="w-full px-4 py-3 rounded-xl bg-white border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/15 focus:border-indigo-500 text-sm font-semibold text-slate-900 placeholder:text-slate-400"/>
                    <p className="text-[10px] text-indigo-655 font-bold mt-1.5">
                      Minimum investment: {formatAmount(activeSyn.minInvestment)}
                    </p>
                  </div>

                  {/* Calculations breakdown */}
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2.5 text-xs font-bold">
                    <div className="flex justify-between text-slate-600">
                      <span>Pro-Rata Equity Share:</span>
                      <span className="text-slate-800">
                        {((fundAmount / activeSyn.targetAmt) * 100).toFixed(4)}%
                      </span>
                    </div>
                    <div className="flex justify-between text-slate-650">
                      <span>Target yield (IRR):</span>
                      <span className="text-emerald-700">{activeSyn.targetIrr}% / year</span>
                    </div>
                    <div className="h-px bg-slate-200 my-1"></div>
                    <div className="flex justify-between text-slate-900">
                      <span>Projected Annual Return:</span>
                      <span className="text-indigo-655">
                        {formatAmount(fundAmount * (activeSyn.targetIrr / 100))}
                      </span>
                    </div>
                  </div>
                </div>

                {fundAmount < activeSyn.minInvestment && (<p className="text-xs font-bold text-rose-700 text-center bg-rose-50 border border-rose-250 p-2.5 rounded-xl">
                    Error: Amount is below the syndicate minimum slot.
                  </p>)}

                <button onClick={handleConfirmFund} disabled={fundAmount < activeSyn.minInvestment} className="w-full py-3.5 bg-indigo-650 hover:bg-indigo-600 disabled:bg-slate-100 disabled:text-slate-400 text-white rounded-2xl font-bold text-sm shadow-md transition-all active:scale-[0.98] cursor-pointer text-center border-0">
                  Verify KYC & Confirm Capital Call
                </button>
              </>)}

            {fundState === "processing" && (<div className="py-6 flex flex-col items-center justify-center text-center space-y-6">
                <div className="relative h-14 w-14 flex items-center justify-center">
                  <div className="absolute inset-0 border-4 border-indigo-500/10 rounded-full"></div>
                  <div className="absolute inset-0 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
                <div className="space-y-2">
                  <h4 className="text-base font-bold text-slate-900">Escrow Placement in Progress</h4>
                  <p className="text-xs text-indigo-600 font-semibold max-w-xs mx-auto leading-relaxed">
                    {fundText}
                  </p>
                </div>

                {/* Animated timeline list */}
                <div className="w-full max-w-xs bg-slate-50 p-4 rounded-2xl border border-slate-200 text-left space-y-3">
                  {[
                    "Accredited KYC clearance check",
                    "Escrow banking ledger handshake",
                    "Lease registry smart contract allocation"
                  ].map((step, idx) => {
                    const isDone = stepIndex > idx;
                    const isCurrent = stepIndex === idx;
                    return (<div key={idx} className="flex items-center gap-2.5 text-xs font-bold">
                        {isDone ? (<div className="h-4.5 w-4.5 rounded-full bg-emerald-50 border border-emerald-250 text-emerald-705 flex items-center justify-center shrink-0">
                            <Check className="h-3 w-3"/>
                          </div>) : isCurrent ? (<div className="h-4.5 w-4.5 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-650 flex items-center justify-center shrink-0">
                            <div className="h-1.5 w-1.5 bg-indigo-650 rounded-full animate-ping"></div>
                          </div>) : (<div className="h-4.5 w-4.5 rounded-full bg-slate-100 border border-slate-200 text-slate-400 flex items-center justify-center shrink-0">
                            <span className="h-1 w-1 bg-slate-300 rounded-full"></span>
                          </div>)}
                        <span className={isDone ? "text-slate-655 font-medium" : isCurrent ? "text-indigo-650" : "text-slate-400"}>
                          {step}
                        </span>
                      </div>);
                })}
                </div>
              </div>)}

            {fundState === "success" && (<div className="py-6 flex flex-col items-center justify-center text-center space-y-5 animate-in fade-in duration-300">
                <div className="h-14 w-14 rounded-full bg-emerald-50 border border-emerald-255 text-emerald-700 flex items-center justify-center shrink-0 shadow-lg shadow-emerald-100">
                  <Check className="h-7 w-7"/>
                </div>
                <div className="space-y-2">
                  <h4 className="text-lg font-black text-slate-900">Commitment Successful!</h4>
                  <p className="text-xs text-slate-600 font-semibold leading-relaxed max-w-xs mx-auto">
                    Successfully locked <span className="text-indigo-650">{formatAmount(fundAmount)}</span> into the escrow vault for <span className="text-slate-800">{activeSyn.title}</span>.
                  </p>
                  <p className="text-[10px] text-slate-705 font-bold bg-slate-50 border border-slate-200 px-3 py-1 rounded-full inline-block mt-2">
                    Tx ID: JV-ESC-{Math.floor(Math.random() * 900000) + 100000}
                  </p>
                </div>
                <button onClick={() => setActiveSyn(null)} className="w-full py-3 bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-750 rounded-xl text-xs font-bold transition-all cursor-pointer text-center">
                  Close & View Dashboard
                </button>
              </div>)}
          </div>
        </div>)}

      {/* Verify Checkout Modal */}
      {showVerifyModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-sm w-full p-6 shadow-2xl animate-scale-in relative">
            <button onClick={() => setShowVerifyModal(false)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-655 transition-colors cursor-pointer border-0 bg-transparent">
              <X className="h-5 w-5"/>
            </button>

            {verifyStep === "form" && (
              <form onSubmit={handleVerifyPayment} className="space-y-4">
                <div className="text-center mb-4">
                  <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 border border-indigo-200">
                    <CreditCard className="h-5 w-5"/>
                  </div>
                  <h3 className="text-base font-black text-slate-900 mt-2">Premium Partner Checkout</h3>
                  <p className="text-[10px] text-slate-500 font-bold uppercase mt-0.5 tracking-wider">₹9,999 / Annual Subscription</p>
                </div>

                {paymentError && (
                  <div className="bg-rose-50 text-rose-700 text-[10px] font-bold p-3 rounded-xl border border-rose-200">
                    {paymentError}
                  </div>
                )}

                <div className="space-y-3.5 text-left">
                  <div>
                    <label className="block text-[9px] font-bold uppercase tracking-wider text-slate-505 mb-1">Cardholder Name</label>
                    <input 
                      type="text" 
                      placeholder="e.g. Rajesh Kumar" 
                      required 
                      value={cardName}
                      onChange={(e) => setCardName(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl bg-white border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/15 focus:border-indigo-500 text-xs font-semibold text-slate-900"
                    />
                  </div>

                  <div>
                    <label className="block text-[9px] font-bold uppercase tracking-wider text-slate-505 mb-1">Card Number</label>
                    <input 
                      type="text" 
                      placeholder="XXXX XXXX XXXX XXXX" 
                      maxLength="19"
                      required 
                      value={cardNumber}
                      onChange={(e) => {
                        const val = e.target.value.replace(/\D/g, "").replace(/(.{4})/g, "$1 ").trim();
                        setCardNumber(val);
                      }}
                      className="w-full px-3 py-2.5 rounded-xl bg-white border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/15 focus:border-indigo-500 text-xs font-semibold text-slate-900"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3.5">
                    <div>
                      <label className="block text-[9px] font-bold uppercase tracking-wider text-slate-550 mb-1">Expiry Date</label>
                      <input 
                        type="text" 
                        placeholder="MM/YY" 
                        maxLength="5"
                        required 
                        value={expiry}
                        onChange={(e) => {
                          let val = e.target.value.replace(/\D/g, "");
                          if (val.length > 2) {
                            val = val.slice(0, 2) + "/" + val.slice(2, 4);
                          }
                          setExpiry(val);
                        }}
                        className="w-full px-3 py-2.5 rounded-xl bg-white border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/15 focus:border-indigo-500 text-xs font-semibold text-slate-900"
                      />
                    </div>
                    <div>
                      <label className="block text-[9px] font-bold uppercase tracking-wider text-slate-550 mb-1">CVV</label>
                      <input 
                        type="password" 
                        placeholder="•••" 
                        maxLength="3"
                        required 
                        value={cvv}
                        onChange={(e) => setCvv(e.target.value.replace(/\D/g, ""))}
                        className="w-full px-3 py-2.5 rounded-xl bg-white border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/15 focus:border-indigo-500 text-xs font-semibold text-slate-900"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 text-[9px] font-bold text-slate-500 justify-center pt-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
                  SSL Secure 256-Bit Encrypted Connection
                </div>

                <button type="submit" className="w-full py-3 bg-indigo-650 hover:bg-indigo-700 text-white text-xs font-black uppercase tracking-wider rounded-xl transition-all border-0 cursor-pointer shadow-lg shadow-indigo-600/10 active:scale-98">
                  Pay & Verify Account
                </button>
              </form>
            )}

            {verifyStep === "processing" && (
              <div className="py-8 text-center space-y-4">
                <div className="h-8 w-8 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
                <div>
                  <h3 className="text-sm font-black text-slate-900">Processing Payment</h3>
                  <p className="text-[10px] text-slate-500 font-semibold mt-1">Interfacing with secure payment gateways...</p>
                </div>
              </div>
            )}

            {verifyStep === "success" && (
              <div className="py-6 text-center space-y-4">
                <div className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200 animate-bounce">
                  <CheckCircle2 className="h-7 w-7"/>
                </div>
                <div>
                  <h3 className="text-base font-black text-emerald-800">Verification Active!</h3>
                  <p className="text-[10px] text-slate-500 font-semibold mt-1">
                    Congratulations! Your account is now a premium verified partner.
                  </p>
                </div>
                <div className="space-y-2 pt-2">
                  <button onClick={handleDownloadReceipt} className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black uppercase tracking-wider rounded-xl transition-all border-0 cursor-pointer flex items-center justify-center gap-1.5 shadow-lg active:scale-98">
                    <FileText className="h-4 w-4"/>
                    Download Receipt
                  </button>
                  <button onClick={() => setShowVerifyModal(false)} className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-all border-0 cursor-pointer">
                    Close Workspace
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>);
}
