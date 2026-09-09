'use client';

import { useState, useRef, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useChat } from 'ai/react';
import { MessageCircle, X, Send, Loader2, Maximize2, Minimize2, Sparkles, User, Bot } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
    api: '/api/chat',
  });

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  // Handle Tooltip Popout Timing
  useEffect(() => {
    if (isOpen) {
      setShowTooltip(false);
      return;
    }
    
    // Initial popup shortly after load
    const initialTimeout = setTimeout(() => setShowTooltip(true), 4000);
    const initialHide = setTimeout(() => setShowTooltip(false), 10000);

    // Then pop up every 30 seconds
    const interval = setInterval(() => {
      setShowTooltip(true);
      setTimeout(() => setShowTooltip(false), 6000);
    }, 30000);

    return () => {
      clearTimeout(initialTimeout);
      clearTimeout(initialHide);
      clearInterval(interval);
    };
  }, [isOpen]);

  if (pathname.startsWith('/admin')) return null;

  return (
    <>
      <div className="fixed bottom-20 right-6 z-[150] flex flex-col items-end">
        {/* Tooltip Pop */}
        <AnimatePresence>
          {!isOpen && showTooltip && (
            <motion.div
              initial={{ opacity: 0, x: 20, scale: 0.8 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 10, scale: 0.8 }}
              className="absolute right-[75px] top-3 bg-white text-black px-4 py-3 rounded-2xl rounded-tr-sm shadow-[0_10px_40px_rgba(0,122,255,0.3)] whitespace-nowrap border border-gray-100 flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-[#007AFF]" />
              <span className="text-[13px] font-bold tracking-wide">Need help? Ask AI</span>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {!isOpen && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 260, damping: 20 }}
              className="relative mt-2"
            >
              <motion.button
                animate={{ scale: [1, 1.08, 1] }}
                transition={{ repeat: Infinity, repeatDelay: 5, duration: 0.6, ease: "easeInOut" }}
                onClick={() => setIsOpen(true)}
                className="relative group p-4 rounded-full shadow-2xl overflow-hidden block"
                style={{ background: 'linear-gradient(135deg, #007AFF 0%, #00C6FF 100%)' }}
              >
                {/* Shine effect */}
                <div className="absolute inset-0 bg-white/20 translate-y-[-100%] group-hover:translate-y-[100%] transition-transform duration-700 ease-in-out" />
                <MessageCircle size={26} className="text-white relative z-10" />
                
                {/* Notification dot */}
                {messages.length === 0 && (
                  <span className="absolute top-0 right-0 flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500 border-2 border-[#007AFF]"></span>
                  </span>
                )}
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.95, transformOrigin: 'bottom right' }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className={`absolute bottom-0 right-0 ${isExpanded ? 'w-[90vw] sm:w-[600px] h-[85vh]' : 'w-[90vw] sm:w-[380px] h-[550px] max-h-[80vh]'} bg-black/70 backdrop-blur-3xl rounded-3xl shadow-[0_10px_60px_rgba(0,122,255,0.3)] border border-white/10 flex flex-col overflow-hidden transition-all duration-300 ease-in-out`}
            >
              {/* Premium Header */}
              <div className="relative overflow-hidden flex items-center justify-between px-6 py-4 border-b border-white/10 shrink-0" style={{ background: 'linear-gradient(90deg, rgba(0,122,255,0.15) 0%, rgba(0,198,255,0.05) 100%)' }}>
                <div className="flex items-center gap-3 relative z-10">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#007AFF] to-[#00C6FF] flex items-center justify-center shadow-lg shadow-blue-500/30">
                    <Sparkles className="text-white w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-base leading-tight">TSO AI Assistant</h3>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                      <span className="text-[11px] font-medium text-white/50 uppercase tracking-widest">Online</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 relative z-10">
                  <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/10 text-white/60 hover:text-white transition-colors"
                    title={isExpanded ? "Minimize" : "Expand"}
                  >
                    {isExpanded ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
                  </button>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/10 text-white/60 hover:text-white transition-colors"
                  >
                    <X size={18} />
                  </button>
                </div>
              </div>

              {/* Chat Messages */}
              <div className="flex-1 overflow-y-auto overscroll-contain p-5 space-y-6 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
                {messages.length === 0 && (
                  <div className="flex flex-col items-center justify-center h-full text-center px-4">
                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500/20 to-teal-500/20 flex items-center justify-center mb-6">
                      <Bot className="w-10 h-10 text-blue-400 opacity-80" />
                    </div>
                    <h4 className="text-xl font-bold text-white mb-2">How can I help you today?</h4>
                    <p className="text-sm text-white/50 leading-relaxed">Ask me anything about our courses, fees, placements, or how to enroll at Talent Shapers Orbit.</p>
                  </div>
                )}
                
                {messages.filter(m => m.content && m.content.trim().length > 0).map((m) => (
                  <div
                    key={m.id}
                    className={`flex gap-3 ${m.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
                  >
                    {/* Avatar */}
                    <div className={`w-8 h-8 shrink-0 rounded-full flex items-center justify-center shadow-md ${m.role === 'user' ? 'bg-white/10 border border-white/10' : 'bg-gradient-to-br from-[#007AFF] to-[#00C6FF]'}`}>
                      {m.role === 'user' ? <User className="w-4 h-4 text-white/70" /> : <Sparkles className="w-4 h-4 text-white" />}
                    </div>
                    
                    {/* Message Bubble */}
                    <div
                      className={`max-w-[75%] rounded-2xl p-4 shadow-sm ${
                        m.role === 'user'
                          ? 'bg-gradient-to-br from-[#007AFF] to-[#00C6FF] text-white rounded-tr-sm shadow-blue-500/20'
                          : 'bg-white/5 border border-white/10 text-white/90 rounded-tl-sm backdrop-blur-md'
                      }`}
                    >
                      <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        components={{
                          p: ({node, ...props}) => <p className="mb-3 leading-relaxed last:mb-0 text-[15px]" {...props} />,
                          ul: ({node, ...props}) => <ul className="list-disc pl-5 mb-3 space-y-1.5 marker:text-blue-400" {...props} />,
                          ol: ({node, ...props}) => <ol className="list-decimal pl-5 mb-3 space-y-1.5 marker:text-blue-400" {...props} />,
                          li: ({node, ...props}) => <li className="text-[15px]" {...props} />,
                          strong: ({node, ...props}) => <strong className="font-semibold text-white" {...props} />,
                          a: ({node, ...props}) => <a className="text-blue-300 hover:text-blue-200 underline underline-offset-2" {...props} />,
                        }}
                      >
                        {m.content}
                      </ReactMarkdown>
                    </div>
                  </div>
                ))}
                
                {isLoading && (
                  <div className="flex gap-3 flex-row">
                    <div className="w-8 h-8 shrink-0 rounded-full flex items-center justify-center shadow-md bg-gradient-to-br from-[#007AFF] to-[#00C6FF]">
                      <Sparkles className="w-4 h-4 text-white" />
                    </div>
                    <div className="bg-white/5 border border-white/10 rounded-2xl rounded-tl-sm p-4 flex items-center gap-2 backdrop-blur-md">
                      <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} className="h-1" />
              </div>

              {/* Input Form */}
              <div className="p-5 border-t border-white/10 bg-black/40 backdrop-blur-xl shrink-0">
                <form onSubmit={handleSubmit} className="relative flex items-center">
                  <input
                    value={input || ''}
                    onChange={handleInputChange}
                    placeholder="Ask about IT courses..."
                    className="w-full bg-white/5 border border-white/10 hover:border-white/20 focus:border-[#007AFF] rounded-full py-3.5 pl-5 pr-14 text-[15px] text-white focus:outline-none transition-all placeholder:text-white/30 shadow-inner"
                  />
                  <button
                    type="submit"
                    disabled={isLoading || !input?.trim()}
                    className="absolute right-2 w-10 h-10 flex items-center justify-center bg-[#007AFF] text-white rounded-full hover:bg-blue-500 hover:scale-105 disabled:opacity-50 disabled:hover:scale-100 disabled:hover:bg-[#007AFF] transition-all"
                  >
                    <Send size={16} className="ml-0.5" />
                  </button>
                </form>
                <div className="text-center mt-3">
                  <span className="text-[10px] text-white/30 uppercase tracking-widest font-medium">Powered by AI Vector Search</span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}
