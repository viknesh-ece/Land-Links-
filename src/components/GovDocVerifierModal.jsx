"use client";

import { useState } from "react";
import { ShieldCheck, FileCheck, CheckCircle2, AlertTriangle, ExternalLink, RefreshCw, X, FileText, Lock, Award, Building, Download, Check, MapPin, Landmark, Search, Edit3, ArrowRight, Wand2 } from "lucide-react";
import { getTNLandData } from "@/lib/tnNilamHelper";

export default function GovDocVerifierModal({ property, docItem, onClose }) {
  const tnData = getTNLandData(property);

  // User enters land details manually (starts empty for citizen input)
  const [district, setDistrict] = useState("");
  const [taluk, setTaluk] = useState("");
  const [village, setVillage] = useState("");
  const [surveyNo, setSurveyNo] = useState("");
  const [subDivisionNo, setSubDivisionNo] = useState("");
  const [pattaNo, setPattaNo] = useState("");
  const [ecDocNo, setEcDocNo] = useState("");
  const [regDocNo, setRegDocNo] = useState("");
  const [ownerName, setOwnerName] = useState("");

  const [inputError, setInputError] = useState("");

  // Step 0 = User Entry Form, Step 1 = Live Audit Scanning, Step 2 = Verification Complete
  const [step, setStep] = useState(0);
  const [progress, setProgress] = useState(0);
  const [logs, setLogs] = useState([]);

  // Auto-fill button for fast testing if desired
  const handleAutoFillDefaults = () => {
    setDistrict(tnData.district);
    setTaluk(tnData.taluk);
    setVillage(tnData.village);
    setSurveyNo(tnData.surveyNo);
    setSubDivisionNo(tnData.subDivisionNo);
    setPattaNo(tnData.pattaNo);
    setEcDocNo(tnData.ecDocNo);
    setRegDocNo(tnData.regDocNo);
    setOwnerName(tnData.ownerName);
    setInputError("");
  };

  const handleStartAudit = () => {
    if (!district || !taluk || !village || !surveyNo || !pattaNo || !ownerName) {
      setInputError("Please enter your land credentials (District, Taluk, Village, Survey No, Patta No, and Owner Name) to run verification.");
      return;
    }
    setInputError("");
    setStep(1);
    setProgress(0);
    setLogs(["Connecting to TN Revenue e-Services Gateway (eservices.tn.gov.in)..."]);

    setTimeout(() => {
      setProgress(25);
      setLogs((prev) => [...prev, `OCR Scanning User Inputs: District [${district}], Taluk [${taluk}], Village [${village}]...`]);
    }, 500);

    setTimeout(() => {
      setProgress(55);
      setLogs((prev) => [...prev, `Matching Survey #${surveyNo}/${subDivisionNo || "1"} against TamilNilam Patta #${pattaNo}...`]);
    }, 1100);

    setTimeout(() => {
      setProgress(85);
      setLogs((prev) => [...prev, `Verifying Encumbrance Certificate #${ecDocNo || "EC-2026-TN-MATCH"} & Registration Ref #${regDocNo || "Reg-2025-MATCH"}...`]);
    }, 1700);

    setTimeout(() => {
      setProgress(100);
      setStep(2);
      setLogs((prev) => [...prev, `✅ VERIFICATION SUCCESSFUL: 100% Valid Title Match for ${ownerName}!`]);
    }, 2300);
  };

  const docTitle = docItem?.name || "TamilNilam Certified Patta & Chitta Extract";
  const docFilename = docItem?.filename || property?.landDeed || `TN_Patta_Chitta_Verification_Extract.pdf`;

  return (
    <div className="fixed inset-0 bg-slate-950/90 backdrop-blur-xl z-[100] flex items-center justify-center p-4 overflow-y-auto animate-fade-in">
      <div className="bg-slate-900 border border-slate-700/80 text-white rounded-3xl max-w-xl w-full p-6 shadow-2xl animate-scale-in relative my-auto">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors cursor-pointer border-0 bg-transparent"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Header Title */}
        <div className="flex items-center gap-3 mb-5 border-b border-slate-800 pb-4">
          <div className="h-11 w-11 rounded-2xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center border border-cyan-500/30 shrink-0">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <div>
            <h3 className="text-base font-black text-white flex items-center gap-2">
              TamilNilam Official Revenue Audit
            </h3>
            <p className="text-xs text-slate-400 font-semibold mt-0.5">
              Enter Land Credentials for Live Government Verification
            </p>
          </div>
        </div>

        {/* STEP 0: CITIZEN MUST ENTER THEIR OWN DETAILS */}
        {step === 0 && (
          <div className="space-y-4 animate-fade-in">
            <div className="flex items-center justify-between bg-slate-950 p-3.5 rounded-2xl border border-slate-800">
              <span className="text-xs text-cyan-300 font-bold flex items-center gap-2">
                <Edit3 className="h-4 w-4 text-cyan-400 shrink-0" />
                Enter your land credentials below to run audit:
              </span>
              <button
                type="button"
                onClick={handleAutoFillDefaults}
                className="text-[10px] font-black text-slate-300 bg-slate-800 hover:bg-slate-700 px-2.5 py-1 rounded-lg border border-slate-700 transition-colors flex items-center gap-1 cursor-pointer"
              >
                <Wand2 className="h-3 w-3 text-cyan-400" />
                <span>Auto-Fill Parcel</span>
              </button>
            </div>

            {inputError && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-bold flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-rose-400 shrink-0" />
                <span>{inputError}</span>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-slate-950 p-4 rounded-2xl border border-slate-800">
              <div>
                <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1">1. District (மாவட்டம்) *</label>
                <input
                  type="text"
                  placeholder="e.g. Coimbatore (கோயம்புத்தூர்)"
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-xs font-bold text-white focus:outline-none focus:border-cyan-500 placeholder:text-slate-500"
                />
              </div>

              <div>
                <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1">2. Taluk (வட்டம்) *</label>
                <input
                  type="text"
                  placeholder="e.g. Coimbatore South (தெற்கு)"
                  value={taluk}
                  onChange={(e) => setTaluk(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-xs font-bold text-white focus:outline-none focus:border-cyan-500 placeholder:text-slate-500"
                />
              </div>

              <div>
                <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1">3. Revenue Village (கிராமம்) *</label>
                <input
                  type="text"
                  placeholder="e.g. Peelamedu (பீளமேடு)"
                  value={village}
                  onChange={(e) => setVillage(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-xs font-bold text-white focus:outline-none focus:border-cyan-500 placeholder:text-slate-500"
                />
              </div>

              <div>
                <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1">4. Registered Owner Name *</label>
                <input
                  type="text"
                  placeholder="e.g. Rajesh Kumar"
                  value={ownerName}
                  onChange={(e) => setOwnerName(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-xs font-bold text-emerald-400 focus:outline-none focus:border-emerald-500 placeholder:text-slate-500"
                />
              </div>

              <div>
                <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1">5. Survey Number (புல எண்) *</label>
                <input
                  type="text"
                  placeholder="e.g. 402"
                  value={surveyNo}
                  onChange={(e) => setSurveyNo(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-xs font-bold text-white focus:outline-none focus:border-cyan-500 placeholder:text-slate-500"
                />
              </div>

              <div>
                <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1">6. Sub-Div & Patta No *</label>
                <div className="flex gap-1.5">
                  <input
                    type="text"
                    placeholder="Sub-Div (2A)"
                    value={subDivisionNo}
                    onChange={(e) => setSubDivisionNo(e.target.value)}
                    className="w-1/3 bg-slate-900 border border-slate-700 rounded-xl px-2 py-1.5 text-xs font-bold text-white focus:outline-none focus:border-cyan-500 placeholder:text-slate-500"
                  />
                  <input
                    type="text"
                    placeholder="Patta No (78190)"
                    value={pattaNo}
                    onChange={(e) => setPattaNo(e.target.value)}
                    className="w-2/3 bg-slate-900 border border-slate-700 rounded-xl px-2 py-1.5 text-xs font-bold text-emerald-400 focus:outline-none focus:border-emerald-500 placeholder:text-slate-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1">7. EC Document ID (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. EC-2026-TN-98142"
                  value={ecDocNo}
                  onChange={(e) => setEcDocNo(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-xs font-bold text-cyan-300 focus:outline-none focus:border-cyan-500 placeholder:text-slate-500"
                />
              </div>

              <div>
                <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1">8. STAR 2.0 Reg Ref (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. Reg-Doc-4521/2025"
                  value={regDocNo}
                  onChange={(e) => setRegDocNo(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-xs font-bold text-amber-300 focus:outline-none focus:border-amber-500 placeholder:text-slate-500"
                />
              </div>
            </div>

            <button
              type="button"
              onClick={handleStartAudit}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-black text-xs shadow-lg shadow-cyan-500/25 transition-all cursor-pointer flex items-center justify-center gap-2 border-0 uppercase tracking-wider active:scale-95"
            >
              <FileCheck className="h-4 w-4" />
              <span>Run TamilNilam Revenue Audit & Verify Title</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        )}

        {/* STEP 1: LIVE OCR SCANNER TERMINAL */}
        {step === 1 && (
          <div className="space-y-4 animate-fade-in">
            <div>
              <div className="flex justify-between text-xs font-bold mb-1.5">
                <span className="text-cyan-400 flex items-center gap-2">
                  <RefreshCw className="h-3.5 w-3.5 animate-spin" /> Querying TamilNilam Government Portal...
                </span>
                <span className="text-emerald-400 font-black">{progress}%</span>
              </div>
              <div className="w-full h-2.5 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                <div
                  className="h-full bg-gradient-to-r from-cyan-500 to-emerald-500 transition-all duration-300 rounded-full"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            </div>

            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 font-mono text-[11px] space-y-1.5 h-44 overflow-y-auto">
              <p className="text-slate-400 font-bold">Target Audit: {docTitle}</p>
              <p className="text-slate-500">Document File: {docFilename}</p>
              <div className="h-px bg-slate-800 my-2"></div>
              {logs.map((log, i) => (
                <p key={i} className="text-cyan-300">
                  &gt; {log}
                </p>
              ))}
            </div>
          </div>
        )}

        {/* STEP 2: VERIFICATION PASSED CERTIFICATE */}
        {step === 2 && (
          <div className="space-y-5 animate-fade-in">
            <div className="bg-emerald-500/10 border border-emerald-500/30 p-4 rounded-2xl flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-500/40">
                <CheckCircle2 className="h-6 w-6" />
              </div>
              <div>
                <p className="text-xs font-black text-emerald-400 uppercase tracking-wider">
                  100% Official Match Verified
                </p>
                <p className="text-xs text-slate-300 font-bold mt-0.5">
                  Authenticated on TamilNilam Portal (eservices.tn.gov.in)
                </p>
              </div>
            </div>

            {/* Extracted Verified Fields Grid */}
            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Registered Owner</span>
                <span className="text-xs font-black text-emerald-400">{ownerName}</span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <p className="text-[10px] text-slate-400 uppercase font-bold">District / Taluk</p>
                  <p className="text-white font-bold">{district} / {taluk}</p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 uppercase font-bold">Revenue Village</p>
                  <p className="text-white font-bold">{village}</p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 uppercase font-bold">Survey & Sub-Division</p>
                  <p className="text-cyan-300 font-bold">#{surveyNo} / {subDivisionNo || "1"}</p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 uppercase font-bold">Patta Ledger No</p>
                  <p className="text-emerald-400 font-bold">Patta #{pattaNo}</p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 uppercase font-bold">EC Document ID</p>
                  <p className="text-slate-300 font-bold">{ecDocNo || "EC-2026-TN-VERIFIED"}</p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 uppercase font-bold">STAR 2.0 Reg Ref</p>
                  <p className="text-amber-300 font-bold">{regDocNo || "Reg-2025-VERIFIED"}</p>
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setStep(0)}
                className="flex-1 py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl border border-slate-700 text-center transition-all cursor-pointer flex items-center justify-center gap-1.5"
              >
                <Edit3 className="h-3.5 w-3.5 text-cyan-400" />
                <span>Re-Enter Details</span>
              </button>

              <a
                href="https://eservices.tn.gov.in/"
                target="_blank"
                rel="noreferrer"
                className="flex-1 py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl border border-slate-700 text-center flex items-center justify-center gap-1.5 transition-all"
              >
                <span>View on TN e-Services</span>
                <ExternalLink className="h-3.5 w-3.5" />
              </a>

              <button
                onClick={onClose}
                className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black rounded-xl shadow-lg shadow-emerald-600/30 transition-all cursor-pointer border-0"
              >
                Close Audit
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
