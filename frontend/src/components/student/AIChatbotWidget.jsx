import React, { useState, useRef, useEffect } from 'react';
import { aiService } from '../../services/api';
import { Send, X, Bot, User, Sparkles, Loader2 } from 'lucide-react';

const AIChatbotWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      sender: 'bot',
      text: "👋 Welcome. I am InternX AI Advisor powered by Gemini. How may I assist your career trajectory today?",
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userText = input.trim();
    const newMessages = [...messages, { sender: 'user', text: userText }];
    setMessages(newMessages);
    setInput('');
    setLoading(true);

    try {
      const historyForApi = newMessages.map((m) => ({
        sender: m.sender === 'user' ? 'User' : 'Assistant',
        text: m.text,
      }));

      const res = await aiService.sendChatMessage({
        message: userText,
        history: historyForApi,
      });

      setMessages([
        ...newMessages,
        { sender: 'bot', text: res.data.reply || 'Thank you. How else can I assist your placement journey?' },
      ]);
    } catch (err) {
      setMessages([
        ...newMessages,
        { sender: 'bot', text: 'Connection issue encountered. Please submit your question again.' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Trigger Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="group flex items-center gap-2.5 bg-zinc-900 hover:bg-black text-white px-5 py-3 rounded-full shadow-lg transition-all duration-300 transform hover:scale-105 border border-zinc-800"
        >
          <div className="p-1 rounded-full bg-[#bef264] text-zinc-900">
            <Sparkles size={14} />
          </div>
          <span className="font-semibold text-xs text-white">Ask AI Assistant</span>
          <span className="text-[10px] bg-indigo-500 text-white font-bold px-1.5 py-0.5 rounded-full">AI</span>
        </button>
      )}

      {/* Floating Chat Drawer */}
      {isOpen && (
        <div className="w-[360px] sm:w-[400px] h-[520px] bg-white border border-slate-200 rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom-5 duration-300">
          {/* Header */}
          <div className="bg-indigo-600 p-4 text-white flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-2xl bg-white/10 text-lime-300 flex items-center justify-center font-bold">
                <Sparkles size={18} />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
                  Gemini AI Advisor
                </h4>
                <p className="text-[10px] text-indigo-200 font-medium flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-lime-300 animate-pulse"></span> Active Assistant
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white/80 hover:text-white p-1.5 rounded-xl hover:bg-white/10 transition"
            >
              <X size={18} />
            </button>
          </div>

          {/* Messages Body */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3.5 bg-slate-50 text-xs font-sans">
            {messages.map((m, idx) => (
              <div
                key={idx}
                className={`flex gap-2.5 ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {m.sender === 'bot' && (
                  <div className="w-7 h-7 rounded-xl bg-indigo-600 text-white flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
                    <Bot size={14} />
                  </div>
                )}
                <div
                  className={`max-w-[80%] p-3 rounded-2xl leading-relaxed whitespace-pre-wrap ${
                    m.sender === 'user'
                      ? 'bg-zinc-900 text-white font-medium rounded-br-none shadow-xs'
                      : 'bg-white text-slate-800 border border-slate-200/80 rounded-bl-none shadow-xs'
                  }`}
                >
                  {m.text}
                </div>
                {m.sender === 'user' && (
                  <div className="w-7 h-7 rounded-xl bg-slate-200 text-slate-700 font-bold flex items-center justify-center shrink-0 mt-0.5">
                    <User size={14} />
                  </div>
                )}
              </div>
            ))}
            {loading && (
              <div className="flex items-center gap-2 text-slate-400 font-medium text-xs p-2">
                <Loader2 size={15} className="animate-spin text-indigo-600" />
                Thinking...
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Input Footer */}
          <form onSubmit={handleSend} className="p-3 bg-white border-t border-slate-100 flex items-center gap-2">
            <input
              type="text"
              placeholder="Ask about resume, interviews, applications..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:bg-white transition"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="bg-zinc-900 hover:bg-black disabled:opacity-40 text-white p-2.5 rounded-xl transition shadow-xs"
            >
              <Send size={15} />
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default AIChatbotWidget;
