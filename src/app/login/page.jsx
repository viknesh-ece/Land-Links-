"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Link from "next/link";
import { Mail, Lock, LogIn, ShieldAlert, Sparkles, MapPin } from "lucide-react";
import { loginUser } from "@/lib/auth";
import ThreeDTilt from "@/components/ThreeDTilt";
export default function LoginPage() {
    const router = useRouter();
    const [form, setForm] = useState({
        email: "",
        password: "",
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [successSteps, setSuccessSteps] = useState([]);
    const [showSuccessOverlay, setShowSuccessOverlay] = useState(false);
    useEffect(() => {
        if (typeof window !== "undefined") {
            const params = new URLSearchParams(window.location.search);
            if (!params.has("bypass")) {
                router.push("/signup");
            }
        }
    }, [router]);
    async function handleLogin() {
        if (!form.email || !form.password) {
            setError("Please fill in all fields");
            return;
        }
        setLoading(true);
        setError("");
        try {
            const res = await fetch("/api/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(form),
            });
            const data = await res.json();
            if (res.ok && data?.user) {
                // Save user session in localStorage
                loginUser(data.user);
                router.push("/");
            }
            else {
                setError(data.message || "Invalid credentials");
            }
        }
        catch (err) {
            console.error(err);
            setError("Something went wrong. Please try again.");
        }
        finally {
            setLoading(false);
        }
    }
    return (<div className="min-h-screen bg-transparent text-slate-100 flex flex-col font-sans">
      <Navbar />

      {/* Success overlay removed */}

      <main className="flex-grow flex flex-col lg:flex-row">
        
        {/* Left Side: Brand Showcase (Hidden on Mobile) */}
        <div className="hidden lg:flex lg:w-1/2 bg-[#090d16] text-white p-16 flex-col justify-between relative overflow-hidden border-r border-slate-900/60">
          {/* Background glows */}
          <div className="absolute inset-0 bg-radial-gradient from-indigo-500/10 via-transparent to-transparent opacity-40 pointer-events-none"></div>
          <div className="absolute bottom-[-100px] left-[-100px] w-[400px] h-[400px] bg-sky-500/5 rounded-full blur-3xl pointer-events-none animate-pulse-slow"></div>
          
          <div className="relative z-10">
            <div className="flex items-center gap-2.5 mb-20">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-lg">
                <MapPin className="h-5.5 w-5.5"/>
              </div>
              <span className="text-xl font-bold tracking-wider">LandLinkX</span>
            </div>

            <div className="space-y-6 max-w-md">
              <h2 className="text-4xl font-black tracking-tight leading-[1.2] text-white">
                Access India's Vetted Land Marketplace
              </h2>
              <p className="text-slate-400 font-semibold leading-relaxed">
                Log in to review verified land registry deeds, coordinate transactions directly with landowners, and run machine learning valuation models.
              </p>
            </div>
          </div>

          <div className="relative z-10 text-xs font-semibold text-slate-500">
            &copy; {new Date().getFullYear()} LandLinkX Inc. All rights reserved.
          </div>
        </div>

        {/* Right Side: Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 relative bg-transparent">
          <div className="absolute inset-0 bg-glow-cyan opacity-20 pointer-events-none"></div>

          <ThreeDTilt className="w-full max-w-md relative z-10">
            <div className="w-full bg-[#090d16]/75 backdrop-blur-xl border border-slate-800 rounded-3xl p-8 sm:p-10 shadow-2xl">
            
            {/* Header */}
            <div className="text-center mb-8">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-950/40 border border-indigo-900/50 text-indigo-400 mb-4 shadow-md">
                <Sparkles className="h-5.5 w-5.5 text-indigo-400"/>
              </div>
              <h1 className="text-2xl font-black text-white tracking-tight">
                Welcome Back
              </h1>
              <p className="text-xs text-slate-450 font-semibold mt-1">
                Enter your credentials to manage your land assets
              </p>
            </div>

            {/* Error Message */}
            {error && (<div className="mb-6 flex items-start gap-2.5 p-4 rounded-2xl bg-rose-950/30 border border-rose-900/50 text-rose-400 text-xs font-bold shadow-md">
                <ShieldAlert className="h-4.5 w-4.5 shrink-0 text-rose-500"/>
                <span>{error}</span>
              </div>)}

            {/* Form */}
            <div className="space-y-5">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                    <Mail className="h-4 w-4"/>
                  </div>
                  <input type="email" placeholder="name@company.com" value={form.email} className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-950 border border-slate-850 focus:outline-none focus:ring-2 focus:ring-indigo-500/15 focus:border-indigo-500 text-sm font-semibold text-white placeholder:text-slate-600" onChange={(e) => setForm({ ...form, email: e.target.value })}/>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                    <Lock className="h-4 w-4"/>
                  </div>
                  <input type="password" placeholder="••••••••" value={form.password} className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-950 border border-slate-850 focus:outline-none focus:ring-2 focus:ring-indigo-500/15 focus:border-indigo-500 text-sm font-semibold text-white placeholder:text-slate-600" onChange={(e) => setForm({ ...form, password: e.target.value })}/>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs font-bold pt-1 pb-1">
                <label className="flex items-center gap-2 cursor-pointer text-slate-400">
                  <input type="checkbox" className="rounded text-indigo-500 border-slate-700 bg-slate-950 focus:ring-indigo-500"/>
                  Keep me logged in
                </label>
                <a href="#" className="text-indigo-400 hover:text-indigo-305 transition-colors">
                  Forgot Password?
                </a>
              </div>

              <button onClick={handleLogin} disabled={loading} className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3.5 px-4 rounded-xl shadow-lg shadow-indigo-900/15 hover:shadow-indigo-900/25 active:scale-[0.98] transition-all disabled:opacity-50 disabled:pointer-events-none cursor-pointer border-0">
                {loading ? (<div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>) : (<>
                    <LogIn className="h-4.5 w-4.5"/>
                    Sign In
                  </>)}
              </button>
            </div>

            {/* Footer Sign Up */}
            <div className="mt-8 text-center text-xs font-bold text-slate-400 border-t border-slate-800 pt-6">
              New to the platform?{" "}
              <Link href="/signup" className="text-indigo-400 hover:text-indigo-305 transition-colors">
                Register a new account
              </Link>
            </div>

            </div>
          </ThreeDTilt>
        </div>
      </main>
    </div>);
}
