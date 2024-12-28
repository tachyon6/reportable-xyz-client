import axios from "axios";
import { API_URL } from "../config/index";
import { authService } from "./auth.service";

export interface ChatRoom {
    id: number;
    title: string;
    lastResult: string;
    createdAt: string;
    chats?: Chat[];
}

export interface Chat {
    id: number;
    userInput: string;
    response: string;
    result: string;
    createdAt: string;
    isReverted?: boolean;
}

export interface CreateChatRoomDto {
    initialPrompt: string;
}

export interface CreateChatDto {
    content: string;
}

class ChatService {
    private getHeaders() {
        return {
            headers: {
                Authorization: `Bearer ${authService.getToken()}`,
            },
            withCredentials: true,
        };
    }

    async createChatRoom(dto: CreateChatRoomDto): Promise<ChatRoom> {
        const response = await axios.post<ChatRoom>(`${API_URL}/chat/room`, dto, this.getHeaders());
        return response.data;
    }

    async addChat(roomId: number, dto: CreateChatDto): Promise<Chat> {
        const response = await axios.post<Chat>(`${API_URL}/chat/room/${roomId}`, dto, this.getHeaders());
        return response.data;
    }

    async revertChat(chatId: number): Promise<ChatRoom> {
        const response = await axios.post<ChatRoom>(`${API_URL}/chat/revert/${chatId}`, {}, this.getHeaders());
        return response.data;
    }

    async getChatRooms(): Promise<ChatRoom[]> {
        const response = await axios.get<ChatRoom[]>(`${API_URL}/chat/rooms`, this.getHeaders());
        return response.data;
    }

    async getChatRoom(roomId: number): Promise<ChatRoom> {
        const response = await axios.get<ChatRoom>(`${API_URL}/chat/room/${roomId}`, this.getHeaders());
        return response.data;
    }
}

export const chatService = new ChatService();
