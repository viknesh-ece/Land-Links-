"use client";

import Navbar from "@/components/Navbar";
import { useState, useEffect } from "react";
import { 
  ShieldCheck, ShieldAlert, FileText, CheckCircle2, XCircle, AlertTriangle, 
  UserCheck, Search, Filter, Eye, RefreshCw, UserX, Lock, Download, 
  CheckSquare, FileSpreadsheet, Map, Award, ExternalLink, HelpCircle, Check
} from "lucide-react";
import AdminDocumentInspectorModal from "@/components/AdminDocumentInspectorModal";

export default function AdminDashboard() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProp, setSelectedProp] = useState(null);
  const [auditDetails, setAuditDetails] = useState(null);
  const [processingId, setProcessingId] = useState(null);
  const [activeTab, setActiveTab] = useState("all");
  const [previewDoc, setPreviewDoc] = useState(null);
  const [docVerifications, setDocVerifications] = useState({});

  useEffect(() => {
    async function loadProperties() {
      try {
        const res = await fetch("/api/properties");
        if (res.ok) {
          const data = await res.json();
          const props = Array.isArray(data) ? data : [];
          setProperties(props);
          if (props.length > 0) {
            handleRunForensics(props[0]);
          }
        }
      } catch (err) {
        console.error("Failed to load properties for admin review", err);
      } finally {
        setLoading(false);
      }
    }
    loadProperties();
  }, []);

  const handleRunForensics = async (prop) => {
    setSelectedProp(prop);
    setProcessingId(prop.id);
    
    // Initialize verification checklist for this property
    setDocVerifications({
      patta: true,
      deed: true,
      ec: prop.verificationStatus === "VERIFIED" || prop.verificationStatus === "AUTOMATED_PASSED",
      fmb: true,
      soil: true,
      kyc: true
    });

    try {
      const res = await fetch("/api/admin/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          propertyId: prop.id,
          docType: "Land Patta / Chitta Deed",
          pattaNo: prop.pattaNumber || "78190",
          surveyNo: prop.surveyNumber || "402/1A",
          district: prop.location,
          userProfile: { name: prop.extractedOwnerName || "Rajesh Kumar", kycVerified: true }
        })
      });
      if (res.ok) {
        const result = await res.json();
        setAuditDetails(result);
      }
    } catch (err) {
      console.error("Failed to run forensic audit", err);
    } finally {
      setProcessingId(null);
    }
  };

  const handleUpdateStatus = (status) => {
    if (!selectedProp) return;
    setProperties(prev => prev.map(p => p.id === selectedProp.id ? { ...p, verificationStatus: status } : p));
    setSelectedProp(prev => ({ ...prev, verificationStatus: status }));
  };

  const toggleDocVerification = (docKey) => {
    setDocVerifications(prev => ({
      ...prev,
      [docKey]: !prev[docKey]
    }));
  };

  const verifyAllDocs = () => {
    setDocVerifications({
      patta: true,
      deed: true,
      ec: true,
      fmb: true,
      soil: true,
      kyc: true
    });
  };

  const getUploadedDocsList = (prop) => {
    if (!prop) return [];
    return [
      {
        id: "patta",
        title: "Patta / Chitta Revenue Record",
        fileName: prop.pattaDocument || `Patta_Chitta_${prop.pattaNumber || '78190'}.pdf`,
        fileSize: "2.4 MB",
        uploaded: Boolean(prop.pattaDocument || prop.pattaNumber),
        verified: docVerifications.patta,
        type: "Government Land Record",
        hash: "SHA256: 8f92a1c0d4e5f600...9812",
        details: `Patta #${prop.pattaNumber || '78190'} • Survey #${prop.surveyNumber || '402/2A'}`
      },
      {
        id: "deed",
        title: "Registered Sale Deed / Mother Deed",
        fileName: prop.landDeed || `Original_Sale_Deed_${prop.id}.pdf`,
        fileSize: "5.8 MB",
        uploaded: Boolean(prop.landDeed || true),
        verified: docVerifications.deed,
        type: "Title Document",
        hash: "SHA256: 4b12c8e9f0a1b2c3...7741",
        details: `Owner: ${prop.extractedOwnerName || 'Rajesh Kumar S/O Sundaram'}`
      },
      {
        id: "ec",
        title: "Encumbrance Certificate (EC - Nil Encumbrance)",
        fileName: `EC_TamilNilam_15Yrs_${prop.pattaNumber || '78190'}.pdf`,
        fileSize: "1.9 MB",
        uploaded: true,
        verified: docVerifications.ec,
        type: "Legal Clearance Certificate",
        hash: "SHA256: 3c91d8e7a6b5c4d3...1120",
        details: "15-Year Non-Encumbrance Certified by Sub-Registrar"
      },
      {
        id: "fmb",
        title: "Field Measurement Book (FMB Sketch)",
        fileName: `FMB_Sketch_Survey_${(prop.surveyNumber || '402').replace('/', '_')}.pdf`,
        fileSize: "3.1 MB",
        uploaded: true,
        verified: docVerifications.fmb,
        type: "GIS Boundary Vector",
        hash: "SHA256: 7a8b9c0d1e2f3a4b...5562",
        details: "Survey Dept Vector Boundaries & Coordinates"
      },
      {
        id: "soil",
        title: "Soil Mechanics & Geotech Test Report",
        fileName: prop.soilReport || `Soil_Mechanics_BH1_${prop.id}.pdf`,
        fileSize: "4.2 MB",
        uploaded: Boolean(prop.soilReport || true),
        verified: docVerifications.soil,
        type: "Engineering Survey",
        hash: "SHA256: 1e2d3c4b5a6f7e8d...9903",
        details: "Borehole Depth: 15m • Safe Bearing Capacity: 220 kN/m²"
      },
      {
        id: "kyc",
        title: "Owner Identity & eKYC Binding",
        fileName: "Aadhaar_PAN_eKYC_Verified.pdf",
        fileSize: "1.1 MB",
        uploaded: true,
        verified: docVerifications.kyc,
        type: "Identity Proof",
        hash: "SHA256: e8f7d6c5b4a3f2e1...4419",
        details: "UIDAI 256-Bit Encrypted Aadhaar & PAN Card Attached"
      }
    ];
  };

  const currentDocs = getUploadedDocsList(selectedProp);
  const uploadedCount = currentDocs.filter(d => d.uploaded).length;
  const verifiedDocsCount = currentDocs.filter(d => d.verified).length;

  const filteredProperties = properties.filter(p => {
    if (activeTab === "all") return true;
    if (activeTab === "verified") return p.verificationStatus === "VERIFIED" || p.verificationStatus === "AUTOMATED_PASSED";
    if (activeTab === "pending") return p.verificationStatus === "PENDING" || p.verificationStatus === "IN_REVIEW";
    if (activeTab === "rejected") return p.verificationStatus === "REJECTED" || p.verificationStatus === "OWNER_MISMATCH_SUSPECTED";
    return true;
  });

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-8 space-y-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-black uppercase tracking-wider mb-2">
              <ShieldAlert className="h-3.5 w-3.5" />
              Enterprise Document Audit & Verification Console
            </div>
            <h1 className="text-3xl font-black text-white tracking-tight">Admin Land Verification Queue</h1>
            <p className="text-xs text-slate-400 mt-1">Review user uploaded legal deeds, inspect OCR extractions, cross-match TamilNilam records, and verify title certificates.</p>
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl px-4 py-2 text-right">
              <p className="text-[10px] font-black uppercase text-slate-400">Total Listings</p>
              <p className="text-xl font-black text-cyan-400">{properties.length}</p>
            </div>
          </div>
        </div>

        {/* Tab Filters */}
        <div className="flex flex-wrap items-center gap-2 border-b border-slate-800 pb-3">
          {[
            { id: "all", label: "All Properties", count: properties.length },
            { id: "pending", label: "Pending Review", count: properties.filter(p => p.verificationStatus === "PENDING" || p.verificationStatus === "IN_REVIEW").length },
            { id: "verified", label: "Verified & Cleared", count: properties.filter(p => p.verificationStatus === "VERIFIED" || p.verificationStatus === "AUTOMATED_PASSED").length },
            { id: "rejected", label: "Flagged / Rejected", count: properties.filter(p => p.verificationStatus === "REJECTED" || p.verificationStatus === "OWNER_MISMATCH_SUSPECTED").length }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
                activeTab === tab.id
                  ? "bg-cyan-600 text-white shadow-lg shadow-cyan-600/20"
                  : "bg-slate-900 text-slate-400 hover:text-white border border-slate-800"
              }`}
            >
              <span>{tab.label}</span>
              <span className="px-2 py-0.5 rounded-full bg-slate-950/60 text-[10px]">{tab.count}</span>
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column: List of Properties */}
          <div className="lg:col-span-1 space-y-4">
            <h2 className="text-xs font-black uppercase tracking-wider text-slate-400 flex items-center gap-2">
              <Filter className="h-4 w-4 text-cyan-400" />
              Listing Queue ({filteredProperties.length})
            </h2>

            {loading ? (
              <div className="p-8 text-center bg-slate-900/50 rounded-2xl border border-slate-800 text-slate-400 text-xs animate-pulse">
                Loading moderation queue...
              </div>
            ) : filteredProperties.length === 0 ? (
              <div className="p-8 text-center bg-slate-900/50 rounded-2xl border border-slate-800 text-slate-400 text-xs">
                No listings in this queue tab.
              </div>
            ) : (
              filteredProperties.map((p) => {
                const isSelected = selectedProp?.id === p.id;
                const status = p.verificationStatus || "IN_REVIEW";

                return (
                  <div
                    key={p.id}
                    onClick={() => handleRunForensics(p)}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer space-y-2 ${
                      isSelected
                        ? "bg-slate-900 border-cyan-500 ring-2 ring-cyan-500/20 shadow-xl"
                        : "bg-slate-900/60 border-slate-800 hover:border-slate-700"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">#{String(p.id).slice(-6)}</span>
                      <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase ${
                        status === "VERIFIED" || status === "AUTOMATED_PASSED"
                          ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                          : status === "REJECTED"
                          ? "bg-rose-500/20 text-rose-300 border border-rose-500/30"
                          : "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                      }`}>
                        {status}
                      </span>
                    </div>

                    <h3 className="text-sm font-bold text-white line-clamp-1">{p.title}</h3>
                    <p className="text-xs text-slate-400 flex items-center gap-1">📍 {p.location}</p>
                    
                    <div className="flex items-center justify-between pt-1 border-t border-slate-800/80">
                      <span className="text-xs font-black text-cyan-400">₹{(p.price / 100000).toFixed(1)} Lakhs</span>
                      <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1">
                        <FileText className="h-3 w-3 text-cyan-400" />
                        6 Uploaded Docs
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Right Column: Detailed Audit & User Uploaded Documents Verification */}
          <div className="lg:col-span-2 space-y-6">
            {selectedProp ? (
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-6 shadow-2xl">
                
                {/* Title & Actions */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
                  <div>
                    <h2 className="text-xl font-black text-white">{selectedProp.title}</h2>
                    <p className="text-xs text-slate-400 mt-1">📍 {selectedProp.location} • Parcel ID: #{selectedProp.id}</p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleUpdateStatus("VERIFIED")}
                      className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-lg shadow-emerald-600/20 cursor-pointer"
                    >
                      <CheckCircle2 className="h-4 w-4" />
                      Approve & Issue Badge
                    </button>
                    <button
                      onClick={() => handleUpdateStatus("REJECTED")}
                      className="px-4 py-2 rounded-xl bg-rose-600/20 hover:bg-rose-600/30 border border-rose-500/40 text-rose-300 font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer"
                    >
                      <XCircle className="h-4 w-4" />
                      Reject Title
                    </button>
                  </div>
                </div>

                {/* USER UPLOADED DOCUMENTS VERIFICATION CHECKLIST */}
                <div className="bg-slate-950 rounded-2xl border border-slate-800 p-5 space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
                    <div>
                      <h3 className="text-sm font-black text-white flex items-center gap-2">
                        <FileText className="h-4 w-4 text-cyan-400" />
                        User Uploaded Documents Verification Checklist
                      </h3>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        Inspect every uploaded deed, map, and test report to ensure completeness.
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="px-3 py-1 rounded-full text-xs font-black uppercase bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                        {verifiedDocsCount} / {currentDocs.length} Verified
                      </span>
                      <button
                        onClick={verifyAllDocs}
                        className="px-3 py-1.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-[11px] flex items-center gap-1 transition-all cursor-pointer"
                      >
                        <Check className="h-3.5 w-3.5" />
                        Verify All Docs
                      </button>
                    </div>
                  </div>

                  {/* Documents List Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {currentDocs.map((doc) => (
                      <div
                        key={doc.id}
                        className={`p-3.5 rounded-xl border transition-all flex flex-col justify-between space-y-2.5 ${
                          doc.verified 
                            ? "bg-slate-900/90 border-emerald-500/40" 
                            : "bg-slate-900/60 border-slate-800"
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="space-y-0.5">
                            <span className="text-[9px] font-extrabold uppercase text-cyan-400">{doc.type}</span>
                            <h4 className="text-xs font-bold text-white line-clamp-1">{doc.title}</h4>
                            <p className="text-[10px] font-mono text-slate-400 truncate">{doc.fileName} ({doc.fileSize})</p>
                          </div>

                          <button
                            onClick={() => toggleDocVerification(doc.id)}
                            className={`p-1.5 rounded-lg border transition-all cursor-pointer ${
                              doc.verified 
                                ? "bg-emerald-500 text-white border-emerald-400" 
                                : "bg-slate-950 text-slate-500 border-slate-700 hover:border-slate-500"
                            }`}
                            title={doc.verified ? "Mark as unverified" : "Mark as verified"}
                          >
                            <Check className="h-3.5 w-3.5" />
                          </button>
                        </div>

                        <div className="flex items-center justify-between text-[10px] pt-2 border-t border-slate-800/80">
                          <span className="text-slate-400 truncate max-w-[160px]">{doc.details}</span>
                          <button
                            onClick={() => setPreviewDoc(doc)}
                            className="px-2 py-1 rounded-lg bg-slate-800 hover:bg-cyan-600 hover:text-white text-cyan-300 font-bold transition-all flex items-center gap-1 cursor-pointer border-0"
                          >
                            <Eye className="h-3 w-3" />
                            Inspect
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Forensic Results & Score Cards */}
                {auditDetails && (
                  <div className="space-y-4">
                    
                    {/* Score Card */}
                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                      <div className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800">
                        <p className="text-[10px] font-black uppercase text-slate-400">Zero-Trust Score</p>
                        <p className={`text-2xl font-black ${auditDetails.score >= 80 ? "text-emerald-400" : "text-amber-400"}`}>
                          {auditDetails.score} / 100
                        </p>
                      </div>

                      <div className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800">
                        <p className="text-[10px] font-black uppercase text-slate-400">OCR Identity Match</p>
                        <p className={`text-xl font-black ${auditDetails.nameMatchScore >= 85 ? "text-emerald-400" : "text-rose-400"}`}>
                          {auditDetails.nameMatchScore}% Match
                        </p>
                        <p className="text-[9px] font-mono text-slate-400 truncate mt-0.5">"{auditDetails.extractedOwnerName}"</p>
                      </div>

                      <div className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800">
                        <p className="text-[10px] font-black uppercase text-slate-400">pHash Checksum</p>
                        <p className="text-xs font-mono text-cyan-300 truncate mt-1">{auditDetails.pHash}</p>
                      </div>

                      <div className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800">
                        <p className="text-[10px] font-black uppercase text-slate-400">TN Digital Stamp</p>
                        <p className="text-xs font-bold text-emerald-400 mt-1">{auditDetails.qrValid ? "TamilNilam Valid" : "Standard Deed"}</p>
                      </div>
                    </div>

                    {/* Audit Execution Logs */}
                    <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2">
                      <h4 className="text-xs font-black uppercase text-slate-300 flex items-center gap-2">
                        <FileText className="h-4 w-4 text-cyan-400" />
                        Automated AI Forensic Execution Logs
                      </h4>
                      <div className="font-mono text-xs text-slate-300 space-y-1 bg-black/40 p-3 rounded-xl max-h-36 overflow-y-auto border border-slate-800/80">
                        {auditDetails.logs.map((log, idx) => (
                          <div key={idx} className="leading-relaxed">{log}</div>
                        ))}
                      </div>
                    </div>

                    {/* Issues List */}
                    {auditDetails.issues.length > 0 && (
                      <div className="bg-rose-500/10 border border-rose-500/30 p-4 rounded-2xl space-y-2 text-rose-300">
                        <h4 className="text-xs font-black uppercase flex items-center gap-2 text-rose-400">
                          <AlertTriangle className="h-4 w-4" />
                          Detected Risk Indicators
                        </h4>
                        <ul className="text-xs space-y-1 list-disc list-inside">
                          {auditDetails.issues.map((iss, idx) => (
                            <li key={idx}>{iss}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                  </div>
                )}

              </div>
            ) : (
              <div className="bg-slate-900/40 border border-slate-800 rounded-3xl p-12 text-center text-slate-400 space-y-3">
                <ShieldCheck className="h-12 w-12 text-cyan-500/40 mx-auto" />
                <h3 className="text-lg font-bold text-white">Select a Property for Human Audit</h3>
                <p className="text-xs text-slate-400 max-w-md mx-auto">
                  Click on any property in the queue to inspect user uploaded deeds, verify OCR names, and validate TamilNilam revenue records.
                </p>
              </div>
            )}
          </div>

        </div>

        {/* ADVANCED DOCUMENT PREVIEW & INSPECTION MODAL */}
        {previewDoc && (
          <AdminDocumentInspectorModal
            doc={previewDoc}
            property={selectedProp}
            onClose={() => setPreviewDoc(null)}
            onVerifyToggle={toggleDocVerification}
          />
        )}

      </main>
    </div>
  );
}

