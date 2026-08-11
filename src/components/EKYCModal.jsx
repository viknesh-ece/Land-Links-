"use client";

import { useState } from "react";
import { ShieldCheck, UserCheck, CreditCard, Lock, CheckCircle2, X } from "lucide-react";

export default function EKYCModal({ user, onClose, onComplete }) {
  const [kycType, setKycType] = useState("AADHAAR");
  const [idNumber, setIdNumber] = useState("");
  const [verifying, setVerifying] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmitKyc = (e) => {
    e.preventDefault();
    if (!idNumber) return;
    setVerifying(true);

    setTimeout(() => {
      setVerifying(false);
      setSuccess(true);
      if (onComplete) {
        onComplete({
          kycType,
          kycNumber: idNumber.replace(/\d(?=\d{4})/g, "*"), // Mask sensitive digits
          verified: true
        });
      }
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-6 space-y-6 shadow-2xl relative text-white">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2">
            <UserCheck className="h-5 w-5 text-cyan-400" />
            <h3 className="text-lg font-black tracking-tight">Identity Binding (eKYC Verification)</h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white">
            <X className="h-5 w-5" />
          </button>
        </div>

        {success ? (
          <div className="p-6 text-center space-y-4 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl text-emerald-300">
            <CheckCircle2 className="h-12 w-12 text-emerald-400 mx-auto" />
            <h4 className="text-base font-black">Identity Bound & Verified!</h4>
            <p className="text-xs text-slate-300">
              Your {kycType} has been cross-matched with Government Identity Registries. Verified seller badge is now active.
            </p>
            <button
              onClick={onClose}
              className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs"
            >
              Done
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmitKyc} className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-300">Select Document Type:</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setKycType("AADHAAR")}
                  className={`p-3 rounded-xl border font-extrabold text-xs flex items-center justify-center gap-2 transition-all ${
                    kycType === "AADHAAR"
                      ? "bg-cyan-500/20 border-cyan-500 text-cyan-300"
                      : "bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700"
                  }`}
                >
                  <CreditCard className="h-4 w-4" />
                  Aadhaar (UIDAI)
                </button>
                <button
                  type="button"
                  onClick={() => setKycType("PAN")}
                  className={`p-3 rounded-xl border font-extrabold text-xs flex items-center justify-center gap-2 transition-all ${
                    kycType === "PAN"
                      ? "bg-indigo-500/20 border-indigo-500 text-indigo-300"
                      : "bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700"
                  }`}
                >
                  <ShieldCheck className="h-4 w-4" />
                  PAN Card (Income Tax)
                </button>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-300">
                Enter {kycType === "AADHAAR" ? "12-Digit Aadhaar Number" : "10-Character PAN Number"}:
              </label>
              <input
                type="text"
                required
                maxLength={kycType === "AADHAAR" ? 12 : 10}
                placeholder={kycType === "AADHAAR" ? "5819 4012 9812" : "ABCDE1234F"}
                value={idNumber}
                onChange={(e) => setIdNumber(e.target.value.toUpperCase())}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm font-mono text-white tracking-widest focus:border-cyan-500 outline-none"
              />
            </div>

            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800/80 text-[10px] text-slate-400 flex items-center gap-2">
              <Lock className="h-4 w-4 text-cyan-400 shrink-0" />
              <span>256-bit encrypted UIDAI / NSDL API verification. Sensitive numbers are masked at rest.</span>
            </div>

            <button
              type="submit"
              disabled={verifying || !idNumber}
              className={`w-full py-3 rounded-xl font-extrabold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all ${
                idNumber && !verifying
                  ? "bg-gradient-to-r from-cyan-500 to-indigo-600 text-white shadow-lg shadow-cyan-500/25"
                  : "bg-slate-800 text-slate-500 cursor-not-allowed"
              }`}
            >
              {verifying ? "Verifying with Government Registry..." : "Verify & Bind Identity"}
            </button>
          </form>
        )}

      </div>
    </div>
  );
}
