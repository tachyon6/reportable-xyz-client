import React from "react";
import { Paperclip } from "lucide-react";

interface FileUploadProps {
    onFileSelect: (files: FileList) => void;
}

export function FileUpload({ onFileSelect }: FileUploadProps) {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files && files.length > 0) {
            onFileSelect(files);
        }
    };

    return (
        <label className='cursor-pointer text-gray-400 hover:text-white transition-colors'>
            <input type='file' className='hidden' multiple onChange={handleChange} accept='.doc,.docx,.pdf,.txt' />
            <Paperclip className='h-5 w-5' />
        </label>
    );
}
