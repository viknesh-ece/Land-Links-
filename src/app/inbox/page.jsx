"use client";
import Navbar from "@/components/Navbar";
import { useState, useEffect, useRef } from "react";
import { getLoggedInUser } from "@/lib/auth";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/context/LanguageContext";
import { Send, User, MessageSquare, DollarSign, Check, X, Info, Calendar, ShieldCheck, Lock, Award, FileText, FileCheck } from "lucide-react";

export default function InboxPage() {
    const router = useRouter();
    const { lang, t } = useLanguage();
    const [currentUser, setCurrentUser] = useState(null);
    const [activeThreadId, setActiveThreadId] = useState("");
    const [inputValue, setInputValue] = useState("");
    const [threads, setThreads] = useState([]);
    // Escrow Workspace States
    const [escrowStep, setEscrowStep] = useState({});
    const [escrowLoading, setEscrowLoading] = useState(false);
    const [escrowLoadingText, setEscrowLoadingText] = useState("");
    const [auditStatus, setAuditStatus] = useState({});
    const [hasSigned, setHasSigned] = useState({});
    const canvasRef = useRef(null);
    const [isDrawing, setIsDrawing] = useState(false);

    const seedMockThreads = async (activeUser) => {
        const mockThreads = [
            {
                name: "Rajesh Kumar",
                role: "Landowner",
                propertyName: "Chennai Farm Land",
                propertyPrice: 2500000,
                location: "Chennai",
                lastMessage: "I can agree to ₹24 Lakhs if we close the registration by next week.",
                unread: true,
                status: "pending",
                myOffer: 2350000,
                counterOffer: 2400000,
                userId: activeUser.id,
                initialMessages: [
                    { sender: "me", text: "Hi Rajesh, I am interested in your Chennai farm land parcel. I noticed it has a fully vetted title. Would you accept ₹23.5 Lakhs for it?", time: "10:30 AM" },
                    { sender: "them", text: "Hello! Thank you for reaching out. Yes, the deeds are completely clear and verified. ₹23.5 Lakhs is a bit low since road widening is coming near the parcel.", time: "10:45 AM" },
                    { sender: "them", text: "I can agree to ₹24 Lakhs if we close the registration by next week.", time: "10:47 AM" }
                ]
            },
            {
                name: "Vicky (Builder)",
                role: "Builder",
                propertyName: "Industrial Plot - Trichy",
                propertyPrice: 12000000,
                location: "Trichy",
                lastMessage: "Sounds good, let's schedule the title deed check.",
                unread: false,
                status: "none",
                myOffer: 0,
                userId: activeUser.id,
                initialMessages: [
                    { sender: "them", text: "Hello, I saw your co-investment slot for the industrial site. Is the FSI rating officially zoned for commercial construction?", time: "Yesterday" },
                    { sender: "me", text: "Hi Vicky! Yes, it's zoned for Industrial/Commercial. We have official NOC clearances from local bodies.", time: "Yesterday" },
                    { sender: "them", text: "Sounds good, let's schedule the title deed check.", time: "Yesterday" }
                ]
            }
        ];

        try {
            const loadedThreads = [];
            for (const t of mockThreads) {
                const res = await fetch("/api/inbox", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(t)
                });
                if (res.ok) {
                    const data = await res.json();
                    loadedThreads.push(data);
                }
            }
            if (loadedThreads.length > 0) {
                setThreads(loadedThreads);
                setActiveThreadId(loadedThreads[0].id);
            }
        } catch (err) {
            console.error("Seeding threads error:", err);
        }
    };

    useEffect(() => {
        const user = getLoggedInUser();
        if (!user) {
            router.push("/login");
            return;
        }
        setCurrentUser(user);

        async function loadThreads() {
            try {
                const res = await fetch(`/api/inbox?userId=${user.id}`);
                if (res.ok) {
                    const data = await res.json();
                    if (data.length > 0) {
                        setThreads(data);
                        // Make sure custom offers are loaded
                        const offerProp = localStorage.getItem("pending_offer_property");
                        if (offerProp) {
                            const parsed = JSON.parse(offerProp);
                            const newThreadData = {
                                name: parsed.ownerName || "Rajesh Kumar",
                                role: "Landowner",
                                propertyName: parsed.title,
                                propertyPrice: parsed.price,
                                location: parsed.location,
                                lastMessage: `Offer submitted: ₹ ${new Intl.NumberFormat("en-IN").format(parsed.offerPrice)}`,
                                unread: false,
                                status: "pending",
                                myOffer: Number(parsed.offerPrice),
                                userId: user.id,
                                initialMessages: [
                                    { sender: "me", text: `Hi, I would like to make an offer of ₹ ${new Intl.NumberFormat("en-IN").format(parsed.offerPrice)} on your listing "${parsed.title}". Let me know if you would like to initiate negotiations.`, time: "Just now" },
                                    { sender: "them", text: `Thank you for your offer. Let me review the valuation criteria and get back to you.`, time: "Just now", system: true }
                                ]
                            };
                            const offerRes = await fetch("/api/inbox", {
                                method: "POST",
                                headers: { "Content-Type": "application/json" },
                                body: JSON.stringify(newThreadData)
                            });
                            if (offerRes.ok) {
                                const newThread = await offerRes.json();
                                setThreads(prev => [newThread, ...prev.filter(t => t.propertyName !== newThread.propertyName)]);
                                setActiveThreadId(newThread.id);
                            }
                            localStorage.removeItem("pending_offer_property");
                        } else {
                            setActiveThreadId(data[0].id);
                        }
                    } else {
                        await seedMockThreads(user);
                    }
                }
            } catch (err) {
                console.error("Load Threads Error:", err);
            }
        }
        loadThreads();
    }, [router]);
    if (!currentUser)
        return null;
    const activeThread = threads.find(t => t.id === activeThreadId) || threads[0];
    if (!activeThread) {
        return (
            <div className="min-h-screen bg-transparent text-slate-805 flex flex-col font-sans">
              <Navbar />
              <main className="flex-grow flex items-center justify-center">
                <div className="text-center space-y-3">
                  <div className="h-8 w-8 border-2 border-indigo-650 border-t-transparent rounded-full animate-spin mx-auto"></div>
                  <p className="text-xs font-bold text-slate-500">Loading negotiation threads...</p>
                </div>
              </main>
            </div>
        );
    }
    const currentStep = escrowStep[activeThread.id] || 1;
    const currentAudit = auditStatus[activeThread.id] || ["pending", "pending", "pending"];
    // Signature drawing canvas functions
    const getCoordinates = (e) => {
        const canvas = canvasRef.current;
        if (!canvas)
            return { x: 0, y: 0 };
        const rect = canvas.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * canvas.width;
        const y = ((e.clientY - rect.top) / rect.height) * canvas.height;
        return { x, y };
    };
    const startDrawing = (e) => {
        const canvas = canvasRef.current;
        if (!canvas)
            return;
        const ctx = canvas.getContext("2d");
        if (!ctx)
            return;
        const { x, y } = getCoordinates(e);
        ctx.beginPath();
        ctx.moveTo(x, y);
        setIsDrawing(true);
        ctx.strokeStyle = "#818cf8"; // Indigo color
        ctx.lineWidth = 3;
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
    };
    const draw = (e) => {
        if (!isDrawing)
            return;
        const canvas = canvasRef.current;
        if (!canvas)
            return;
        const ctx = canvas.getContext("2d");
        if (!ctx)
            return;
        const { x, y } = getCoordinates(e);
        ctx.lineTo(x, y);
        ctx.stroke();
    };
    const stopDrawing = () => {
        setIsDrawing(false);
    };
    const clearCanvas = () => {
        const canvas = canvasRef.current;
        if (!canvas)
            return;
        const ctx = canvas.getContext("2d");
        if (!ctx)
            return;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    };
    const getTouchCoordinates = (e) => {
        const canvas = canvasRef.current;
        if (!canvas || e.touches.length === 0)
            return { x: 0, y: 0 };
        const rect = canvas.getBoundingClientRect();
        const touch = e.touches[0];
        const x = ((touch.clientX - rect.left) / rect.width) * canvas.width;
        const y = ((touch.clientY - rect.top) / rect.height) * canvas.height;
        return { x, y };
    };
    const startDrawingTouch = (e) => {
        const canvas = canvasRef.current;
        if (!canvas)
            return;
        const ctx = canvas.getContext("2d");
        if (!ctx)
            return;
        const { x, y } = getTouchCoordinates(e);
        ctx.beginPath();
        ctx.moveTo(x, y);
        setIsDrawing(true);
        ctx.strokeStyle = "#818cf8";
        ctx.lineWidth = 3;
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
    };
    const drawTouch = (e) => {
        if (!isDrawing)
            return;
        const canvas = canvasRef.current;
        if (!canvas)
            return;
        const ctx = canvas.getContext("2d");
        if (!ctx)
            return;
        const { x, y } = getTouchCoordinates(e);
        ctx.lineTo(x, y);
        ctx.stroke();
    };
    const handleInitiateDeposit = (threadId) => {
        setEscrowLoading(true);
        setEscrowLoadingText("Connecting to bank clearing gateway...");
        setTimeout(() => {
            setEscrowLoadingText("Generating encrypted transaction keys...");
            setTimeout(() => {
                setEscrowLoadingText("Confirming earnest deposit on ledger...");
                setTimeout(() => {
                    setEscrowLoadingText("Escrow Deposit Confirmed!");
                    setTimeout(() => {
                        setEscrowLoading(false);
                        setEscrowLoadingText("");
                        setEscrowStep(prev => ({ ...prev, [threadId]: 2 }));
                    }, 150);
                }, 150);
            }, 150);
        }, 150);
    };
    const handleRunAudits = (threadId) => {
        setAuditStatus(prev => ({ ...prev, [threadId]: ["running", "pending", "pending"] }));
        setTimeout(() => {
            setAuditStatus(prev => ({ ...prev, [threadId]: ["verified", "running", "pending"] }));
            setTimeout(() => {
                setAuditStatus(prev => ({ ...prev, [threadId]: ["verified", "verified", "running"] }));
                setTimeout(() => {
                    setAuditStatus(prev => ({ ...prev, [threadId]: ["verified", "verified", "verified"] }));
                    setTimeout(() => {
                        setEscrowStep(prev => ({ ...prev, [threadId]: 3 }));
                    }, 150);
                }, 150);
            }, 150);
        }, 150);
    };
    const handleExecuteDeed = (threadId) => {
        setEscrowLoading(true);
        setEscrowLoadingText("Generating cryptographically bound deed hash...");
        setTimeout(() => {
            setEscrowLoadingText("Signing block via private keystore...");
            setTimeout(() => {
                setEscrowLoadingText("Executing automated escrow ledger disbursement...");
                setTimeout(() => {
                    setEscrowLoading(false);
                    setEscrowLoadingText("");
                    setHasSigned(prev => ({ ...prev, [threadId]: true }));
                    setEscrowStep(prev => ({ ...prev, [threadId]: 4 }));
                }, 150);
            }, 150);
        }, 150);
    };
    const downloadEscrowReceipt = (thread) => {
        const docId = `TX-${thread.id.toUpperCase()}-${Math.floor(Math.random() * 90000) + 10000}`;
        const amount = thread.counterOffer || thread.propertyPrice;
        const receiptHtml = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>LandLinkX - Escrow Settlement Receipt [${docId}]</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;600;800;900&display=swap');
    body {
      font-family: 'Outfit', sans-serif;
      background-color: #030712;
      color: #f3f4f6;
      margin: 0;
      padding: 40px;
      display: flex;
      justify-content: center;
    }
    .receipt-container {
      max-width: 600px;
      width: 100%;
      background: linear-gradient(135deg, #090f1d 0%, #040813 100%);
      border: 1px solid #1e293b;
      border-radius: 24px;
      padding: 40px;
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
    }
    .header {
      border-bottom: 1px solid #1e293b;
      padding-bottom: 20px;
      margin-bottom: 30px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .logo {
      font-size: 20px;
      font-weight: 900;
      color: #ffffff;
    }
    .logo span {
      color: #6366f1;
    }
    .status {
      background: rgba(16, 185, 129, 0.1);
      border: 1px solid #10b981;
      color: #10b981;
      padding: 4px 12px;
      border-radius: 100px;
      font-size: 10px;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 1px;
    }
    .details {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 30px;
    }
    .details td {
      padding: 12px 0;
      border-bottom: 1px solid #0f172a;
      font-size: 13px;
    }
    .details td.label {
      color: #94a3b8;
    }
    .details td.value {
      font-weight: 600;
      color: #ffffff;
      text-align: right;
    }
    .footer {
      border-top: 1px solid #1e293b;
      padding-top: 20px;
      text-align: center;
      font-size: 10px;
      color: #64748b;
    }
  </style>
</head>
<body>
  <div class="receipt-container">
    <div class="header">
      <div class="logo">Land<span>LinkX</span></div>
      <div class="status">Settled & Locked</div>
    </div>
    <h2 style="font-size: 18px; margin-top: 0; color: #ffffff;">P2P Escrow Transfer Receipt</h2>
    <p style="font-size: 12px; color: #94a3b8; margin-bottom: 24px;">This certificate confirms that the digital escrow transfer is successfully finalized on the LandLinkX ledger.</p>
    <table class="details">
      <tr>
        <td class="label">Transaction Reference</td>
        <td class="value">${docId}</td>
      </tr>
      <tr>
        <td class="label">Property / Asset</td>
        <td class="value">${thread.propertyName}</td>
      </tr>
      <tr>
        <td class="label">Location</td>
        <td class="value">${thread.location}</td>
      </tr>
      <tr>
        <td class="label">Landowner / Seller</td>
        <td class="value">${thread.name}</td>
      </tr>
      <tr>
        <td class="label">Escrow Release Value</td>
        <td class="value" style="color: #10b981; font-weight: 800;">₹ ${new Intl.NumberFormat("en-IN").format(amount)}</td>
      </tr>
      <tr>
        <td class="label">Registry Ledger Hash</td>
        <td class="value" style="font-family: monospace; font-size: 10px; max-width: 250px; overflow-wrap: break-word;">0x78af98c566a01b1de38e874bc0569a7c88b2a3d5f992381f9a2e38b383ef1d1e</td>
      </tr>
    </table>
    <div class="footer">
      Generated automatically by LandLinkX P2P Escrow Protocol & bull; Secure Encrypted Transaction
    </div>
  </div>
</body>
</html>`;
        const blob = new Blob([receiptHtml], { type: "text/html" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `LandLinkX_Escrow_Receipt_${docId}.html`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };
    const handleSendMessage = async () => {
        if (!inputValue.trim())
            return;
        const timeNow = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const textVal = inputValue;
        setInputValue("");

        try {
            const res = await fetch("/api/inbox/messages", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    threadId: activeThread.id,
                    sender: "me",
                    text: textVal,
                    time: timeNow
                })
            });

            if (res.ok) {
                const newMsg = await res.json();
                setThreads(prev => prev.map(t => {
                    if (t.id === activeThreadId) {
                        return {
                            ...t,
                            lastMessage: textVal,
                            messages: [...t.messages, newMsg]
                        };
                    }
                    return t;
                }));

                // Snappy simulated reply
                setTimeout(async () => {
                    const replyText = `Got your message. I am currently reviewing the document package for "${activeThread.propertyName}" and will call you back shortly.`;
                    const replyTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

                    const replyRes = await fetch("/api/inbox/messages", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            threadId: activeThread.id,
                            sender: "them",
                            text: replyText,
                            time: replyTime
                        })
                    });

                    if (replyRes.ok) {
                        const replyMsg = await replyRes.json();
                        setThreads(prev => prev.map(t => {
                            if (t.id === activeThreadId) {
                                return {
                                    ...t,
                                    lastMessage: replyText,
                                    messages: [...t.messages, replyMsg]
                                };
                            }
                            return t;
                        }));
                    }
                }, 300);
            }
        } catch (err) {
            console.error("Send Message Error:", err);
        }
    };

    const handleNegotiation = async (action, counterVal) => {
        const timeNow = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        let systemText = "";
        let newStatus = activeThread.status;
        if (action === "accept") {
            systemText = `Negotiation Success! You accepted the offer of ₹ ${new Intl.NumberFormat("en-IN").format(activeThread.counterOffer || activeThread.propertyPrice)}. Escrow contract initiated.`;
            newStatus = "accepted";
        }
        else if (action === "decline") {
            systemText = `You declined the counter-offer.`;
            newStatus = "declined";
        }
        else if (action === "counter") {
            const formatted = new Intl.NumberFormat("en-IN").format(counterVal || 0);
            systemText = `You submitted a counter offer of ₹ ${formatted}`;
            newStatus = "countered";
        }

        try {
            await fetch("/api/inbox", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    userId: currentUser.id,
                    propertyName: activeThread.propertyName,
                    status: newStatus,
                    lastMessage: systemText
                })
            });

            const res = await fetch("/api/inbox/messages", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    threadId: activeThread.id,
                    sender: "me",
                    text: systemText,
                    time: timeNow,
                    system: true
                })
            });

            if (res.ok) {
                const systemMsg = await res.json();
                setThreads(prev => prev.map(t => {
                    if (t.id === activeThreadId) {
                        return {
                            ...t,
                            status: newStatus,
                            lastMessage: systemText,
                            messages: [...t.messages, systemMsg]
                        };
                    }
                    return t;
                }));
            }
        } catch (err) {
            console.error("Negotiation Error:", err);
        }
    };
    return (<div className="min-h-screen bg-[#070b14] text-slate-100 flex flex-col font-sans">
      <Navbar />

      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col h-[calc(100vh-80px)]">
        
        {/* dm workspace header */}
        <div className="flex items-center gap-2 border-b border-slate-800 pb-4 mb-6 shrink-0">
          <MessageSquare className="h-6 w-6 text-cyan-400"/>
          <h1 className="text-2xl font-black text-white tracking-tight">Direct Negotiation Hub</h1>
          <span className="text-[10px] font-bold text-cyan-300 bg-cyan-500/10 border border-cyan-500/30 px-2.5 py-0.5 rounded-full ml-2">
            Secure Encrypted Bids
          </span>
        </div>

        {/* chat grid container */}
        <div className="flex-grow flex border border-slate-800 bg-slate-900/90 backdrop-blur-xl overflow-hidden shadow-2xl h-0 rounded-3xl">
          
          {/* threads sidebar */}
          <div className="w-80 border-r border-slate-800 flex flex-col shrink-0">
            <div className="p-4 border-b border-slate-800">
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Active Conversations</p>
            </div>
            <div className="flex-grow overflow-y-auto p-2 space-y-1">
              {threads.map(t => {
            const isActive = t.id === activeThreadId;
            return (<button key={t.id} onClick={() => {
                    setActiveThreadId(t.id);
                    t.unread = false;
                }} className={`w-full text-left p-3.5 rounded-2xl border transition-all flex items-start gap-3 cursor-pointer ${isActive
                    ? "bg-cyan-500/10 border-cyan-500/30 text-white"
                    : "border-transparent hover:bg-slate-800/60 text-slate-400 hover:text-slate-200"}`}>
                    <div className="h-9 w-9 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center shrink-0">
                      <User className={`h-4.5 w-4.5 ${isActive ? "text-cyan-400" : "text-slate-400"}`}/>
                    </div>
                    <div className="flex-grow min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="font-bold text-xs truncate flex items-center gap-1 text-white">
                          {t.name}
                          <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" title="Verified User"/>
                        </p>
                        {t.unread && (<span className="h-2 w-2 rounded-full bg-cyan-400 shrink-0"></span>)}
                      </div>
                      <p className="text-[9px] font-bold text-slate-400 mt-0.5 truncate">{t.propertyName}</p>
                      <p className="text-[10px] font-medium text-slate-400 mt-1 line-clamp-1">{t.lastMessage}</p>
                    </div>
                  </button>);
        })}
            </div>
          </div>

          {/* active chat panel */}
          <div className="flex-grow flex flex-col min-w-0 bg-slate-950/60">
            
            {/* active thread info bar */}
            <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/60 shrink-0">
              <div className="flex items-center gap-3">
                <div>
                  <h3 className="font-bold text-sm text-white flex items-center gap-1">
                    {activeThread.name}
                    <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" title="Verified User"/>
                  </h3>
                  <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400 mt-0.5">
                    {activeThread.role} &bull; {activeThread.location}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-300 bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-800">
                  {activeThread.propertyName}
                </span>
                <span className="text-xs font-bold text-cyan-300 bg-cyan-500/10 px-3 py-1.5 rounded-xl border border-cyan-500/30">
                  ₹ {new Intl.NumberFormat("en-IN").format(activeThread.propertyPrice)}
                </span>
              </div>
            </div>

            {activeThread.status === "accepted" ? (
        /* Escrow Workspace */
        <div className="flex-grow flex flex-col overflow-y-auto p-6 animate-fade-in bg-slate-950/40">
                
                {/* Step indicator */}
                <div className="mb-8 shrink-0">
                  <div className="flex items-center justify-between max-w-xl mx-auto">
                    {/* Step 1 */}
                    <div className="flex flex-col items-center">
                      <div className={`h-9 w-9 rounded-full flex items-center justify-center border font-bold text-xs transition-all ${currentStep >= 1 ? "bg-gradient-to-r from-cyan-500 to-indigo-600 border-cyan-400 text-white shadow-lg shadow-cyan-500/25" : "border-slate-700 text-slate-500"}`}>
                        {currentStep > 1 ? <Check className="h-4 w-4"/> : "1"}
                      </div>
                      <span className="text-[10px] font-bold text-slate-400 mt-1.5 uppercase tracking-wider">Deposit</span>
                    </div>
                    <div className={`flex-grow h-0.5 max-w-[80px] mx-2 transition-all ${currentStep > 1 ? "bg-cyan-500" : "bg-slate-800"}`}></div>
                    
                    {/* Step 2 */}
                    <div className="flex flex-col items-center">
                      <div className={`h-9 w-9 rounded-full flex items-center justify-center border font-bold text-xs transition-all ${currentStep >= 2 ? "bg-gradient-to-r from-cyan-500 to-indigo-600 border-cyan-400 text-white shadow-lg shadow-cyan-500/25" : "border-slate-700 text-slate-500"}`}>
                        {currentStep > 2 ? <Check className="h-4 w-4"/> : "2"}
                      </div>
                      <span className="text-[10px] font-bold text-slate-400 mt-1.5 uppercase tracking-wider">Legal Audit</span>
                    </div>
                    <div className={`flex-grow h-0.5 max-w-[80px] mx-2 transition-all ${currentStep > 2 ? "bg-cyan-500" : "bg-slate-800"}`}></div>

                    {/* Step 3 */}
                    <div className="flex flex-col items-center">
                      <div className={`h-9 w-9 rounded-full flex items-center justify-center border font-bold text-xs transition-all ${currentStep >= 3 ? "bg-gradient-to-r from-cyan-500 to-indigo-600 border-cyan-400 text-white shadow-lg shadow-cyan-500/25" : "border-slate-700 text-slate-500"}`}>
                        {currentStep > 3 ? <Check className="h-4 w-4"/> : "3"}
                      </div>
                      <span className="text-[10px] font-bold text-slate-400 mt-1.5 uppercase tracking-wider">Sign Deed</span>
                    </div>
                    <div className={`flex-grow h-0.5 max-w-[80px] mx-2 transition-all ${currentStep > 3 ? "bg-cyan-500" : "bg-slate-800"}`}></div>

                    {/* Step 4 */}
                    <div className="flex flex-col items-center">
                      <div className={`h-9 w-9 rounded-full flex items-center justify-center border font-bold text-xs transition-all ${currentStep === 4 ? "bg-emerald-600 border-emerald-400 text-white shadow-lg shadow-emerald-500/25" : "border-slate-700 text-slate-500"}`}>
                        {currentStep === 4 ? <Award className="h-4 w-4"/> : "4"}
                      </div>
                      <span className="text-[10px] font-bold text-slate-400 mt-1.5 uppercase tracking-wider">Settlement</span>
                    </div>
                  </div>
                </div>

                {/* Content Panel based on Step */}
                <div className="flex-grow flex items-center justify-center">
                  <div className="max-w-md w-full bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
                    
                    {/* Step 1: Deposit */}
                    {currentStep === 1 && (<div className="space-y-6 text-center animate-fade-in">
                        <div className="h-14 w-14 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center mx-auto text-cyan-400">
                          <Lock className="h-6 w-6"/>
                        </div>
                        <div>
                          <h3 className="text-lg font-bold text-white">Escrow Deposit Required</h3>
                          <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                            To secure the transaction of <span className="text-cyan-300 font-semibold">{activeThread.propertyName}</span>, you must deposit 10% of the agreed price as earnest money into the secure LandLinkX P2P escrow account.
                          </p>
                        </div>
                        <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 space-y-2">
                          <div className="flex justify-between items-center text-xs text-slate-400 font-semibold">
                            <span>Agreed Property Value</span>
                            <span className="text-white">₹ {new Intl.NumberFormat("en-IN").format(activeThread.counterOffer || activeThread.propertyPrice)}</span>
                          </div>
                          <div className="flex justify-between items-center text-xs text-slate-400 font-semibold border-t border-slate-800 pt-2">
                            <span>Required Escrow Deposit (10%)</span>
                            <span className="text-cyan-400 font-black text-sm">₹ {new Intl.NumberFormat("en-IN").format((activeThread.counterOffer || activeThread.propertyPrice) * 0.1)}</span>
                          </div>
                        </div>

                        {escrowLoading ? (<div className="space-y-3">
                            <div className="h-5 w-5 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
                            <p className="text-[10px] font-bold text-cyan-400 uppercase tracking-widest animate-pulse">{escrowLoadingText}</p>
                          </div>) : (<button onClick={() => handleInitiateDeposit(activeThread.id)} className="w-full py-3.5 bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-2 border-0 shadow-lg shadow-cyan-500/25">
                            <DollarSign className="h-4 w-4"/> Deposit Earnest Funds
                          </button>)}
                      </div>)}

                    {/* Step 2: Legal Audit */}
                    {currentStep === 2 && (<div className="space-y-6 animate-fade-in">
                        <div className="text-center">
                          <div className="h-14 w-14 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center mx-auto text-cyan-400 mb-4">
                            <ShieldCheck className="h-6 w-6"/>
                          </div>
                          <h3 className="text-lg font-bold text-white">Title Registry Audit</h3>
                          <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                            LandLinkX compliance engine is verifying public registry records, ownership title history, and boundary surveys.
                          </p>
                        </div>

                        <div className="space-y-3">
                          {[
                    { id: 0, label: "Registry Title Authenticity Scan", desc: "Checking registrar database for clean chain of ownership" },
                    { id: 1, label: "Encumbrance Certificate Vetting", desc: "Ensuring no active loans, mortgages, or court claims exist" },
                    { id: 2, label: "Survey Boundary Coordinates Check", desc: "Aligning surveyor pins with GIS boundary polygons" }
                ].map((item, idx) => {
                    const status = currentAudit[idx];
                    return (<div key={idx} className="flex gap-3.5 items-start p-3 bg-slate-950 border border-slate-800 rounded-xl">
                                <div className="mt-0.5 shrink-0">
                                  {status === "verified" ? (<div className="h-5 w-5 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                                      <Check className="h-3 w-3"/>
                                    </div>) : status === "running" ? (<div className="h-5 w-5 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>) : (<div className="h-5 w-5 rounded-full border border-slate-700 bg-slate-900"></div>)}
                                </div>
                                <div className="min-w-0 flex-grow">
                                  <p className={`text-xs font-bold ${status === "verified" ? "text-white" : status === "running" ? "text-cyan-400" : "text-slate-400"}`}>{item.label}</p>
                                  <p className="text-[10px] text-slate-400 font-semibold mt-0.5 leading-normal">{item.desc}</p>
                                </div>
                              </div>);
                })}
                        </div>

                        {currentAudit.every(s => s === "pending") && (<button onClick={() => handleRunAudits(activeThread.id)} className="w-full py-3.5 bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-2 border-0 shadow-lg shadow-cyan-500/25">
                            <FileText className="h-4 w-4"/> Run Compliance Audits
                          </button>)}

                        {currentAudit.includes("running") && (<p className="text-[10px] font-bold text-center text-cyan-400 uppercase tracking-widest animate-pulse">Running verification sequence...</p>)}
                      </div>)}

                    {/* Step 3: Signature */}
                    {currentStep === 3 && (<div className="space-y-6 text-center animate-fade-in">
                        <div className="h-14 w-14 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center mx-auto text-cyan-400">
                          <FileCheck className="h-6 w-6"/>
                        </div>
                        <div>
                          <h3 className="text-lg font-bold text-white">Execute Sale Deed</h3>
                          <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                            Audits successfully cleared! Draw your signature on the secure canvas below to sign and execute the digital land deed.
                          </p>
                        </div>

                        {/* Signature Canvas */}
                        <div className="space-y-2">
                          <div className="relative">
                            <canvas ref={canvasRef} width={400} height={150} onMouseDown={startDrawing} onMouseMove={draw} onMouseUp={stopDrawing} onMouseLeave={stopDrawing} onTouchStart={startDrawingTouch} onTouchMove={drawTouch} onTouchEnd={stopDrawing} className="w-full h-36 bg-slate-950 border border-slate-800 rounded-2xl cursor-crosshair block"/>
                            <div className="absolute bottom-2 right-2 text-[9px] font-bold text-slate-500 pointer-events-none uppercase tracking-wider">
                              Secure Sandbox Signature Pad
                            </div>
                          </div>
                          <div className="flex justify-end">
                            <button onClick={clearCanvas} className="text-[10px] font-bold text-slate-400 hover:text-white border border-slate-800 bg-slate-950 px-3 py-1.5 rounded-lg cursor-pointer transition-all">
                              Reset Pad
                            </button>
                          </div>
                        </div>

                        {escrowLoading ? (<div className="space-y-3">
                            <div className="h-5 w-5 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
                            <p className="text-[10px] font-bold text-cyan-400 uppercase tracking-widest animate-pulse">{escrowLoadingText}</p>
                          </div>) : (<button onClick={() => handleExecuteDeed(activeThread.id)} className="w-full py-3.5 bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-2 border-0 shadow-lg shadow-cyan-500/25">
                            <Check className="h-4 w-4"/> Sign & Execute Deed
                          </button>)}
                      </div>)}

                    {/* Step 4: Settlement */}
                    {currentStep === 4 && (<div className="space-y-6 text-center animate-fade-in">
                        <div className="h-14 w-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mx-auto text-emerald-400">
                          <Check className="h-6 w-6"/>
                        </div>
                        <div>
                          <h3 className="text-lg font-bold text-white">Escrow Settled & Sealed</h3>
                          <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                            The sale deed has been cryptographically signed and confirmed on the decentralized LandLinkX registry ledger. The escrow deposit has been released to the landowner.
                          </p>
                        </div>

                        {/* Transaction Receipt Box */}
                        <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 text-left space-y-3">
                          <div className="border-b border-slate-800 pb-2">
                            <span className="text-[9px] font-bold text-cyan-400 uppercase tracking-wider">Transaction Ledger Record</span>
                          </div>
                          <div className="grid grid-cols-2 gap-y-2 text-[11px] font-semibold text-slate-300">
                            <span className="text-slate-400">Receipt ID</span>
                            <span className="text-white text-right">LLX-TX-30291-SL</span>
                            <span className="text-slate-400">Ledger Block</span>
                            <span className="text-white text-right">#14,582,309</span>
                            <span className="text-slate-400">Transferred Price</span>
                            <span className="text-emerald-400 text-right font-bold">₹ {new Intl.NumberFormat("en-IN").format(activeThread.counterOffer || activeThread.propertyPrice)}</span>
                            <span className="text-slate-400">Ownership State</span>
                            <span className="text-emerald-400 text-right font-bold">TRANSFERRED</span>
                          </div>
                        </div>

                        <button onClick={() => downloadEscrowReceipt(activeThread)} className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-2 border-0 shadow-lg shadow-emerald-600/25">
                          <FileText className="h-4 w-4"/> Download Settlement Receipt
                        </button>
                      </div>)}

                  </div>
                </div>

              </div>) : (
        /* Original Messaging Flow */
        <>
                {/* messaging messages history */}
                <div className="flex-grow overflow-y-auto p-6 space-y-4">
                  {activeThread.messages.map((m, idx) => {
                if (m.system) {
                    return (<div key={idx} className="flex justify-center my-4">
                          <div className="max-w-md bg-cyan-500/10 border border-cyan-500/30 rounded-2xl p-4 flex gap-3 text-left">
                            <Info className="h-5 w-5 text-cyan-400 shrink-0 mt-0.5"/>
                            <div>
                              <p className="text-xs font-semibold text-cyan-200 leading-relaxed">{m.text}</p>
                              <p className="text-[9px] font-bold text-cyan-400 mt-1.5 flex items-center gap-1">
                                <Calendar className="h-3 w-3"/> System Log &bull; {m.time}
                              </p>
                            </div>
                          </div>
                        </div>);
                }
                const isMe = m.sender === "me";
                return (<div key={idx} className={`flex ${isMe ? "justify-end" : "justify-start"} animate-slide-up opacity-0`} style={{ animationDuration: "250ms", animationFillMode: "forwards" }}>
                        <div className={`max-w-md rounded-2xl p-4 ${isMe
                        ? "bg-gradient-to-r from-cyan-500 to-indigo-600 text-white rounded-tr-none shadow-lg shadow-cyan-500/25"
                        : "bg-slate-900 border border-slate-800 text-slate-200 rounded-tl-none"}`}>
                          <p className="text-xs font-medium leading-relaxed">{m.text}</p>
                          <p className={`text-[8px] font-semibold mt-1.5 ${isMe ? "text-cyan-100" : "text-slate-500"}`}>
                            {m.time}
                          </p>
                        </div>
                      </div>);
            })}
                </div>

                {/* active offer banner for negotiation actions */}
                {activeThread.status === "pending" && activeThread.counterOffer && (<div className="mx-6 mb-4 bg-amber-500/10 border border-amber-500/30 p-4 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-in slide-in-from-bottom-3 duration-250 shrink-0">
                    <div className="flex gap-3">
                      <div className="h-10 w-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center shrink-0">
                        <DollarSign className="h-5 w-5 text-amber-400"/>
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-amber-300 uppercase tracking-wider">Active Counter-Offer Received</h4>
                        <p className="text-sm font-black text-white mt-0.5">
                          ₹ {new Intl.NumberFormat("en-IN").format(activeThread.counterOffer)}
                        </p>
                        <p className="text-[10px] text-slate-400 font-semibold mt-0.5">
                          Your original offer was ₹ {new Intl.NumberFormat("en-IN").format(activeThread.myOffer)}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => handleNegotiation("decline")} className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 text-xs font-bold transition-all cursor-pointer">
                        <X className="h-3.5 w-3.5"/> Decline
                      </button>
                      <button onClick={() => handleNegotiation("accept")} className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md transition-all active:scale-95 cursor-pointer border-0">
                        <Check className="h-3.5 w-3.5"/> Accept Bid
                      </button>
                    </div>
                  </div>)}

                {/* chat input form */}
                <div className="p-4 border-t border-slate-800 flex gap-2.5 items-center shrink-0">
                  <input type="text" value={inputValue} placeholder="Type a message..." className="flex-grow py-3 px-4 rounded-xl bg-slate-950 border border-slate-800 focus:outline-none focus:ring-1 focus:ring-cyan-500 text-sm font-semibold text-white placeholder:text-slate-500" onChange={(e) => setInputValue(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}/>
                  <button onClick={handleSendMessage} className="h-11 w-11 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white flex items-center justify-center transition-all shrink-0 active:scale-95 cursor-pointer border-0 shadow-md">
                    <Send className="h-4.5 w-4.5"/>
                  </button>
                </div>
              </>)}

          </div>

        </div>

      </main>
    </div>);
}
