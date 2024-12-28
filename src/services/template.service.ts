import axios from "axios";
import { API_URL } from "../config/index";
import { authService } from "./auth.service";

export interface Template {
    id: number;
    name: string;
    content: string;
}

export interface CreateTemplateDto {
    name: string;
    content: string;
}

class TemplateService {
    private getHeaders() {
        return {
            headers: {
                Authorization: `Bearer ${authService.getToken()}`,
            },
        };
    }

    async createTemplate(dto: CreateTemplateDto): Promise<Template> {
        const response = await axios.post<Template>(`${API_URL}/chat/template`, dto, this.getHeaders());
        return response.data;
    }
}

export const templateService = new TemplateService();
