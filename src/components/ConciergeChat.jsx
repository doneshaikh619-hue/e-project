import React, { useState, useRef, useEffect } from 'react';
import { useUI } from '../context/UIContext.jsx';
import { MessageSquare, X, Send, Sparkles, Shield, User, Bot } from 'lucide-react';

const INITIAL_MESSAGES = [
  {
    id: 1,
    sender: 'concierge',
    text: "Good day, esteemed client. I am Laurent Mercier, Private Horological Concierge for WatchHub. How may I be of assistance with your watch acquisition today?",
    time: "Just now"
  }
];

const BOT_RESPONSES = {
  authenticity: "Every timepiece in our vault undergoes a 48-point diagnostic examination by Swiss-certified master horologists in Geneva. All serial numbers are matched against original brand archives, and an official serialized physical guarantee and digital NFC certificate are issued.",
  delivery: "We utilize armored bonded couriers (Ferrari Group & Malca-Amit). Your timepiece travels in a biometric-locked vault case with full replacement insurance. White-glove personal handover is available in London, Geneva, Dubai, New York, and Tokyo within 24 to 48 hours.",
  payment: "We facilitate transactions via Swiss Wire Transfer, Major Credit Cards (Amex Centurion, Visa Infinite), Certified Escrow, and Cryptocurrency (Bitcoin & Ethereum). For acquisitions exceeding $100,000, our private banking desk coordinates with your wealth management representative.",
  warranty: "All timepieces include remaining manufacturer warranty plus WatchHub's 2-Year International Horology Protection Plan, covering movement amplitude regulation, water resistance resealing, and complete servicing at zero surcharge.",
  default: "Thank you for your inquiry. Our senior watch specialist is reviewing your note and will coordinate the details. You may also reserve a private viewing appointment or submit our inquiry form on the FAQ page."
};

export default function ConciergeChat() {
  const { isChatOpen, setIsChatOpen } = useUI();
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (isChatOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isChatOpen]);

  const handleSend = (textToSend = null) => {
    const text = textToSend || inputText;
    if (!text.trim()) return;

    const userMsg = {
      id: Date.now(),
      sender: 'user',
      text: text,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    if (!textToSend) setInputText('');
    setIsTyping(true);

    setTimeout(() => {
      let reply = BOT_RESPONSES.default;
      const lower = text.toLowerCase();
      if (lower.includes('authentic') || lower.includes('real') || lower.includes('fake') || lower.includes('papers')) {
        reply = BOT_RESPONSES.authenticity;
      } else if (lower.includes('deliver') || lower.includes('ship') || lower.includes('transit') || lower.includes('london') || lower.includes('dubai')) {
        reply = BOT_RESPONSES.delivery;
      } else if (lower.includes('pay') || lower.includes('wire') || lower.includes('crypto') || lower.includes('card') || lower.includes('cost')) {
        reply = BOT_RESPONSES.payment;
      } else if (lower.includes('warranty') || lower.includes('repair') || lower.includes('service')) {
        reply = BOT_RESPONSES.warranty;
      }

      setMessages(prev => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: 'concierge',
          text: reply,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
      setIsTyping(false);
    }, 900);
  };

  return (
    <>
      {/* Floating Trigger Button */}
      {!isChatOpen && (
        <button
          onClick={() => setIsChatOpen(true)}
          className="fixed bottom-6 right-6 z-40 p-3.5 rounded-full gold-button shadow-gold-glow flex items-center space-x-2 text-luxury-950 group hover:scale-105 transition-all"
          title="Private Concierge Chat"
        >
          <div className="relative">
            <MessageSquare className="w-5 h-5" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-400 ring-2 ring-luxury-950 animate-ping" />
          </div>
          <span className="hidden sm:inline text-xs font-bold uppercase tracking-wider">
            Geneva Concierge 24/7
          </span>
        </button>
      )}

      {/* Chat Window */}
      {isChatOpen && (
        <div className="fixed bottom-6 right-4 sm:right-6 z-50 w-[360px] sm:w-[400px] h-[520px] glass-card rounded-2xl border border-luxury-gold/40 shadow-2xl flex flex-col justify-between overflow-hidden animate-fadeIn">
          {/* Header */}
          <div className="p-4 bg-luxury-900 border-b border-luxury-gold/20 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="w-9 h-9 rounded-full border border-luxury-gold flex items-center justify-center bg-luxury-950 text-luxury-gold">
                  <Bot className="w-5 h-5" />
                </div>
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-400 ring-2 ring-luxury-900" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-100 flex items-center space-x-1">
                  <span>Laurent Mercier</span>
                  <Sparkles className="w-3 h-3 text-luxury-gold" />
                </h4>
                <p className="text-[10px] text-slate-400">Head of Horological Advisory • Geneva</p>
              </div>
            </div>
            <button
              onClick={() => setIsChatOpen(false)}
              className="p-1 rounded-full text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Quick FAQ Pills */}
          <div className="px-4 py-2 bg-luxury-950/60 border-b border-white/5 flex gap-1.5 overflow-x-auto text-[10px] no-scrollbar">
            <button
              onClick={() => handleSend("How is authenticity guaranteed?")}
              className="shrink-0 px-2.5 py-1 rounded-full bg-white/5 hover:bg-luxury-gold/15 text-slate-300 hover:text-luxury-gold border border-white/10"
            >
              ✦ Swiss Authenticity
            </button>
            <button
              onClick={() => handleSend("Tell me about armored delivery")}
              className="shrink-0 px-2.5 py-1 rounded-full bg-white/5 hover:bg-luxury-gold/15 text-slate-300 hover:text-luxury-gold border border-white/10"
            >
              ✦ Armored Delivery
            </button>
            <button
              onClick={() => handleSend("What payment options are accepted?")}
              className="shrink-0 px-2.5 py-1 rounded-full bg-white/5 hover:bg-luxury-gold/15 text-slate-300 hover:text-luxury-gold border border-white/10"
            >
              ✦ Wire & Crypto
            </button>
          </div>

          {/* Message Thread */}
          <div className="p-4 flex-grow overflow-y-auto space-y-3 text-xs">
            {messages.map(msg => (
              <div
                key={msg.id}
                className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[85%] p-3 rounded-2xl ${
                    msg.sender === 'user'
                      ? 'bg-luxury-gold text-luxury-950 rounded-br-none font-medium'
                      : 'bg-white/10 text-slate-200 rounded-bl-none border border-luxury-gold/15'
                  }`}
                >
                  <p className="leading-relaxed">{msg.text}</p>
                </div>
                <span className="text-[9px] text-slate-500 mt-1 px-1">{msg.time}</span>
              </div>
            ))}
            {isTyping && (
              <div className="flex items-center space-x-1.5 text-luxury-gold text-xs p-2">
                <span className="w-1.5 h-1.5 rounded-full bg-luxury-gold animate-bounce" />
                <span className="w-1.5 h-1.5 rounded-full bg-luxury-gold animate-bounce [animation-delay:0.2s]" />
                <span className="w-1.5 h-1.5 rounded-full bg-luxury-gold animate-bounce [animation-delay:0.4s]" />
                <span className="text-[10px] text-slate-400 ml-1">Laurent is composing...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Box */}
          <form
            onSubmit={(e) => { e.preventDefault(); handleSend(); }}
            className="p-3 bg-luxury-900 border-t border-white/10 flex items-center space-x-2"
          >
            <input
              type="text"
              placeholder="Inquire with private concierge..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="flex-grow bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-luxury-gold"
            />
            <button
              type="submit"
              className="p-2 rounded-xl gold-button text-luxury-950 flex items-center justify-center shadow-md"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </>
  );
}
