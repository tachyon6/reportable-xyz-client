import React, { useState } from 'react';
import { Send } from 'lucide-react';

export function ChatSidebar() {
  const [message, setMessage] = useState('');

  return (
    <div className="w-1/3 border-r border-gray-800 flex flex-col">
      <div className="flex-1 p-4 overflow-y-auto">
        {/* Chat messages will go here */}
      </div>
      
      <div className="p-4 border-t border-gray-800">
        <div className="relative">
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your message..."
            className="w-full p-3 bg-gray-900 rounded-lg resize-none focus:outline-none focus:ring-1 focus:ring-blue-500"
            rows={3}
          />
          <button 
            className="absolute right-3 bottom-3 text-gray-400 hover:text-gray-300"
            onClick={() => setMessage('')}
          >
            <Send className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
}