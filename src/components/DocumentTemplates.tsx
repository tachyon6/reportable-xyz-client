import React from "react";

interface DocumentTemplatesProps {
    onTemplateClick: (text: string) => void;
}

const templates = [
    {
        id: 1,
        name: "Meeting Minutes",
        prompt: "Create a meeting minutes document with the following agenda items: 1. Project Updates 2. Action Items 3. Next Steps",
    },
    {
        id: 2,
        name: "Weekly Report",
        prompt: "Generate a weekly report covering: 1. Achievements 2. Challenges 3. Plans for next week",
    },
    {
        id: 3,
        name: "Project Proposal",
        prompt: "Write a project proposal including: 1. Overview 2. Objectives 3. Timeline 4. Budget",
    },
];

export function DocumentTemplates({ onTemplateClick }: DocumentTemplatesProps) {
    return (
        <div className='mt-4'>
            <h3 className='text-sm font-medium text-gray-400 mb-2'>Quick Templates</h3>
            <div className='flex flex-wrap gap-2'>
                {templates.map((template) => (
                    <button
                        key={template.id}
                        onClick={() => onTemplateClick(template.prompt)}
                        className='px-3 py-1.5 bg-gray-900/50 backdrop-blur-xl border border-gray-800 rounded-lg text-sm text-gray-300 hover:text-white hover:border-gray-700 transition-colors'
                    >
                        {template.name}
                    </button>
                ))}
            </div>
        </div>
    );
}
