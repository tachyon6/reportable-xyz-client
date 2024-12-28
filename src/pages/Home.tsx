import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { chatService } from "../services/chat.service";
import { Sparkles } from "lucide-react";
import Sidebar from "../components/Sidebar";

export default function Home() {
    const [prompt, setPrompt] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const examples = [
        {
            title: "Resume Writing",
            prompt: "Create a professional resume template with sections for work experience, education, skills, and achievements. Make it modern and easy to read.",
        },
        {
            title: "Development Quote",
            prompt: "Generate a detailed software development project quote including project scope, timeline, deliverables, and cost breakdown.",
        },
        {
            title: "Lab Report",
            prompt: "Write a comprehensive laboratory report template with introduction, methodology, results, and discussion sections for a scientific experiment.",
        },
        {
            title: "Essay Writing",
            prompt: "Create an essay outline with introduction, body paragraphs, and conclusion. Include guidelines for thesis statement and topic sentences.",
        },
    ];

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!prompt.trim() || loading) return;

        setLoading(true);
        try {
            const response = await chatService.createChatRoom({ initialPrompt: prompt });
            navigate(`/chat/${response.id}`);
        } catch (error) {
            console.error("Failed to create chat room:", error);
            setLoading(false);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSubmit(e);
        }
    };

    const handleExampleClick = (examplePrompt: string) => {
        setPrompt(examplePrompt);
    };

    return (
        <>
            <Sidebar />
            <main className='h-[calc(100vh-81px)] overflow-hidden'>
                <div className='h-full flex flex-col items-center justify-center text-center max-w-3xl mx-auto px-4 -mt-20'>
                    <div className='absolute top-1/4 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full blur-3xl opacity-20' />

                    <img
                        src='https://myquark-image-label.s3.ap-northeast-2.amazonaws.com/boltlab/reportable/reportable_v2_icon.svg'
                        alt='reportable icon'
                        className='w-24 mb-8'
                    />

                    <h1 className='text-2xl md:text-4xl font-bold mb-4 relative whitespace-nowrap'>
                        Make documents in seconds.
                    </h1>

                    <p className='text-gray-400 text-xl mb-8 max-w-2xl'>
                        Transform your ideas into professional documents instantly with our intelligent document
                        generation platform.
                    </p>

                    {!loading ? (
                        <div className='w-full'>
                            <form onSubmit={handleSubmit} className='space-y-4'>
                                <div className='relative'>
                                    <textarea
                                        value={prompt}
                                        onChange={(e) => setPrompt(e.target.value)}
                                        onKeyPress={handleKeyPress}
                                        placeholder='Ask reportable to create a pro...'
                                        className='w-full h-32 px-4 py-3 bg-gray-900 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none'
                                        disabled={loading}
                                    />
                                    <button
                                        type='submit'
                                        className='absolute right-4 bottom-4 p-2 bg-white text-gray-900 rounded-xl hover:bg-gray-100 transition-colors disabled:opacity-50'
                                        disabled={loading || !prompt.trim()}
                                    >
                                        <Sparkles className='h-5 w-5' />
                                    </button>
                                </div>
                            </form>

                            <div className='flex gap-3 justify-center mt-4'>
                                {examples.map((example) => (
                                    <button
                                        key={example.title}
                                        onClick={() => handleExampleClick(example.prompt)}
                                        className='px-4 py-2 bg-gray-900 rounded-xl text-sm text-gray-400 hover:text-white transition-colors'
                                    >
                                        {example.title}
                                    </button>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div className='flex flex-col items-center justify-center space-y-6'>
                            <div className='relative'>
                                <div className='w-16 h-16 border-4 border-blue-500 rounded-full animate-spin border-t-transparent'></div>
                                <div className='absolute inset-0 flex items-center justify-center'>
                                    <div className='w-8 h-8 bg-blue-500 rounded-lg animate-pulse'></div>
                                </div>
                            </div>
                            <div className='text-center space-y-2'>
                                <h3 className='text-xl font-semibold'>Creating your document</h3>
                                <p className='text-gray-400'>This might take a few seconds...</p>
                            </div>
                            <div className='w-48 h-1 bg-gray-800 rounded-full overflow-hidden'>
                                <div className='h-full bg-blue-500 animate-progress'></div>
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </>
    );
}
