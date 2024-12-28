import { API_URL } from "../config/index";

export interface User {
    id: number;
    email: string;
    name: string;
    profileImage: string;
}

export interface AuthResponse {
    access_token: string;
    user: User;
}

class AuthService {
    async googleLogin(): Promise<void> {
        window.location.href = `${API_URL}/auth/google`;
    }

    setToken(token: string): void {
        localStorage.setItem("access_token", token);
        try {
            const payload = JSON.parse(atob(token.split(".")[1]));
            this.setUser({
                id: payload.sub,
                email: payload.email,
                name: payload.name,
                profileImage: payload.profileImage,
            });
        } catch (error) {
            console.error("Failed to parse token:", error);
        }
    }

    setUser(user: User): void {
        localStorage.setItem("user", JSON.stringify(user));
    }

    getUser(): User | null {
        const userStr = localStorage.getItem("user");
        if (!userStr) return null;
        try {
            return JSON.parse(userStr);
        } catch {
            return null;
        }
    }

    getToken(): string | null {
        return localStorage.getItem("access_token");
    }

    removeToken(): void {
        localStorage.removeItem("access_token");
        localStorage.removeItem("user");
    }

    isAuthenticated(): boolean {
        return !!this.getToken();
    }
}

export const authService = new AuthService();
