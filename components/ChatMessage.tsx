import React from 'react';
import { User, Sparkles } from 'lucide-react';
import { ChatMessage as ChatMessageType } from '../types';

interface ChatMessageProps {
  message: ChatMessageType;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isModel = message.role === 'model';
  
  const formatText = (text: string) => {
    // Basic markdown to HTML for bold and italics
    const formattedText = text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>');
    return { __html: formattedText };
  };

  return (
    <div className={`flex items-start gap-3 my-4 ${isModel ? '' : 'justify-end'}`}>
      {isModel && (
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-yellow-400 to-amber-500 flex items-center justify-center">
          <Sparkles size={18} className="text-black" />
        </div>
      )}
      <div className={`max-w-xs md:max-w-md p-3 rounded-2xl ${isModel ? 'bg-gray-800 rounded-tl-none' : 'bg-yellow-600 text-black rounded-br-none'}`}>
        <p 
          className="text-sm leading-relaxed whitespace-pre-wrap"
          dangerouslySetInnerHTML={formatText(message.parts[0].text)}
        />
      </div>
      {!isModel && (
         <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center">
          <User size={20} className="text-gray-300" />
        </div>
      )}
    </div>
  );
};

export default ChatMessage;