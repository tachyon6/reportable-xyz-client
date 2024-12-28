import React, { useState } from 'react';
import { Send } from 'lucide-react';

interface ChatInputProps {
  onSend: (message: string) => void;
}

export function ChatInput({ onSend }: ChatInputProps) {
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = () => {
    if (isSubmitting) return;
    
    const trimmedMessage = message.trim();
    if (trimmedMessage) {
      setIsSubmitting(true);
      onSend(trimmedMessage);
      setMessage('');
      setTimeout(() => setIsSubmitting(false), 100);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const hasContent = message.trim().length > 0;

  return (
    <div className="p-4 border-t border-gray-800">
      <div className="relative">
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type your message..."
          className="w-full p-3 bg-gray-900 rounded-lg resize-none focus:outline-none focus:ring-1 focus:ring-blue-500"
          rows={3}
          disabled={isSubmitting}
        />
        <button 
          className={`absolute right-3 bottom-3 transition-colors ${
            hasContent ? 'text-white' : 'text-gray-400'
          } disabled:opacity-50`}
          onClick={handleSubmit}
          disabled={isSubmitting || !hasContent}
        >
          <Send className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}