import React, { useState } from 'react';
import { FileDown, ChevronDown } from 'lucide-react';

interface ChatHeaderProps {
  roomName: string;
}

export function ChatHeader({ roomName }: ChatHeaderProps) {
  const [showExportMenu, setShowExportMenu] = useState(false);

  const handleExport = (format: 'word' | 'pdf') => {
    // TODO: Implement export functionality
    console.log(`Exporting as ${format}`);
    setShowExportMenu(false);
  };

  return (
    <div className="absolute top-0 left-0 right-0 h-20 flex items-center justify-between px-8 border-b border-gray-800">
      <h1 className="text-xl font-semibold text-center flex-1">{roomName}</h1>
      
      <div className="relative">
        <button
          onClick={() => setShowExportMenu(!showExportMenu)}
          className="flex items-center gap-2 px-4 py-2 bg-gray-900 rounded-lg hover:bg-gray-800 transition-colors"
        >
          <FileDown className="h-4 w-4" />
          <span>Export</span>
          <ChevronDown className="h-4 w-4" />
        </button>

        {showExportMenu && (
          <div className="absolute right-0 mt-2 w-48 bg-gray-900 rounded-lg shadow-lg overflow-hidden">
            <button
              onClick={() => handleExport('word')}
              className="w-full px-4 py-2 text-left hover:bg-gray-800 transition-colors"
            >
              Export as Word
            </button>
            <button
              onClick={() => handleExport('pdf')}
              className="w-full px-4 py-2 text-left hover:bg-gray-800 transition-colors"
            >
              Export as PDF
            </button>
          </div>
        )}
      </div>
    </div>
  );
}