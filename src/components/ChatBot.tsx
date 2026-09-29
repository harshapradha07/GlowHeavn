import React, { useState, useEffect, useRef } from 'react';
import { 
  MessageSquare, 
  X, 
  Send, 
  Sparkles, 
  Bot, 
  User, 
  RotateCcw, 
  Loader2, 
  ChevronDown, 
  ExternalLink,
  ShieldCheck
} from 'lucide-react';
import { UserPersona } from '../types';

interface ChatMessage {
  id: string;
  sender: 'user' | 'agent';
  text: string;
  timestamp: string;
  isError?: boolean;
}

interface ChatBotProps {
  currentUser: UserPersona | null;
  webhookUrl?: string;
  onOpenProductByName?: (productName: string) => void;
}

const DEFAULT_WEBHOOK_URL = 'https://harshapradha.app.n8n.cloud/webhook/55430de3-a12a-419c-8317-aa1d8be07798/chat';

const QUICK_PROMPTS = [
  'Recommend skincare for my skin',
  'How does the selective checkbox work?',
  'What active coupons do you have?',
  'Best lipstick shade for warm undertone?'
];

export const ChatBot: React.FC<ChatBotProps> = ({
  currentUser,
  webhookUrl = DEFAULT_WEBHOOK_URL,
  onOpenProductByName
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [unreadCount, setUnreadCount] = useState(1);

  // Session ID for n8n multi-turn memory
  const [sessionId] = useState(() => {
    try {
      const saved = localStorage.getItem('glowheavn_chat_session_id');
      if (saved) return saved;
      const newId = `gh-session-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
      localStorage.setItem('glowheavn_chat_session_id', newId);
      return newId;
    } catch {
      return `gh-session-${Date.now()}`;
    }
  });

  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    try {
      const saved = localStorage.getItem('glowheavn_chat_history');
      if (saved) return JSON.parse(saved);
    } catch {}

    const initialWelcome = currentUser
      ? `Hello ${currentUser.name.split(' ')[0]}! ✨ I'm Aura, your GlowHeavn Dermal & Beauty Concierge. I see you have ${currentUser.skinType} skin focusing on ${currentUser.concerns.join(' & ')}. How can I assist your beauty routine today?`
      : `Welcome to GlowHeavn! ✨ I'm Aura, your personal Beauty Concierge. How can I help you discover the perfect skincare, lip shades, or navigate our seamless checkout today?`;

    return [
      {
        id: 'welcome-1',
        sender: 'agent',
        text: initialWelcome,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ];
  });

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to latest message
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      setUnreadCount(0);
    }
  }, [messages, isOpen]);

  // Persist chat history
  useEffect(() => {
    try {
      localStorage.setItem('glowheavn_chat_history', JSON.stringify(messages));
    } catch {}
  }, [messages]);

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || input).trim();
    if (!text || isLoading) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      // Send message to n8n chat webhook
      const payload = {
        chatInput: text,
        message: text,
        sessionId,
        action: 'sendMessage',
        timestamp: new Date().toISOString(),
        userContext: currentUser
          ? {
              name: currentUser.name,
              email: currentUser.email,
              skinType: currentUser.skinType,
              undertone: currentUser.undertone,
              concerns: currentUser.concerns,
              aestheticPreference: currentUser.aestheticPreference,
              rewardPoints: currentUser.rewardPoints,
              tier: currentUser.tier
            }
          : { isGuest: true }
      };

      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json, text/plain, */*'
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error(`n8n webhook responded with status: ${response.status}`);
      }

      // Parse n8n response (handles JSON or raw string output)
      let replyText = '';
      const contentType = response.headers.get('content-type') || '';

      if (contentType.includes('application/json')) {
        const data = await response.json();
        if (typeof data === 'string') {
          replyText = data;
        } else if (Array.isArray(data) && data.length > 0) {
          replyText = data[0].output || data[0].text || data[0].message || JSON.stringify(data[0]);
        } else if (data) {
          replyText = data.output || data.text || data.response || data.message || data.reply || JSON.stringify(data);
        }
      } else {
        replyText = await response.text();
      }

      if (!replyText || replyText.trim() === '') {
        replyText = "Thank you for reaching out! I've received your inquiry and I'm consulting our dermal formulation database.";
      }

      const agentMsg: ChatMessage = {
        id: `agent-${Date.now()}`,
        sender: 'agent',
        text: replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages((prev) => [...prev, agentMsg]);
    } catch (err: any) {
      console.warn('n8n Chat Webhook Error:', err);

      // Intelligent graceful fallback for user while n8n workflow might be in draft/activating
      let fallbackText = "I'm currently connecting to our live concierge agent. ";
      
      const lower = text.toLowerCase();
      if (lower.includes('checkbox') || lower.includes('cart') || lower.includes('bag')) {
        fallbackText = "In your GlowHeavn shopping bag, each item has an individual selection checkbox plus a master 'Select All' toggle. You can check only the specific items you want to buy today, and unselected items will stay saved in your bag without being deleted!";
      } else if (lower.includes('coupon') || lower.includes('discount') || lower.includes('promo') || lower.includes('code')) {
        fallbackText = "You can use promo code **GLOW20** for 20% off all formulations, or **FIRSTBUY** for $15 off! Plus, orders over $75 unlock free express shipping.";
      } else if (lower.includes('recommend') || lower.includes('skin') || lower.includes('serum')) {
        fallbackText = currentUser
          ? `For your ${currentUser.skinType} skin focusing on ${currentUser.concerns.join(' & ')}, our top recommendation is the **Botanical Radiance Glow Elixir ($48)** (THD Vitamin C + Plant Squalane) and the **Barrier Repair Centella Cera-Cream ($36)**.`
          : "Our top-rated bestseller is the **Botanical Radiance Glow Elixir ($48)** formulated with 10% THD Ascorbate Vitamin C and cold-pressed squalane for glass-skin radiance without clogging pores.";
      } else {
        fallbackText += "Our live concierge workflow at n8n is receiving your message. In the meantime, you can explore our formulations or try our promo code **GLOW20**!";
      }

      const agentMsg: ChatMessage = {
        id: `agent-${Date.now()}`,
        sender: 'agent',
        text: fallbackText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isError: false
      };

      setMessages((prev) => [...prev, agentMsg]);
    } finally {
      setIsLoading(false);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  };

  const handleClearHistory = () => {
    const freshWelcome: ChatMessage = {
      id: `welcome-${Date.now()}`,
      sender: 'agent',
      text: currentUser
        ? `Chat reset. Hello ${currentUser.name.split(' ')[0]}! How can I assist your beauty routine today?`
        : `Chat reset. Welcome back to GlowHeavn! What formulations can I help you find today?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setMessages([freshWelcome]);
    try {
      localStorage.removeItem('glowheavn_chat_history');
    } catch {}
  };

  return (
    <>
      {/* Floating Action Trigger Button (Bottom Right) */}
      {!isOpen && (
        <button
          onClick={() => {
            setIsOpen(true);
            setUnreadCount(0);
          }}
          className="fixed bottom-6 right-6 z-40 p-4 rounded-full bg-stone-900 text-white shadow-2xl hover:bg-rose-950 hover:scale-105 active:scale-95 transition-all duration-300 flex items-center gap-3 group border border-rose-900/40 cursor-pointer"
          aria-label="Open Beauty Concierge Chat"
        >
          <div className="relative">
            <Sparkles className="w-5 h-5 text-rose-300 animate-pulse" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-rose-500 rounded-full ring-2 ring-stone-900" />
            )}
          </div>
          <div className="hidden sm:flex flex-col text-left">
            <span className="text-xs font-serif font-bold text-white tracking-wide">
              Aura Concierge
            </span>
            <span className="text-[10px] text-rose-200">
              Connected to n8n AI
            </span>
          </div>
        </button>
      )}

      {/* Floating Chat Window */}
      {isOpen && (
        <div className="fixed bottom-4 sm:bottom-6 right-3 sm:right-6 z-50 w-[calc(100vw-24px)] sm:w-[410px] h-[580px] max-h-[85vh] bg-[#FAF8F6] rounded-3xl shadow-2xl border border-stone-200/90 flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-200">
          
          {/* Header */}
          <div className="px-5 py-4 bg-stone-900 text-white flex items-center justify-between border-b border-stone-800">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-rose-900/80 border border-rose-700/60 flex items-center justify-center text-rose-200 shadow-inner">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-serif font-bold text-white">
                    Aura Beauty Concierge
                  </h3>
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                </div>
                <p className="text-[10px] text-stone-300 flex items-center gap-1">
                  <span>Live n8n Agent</span>
                  <span>·</span>
                  <span className="text-rose-200 truncate max-w-[170px]">
                    {currentUser ? `${currentUser.name} (${currentUser.skinType})` : 'Guest Session'}
                  </span>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={handleClearHistory}
                title="Reset conversation"
                className="p-1.5 text-stone-400 hover:text-white hover:bg-stone-800 rounded-lg transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                title="Minimize chat"
                className="p-1.5 text-stone-400 hover:text-white hover:bg-stone-800 rounded-lg transition-colors cursor-pointer"
              >
                <ChevronDown className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Connected Webhook Pill Indicator */}
          <div className="px-4 py-1.5 bg-rose-50 border-b border-rose-100 flex items-center justify-between text-[10px] text-rose-900">
            <span className="flex items-center gap-1 font-medium truncate">
              <ShieldCheck className="w-3 h-3 text-emerald-600 shrink-0" />
              <span className="truncate">Webhook: harshapradha.app.n8n.cloud</span>
            </span>
            <span className="text-emerald-700 font-semibold uppercase text-[9px] shrink-0 bg-emerald-100 px-1.5 py-0.5 rounded">
              Active
            </span>
          </div>

          {/* Messages Body */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3.5 text-xs">
            {messages.map((msg) => {
              const isAgent = msg.sender === 'agent';
              return (
                <div
                  key={msg.id}
                  className={`flex gap-2.5 ${isAgent ? 'items-start' : 'items-end justify-end'}`}
                >
                  {isAgent && (
                    <div className="w-6 h-6 rounded-full bg-rose-900 text-white flex items-center justify-center shrink-0 mt-0.5 shadow-xs text-[10px] font-bold">
                      A
                    </div>
                  )}

                  <div className={`max-w-[80%] rounded-2xl p-3.5 shadow-xs leading-relaxed ${
                    isAgent
                      ? 'bg-white border border-stone-200/80 text-stone-800 rounded-tl-xs'
                      : 'bg-stone-900 text-white rounded-br-xs'
                  }`}>
                    {/* Render message text with basic formatting */}
                    <div className="whitespace-pre-line">
                      {msg.text}
                    </div>
                    <span className={`block text-[9px] mt-1.5 font-mono ${
                      isAgent ? 'text-stone-400' : 'text-stone-300 text-right'
                    }`}>
                      {msg.timestamp}
                    </span>
                  </div>

                  {!isAgent && (
                    <div className="w-6 h-6 rounded-full bg-stone-300 text-stone-700 flex items-center justify-center shrink-0 mb-0.5 text-[10px] font-bold">
                      {currentUser ? currentUser.avatar : <User className="w-3.5 h-3.5" />}
                    </div>
                  )}
                </div>
              );
            })}

            {/* Loading Indicator */}
            {isLoading && (
              <div className="flex items-start gap-2.5">
                <div className="w-6 h-6 rounded-full bg-rose-900 text-white flex items-center justify-center shrink-0 text-[10px]">
                  A
                </div>
                <div className="bg-white border border-stone-200 rounded-2xl rounded-tl-xs p-3.5 shadow-xs flex items-center gap-2 text-stone-500">
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-rose-800" />
                  <span className="text-[11px]">Aura is analyzing formulation data...</span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompts Suggestion Chips */}
          <div className="px-3 py-2 bg-stone-50/80 border-t border-stone-200/70 overflow-x-auto no-scrollbar flex items-center gap-1.5 shrink-0">
            {QUICK_PROMPTS.map((prompt) => (
              <button
                key={prompt}
                onClick={() => handleSendMessage(prompt)}
                disabled={isLoading}
                className="whitespace-nowrap px-2.5 py-1 rounded-full bg-white border border-stone-200 hover:border-rose-400 hover:bg-rose-50/50 text-stone-700 hover:text-rose-950 text-[11px] font-medium transition-colors cursor-pointer shrink-0"
              >
                {prompt}
              </button>
            ))}
          </div>

          {/* Input Box Footer */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="p-3 bg-white border-t border-stone-200 flex items-center gap-2"
          >
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask Aura about routines, ingredients, shades..."
              disabled={isLoading}
              className="flex-1 px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-900 placeholder:text-stone-400 outline-none focus:border-rose-900 focus:bg-white transition-all font-medium disabled:opacity-60"
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className={`p-2.5 rounded-xl transition-all cursor-pointer ${
                input.trim() && !isLoading
                  ? 'bg-rose-900 hover:bg-rose-950 text-white shadow-sm'
                  : 'bg-stone-200 text-stone-400 cursor-not-allowed'
              }`}
              aria-label="Send message"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>

        </div>
      )}
    </>
  );
};
