import axios from "axios";
import { API_URL } from "../config/index";
import { authService } from "./auth.service";

export interface FileResponse {
    url: string;
}

class FileService {
    private getHeaders() {
        return {
            headers: {
                Authorization: `Bearer ${authService.getToken()}`,
                "Content-Type": "multipart/form-data",
            },
        };
    }

    async uploadFile(file: File): Promise<FileResponse> {
        const formData = new FormData();
        formData.append("file", file);

        const response = await axios.post<FileResponse>(`${API_URL}/file/upload`, formData, this.getHeaders());
        return response.data;
    }
}

export const fileService = new FileService();
