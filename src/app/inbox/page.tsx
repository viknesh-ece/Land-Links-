"use client";

import Navbar from "@/components/Navbar";
import { useState, useEffect } from "react";
import { getLoggedInUser } from "@/lib/auth";
import { useRouter } from "next/navigation";
import { 
  Send, 
  User, 
  MapPin, 
  MessageSquare, 
  DollarSign, 
  Check, 
  X, 
  RotateCcw,
  Sparkles,
  Info,
  Calendar
} from "lucide-react";

interface ChatThread {
  id: string;
  name: string;
  role: string;
  propertyName: string;
  propertyPrice: number;
  location: string;
  lastMessage: string;
  unread: boolean;
  status: "pending" | "accepted" | "declined" | "countered" | "none";
  myOffer: number;
  counterOffer?: number;
  messages: { sender: "me" | "them"; text: string; time: string; system?: boolean }[];
}

export default function InboxPage() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [activeThreadId, setActiveThreadId] = useState("chat1");
  const [inputValue, setInputValue] = useState("");
  const [threads, setThreads] = useState<ChatThread[]>([
    {
      id: "chat1",
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
      messages: [
        { sender: "me", text: "Hi Rajesh, I am interested in your Chennai farm land parcel. I noticed it has a fully vetted title. Would you accept ₹23.5 Lakhs for it?", time: "10:30 AM" },
        { sender: "them", text: "Hello! Thank you for reaching out. Yes, the deeds are completely clear and verified. ₹23.5 Lakhs is a bit low since road widening is coming near the parcel.", time: "10:45 AM" },
        { sender: "them", text: "I can agree to ₹24 Lakhs if we close the registration by next week.", time: "10:47 AM" },
      ]
    },
    {
      id: "chat2",
      name: "Vicky (Builder)",
      role: "Builder",
      propertyName: "Industrial Plot - Trichy",
      propertyPrice: 12000000,
      location: "Trichy",
      lastMessage: "Sounds good, let's schedule the title deed check.",
      unread: false,
      status: "none",
      myOffer: 0,
      messages: [
        { sender: "them", text: "Hello, I saw your co-investment slot for the industrial site. Is the FSI rating officially zoned for commercial construction?", time: "Yesterday" },
        { sender: "me", text: "Hi Vicky! Yes, it's zoned for Industrial/Commercial. We have official NOC clearances from local bodies.", time: "Yesterday" },
        { sender: "them", text: "Sounds good, let's schedule the title deed check.", time: "Yesterday" },
      ]
    }
  ]);

  useEffect(() => {
    const user = getLoggedInUser();
    if (!user) {
      router.push("/login");
      return;
    }
    setCurrentUser(user);
    
    // Check if there was a redirected offer from another page
    if (typeof window !== "undefined") {
      const offerProp = localStorage.getItem("pending_offer_property");
      if (offerProp) {
        const parsed = JSON.parse(offerProp);
        const newThreadId = "chat_custom_" + Date.now();
        const newThread: ChatThread = {
          id: newThreadId,
          name: parsed.ownerName || "Seller Representative",
          role: "Landowner",
          propertyName: parsed.title,
          propertyPrice: parsed.price,
          location: parsed.location,
          lastMessage: `Offer submitted: ₹ ${new Intl.NumberFormat("en-IN").format(parsed.offerPrice)}`,
          unread: false,
          status: "pending",
          myOffer: parsed.offerPrice,
          messages: [
            { sender: "me", text: `Hi, I would like to make an offer of ₹ ${new Intl.NumberFormat("en-IN").format(parsed.offerPrice)} on your listing "${parsed.title}". Let me know if you would like to initiate negotiations.`, time: "Just now" },
            { sender: "them", text: `Thank you for your offer. Let me review the valuation criteria and get back to you.`, time: "Just now", system: true }
          ]
        };
        setThreads(prev => [newThread, ...prev]);
        setActiveThreadId(newThreadId);
        localStorage.removeItem("pending_offer_property");
      }
    }
  }, [router]);

  if (!currentUser) return null;

  const activeThread = threads.find(t => t.id === activeThreadId) || threads[0];

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;
    
    const timeNow = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const newMsg = { sender: "me" as const, text: inputValue, time: timeNow };
    
    setThreads(prev => prev.map(t => {
      if (t.id === activeThreadId) {
        return {
          ...t,
          lastMessage: inputValue,
          messages: [...t.messages, newMsg]
        };
      }
      return t;
    }));
    
    setInputValue("");

    // Simulate reply after 1.5 seconds
    setTimeout(() => {
      const autoReply = { 
        sender: "them" as const, 
        text: `Got your message. I am currently in a meeting, but let me check on the deed registries and call you back shortly.`, 
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
      };
      setThreads(prev => prev.map(t => {
        if (t.id === activeThreadId) {
          return {
            ...t,
            lastMessage: autoReply.text,
            messages: [...t.messages, autoReply]
          };
        }
        return t;
      }));
    }, 1500);
  };

  const handleNegotiation = (action: "accept" | "decline" | "counter", counterVal?: number) => {
    setThreads(prev => prev.map(t => {
      if (t.id === activeThreadId) {
        const timeNow = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        let systemText = "";
        let newStatus = t.status;

        if (action === "accept") {
          systemText = `Negotiation Success! You accepted the offer of ₹ ${new Intl.NumberFormat("en-IN").format(t.counterOffer || t.propertyPrice)}. Escrow contract initiated.`;
          newStatus = "accepted";
        } else if (action === "decline") {
          systemText = `You declined the counter-offer.`;
          newStatus = "declined";
        } else if (action === "counter") {
          const formatted = new Intl.NumberFormat("en-IN").format(counterVal || 0);
          systemText = `You submitted a counter offer of ₹ ${formatted}`;
          newStatus = "countered";
        }

        return {
          ...t,
          status: newStatus,
          lastMessage: systemText,
          messages: [...t.messages, { sender: "me", text: systemText, time: timeNow, system: true }]
        };
      }
      return t;
    }));
  };

  return (
    <div className="min-h-screen bg-black text-slate-100 flex flex-col font-sans">
      <Navbar />

      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col h-[calc(100vh-80px)]">
        
        {/* dm workspace header */}
        <div className="flex items-center gap-2 border-b border-slate-900 pb-4 mb-6 shrink-0">
          <MessageSquare className="h-6 w-6 text-indigo-400" />
          <h1 className="text-2xl font-black text-white tracking-tight">Direct Negotiation Hub</h1>
          <span className="text-[10px] font-bold text-slate-400 bg-slate-900 border border-slate-800 px-2 py-0.5 rounded-full ml-2">
            Secure Encrypted Bids
          </span>
        </div>

        {/* chat grid container */}
        <div className="flex-grow flex border border-slate-900 rounded-3xl bg-[#03060d]/80 backdrop-blur-xl overflow-hidden shadow-2xl h-0">
          
          {/* threads sidebar */}
          <div className="w-80 border-r border-slate-900 flex flex-col shrink-0">
            <div className="p-4 border-b border-slate-900">
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Active Conversations</p>
            </div>
            <div className="flex-grow overflow-y-auto p-2 space-y-1">
              {threads.map(t => {
                const isActive = t.id === activeThreadId;
                return (
                  <button
                    key={t.id}
                    onClick={() => {
                      setActiveThreadId(t.id);
                      t.unread = false;
                    }}
                    className={`w-full text-left p-3.5 rounded-2xl border transition-all flex items-start gap-3 cursor-pointer ${
                      isActive 
                        ? "bg-indigo-950/20 border-indigo-900/60 text-white" 
                        : "border-transparent hover:bg-slate-900/40 text-slate-400 hover:text-slate-350"
                    }`}
                  >
                    <div className="h-9 w-9 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center shrink-0">
                      <User className={`h-4.5 w-4.5 ${isActive ? "text-indigo-400" : "text-slate-500"}`} />
                    </div>
                    <div className="flex-grow min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="font-bold text-xs truncate">{t.name}</p>
                        {t.unread && (
                          <span className="h-2 w-2 rounded-full bg-indigo-500 shrink-0"></span>
                        )}
                      </div>
                      <p className="text-[9px] font-bold text-slate-500 mt-0.5 truncate">{t.propertyName}</p>
                      <p className="text-[10px] font-medium text-slate-400 mt-1 line-clamp-1">{t.lastMessage}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* active chat panel */}
          <div className="flex-grow flex flex-col min-w-0 bg-[#020408]/30">
            
            {/* active thread info bar */}
            <div className="p-4 border-b border-slate-900 flex items-center justify-between bg-slate-950/20 shrink-0">
              <div className="flex items-center gap-3">
                <div>
                  <h3 className="font-bold text-sm text-slate-200">{activeThread.name}</h3>
                  <p className="text-[9px] font-bold uppercase tracking-wider text-slate-500 mt-0.5">
                    {activeThread.role} &bull; {activeThread.location}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-400 bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-850">
                  {activeThread.propertyName}
                </span>
                <span className="text-xs font-bold text-indigo-400 bg-indigo-950/30 px-3 py-1.5 rounded-xl border border-indigo-900/30">
                  ₹ {new Intl.NumberFormat("en-IN").format(activeThread.propertyPrice)}
                </span>
              </div>
            </div>

            {/* messaging messages history */}
            <div className="flex-grow overflow-y-auto p-6 space-y-4">
              {activeThread.messages.map((m, idx) => {
                if (m.system) {
                  return (
                    <div key={idx} className="flex justify-center my-4">
                      <div className="max-w-md bg-indigo-950/30 border border-indigo-900/40 rounded-2xl p-4 flex gap-3 text-left">
                        <Info className="h-5 w-5 text-indigo-400 shrink-0 mt-0.5" />
                        <div>
                          <p className="text-xs font-semibold text-indigo-305 leading-relaxed">{m.text}</p>
                          <p className="text-[9px] font-bold text-indigo-500 mt-1.5 flex items-center gap-1">
                            <Calendar className="h-3 w-3" /> System Log &bull; {m.time}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                }
                const isMe = m.sender === "me";
                return (
                  <div key={idx} className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
                    <div className={`max-w-md rounded-2xl p-4 ${
                      isMe 
                        ? "bg-indigo-650 text-white rounded-tr-none shadow-lg shadow-indigo-900/15" 
                        : "bg-[#090d16] border border-slate-850 text-slate-200 rounded-tl-none"
                    }`}>
                      <p className="text-xs font-medium leading-relaxed">{m.text}</p>
                      <p className={`text-[8px] font-semibold mt-1.5 ${isMe ? "text-indigo-200" : "text-slate-500"}`}>
                        {m.time}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* active offer banner for negotiation actions */}
            {activeThread.status === "pending" && activeThread.counterOffer && (
              <div className="mx-6 mb-4 bg-amber-950/20 border border-amber-900/40 p-4 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-in slide-in-from-bottom-3 duration-250 shrink-0">
                <div className="flex gap-3">
                  <div className="h-10 w-10 rounded-xl bg-amber-950/30 border border-amber-900/50 flex items-center justify-center shrink-0">
                    <DollarSign className="h-5 w-5 text-amber-400" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider">Active Counter-Offer Received</h4>
                    <p className="text-sm font-black text-slate-200 mt-0.5">
                      ₹ {new Intl.NumberFormat("en-IN").format(activeThread.counterOffer)}
                    </p>
                    <p className="text-[10px] text-slate-450 font-semibold mt-0.5">
                      Your original offer was ₹ {new Intl.NumberFormat("en-IN").format(activeThread.myOffer)}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleNegotiation("decline")}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-slate-300 border border-slate-850 text-xs font-bold transition-all cursor-pointer"
                  >
                    <X className="h-3.5 w-3.5" /> Decline
                  </button>
                  <button
                    onClick={() => handleNegotiation("accept")}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md transition-all active:scale-95 cursor-pointer"
                  >
                    <Check className="h-3.5 w-3.5" /> Accept Bid
                  </button>
                </div>
              </div>
            )}

            {/* chat input form */}
            <div className="p-4 border-t border-slate-900 flex gap-2.5 items-center shrink-0">
              <input
                type="text"
                value={inputValue}
                placeholder="Type a message..."
                className="flex-grow py-3 px-4 rounded-xl bg-slate-950 border border-slate-850 focus:outline-none focus:ring-2 focus:ring-indigo-500/15 focus:border-indigo-500 text-sm font-semibold text-white placeholder:text-slate-600"
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
              />
              <button
                onClick={handleSendMessage}
                className="h-11 w-11 rounded-xl bg-indigo-650 hover:bg-indigo-600 text-white flex items-center justify-center transition-all shrink-0 active:scale-95 cursor-pointer"
              >
                <Send className="h-4.5 w-4.5" />
              </button>
            </div>

          </div>

        </div>

      </main>
    </div>
  );
}
