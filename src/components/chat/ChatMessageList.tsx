import React from 'react';
import { ChatMessage } from './ChatMessage';
import { Message } from '../../types/chat';

interface ChatMessageListProps {
  messages: Message[];
}

export function ChatMessageList({ messages }: ChatMessageListProps) {
  return (
    <div className="flex-1 p-4 overflow-y-auto">
      {messages.map((message, index) => (
        <ChatMessage
          key={index}
          content={message.content}
          isUser={message.isUser}
        />
      ))}
    </div>
  );
}