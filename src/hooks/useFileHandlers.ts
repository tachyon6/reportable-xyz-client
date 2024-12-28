import { useState } from "react";

export function useFileHandlers() {
    const [files, setFiles] = useState<File[]>([]);

    const handleFileSelect = (newFiles: FileList) => {
        setFiles((prev) => [...prev, ...Array.from(newFiles)]);
    };

    const handlePaste = (e: React.ClipboardEvent) => {
        const pastedFiles = e.clipboardData.files;
        if (pastedFiles.length > 0) {
            setFiles((prev) => [...prev, ...Array.from(pastedFiles)]);
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        const droppedFiles = e.dataTransfer.files;
        if (droppedFiles.length > 0) {
            setFiles((prev) => [...prev, ...Array.from(droppedFiles)]);
        }
    };

    const removeFile = (index: number) => {
        setFiles((prev) => prev.filter((_, i) => i !== index));
    };

    return {
        files,
        handleFileSelect,
        handlePaste,
        handleDrop,
        removeFile,
    };
}
