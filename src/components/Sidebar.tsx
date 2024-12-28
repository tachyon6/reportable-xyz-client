import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Menu, Settings, HelpCircle, CreditCard, Users, LogOut } from "lucide-react";
import { chatService } from "../services/chat.service";
import { authService } from "../services/auth.service";

interface ChatRoom {
    id: number;
    title: string;
    createdAt: string;
}

interface GroupedChats {
    [key: string]: ChatRoom[];
}

export default function Sidebar() {
    const [isOpen, setIsOpen] = useState(false);
    const [chatRooms, setChatRooms] = useState<ChatRoom[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [showFeatureModal, setShowFeatureModal] = useState(false);
    const [showSignOutModal, setShowSignOutModal] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (isOpen) {
            loadChatRooms();
        }
    }, [isOpen]);

    const loadChatRooms = async () => {
        try {
            const rooms = await chatService.getChatRooms();
            setChatRooms(rooms);
        } catch (error) {
            console.error("Failed to load chat rooms:", error);
        }
    };

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
    };

    const filteredChatRooms = chatRooms.filter((room) => room.title.toLowerCase().includes(searchTerm.toLowerCase()));

    const groupChatsByDate = (chats: ChatRoom[]): GroupedChats => {
        const grouped = chats.reduce((acc: GroupedChats, chat) => {
            const date = new Date(chat.createdAt);
            const today = new Date();
            const yesterday = new Date(today);
            yesterday.setDate(yesterday.getDate() - 1);

            let dateKey: string;
            if (date.toDateString() === today.toDateString()) {
                dateKey = "Today";
            } else if (date.toDateString() === yesterday.toDateString()) {
                dateKey = "Yesterday";
            } else {
                dateKey = date.toLocaleDateString("en-US", { weekday: "long" });
            }

            if (!acc[dateKey]) {
                acc[dateKey] = [];
            }
            acc[dateKey].push(chat);
            return acc;
        }, {});

        return grouped;
    };

    const handleChatRoomClick = (roomId: number) => {
        navigate(`/chat/${roomId}`);
        setIsOpen(false);
    };

    const handleFeatureClick = () => {
        setShowFeatureModal(true);
    };

    const handleSignOut = () => {
        authService.removeToken();
        navigate("/login");
        setShowSignOutModal(false);
    };

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className='fixed left-6 bottom-6 p-3 bg-gray-900 rounded-xl hover:bg-gray-800 transition-colors z-50'
            >
                <Menu className='h-5 w-5' />
            </button>

            {/* Overlay */}
            {isOpen && <div className='fixed inset-0 bg-black/50 z-40' onClick={() => setIsOpen(false)} />}

            {/* Sidebar */}
            <div
                className={`fixed left-0 top-0 h-full w-80 bg-gray-900 p-4 transition-transform duration-300 ease-in-out z-50 ${
                    isOpen ? "translate-x-0" : "-translate-x-full"
                }`}
            >
                <div className='flex flex-col h-full'>
                    <div className='py-6 px-1'>
                        <input
                            type='text'
                            value={searchTerm}
                            onChange={handleSearch}
                            placeholder='Search chats'
                            className='w-full px-4 py-3 bg-gray-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/80 transition-all duration-200'
                        />
                    </div>

                    <div className='flex-1 overflow-auto scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent hover:scrollbar-thumb-gray-600'>
                        <div className='space-y-6'>
                            <div>
                                <h2 className='text-sm font-semibold text-gray-400 mb-2'>Your Chats</h2>
                                {Object.entries(groupChatsByDate(filteredChatRooms)).map(([date, rooms]) => (
                                    <div key={date} className='mb-4'>
                                        <h3 className='text-xs text-gray-500 mb-2'>{date}</h3>
                                        <div className='space-y-1'>
                                            {rooms.map((room) => (
                                                <button
                                                    key={room.id}
                                                    onClick={() => handleChatRoomClick(room.id)}
                                                    className='w-full text-left px-2 py-2 text-sm text-gray-300 hover:bg-gray-800 rounded-lg transition-colors'
                                                >
                                                    {room.title}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className='border-t border-gray-800 pt-4 space-y-2'>
                        <button
                            onClick={handleFeatureClick}
                            className='w-full flex items-center gap-2 px-2 py-2 text-sm text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors'
                        >
                            <Settings className='h-4 w-4' />
                            Settings
                        </button>
                        <button
                            onClick={handleFeatureClick}
                            className='w-full flex items-center gap-2 px-2 py-2 text-sm text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors'
                        >
                            <HelpCircle className='h-4 w-4' />
                            Help Center
                        </button>
                        <button
                            onClick={handleFeatureClick}
                            className='w-full flex items-center gap-2 px-2 py-2 text-sm text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors'
                        >
                            <CreditCard className='h-4 w-4' />
                            My Subscription
                        </button>
                        <button
                            onClick={handleFeatureClick}
                            className='w-full flex items-center gap-2 px-2 py-2 text-sm text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors'
                        >
                            <Users className='h-4 w-4' />
                            Select Account
                        </button>
                        <button
                            onClick={() => setShowSignOutModal(true)}
                            className='w-full flex items-center gap-2 px-2 py-2 text-sm text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors'
                        >
                            <LogOut className='h-4 w-4' />
                            Sign Out
                        </button>
                    </div>
                </div>
            </div>

            {/* Feature Not Available Modal */}
            {showFeatureModal && (
                <div className='fixed inset-0 flex items-center justify-center bg-black/50 z-50'>
                    <div className='bg-gray-800 p-6 rounded-2xl max-w-md w-full mx-4'>
                        <h3 className='text-lg font-semibold mb-2'>Coming Soon!</h3>
                        <p className='text-gray-300 mb-6'>This feature is not available yet. Stay tuned!</p>
                        <div className='flex justify-end'>
                            <button
                                onClick={() => setShowFeatureModal(false)}
                                className='px-4 py-2 text-sm bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors'
                            >
                                OK
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Sign Out Confirmation Modal */}
            {showSignOutModal && (
                <div className='fixed inset-0 flex items-center justify-center bg-black/50 z-50'>
                    <div className='bg-gray-800 p-6 rounded-2xl max-w-md w-full mx-4'>
                        <h3 className='text-lg font-semibold mb-2'>Sign Out</h3>
                        <p className='text-gray-300 mb-6'>Are you sure you want to sign out?</p>
                        <div className='flex justify-end gap-3'>
                            <button
                                onClick={() => setShowSignOutModal(false)}
                                className='px-4 py-2 text-sm text-gray-300 hover:text-white transition-colors'
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSignOut}
                                className='px-4 py-2 text-sm bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors'
                            >
                                Sign Out
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
