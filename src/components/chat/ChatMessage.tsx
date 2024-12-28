import React from 'react';

interface ChatMessageProps {
  content: string;
  isUser: boolean;
}

export function ChatMessage({ content, isUser }: ChatMessageProps) {
  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}>
      <div className={`max-w-[80%] p-3 rounded-lg ${
        isUser ? 'bg-gray-800' : 'bg-gray-900'
      }`}>
        <p className="text-sm">{content}</p>
      </div>
    </div>
  );
}