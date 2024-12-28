import React from "react";
import { X } from "lucide-react";

interface FileListProps {
    files: File[];
    onRemoveFile: (index: number) => void;
}

export function FileList({ files, onRemoveFile }: FileListProps) {
    if (files.length === 0) return null;

    return (
        <div className='px-6 py-2 border-t border-gray-800'>
            <div className='flex flex-wrap gap-2'>
                {files.map((file, index) => (
                    <div key={index} className='flex items-center gap-2 px-3 py-1 bg-gray-800/50 rounded-lg text-sm'>
                        <span className='text-gray-300'>{file.name}</span>
                        <button
                            onClick={() => onRemoveFile(index)}
                            className='text-gray-400 hover:text-white transition-colors'
                        >
                            <X className='h-4 w-4' />
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}
