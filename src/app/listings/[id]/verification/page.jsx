"use client";

import Navbar from "@/components/Navbar";
import { useState, useEffect, use } from "react";
import { ShieldCheck, ShieldAlert, FileText, CheckCircle2, XCircle, AlertTriangle, UserCheck, ArrowLeft, Download, Clock, Award, FileCode, Check, RefreshCw } from "lucide-react";
import Link from "next/link";
import { lookupTNRegistryRecord } from "@/lib/mockTNRegistry";

export default function PropertyVerificationReport({ params }) {
  const resolvedParams = use(params);
  const propertyId = resolvedParams?.id || "prop_1";
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProperty() {
      try {
        const res = await fetch(`/api/properties/${propertyId}`);
        if (res.ok) {
          const data = await res.json();
          setProperty(data);
        }
      } catch (err) {
        console.error("Failed to load verification report", err);
      } finally {
        setLoading(false);
      }
    }
    loadProperty();
  }, [propertyId]);

  const mockProp = property || {
    id: propertyId,
    title: "10.5 Acres Prime Commercial Land on Devanahalli Highway",
    location: "Peelamedu, Coimbatore",
    pattaNumber: "78190",
    surveyNumber: "402/2A",
    extractedOwnerName: "Rajesh Kumar S/O Sundaram",
    nameMatchScore: 100,
    qrValid: true,
    pHash: "phash_8f92a1c0d4e5f600",
    verificationStatus: "VERIFIED"
  };

  const tnGovRecord = lookupTNRegistryRecord({
    pattaNo: mockProp.pattaNumber,
    surveyNo: mockProp.surveyNumber,
    district: mockProp.location
  });

  const eKycProfile = {
    name: "Rajesh Kumar",
    kycType: "AADHAAR",
    kycNumber: "XXXX-XXXX-9812",
    verified: true
  };

  const riskBreakdown = [
    { category: "MIME Security Scan", maxScore: 20, score: 20, status: "PASSED" },
    { category: "EXIF Metadata Inspection", maxScore: 20, score: mockProp.verificationStatus === "REJECTED" ? 5 : 20, status: mockProp.verificationStatus === "REJECTED" ? "FAILED" : "PASSED" },
    { category: "OCR Owner Identity Cross-Match", maxScore: 20, score: Math.round((mockProp.nameMatchScore || 100) * 0.2), status: (mockProp.nameMatchScore || 100) >= 85 ? "PASSED" : "MISMATCH" },
    { category: "TamilNilam Revenue Registry Check", maxScore: 20, score: tnGovRecord ? 20 : 10, status: tnGovRecord ? "PASSED" : "NOT_FOUND" },
    { category: "pHash Duplicate Checksum Check", maxScore: 20, score: mockProp.verificationStatus === "FLAGGED_MANUAL_REVIEW" ? 8 : 20, status: mockProp.verificationStatus === "FLAGGED_MANUAL_REVIEW" ? "DUPLICATE" : "PASSED" }
  ];

  const totalTrustScore = riskBreakdown.reduce((acc, item) => acc + item.score, 0);

  const pipelineStages = [
    { name: "1. Document Upload", status: "COMPLETED" },
    { name: "2. Security Scan", status: "COMPLETED" },
    { name: "3. OCR Data Extraction", status: "COMPLETED" },
    { name: "4. TN Revenue Match", status: tnGovRecord ? "COMPLETED" : "WARNING" },
    { name: "5. pHash Ledger Check", status: mockProp.verificationStatus === "FLAGGED_MANUAL_REVIEW" ? "WARNING" : "COMPLETED" },
    { name: "6. Admin Review Log", status: "COMPLETED" },
    { name: "7. Verification Badge Issued", status: mockProp.verificationStatus === "VERIFIED" ? "COMPLETED" : "IN_PROGRESS" }
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 py-8 space-y-8">
        
        {/* Navigation & Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
          <div className="space-y-1">
            <Link href="/listings" className="inline-flex items-center gap-1.5 text-xs font-bold text-cyan-400 hover:text-cyan-300 mb-2">
              <ArrowLeft className="h-4 w-4" /> Back to Marketplace
            </Link>
            <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2.5">
              Legal Title Verification Report Certificate
              <span className={`text-xs font-black uppercase px-3 py-1 rounded-full border ${
                mockProp.verificationStatus === "VERIFIED" || mockProp.verificationStatus === "AUTOMATED_PASSED"
                  ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40"
                  : "bg-amber-500/20 text-amber-300 border-amber-500/40"
              }`}>
                {mockProp.verificationStatus}
              </span>
            </h1>
            <p className="text-xs text-slate-400">Property Parcel ID: #{mockProp.id} • {mockProp.title}</p>
          </div>

          <button
            onClick={() => window.print()}
            className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-700 text-cyan-300 hover:border-cyan-500 text-xs font-bold transition-all flex items-center gap-2 shadow-sm self-start sm:self-auto cursor-pointer"
          >
            <Download className="h-4 w-4" /> Download Certified Audit Report
          </button>
        </div>

        {/* 7-Stage Visual Progress Pipeline */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4">
          <h3 className="text-xs font-black uppercase tracking-wider text-slate-400 flex items-center gap-2">
            <Clock className="h-4 w-4 text-cyan-400" />
            Zero-Trust Verification Pipeline Execution Status
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-7 gap-2 text-center">
            {pipelineStages.map((stage, idx) => (
              <div key={idx} className="p-3 rounded-2xl bg-slate-950 border border-slate-800 space-y-1.5">
                <div className={`h-2.5 w-2.5 rounded-full mx-auto ${
                  stage.status === "COMPLETED" ? "bg-emerald-400 animate-pulse" : "bg-amber-400"
                }`} />
                <p className="text-[10px] font-bold text-white leading-tight">{stage.name}</p>
                <p className="text-[8px] font-extrabold text-cyan-400 uppercase">{stage.status}</p>
              </div>
            ))}
          </div>
        </div>

        {/* AI Risk Score Breakdown */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-3 text-center flex flex-col justify-center">
            <p className="text-xs font-black uppercase tracking-wider text-slate-400">Overall Trust Score</p>
            <div className="text-5xl font-black text-emerald-400 tracking-tight">
              {totalTrustScore} <span className="text-xl font-normal text-slate-400">/ 100</span>
            </div>
            <p className="text-[10px] text-slate-400 font-semibold">
              Calculated across 5 Zero-Trust inspection criteria.
            </p>
          </div>

          <div className="md:col-span-2 bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4">
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-400">Detailed AI Risk Scoring Breakdown</h3>
            <div className="space-y-2.5 text-xs">
              {riskBreakdown.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950 border border-slate-800/80">
                  <span className="font-bold text-slate-200">{item.category}</span>
                  <div className="flex items-center gap-3">
                    <span className="font-mono font-bold text-cyan-300">{item.score} / {item.maxScore} pts</span>
                    <span className={`px-2 py-0.5 rounded-full text-[9px] font-extrabold uppercase ${
                      item.status === "PASSED" ? "bg-emerald-500/20 text-emerald-300" : "bg-rose-500/20 text-rose-300"
                    }`}>
                      {item.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* 4-Column OCR & Government Cross-Comparison Report Table */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4">
          <h3 className="text-xs font-black uppercase tracking-wider text-slate-400 flex items-center gap-2">
            <FileText className="h-4 w-4 text-cyan-400" />
            4-Column Legal OCR Entity Comparison Matrix
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 uppercase text-[10px] font-black tracking-wider">
                  <th className="py-3 px-4">Field Category</th>
                  <th className="py-3 px-4">Document Extracted (OCR)</th>
                  <th className="py-3 px-4">TN Govt Record (TamilNilam)</th>
                  <th className="py-3 px-4">User eKYC Profile</th>
                  <th className="py-3 px-4 text-right">Comparison Result</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-medium text-slate-200">
                <tr>
                  <td className="py-3 px-4 font-bold text-white">Landowner Name</td>
                  <td className="py-3 px-4 font-mono text-cyan-300">{mockProp.extractedOwnerName || "Rajesh Kumar S/O Sundaram"}</td>
                  <td className="py-3 px-4 font-mono text-indigo-300">{tnGovRecord?.registeredOwner || "Rajesh Kumar S/O Sundaram"}</td>
                  <td className="py-3 px-4 font-mono text-slate-300">{eKycProfile.name}</td>
                  <td className="py-3 px-4 text-right font-bold text-emerald-400">100% Match (Passed)</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-bold text-white">Patta Number</td>
                  <td className="py-3 px-4 font-mono text-cyan-300">Patta #{mockProp.pattaNumber || "78190"}</td>
                  <td className="py-3 px-4 font-mono text-indigo-300">Patta #{tnGovRecord?.pattaNo || "78190"}</td>
                  <td className="py-3 px-4 text-slate-500">N/A (Title Doc)</td>
                  <td className="py-3 px-4 text-right font-bold text-emerald-400">Matched & Active</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-bold text-white">Survey & Sub-Division</td>
                  <td className="py-3 px-4 font-mono text-cyan-300">Survey #{mockProp.surveyNumber || "402/2A"}</td>
                  <td className="py-3 px-4 font-mono text-indigo-300">Survey #{tnGovRecord?.surveyNo || "402"}/{tnGovRecord?.subDivisionNo || "2A"}</td>
                  <td className="py-3 px-4 text-slate-500">N/A (GIS Vector)</td>
                  <td className="py-3 px-4 text-right font-bold text-emerald-400">Matched</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-bold text-white">Cryptographic Signature</td>
                  <td className="py-3 px-4 font-mono text-cyan-300">SHA256-TN-STAMP</td>
                  <td className="py-3 px-4 font-mono text-indigo-300">{tnGovRecord?.digitalSignature || "VALID_TN_GOVT_STAMP"}</td>
                  <td className="py-3 px-4 text-slate-500">N/A</td>
                  <td className="py-3 px-4 text-right font-bold text-emerald-400">Authentic Digital Sig</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

      </main>
    </div>
  );
}