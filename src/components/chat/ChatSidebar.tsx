import React from 'react';
import { ChatMessageList } from './ChatMessageList';
import { ChatInput } from './ChatInput';
import { Message } from '../../types/chat';

interface ChatSidebarProps {
  messages: Message[];
  onSendMessage: (message: string) => void;
}

export function ChatSidebar({ messages, onSendMessage }: ChatSidebarProps) {
  return (
    <div className="w-[400px] border-r border-gray-800 flex flex-col bg-gray-950">
      <ChatMessageList messages={messages} />
      <ChatInput onSend={onSendMessage} />
    </div>
  );
}