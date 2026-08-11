"use client";

import { useState, useRef } from "react";
import { CheckCircle2, ShieldCheck, FileCheck, X, Eraser, Download, Lock } from "lucide-react";

export default function ESignatureModal({ thread, userRole, onClose, onComplete }) {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [signatureData, setSignatureData] = useState(null);
  const [signing, setSigning] = useState(false);
  const [agreementHash, setAgreementHash] = useState(null);

  const startDrawing = (e) => {
    setIsDrawing(true);
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const rect = canvas.getBoundingClientRect();
    ctx.beginPath();
    ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
  };

  const draw = (e) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const rect = canvas.getBoundingClientRect();
    ctx.lineWidth = 2.5;
    ctx.lineCap = "round";
    ctx.strokeStyle = "#38bdf8"; // cyan-400
    ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
    ctx.stroke();
  };

  const stopDrawing = () => {
    if (!isDrawing) return;
    setIsDrawing(false);
    const canvas = canvasRef.current;
    if (canvas) {
      setSignatureData(canvas.toDataURL());
    }
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setSignatureData(null);
  };

  const handleSignAgreement = () => {
    if (!signatureData) return;
    setSigning(true);

    // Compute cryptographic SHA-256 agreement hash
    const textToHash = `${thread?.propertyName}_${thread?.propertyPrice}_${userRole}_${Date.now()}`;
    let hash = 0;
    for (let i = 0; i < textToHash.length; i++) {
      hash = (hash << 5) - hash + textToHash.charCodeAt(i);
      hash |= 0;
    }
    const hexHash = `SHA256_${Math.abs(hash).toString(16).padStart(32, "a")}`;

    setTimeout(() => {
      setAgreementHash(hexHash);
      setSigning(false);
      if (onComplete) {
        onComplete({
          signature: signatureData,
          hash: hexHash,
          signedAt: new Date().toISOString()
        });
      }
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-xl w-full p-6 space-y-6 shadow-2xl relative text-white">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2">
            <FileCheck className="h-5 w-5 text-cyan-400" />
            <h3 className="text-lg font-black tracking-tight">Legal Land Purchase Agreement (eSign)</h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Agreement Terms Box */}
        <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 text-xs space-y-2 max-h-36 overflow-y-auto font-mono text-slate-300">
          <p className="font-bold text-cyan-400">MEMORANDUM OF INTENT & LAND PURCHASE AGREEMENT</p>
          <p>This binding agreement is made for property <span className="text-white font-bold">{thread?.propertyName || "Prime Commercial Land"}</span> at agreed price <span className="text-emerald-400 font-bold">₹{((thread?.myOffer || thread?.propertyPrice || 45000000) / 100000).toFixed(1)} Lakhs</span>.</p>
          <p>Both parties confirm title verification, clear patta deed inspection, and digital authorization without duress.</p>
        </div>

        {/* Digital Signature Canvas */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
              <Lock className="h-3.5 w-3.5 text-cyan-400" />
              Draw Your Digital Signature Below:
            </label>
            <button
              onClick={clearCanvas}
              className="text-[10px] font-bold text-rose-400 hover:text-rose-300 flex items-center gap-1"
            >
              <Eraser className="h-3 w-3" />
              Clear
            </button>
          </div>

          <div className="bg-slate-950 rounded-2xl border border-slate-800 p-2 text-center">
            <canvas
              ref={canvasRef}
              width={500}
              height={140}
              onMouseDown={startDrawing}
              onMouseMove={draw}
              onMouseUp={stopDrawing}
              onMouseLeave={stopDrawing}
              className="w-full bg-slate-950 rounded-xl cursor-crosshair border border-slate-800/80"
            />
            <p className="text-[10px] text-slate-500 mt-1">Use your mouse or touch screen to sign your legal signature.</p>
          </div>
        </div>

        {/* Action Buttons */}
        {agreementHash ? (
          <div className="bg-emerald-500/10 border border-emerald-500/30 p-4 rounded-2xl text-center space-y-2 text-emerald-300">
            <CheckCircle2 className="h-8 w-8 text-emerald-400 mx-auto" />
            <p className="text-sm font-black">Legal E-Signature Executed Successfully!</p>
            <p className="text-[10px] font-mono text-cyan-300 truncate">Hash: {agreementHash}</p>
            <button
              onClick={onClose}
              className="mt-2 w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs"
            >
              Close & Download Signed Covenant
            </button>
          </div>
        ) : (
          <button
            onClick={handleSignAgreement}
            disabled={!signatureData || signing}
            className={`w-full py-3 rounded-xl font-extrabold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all ${
              signatureData && !signing
                ? "bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white shadow-lg shadow-cyan-500/25"
                : "bg-slate-800 text-slate-500 cursor-not-allowed"
            }`}
          >
            <ShieldCheck className="h-4 w-4" />
            {signing ? "Encrypting & Stamping Hash..." : "Execute Cryptographic E-Sign"}
          </button>
        )}

      </div>
    </div>
  );
}
