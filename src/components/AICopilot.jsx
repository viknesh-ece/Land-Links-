"use client";

import { useState } from "react";
import { MessageSquare, X, Sparkles, ShieldCheck, Compass, HelpCircle, CheckSquare, ChevronRight } from "lucide-react";

export default function AICopilot() {
  const [isOpen, setIsOpen] = useState(false);
  const [chatLog, setChatLog] = useState([
    {
      sender: "ai",
      text: "Hello! I am your LandLinkX Registry Assistant. How can I assist you with your land diligence today?",
      time: "Just now",
    }
  ]);
  const [checklist, setChecklist] = useState([
    { id: 1, label: "Verify Title Deed (Patta/Chitta)", checked: true },
    { id: 2, label: "Get Encumbrance Certificate (EC) - 30 Years", checked: false },
    { id: 3, label: "Check Land Zoning Classification", checked: false },
    { id: 4, label: "Assess Soil Load Capacity (SBC)", checked: false },
    { id: 5, label: "Confirm Road Widening buffer zones", checked: false },
  ]);

  const presetQuestions = [
    {
      q: "What is FSI / FAR limit?",
      a: "Floor Space Index (FSI) or Floor Area Ratio (FAR) is the ratio of the total built-up area of a building to the total size of the plot. For example, if your plot size is 2,000 sq. ft. and the allowed FSI is 2.5, you can construct up to 5,000 sq. ft. of total floor area (e.g., G+4 floors of 1,000 sq. ft. each).",
    },
    {
      q: "How to audit clear deeds?",
      a: "A clear deed requires: 1. A continuous chain of title transfers for at least 30 years. 2. A clean Encumbrance Certificate (EC) verifying zero active mortgages. 3. Matching survey boundaries in municipal revenue logs. Our Title Verification wizard automates OCR scans of these files.",
    },
    {
      q: "Explain Soil SBC ratings",
      a: "Safe Bearing Capacity (SBC) is the maximum load the soil can safely support per unit area without shear failure or settlement. 1. Clay / Loose Silt: low SBC (80-120 kN/m²), requires raft/pile foundations. 2. Red Loamy / Murrum: medium SBC (180-250 kN/m²), raft/strip footings. 3. Bedrock: high SBC (>400 kN/m²), shallow footings.",
    }
  ];

  const handleAskQuestion = (question, answer) => {
    const time = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    setChatLog((prev) => [
      ...prev,
      { sender: "user", text: question, time },
      { sender: "ai", text: answer, time }
    ]);
  };

  const toggleChecklist = (id) => {
    setChecklist((prev) =>
      prev.map((item) => (item.id === id ? { ...item, checked: !item.checked } : item))
    );
  };

  return (
    <>
      {/* Floating Action Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 h-14 w-14 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white shadow-xl shadow-indigo-600/20 hover:shadow-indigo-600/35 hover:scale-105 active:scale-95 transition-all duration-205 flex items-center justify-center cursor-pointer z-50 border-0"
        title="Open AI Assistant"
      >
        <Sparkles className="h-6 w-6 text-white animate-pulse" />
      </button>

      {/* Slide-out Drawer */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex justify-end animate-in fade-in duration-200">
          {/* Backdrop */}
          <div
            onClick={() => setIsOpen(false)}
            className="absolute inset-0 bg-slate-900/20 backdrop-blur-xs cursor-pointer"
          />

          {/* Drawer Panel */}
          <div className="relative w-full max-w-md h-full bg-white/95 backdrop-blur-xl border-l border-slate-200 shadow-2xl flex flex-col z-10 animate-in slide-in-from-right duration-300">
            {/* Header */}
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center gap-2">
                <div className="h-9 w-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white">
                  <Sparkles className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-black text-sm text-slate-800 tracking-tight">AI Registry Copilot</h3>
                  <p className="text-[10px] font-bold text-indigo-600 uppercase tracking-wide">Registry Diligence Oracle</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="h-8 w-8 rounded-full border border-slate-200 flex items-center justify-center hover:bg-slate-100 text-slate-500 hover:text-slate-800 transition-all cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Chat Body & Log */}
            <div className="flex-grow overflow-y-auto p-6 space-y-5">
              {chatLog.map((msg, idx) => {
                const isAI = msg.sender === "ai";
                return (
                  <div key={idx} className={`flex ${isAI ? "justify-start" : "justify-end"} animate-fade-in`}>
                    <div
                      className={`max-w-[85%] rounded-2xl p-4 text-xs font-semibold leading-relaxed ${
                        isAI
                          ? "bg-slate-100 text-slate-850 rounded-tl-none border border-slate-200/50"
                          : "bg-indigo-650 text-white rounded-tr-none shadow-md shadow-indigo-100"
                      }`}
                    >
                      <p>{msg.text}</p>
                      <span className={`text-[8px] font-bold mt-1.5 block ${isAI ? "text-slate-400" : "text-indigo-200"}`}>
                        {msg.time}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* preset questions options list */}
            <div className="p-4 bg-slate-50/50 border-t border-slate-100 space-y-3 shrink-0">
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-1">Ask the Expert</p>
              <div className="grid grid-cols-1 gap-2">
                {presetQuestions.map((q, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleAskQuestion(q.q, q.a)}
                    className="w-full text-left px-3 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-655 hover:text-slate-900 transition-all text-xs font-bold flex items-center justify-between cursor-pointer"
                  >
                    <span className="truncate">{q.q}</span>
                    <ChevronRight className="h-4 w-4 text-slate-400 shrink-0" />
                  </button>
                ))}
              </div>
            </div>

            {/* Interactive Diligence Checklist Widget */}
            <div className="p-5 bg-white border-t border-slate-100 shrink-0">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-505 flex items-center gap-1">
                  <CheckSquare className="h-4 w-4 text-indigo-500" />
                  P2P Diligence Checklist
                </span>
                <span className="text-[9px] font-black text-indigo-600 bg-indigo-50 border border-indigo-150 px-2 py-0.5 rounded">
                  {checklist.filter((c) => c.checked).length} / {checklist.length} Completed
                </span>
              </div>
              <div className="space-y-2">
                {checklist.map((item) => (
                  <label
                    key={item.id}
                    className="flex items-center justify-between p-2.5 border border-slate-150 rounded-xl bg-slate-50/40 hover:bg-slate-50 cursor-pointer text-xs font-semibold transition-colors"
                  >
                    <span className={item.checked ? "text-slate-400 line-through" : "text-slate-700"}>
                      {item.label}
                    </span>
                    <input
                      type="checkbox"
                      checked={item.checked}
                      onChange={() => toggleChecklist(item.id)}
                      className="rounded border-slate-300 text-indigo-600 h-4.5 w-4.5 cursor-pointer focus:ring-indigo-500"
                    />
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
