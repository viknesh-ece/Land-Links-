"use client";

import { useState, useEffect } from "react";
import { RefreshCw, Clock, ShieldCheck, ShieldAlert, Sparkles, UserCheck, AlertTriangle } from "lucide-react";
import { DYNAMIC_GOV_ACCOUNTS, getRotatingAccountByTime } from "@/lib/dynamicGovAccountEngine";
import { getLoggedInUser } from "@/lib/auth";

export default function DynamicGovAccountBanner({ onAccountChange, activeAccount }) {
  const [secondsRemaining, setSecondsRemaining] = useState(5);
  const [currentAccount, setCurrentAccount] = useState(activeAccount || DYNAMIC_GOV_ACCOUNTS[0]);
  const [autoRotate, setAutoRotate] = useState(true);

  useEffect(() => {
    const user = getLoggedInUser();
    const initialAcc = activeAccount || getRotatingAccountByTime(user);
    setCurrentAccount(initialAcc);
    if (onAccountChange) {
      onAccountChange(initialAcc);
    }
  }, []);

  useEffect(() => {
    if (!autoRotate) return;

    const interval = setInterval(() => {
      setSecondsRemaining((prev) => {
        if (prev <= 1) {
          // Time to rotate account!
          const user = getLoggedInUser();
          const nextAcc = getRotatingAccountByTime(null);
          setCurrentAccount(nextAcc);
          if (onAccountChange) {
            onAccountChange(nextAcc);
          }
          return 5;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [autoRotate, onAccountChange]);

  const handleManualSwitch = (acc) => {
    setAutoRotate(false);
    setCurrentAccount(acc);
    setSecondsRemaining(5);
    if (onAccountChange) {
      onAccountChange(acc);
    }
  };

  const handleRotateNow = () => {
    const nextIdx = (DYNAMIC_GOV_ACCOUNTS.findIndex(a => a.id === currentAccount.id) + 1) % DYNAMIC_GOV_ACCOUNTS.length;
    const nextAcc = DYNAMIC_GOV_ACCOUNTS[nextIdx];
    setCurrentAccount(nextAcc);
    setSecondsRemaining(5);
    if (onAccountChange) {
      onAccountChange(nextAcc);
    }
  };

  return (
    <div className="bg-gradient-to-r from-slate-900 via-indigo-950/50 to-slate-900 border border-cyan-500/40 rounded-3xl p-5 space-y-4 shadow-2xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
            <Sparkles className="h-4 w-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xs font-black uppercase tracking-wider text-white">Dynamic Government Land Account</h3>
              <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase ${
                currentAccount.accountType === "VERIFIED_ORIGINAL"
                  ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                  : "bg-rose-500/20 text-rose-300 border border-rose-500/40"
              }`}>
                {currentAccount.accountType === "VERIFIED_ORIGINAL" ? "🟢 Original / Verified Title" : "🔴 Disputed / Fake Doc Demo"}
              </span>
            </div>
            <p className="text-[10px] text-slate-400 mt-0.5">
              Simulates live TamilNilam gateway accounts rotating dynamically every 5 seconds or changing by user login profile.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-[11px] font-mono text-cyan-300 font-bold">
            <Clock className="h-3.5 w-3.5 text-cyan-400 animate-spin" style={{ animationDuration: "3s" }} />
            <span>Next Sync: {secondsRemaining}s</span>
          </div>

          <button
            type="button"
            onClick={handleRotateNow}
            className="px-3 py-1.5 rounded-xl bg-cyan-600/20 hover:bg-cyan-600/30 text-cyan-300 border border-cyan-500/40 text-[11px] font-bold transition-all flex items-center gap-1 cursor-pointer"
            title="Force switch to next government account"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            <span>Rotate</span>
          </button>
        </div>
      </div>

      {/* Account Persona Selector Pills */}
      <div className="space-y-1.5">
        <label className="text-[10px] font-extrabold uppercase text-slate-400">Select or Test Specific Account Persona:</label>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          {DYNAMIC_GOV_ACCOUNTS.map((acc) => {
            const isSelected = currentAccount.id === acc.id;
            return (
              <button
                key={acc.id}
                type="button"
                onClick={() => handleManualSwitch(acc)}
                className={`p-2.5 rounded-xl text-left border transition-all cursor-pointer ${
                  isSelected
                    ? "bg-slate-950 border-cyan-400 ring-2 ring-cyan-500/30 shadow-lg text-white"
                    : "bg-slate-950/60 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold line-clamp-1">{acc.personaName}</span>
                  <span className="text-[9px]">{acc.accountType === "VERIFIED_ORIGINAL" ? "🟢" : "🔴"}</span>
                </div>
                <p className="text-[9px] font-mono text-slate-500 truncate mt-0.5">
                  {acc.taluk} • Patta #{acc.pattaNo}
                </p>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
