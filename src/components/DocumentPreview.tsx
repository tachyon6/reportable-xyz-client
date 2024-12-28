import React from 'react';

export function DocumentPreview() {
  return (
    <div className="flex-1 bg-gray-950 p-8 overflow-auto">
      <div className="max-w-[800px] mx-auto">
        <div 
          className="w-full bg-white shadow-xl rounded-lg"
          style={{ 
            aspectRatio: '1 / 1.4142', // A4 ratio (210mm × 297mm)
            minHeight: '842px' // Standard A4 height in pixels at 96 DPI
          }}
        >
          {/* A4 size document preview (scaled) */}
        </div>
      </div>
    </div>
  );
}