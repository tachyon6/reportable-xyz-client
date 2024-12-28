import React from 'react';
import { Upload } from 'lucide-react';

export function ImageUpload() {
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Handle the file upload here
      console.log('File selected:', file);
    }
  };

  return (
    <div className="relative group">
      <input
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        aria-label="Upload image"
      />
      <div className="flex items-center gap-2 px-6 py-4 bg-gray-900/50 border border-gray-800 rounded-lg hover:border-blue-500 transition-colors">
        <Upload className="h-5 w-5 text-gray-400" />
        <span className="text-gray-400">Upload Image</span>
      </div>
    </div>
  );
}