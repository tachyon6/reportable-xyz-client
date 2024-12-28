import React, { useState } from "react";
import { Send, Paperclip, X } from "lucide-react";
import { useFileHandlers } from "../hooks/useFileHandlers";
import { authService } from "../services/auth.service";
import { useNavigate } from "react-router-dom";

interface InputSectionProps {
    onSubmit: (text: string) => Promise<void>;
}

const templates = [
    {
        title: "Business Proposal",
        preview:
            "Create a detailed business proposal for [project name] including executive summary, market analysis, and financial projections.",
    },
    {
        title: "Meeting Minutes",
        preview:
            "Generate meeting minutes for [meeting name] held on [date], covering key discussion points and action items.",
    },
    {
        title: "Research Report",
        preview: "Write a comprehensive research report on [topic] with methodology, findings, and recommendations.",
    },
    {
        title: "Project Brief",
        preview: "Draft a project brief for [project name] outlining objectives, scope, timeline, and deliverables.",
    },
];

export function InputSection({ onSubmit }: InputSectionProps) {
    const [text, setText] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { files, handleFileSelect, handlePaste, handleDrop, removeFile } = useFileHandlers();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!text.trim() || loading) return;

        if (!authService.isAuthenticated()) {
            navigate("/login");
            return;
        }

        setLoading(true);
        try {
            await onSubmit(text.trim());
            setText("");
        } catch (error) {
            console.error("Failed to submit:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSubmit(e);
        }
    };

    const handleTemplateClick = (templateText: string) => {
        setText(templateText);
    };

    const hasContent = text.trim().length > 0 || files.length > 0;

    return (
        <div className='w-full max-w-2xl'>
            <form onSubmit={handleSubmit}>
                <div
                    className='relative bg-gray-900/50 border border-gray-800 rounded-lg overflow-hidden'
                    onDrop={handleDrop}
                    onDragOver={(e) => e.preventDefault()}
                >
                    <textarea
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        onKeyDown={handleKeyDown}
                        onPaste={handlePaste}
                        placeholder='Ask reportable to create a pro...'
                        className='w-full h-32 px-6 py-4 bg-transparent focus:outline-none text-lg resize-none'
                        disabled={loading}
                    />

                    {files.length > 0 && (
                        <div className='px-6 py-2'>
                            <div className='flex flex-wrap gap-2'>
                                {files.map((file, index) => (
                                    <div key={index} className='relative group w-16 h-16'>
                                        {file.type.startsWith("image/") ? (
                                            <div className='w-16 h-16 rounded-lg overflow-hidden bg-gray-800'>
                                                <img
                                                    src={URL.createObjectURL(file)}
                                                    alt={file.name}
                                                    className='w-full h-full object-cover'
                                                />
                                            </div>
                                        ) : (
                                            <div className='w-16 h-16 rounded-lg bg-gray-800 flex items-center justify-center text-xs text-gray-400'>
                                                {file.name.split(".").pop()?.toUpperCase()}
                                            </div>
                                        )}
                                        <button
                                            type='button'
                                            onClick={() => removeFile(index)}
                                            className='absolute -top-1.5 -right-1.5 flex items-center justify-center w-5 h-5 rounded-full bg-gray-700 hover:bg-gray-600 opacity-0 group-hover:opacity-100 transition-all'
                                        >
                                            <X className='w-3 h-3 text-gray-300 hover:text-white' strokeWidth={2.5} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className='flex items-center justify-between px-6 py-3'>
                        <label className='cursor-pointer text-gray-400 hover:text-white transition-colors flex items-center gap-2'>
                            <input
                                type='file'
                                className='hidden'
                                multiple
                                onChange={(e) => e.target.files && handleFileSelect(e.target.files)}
                                accept='image/*,.pdf,.doc,.docx'
                                disabled={loading}
                            />
                            <Paperclip className='h-5 w-5' />
                            <span>Attach</span>
                        </label>

                        <button
                            type='submit'
                            disabled={!hasContent || loading}
                            className={`transition-colors ${
                                hasContent && !loading ? "text-white" : "text-gray-400"
                            } disabled:opacity-50`}
                        >
                            <Send className='h-5 w-5' />
                        </button>
                    </div>
                </div>
            </form>

            <div className='flex flex-wrap justify-center gap-4 mt-12'>
                {templates.map((template) => (
                    <button
                        type='button'
                        key={template.title}
                        onClick={() => handleTemplateClick(template.preview)}
                        className='px-4 py-2 bg-gray-900/50 border border-gray-800 rounded-full text-sm text-gray-400 hover:border-gray-700 hover:text-gray-300 transition-all'
                        disabled={loading}
                    >
                        {template.title}
                    </button>
                ))}
            </div>
        </div>
    );
}
