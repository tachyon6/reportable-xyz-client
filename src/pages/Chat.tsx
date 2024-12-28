import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { chatService, ChatRoom, Chat as ChatMessage } from "../services/chat.service";
import { fileService } from "../services/file.service";
import { Send, Download, RotateCcw } from "lucide-react";
import WordDocumentViewer from "../components/WordDocumentViewer";
import { v4 as uuidv4 } from "uuid";

export default function ChatRoomPage() {
    const { roomId } = useParams<{ roomId: string }>();
    const navigate = useNavigate();
    const [chatRoom, setChatRoom] = useState<ChatRoom | null>(null);
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const [documentUrl, setDocumentUrl] = useState<string | null>(null);
    const chatContainerRef = useRef<HTMLDivElement>(null);
    const [pendingMessage, setPendingMessage] = useState<{ userInput: string } | null>(null);
    const [aiLoading, setAiLoading] = useState(false);
    const [revertModalOpen, setRevertModalOpen] = useState(false);
    const [selectedChatId, setSelectedChatId] = useState<number | null>(null);

    useEffect(() => {
        if (roomId) {
            loadChatRoom();
        }
    }, [roomId]);

    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [chatRoom?.chats, pendingMessage]);

    const uploadDocument = async (content: string) => {
        try {
            // HTML 문자열을 Blob으로 변환
            const blob = new Blob([content], {
                type: "application/msword",
            });
            const file = new File([blob], `${uuidv4()}.doc`, {
                type: "application/msword",
            });

            // S3에 업로드
            const response = await fileService.uploadFile(file);
            setDocumentUrl(response.url);
        } catch (error) {
            console.error("Failed to upload document:", error);
        }
    };

    const loadChatRoom = async () => {
        try {
            const room = await chatService.getChatRoom(Number(roomId));
            console.log(
                "Chat room data:",
                room.chats?.map((chat) => ({
                    id: chat.id,
                    isReverted: chat.isReverted,
                    createdAt: chat.createdAt,
                }))
            );
            setChatRoom(room);
            if (room.lastResult) {
                await uploadDocument(room.lastResult);
            }
        } catch (error) {
            console.error("Failed to load chat room:", error);
            navigate("/");
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!message.trim() || !roomId || loading) return;

        const userMessage = message;
        setMessage("");
        setAiLoading(true);
        setPendingMessage({ userInput: userMessage });

        try {
            const response = await chatService.addChat(Number(roomId), { content: userMessage });
            await loadChatRoom();
        } catch (error) {
            console.error("Failed to send message:", error);
        } finally {
            setAiLoading(false);
            setPendingMessage(null);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSubmit(e);
        }
    };

    const handleRevertClick = (chatId: number) => {
        setSelectedChatId(chatId);
        setRevertModalOpen(true);
    };

    const handleRevertConfirm = async () => {
        if (!selectedChatId) return;

        setLoading(true);
        try {
            console.log("Reverting chat:", selectedChatId);
            await chatService.revertChat(selectedChatId);
            await loadChatRoom();
        } catch (error) {
            console.error("Failed to revert chat:", error);
        } finally {
            setLoading(false);
            setRevertModalOpen(false);
            setSelectedChatId(null);
        }
    };

    const handleDownload = () => {
        if (!documentUrl) return;
        window.open(documentUrl, "_blank");
    };

    if (!chatRoom) {
        return (
            <div className='min-h-screen flex items-center justify-center'>
                <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900' />
            </div>
        );
    }

    return (
        <div className='flex h-[calc(100vh-81px)] p-6 gap-6 bg-gray-950'>
            {/* 채팅 영역 */}
            <div className='w-[400px] flex flex-col min-h-0 bg-gray-900 rounded-2xl'>
                <div
                    ref={chatContainerRef}
                    className='flex-1 overflow-auto p-6 space-y-6 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent hover:scrollbar-thumb-gray-600'
                >
                    {chatRoom.chats
                        ?.filter((chat) => !chat.isReverted)
                        .map((chat, index, filteredChats) => (
                            <div key={chat.id}>
                                {/* 사용자 메시지 */}
                                <div className='flex justify-end mb-4'>
                                    <div className='max-w-[80%] bg-indigo-500/80 text-white px-4 py-2 rounded-xl'>
                                        {chat.userInput}
                                    </div>
                                </div>

                                {/* AI 응답 메시지 */}
                                <div className='flex flex-col mb-4'>
                                    <div className='flex justify-start'>
                                        <div className='max-w-[80%] bg-gray-800 px-4 py-2 rounded-xl'>
                                            <div
                                                className='prose prose-invert max-w-none'
                                                dangerouslySetInnerHTML={{ __html: chat.response }}
                                            />
                                        </div>
                                    </div>
                                    <div className='flex items-center gap-2 mt-1 ml-2'>
                                        <span className='text-xs text-gray-500'>
                                            {new Date(chat.createdAt).toLocaleTimeString("en-US", {
                                                hour: "2-digit",
                                                minute: "2-digit",
                                            })}
                                        </span>
                                        {!chat.isReverted && index !== filteredChats.length - 1 && (
                                            <button
                                                onClick={() => handleRevertClick(chat.id)}
                                                className='flex items-center gap-1 text-xs text-gray-500 hover:text-gray-300 transition-colors'
                                            >
                                                <RotateCcw className='h-3 w-3' />
                                                Revert
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}

                    {/* 대기 중인 사용자 메시지 */}
                    {pendingMessage && (
                        <div>
                            <div className='flex justify-end mb-4'>
                                <div className='max-w-[80%] bg-indigo-500/80 text-white px-4 py-2 rounded-xl'>
                                    {pendingMessage.userInput}
                                </div>
                            </div>
                            {/* AI 로딩 상태 표시 */}
                            <div className='flex justify-start mb-4'>
                                <div className='max-w-[80%] bg-gray-800 px-4 py-2 rounded-xl'>
                                    <div className='flex items-center gap-2'>
                                        <div className='animate-spin rounded-full h-4 w-4 border-2 border-blue-500 border-t-transparent'></div>
                                        <span className='text-sm text-gray-400'>Editing document...</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* 입력창 */}
                <div className='bg-gray-800/50 p-4'>
                    <form onSubmit={handleSubmit}>
                        <div className='relative'>
                            <textarea
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                onKeyPress={handleKeyPress}
                                placeholder={aiLoading ? "Waiting for response..." : "Type a message..."}
                                className='w-full px-4 py-3 bg-gray-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none disabled:opacity-50 disabled:cursor-not-allowed'
                                rows={1}
                                disabled={loading || aiLoading}
                            />
                            <button
                                type='submit'
                                className='absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed'
                                disabled={loading || aiLoading || !message.trim()}
                            >
                                <Send className='h-5 w-5' />
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            {/* 결과 미리보기 */}
            <div className='flex-1 bg-gray-900 rounded-2xl flex flex-col overflow-auto'>
                <div className='shrink-0 p-4 flex justify-between items-center bg-gray-800/50'>
                    <h2 className='text-lg font-semibold'>Preview</h2>
                    <button
                        onClick={handleDownload}
                        className='flex items-center gap-2 px-3 py-1.5 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors disabled:opacity-50'
                        disabled={!documentUrl}
                    >
                        <Download className='h-4 w-4' />
                        Word
                    </button>
                </div>
                <div className='flex-1 h-full'>{documentUrl && <WordDocumentViewer documentUrl={documentUrl} />}</div>
            </div>

            {/* 되돌리기 확인 모달 */}
            {revertModalOpen && (
                <div className='fixed inset-0 flex items-center justify-center bg-black/50 z-50'>
                    <div className='bg-gray-800 p-6 rounded-2xl max-w-md w-full mx-4'>
                        <h3 className='text-lg font-semibold mb-2'>Confirm Revert</h3>
                        <p className='text-gray-300 mb-6'>
                            Reverting to this point will remove all subsequent messages. Do you want to continue?
                        </p>
                        <div className='flex justify-end gap-3'>
                            <button
                                onClick={() => setRevertModalOpen(false)}
                                className='px-4 py-2 text-sm text-gray-300 hover:text-white transition-colors'
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleRevertConfirm}
                                className='px-4 py-2 text-sm bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors'
                                disabled={loading}
                            >
                                {loading ? "Processing..." : "Revert"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
