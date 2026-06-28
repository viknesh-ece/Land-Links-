"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Link from "next/link";
import { User, Mail, Lock, UserPlus, ShieldAlert, MapPin, TrendingUp, Building, CheckCircle2 } from "lucide-react";
import { loginUser } from "@/lib/auth";
import ThreeDTilt from "@/components/ThreeDTilt";
export default function SignupPage() {
    const router = useRouter();
    const [form, setForm] = useState({
        name: "",
        email: "",
        password: "",
        role: "Landowner", // Default to Landowner
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [successSteps, setSuccessSteps] = useState([]);
    const [showSuccessOverlay, setShowSuccessOverlay] = useState(false);
    const handleSignup = async () => {
        if (!form.name || !form.email || !form.password || !form.role) {
            setError("Please fill in all fields");
            return;
        }
        setLoading(true);
        setError("");
        setSuccess("");
        try {
            const res = await fetch("/api/signup", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(form),
            });
            const data = await res.json();
            if (res.ok && data?.user) {
                // Auto-login the user
                loginUser(data.user);
                router.push("/");
            }
            else {
                setError(data.message || "Signup failed");
            }
        }
        catch (err) {
            console.error(err);
            setError("Signup failed. Please try again.");
        }
        finally {
            setLoading(false);
        }
    };
    const roles = [
        { id: "Landowner", label: "Landowner", icon: MapPin, desc: "List my property & sell directly" },
        { id: "Investor", label: "Investor", icon: TrendingUp, desc: "Browse land & acquire assets" },
        { id: "Builder", label: "Builder", icon: Building, desc: "Find sites & build developments" },
    ];
    return (<div className="min-h-screen bg-transparent text-slate-100 flex flex-col">
      <Navbar />

      {/* Success overlay removed */}

      <main className="flex-grow flex flex-col lg:flex-row">
        {/* Left Side: Brand Showcase (Hidden on Mobile) */}
        <div className="hidden lg:flex lg:w-1/2 bg-[#090d16] text-white p-12 flex-col justify-between relative overflow-hidden border-r border-slate-900/60">
          {/* Background glows */}
          <div className="absolute inset-0 bg-glow-indigo opacity-30 pointer-events-none"></div>
          
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-16">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-600">
                <MapPin className="h-5 w-5"/>
              </div>
              <span className="text-xl font-bold tracking-wide">LandLinkX</span>
            </div>

            <h2 className="text-4xl font-extrabold tracking-tight leading-[1.25] mb-6">
              Join India's Premier Ecosystem for Land Transactions
            </h2>
            <p className="text-slate-400 text-lg font-medium max-w-md mb-10">
              Create an account and gain instant access to AI valuations, verified titles, and zero-broker direct deals.
            </p>

            <div className="space-y-6">
              <div className="flex gap-4 items-start">
                <div className="h-6 w-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                  <CheckCircle2 className="h-4 w-4"/>
                </div>
                <div>
                  <h4 className="font-bold text-white text-base">Direct Communication</h4>
                  <p className="text-sm text-slate-400 font-medium mt-0.5">Skip the middlemen and deal directly with principal buyers and landowners.</p>
                </div>
              </div>

              <div className="flex gap-4 items-start">
                <div className="h-6 w-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                  <CheckCircle2 className="h-4 w-4"/>
                </div>
                <div>
                  <h4 className="font-bold text-white text-base">Vetted Legal Background</h4>
                  <p className="text-sm text-slate-400 font-medium mt-0.5">Every lot undergoes multi-factor verification checks before publication.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="relative z-10 text-xs font-semibold text-slate-500">
            &copy; {new Date().getFullYear()} LandLinkX Inc. All rights reserved.
          </div>
        </div>

        {/* Right Side: Form (All Screens) */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 md:p-16 relative bg-transparent">
          <div className="absolute inset-0 bg-glow-cyan opacity-20 pointer-events-none"></div>

          <ThreeDTilt className="w-full max-w-md relative z-10">
            <div className="w-full bg-[#090d16]/75 backdrop-blur-xl border border-slate-800 rounded-2xl p-8 shadow-2xl">
            
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-2xl font-bold tracking-tight text-white">
                Create an Account
              </h1>
              <p className="text-sm font-semibold text-slate-400 mt-1">
                Already registered?{" "}
                <Link href="/login?bypass=true" className="text-indigo-405 hover:text-indigo-300 transition-colors">
                  Sign in here
                </Link>
              </p>
            </div>

            {/* Error Message */}
            {error && (<div className="mb-6 flex items-start gap-2.5 p-3.5 rounded-xl bg-rose-955/30 border border-rose-900/50 text-rose-400 text-xs font-bold shadow-md">
                <ShieldAlert className="h-4.5 w-4.5 shrink-0 text-rose-500"/>
                <span>{error}</span>
              </div>)}

            {/* Success Message */}
            {success && (<div className="mb-6 flex items-start gap-2.5 p-3.5 rounded-xl bg-emerald-955/30 border border-emerald-900/50 text-emerald-450 text-xs font-bold shadow-md">
                <CheckCircle2 className="h-4.5 w-4.5 shrink-0 text-emerald-500"/>
                <span>{success}</span>
              </div>)}

            {/* Form */}
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                  Full Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                    <User className="h-4.5 w-4.5"/>
                  </div>
                  <input type="text" placeholder="John Doe" className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-950 border border-slate-850 focus:outline-none focus:ring-2 focus:ring-indigo-500/15 focus:border-indigo-500 text-sm font-semibold text-white placeholder:text-slate-600 transition-all" onChange={(e) => setForm({ ...form, name: e.target.value })}/>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                    <Mail className="h-4.5 w-4.5"/>
                  </div>
                  <input type="email" placeholder="john@example.com" className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-950 border border-slate-850 focus:outline-none focus:ring-2 focus:ring-indigo-500/15 focus:border-indigo-500 text-sm font-semibold text-white placeholder:text-slate-600 transition-all" onChange={(e) => setForm({ ...form, email: e.target.value })}/>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                  Create Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                    <Lock className="h-4.5 w-4.5"/>
                  </div>
                  <input type="password" placeholder="••••••••" className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-950 border border-slate-850 focus:outline-none focus:ring-2 focus:ring-indigo-500/15 focus:border-indigo-500 text-sm font-semibold text-white placeholder:text-slate-600 transition-all" onChange={(e) => setForm({ ...form, password: e.target.value })}/>
                </div>
              </div>

              {/* Interactive Role Selector */}
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                  Select Your Role
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {roles.map((role) => {
            const RoleIcon = role.icon;
            const isSelected = form.role === role.id;
            return (<button key={role.id} type="button" onClick={() => setForm({ ...form, role: role.id })} className={`flex flex-col items-center justify-center p-3 rounded-xl border text-center transition-all cursor-pointer ${isSelected
                    ? "border-indigo-500 bg-indigo-950/40 text-indigo-300 font-bold ring-2 ring-indigo-550/15"
                    : "border-slate-800 bg-slate-950/40 hover:border-slate-700 text-slate-400"}`}>
                        <RoleIcon className={`h-5 w-5 mb-1.5 ${isSelected ? "text-indigo-400 animate-pulse" : "text-slate-500"}`}/>
                        <span className="text-xs font-bold tracking-tight">{role.label}</span>
                        <span className="text-[8px] text-slate-500 mt-1 leading-normal font-semibold hidden sm:inline">{role.desc}</span>
                      </button>);
        })}
                </div>
              </div>

              <div className="pt-2">
                <button onClick={handleSignup} disabled={loading} className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3.5 px-4 rounded-xl shadow-lg shadow-indigo-900/15 hover:shadow-indigo-900/25 active:scale-[0.98] transition-all disabled:opacity-50 disabled:pointer-events-none border-0 cursor-pointer">
                  {loading ? (<div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>) : (<>
                      <UserPlus className="h-4.5 w-4.5"/>
                      Create Account
                    </>)}
                </button>
              </div>

            </div>

            </div>
          </ThreeDTilt>
        </div>
      </main>
    </div>);
}
