import { useState, useCallback } from 'react';
import { Message } from '../../../types/chat';

export function useChatMessages(initialMessage: string = '') {
  const [messages, setMessages] = useState<Message[]>(() => {
    if (!initialMessage.trim()) return [];
    return [{ content: initialMessage, isUser: true }];
  });

  const addMessage = useCallback((message: string) => {
    const trimmedMessage = message.trim();
    if (!trimmedMessage) return;
    
    setMessages(prev => [...prev, { content: trimmedMessage, isUser: true }]);
  }, []);

  return {
    messages,
    addMessage
  };
}