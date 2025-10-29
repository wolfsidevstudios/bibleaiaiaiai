import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Send, Sparkles, User } from 'lucide-react';
import { ChatMessage as ChatMessageType } from '../types';
import { generateAiResponse } from '../services/geminiService';
import ChatMessage from '../components/ChatMessage';

const AssistantPage: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessageType[]>([
    { role: 'model', parts: [{ text: "I am here to help you explore the scriptures. Ask me anything 🙏" }] }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSend = async (prompt?: string) => {
    const userMessage = prompt || input;
    if (!userMessage.trim()) return;

    setInput('');
    setIsLoading(true);

    const newMessages: ChatMessageType[] = [...messages, { role: 'user', parts: [{ text: userMessage }] }];
    setMessages(newMessages);

    const aiResponse = await generateAiResponse(userMessage);
    
    setMessages([...newMessages, { role: 'model', parts: [{ text: aiResponse }] }]);
    setIsLoading(false);
  };
  
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSend();
  }

  const suggestedPrompts = [
    "Explain the Trinity",
    "Verses on faith",
    "Who was David?",
  ];

  return (
    <div className="flex flex-col h-[calc(100vh-5rem)]">
      <header className="p-4 border-b border-gray-800 flex justify-between items-center">
        <div className="w-6 h-6"></div>
        <h1 className="text-xl font-bold text-center">AI Assistant</h1>
        <Link to="/profile">
            <User className="w-6 h-6 text-gray-400 hover:text-yellow-400" />
        </Link>
      </header>

      <div className="flex-grow p-4 overflow-y-auto">
        {messages.map((msg, index) => (
          <ChatMessage key={index} message={msg} />
        ))}
        {isLoading && (
          <div className="flex items-start gap-3 my-4">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-yellow-400 to-amber-500 flex items-center justify-center">
                <Sparkles size={18} className="text-black" />
            </div>
            <div className="max-w-xs md:max-w-md p-3 rounded-2xl bg-gray-800 rounded-tl-none">
                <div className="flex space-x-1 items-center h-5">
                    <div className="w-2 h-2 bg-gray-500 rounded-full animate-pulse delay-75"></div>
                    <div className="w-2 h-2 bg-gray-500 rounded-full animate-pulse delay-150"></div>
                    <div className="w-2 h-2 bg-gray-500 rounded-full animate-pulse delay-200"></div>
                </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <footer className="p-4 bg-black border-t border-gray-800">
        <div className="flex flex-wrap gap-2 mb-2">
            {suggestedPrompts.map(prompt => (
                <button key={prompt} onClick={() => handleSend(prompt)} className="px-3 py-1 bg-gray-800 text-sm rounded-full hover:bg-gray-700">
                    {prompt}
                </button>
            ))}
        </div>
        <form onSubmit={handleFormSubmit} className="flex items-center space-x-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask a question about the Bible..."
            className="w-full bg-gray-800 text-white p-3 rounded-full border-2 border-gray-700 focus:border-yellow-500 focus:outline-none"
            disabled={isLoading}
          />
          <button type="submit" disabled={isLoading} className="bg-yellow-500 text-black p-3 rounded-full hover:bg-yellow-400 disabled:bg-gray-600">
            <Send size={24} />
          </button>
        </form>
      </footer>
    </div>
  );
};

export default AssistantPage;