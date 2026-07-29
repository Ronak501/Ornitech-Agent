"use client";

import React, { useState, useRef, useEffect } from 'react';

export default function FullPageChat() {
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
      setMessages(prev => [...prev, { role: 'ai', text: "Sorry, I couldn't connect to the backend server." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50 font-sans">
      
      {/* Premium Header */}
      <header className="bg-white border-b border-gray-200 py-4 px-6 flex items-center justify-between shadow-sm sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-md">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
            </svg>
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900 tracking-tight">Ornitech AI</h1>
            <p className="text-sm text-gray-500 font-medium">Enterprise Knowledge Assistant</p>
          </div>
        </div>
        <div className="flex items-center gap-2 bg-blue-50 text-blue-700 px-3 py-1.5 rounded-full text-sm font-semibold border border-blue-100">
          <span className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></span>
          System Online
        </div>
      </header>

      {/* Chat Container */}
      <main className="flex-1 overflow-y-auto w-full max-w-4xl mx-auto p-4 md:p-8 flex flex-col gap-6 scroll-smooth">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center mt-20 animate-fade-in-up">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-indigo-50 rounded-3xl flex items-center justify-center mb-6 shadow-inner ring-1 ring-black/5">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="url(#blue-grad)" stroke="none">
                <defs>
                  <linearGradient id="blue-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#2563eb" />
                    <stop offset="100%" stopColor="#4f46e5" />
                  </linearGradient>
                </defs>
                <path d="M12 2a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2 2 2 0 0 1-2-2V4a2 2 0 0 1 2-2zM4 10a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-6a2 2 0 0 1 2-2zm16 0a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-6a2 2 0 0 1 2-2zM12 10a4 4 0 0 1 4 4v4a4 4 0 0 1-8 0v-4a4 4 0 0 1 4-4z" />
              </svg>
            </div>
            <h2 className="text-2xl font-extrabold text-gray-900 mb-2">Welcome to Ornitech</h2>
            <p className="text-gray-500 max-w-md text-lg">I have ingested all the knowledge from the Ornitech databases. What would you like to know?</p>
          </div>
        )}

        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in-up`}>
            {msg.role === 'ai' && (
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-sm mr-3 mt-1 flex-shrink-0">
                <span className="text-white text-xs font-bold">AI</span>
              </div>
            )}
            
            <div className={`max-w-[80%] rounded-2xl px-6 py-4 text-[16px] leading-relaxed shadow-sm ${
              msg.role === 'user' 
                ? 'bg-blue-600 text-white rounded-br-sm' 
                : 'bg-white border border-gray-200 text-gray-800 rounded-bl-sm'
            }`}>
              {msg.text}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex justify-start animate-fade-in">
             <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-sm mr-3 mt-1 flex-shrink-0">
                <span className="text-white text-xs font-bold">AI</span>
              </div>
            <div className="bg-white border border-gray-200 text-gray-500 rounded-2xl rounded-bl-sm px-6 py-5 flex items-center gap-2 shadow-sm">
              <span className="w-2.5 h-2.5 bg-blue-500 rounded-full animate-bounce"></span>
              <span className="w-2.5 h-2.5 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '0.15s' }}></span>
              <span className="w-2.5 h-2.5 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0.3s' }}></span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} className="h-4" />
      </main>

      {/* Input Area */}
      <div className="bg-white border-t border-gray-200 p-4 pb-8 shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.05)] z-10">
        <div className="max-w-4xl mx-auto">
          <form onSubmit={sendMessage} className="relative flex items-center">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask a question..."
              className="w-full pl-6 pr-16 py-4 bg-gray-50 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 focus:bg-white text-gray-900 placeholder-gray-500 text-[16px] transition-all shadow-inner"
            />
            <button 
              type="submit" 
              disabled={!input.trim() || loading}
              className="absolute right-3 w-10 h-10 bg-blue-600 text-white rounded-xl hover:bg-blue-700 hover:shadow-md transition-all disabled:opacity-40 disabled:hover:scale-100 disabled:cursor-not-allowed flex items-center justify-center"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="ml-1"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
            </button>
          </form>
          <div className="text-center mt-3 text-xs text-gray-400">
            Powered by Gemini and MongoDB Vector Search
          </div>
        </div>
      </div>

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
