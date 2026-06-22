import React, { useState, useEffect, useRef } from 'react';
import { X, Send, Bot, User } from 'lucide-react';

interface AIBotModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AIBotModal: React.FC<AIBotModalProps> = ({ isOpen, onClose }) => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<{sender: 'bot'|'user', text: string}[]>([
    { sender: 'bot', text: 'Hi! I am the E-Shop AI Assistant. How can I help you with your orders today?' }
  ]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  if (!isOpen) return null;

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg = input.trim();
    setMessages(prev => [...prev, { sender: 'user', text: userMsg }]);
    setInput('');

    // Simulate AI response
    setTimeout(() => {
      setMessages(prev => [...prev, { 
        sender: 'bot', 
        text: "I'm checking that for you... Please hold on. Currently, our system shows everything is running smoothly! Is there a specific order ID you'd like me to look at?" 
      }]);
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl flex flex-col h-[500px] animate-fade-in-up">
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b border-gray-100 bg-blue-600 rounded-t-2xl text-white">
          <div className="flex items-center space-x-2">
            <Bot size={24} />
            <h3 className="font-bold text-lg">AI Support Center</h3>
          </div>
          <button onClick={onClose} className="hover:bg-blue-700 p-1 rounded-full transition">
            <X size={20} />
          </button>
        </div>

        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
          {messages.map((msg, idx) => (
            <div key={idx} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[85%] p-3 rounded-2xl flex gap-2 items-start shadow-sm ${msg.sender === 'user' ? 'bg-blue-600 text-white rounded-br-none' : 'bg-white text-gray-800 rounded-bl-none border border-gray-100'}`}>
                {msg.sender === 'bot' && <Bot size={16} className="mt-1 flex-shrink-0 text-blue-500" />}
                <p className="text-sm leading-relaxed">{msg.text}</p>
                {msg.sender === 'user' && <User size={16} className="mt-1 flex-shrink-0 text-blue-200" />}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <form onSubmit={handleSend} className="p-4 border-t border-gray-100 bg-white rounded-b-2xl flex gap-2 items-center">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask me anything..."
            className="flex-1 bg-gray-100 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm transition"
          />
          <button 
            type="submit" 
            disabled={!input.trim()}
            className="bg-blue-600 text-white p-3 rounded-xl hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send size={20} />
          </button>
        </form>
      </div>
    </div>
  );
};

export default AIBotModal;
