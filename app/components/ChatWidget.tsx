"use client";

import React, { useState, useRef, useEffect } from 'react';

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{role: 'user' | 'ai', text: string}[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = input.trim();
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setInput('');
    setLoading(true);

    try {
      const response = await fetch('https://ornitech-ai-backend-822012759095.asia-south1.run.app/chat/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage })
      });
      
      const data = await response.json();
      setMessages(prev => [...prev, { role: 'ai', text: data.reply }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'ai', text: "Sorry, I couldn't connect to the server." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end font-sans">
      {/* Chat Window */}
      <div 
        className={`transition-all duration-300 ease-in-out transform origin-bottom-right ${
          isOpen ? 'scale-100 opacity-100 translate-y-0 mb-4' : 'scale-90 opacity-0 translate-y-8 pointer-events-none absolute bottom-16 right-0'
        }`}
      >
        <div className="bg-white/90 backdrop-blur-xl border border-white/40 rounded-3xl shadow-2xl w-[360px] sm:w-[400px] h-[580px] flex flex-col overflow-hidden ring-1 ring-black/5">
          
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-5 flex justify-between items-center shadow-md relative overflow-hidden">
            <div className="absolute inset-0 bg-white/10 mix-blend-overlay"></div>
            <div className="relative z-10 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-inner">
                 <svg width="24" height="24" viewBox="0 0 24 24" fill="url(#blue-grad)" stroke="none">
                    <defs>
                      <linearGradient id="blue-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#2563eb" />
                        <stop offset="100%" stopColor="#4f46e5" />
                      </linearGradient>
                    </defs>
                    <path d="M12 2a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2 2 2 0 0 1-2-2V4a2 2 0 0 1 2-2zM4 10a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-6a2 2 0 0 1 2-2zm16 0a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-6a2 2 0 0 1 2-2zM12 10a4 4 0 0 1 4 4v4a4 4 0 0 1-8 0v-4a4 4 0 0 1 4-4z" />
                 </svg>
              </div>
              <div>
                <h3 className="font-bold text-white text-lg tracking-wide drop-shadow-sm">Ornitech AI</h3>
                <p className="text-blue-100 text-xs font-medium flex items-center gap-1">
                  <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span> Online
                </p>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="relative z-10 hover:bg-white/20 p-2 rounded-full transition-colors text-white">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            </button>
          </div>

          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto p-5 bg-gray-50/50 flex flex-col gap-4 scroll-smooth">
            {messages.length === 0 && (
              <div className="flex flex-col items-center justify-center h-full text-center px-4 animate-fade-in-up">
                <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mb-4 transform rotate-3">
                   <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
                </div>
                <h4 className="text-gray-800 font-bold text-lg">How can we help?</h4>
                <p className="text-gray-500 text-sm mt-1">Ask me anything about Ornitech's services, pricing, or support.</p>
              </div>
            )}
            
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in-up`}>
                <div className={`max-w-[85%] rounded-2xl px-5 py-3 text-[15px] leading-relaxed shadow-sm ${
                  msg.role === 'user' 
                    ? 'bg-gradient-to-br from-blue-600 to-indigo-600 text-white rounded-br-sm' 
                    : 'bg-white border border-gray-100 text-gray-700 rounded-bl-sm'
                }`}>
                  {msg.text}
                </div>
              </div>
            ))}
            
            {loading && (
              <div className="flex justify-start animate-fade-in">
                <div className="bg-white border border-gray-100 text-gray-500 rounded-2xl rounded-bl-sm px-5 py-4 flex items-center gap-1.5 shadow-sm">
                  <span className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></span>
                  <span className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '0.15s' }}></span>
                  <span className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0.3s' }}></span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} className="h-1" />
          </div>

          {/* Input Area */}
          <div className="p-4 bg-white border-t border-gray-100">
            <form onSubmit={sendMessage} className="relative flex items-center">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about Ornitech..."
                className="w-full pl-5 pr-12 py-3.5 bg-gray-50 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500/40 text-gray-800 placeholder-gray-400 text-[15px] transition-all shadow-inner"
              />
              <button 
                type="submit" 
                disabled={!input.trim() || loading}
                className="absolute right-2 w-9 h-9 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-full hover:shadow-md hover:scale-105 transition-all disabled:opacity-40 disabled:hover:scale-100 disabled:cursor-not-allowed flex items-center justify-center"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="ml-0.5"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
              </button>
            </form>
          </div>
          
        </div>
      </div>

      {/* Floating Action Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-4 rounded-full shadow-2xl transition-all duration-300 flex items-center justify-center hover:shadow-blue-500/30 ${isOpen ? 'rotate-90 scale-0 opacity-0' : 'rotate-0 scale-100 hover:scale-110 opacity-100'}`}
      >
        <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
      </button>

      {/* CSS for custom animations */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes fade-in-up {
          0% { opacity: 0; transform: translateY(10px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        @keyframes fade-in {
          0% { opacity: 0; }
          100% { opacity: 1; }
        }
        .animate-fade-in-up { animation: fade-in-up 0.3s ease-out forwards; }
        .animate-fade-in { animation: fade-in 0.3s ease-out forwards; }
      `}} />
    </div>
  );
}
