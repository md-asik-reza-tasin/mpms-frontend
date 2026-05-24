import api from "@/lib/api";
import { IUser } from "@/types";

export interface LoginResponse {
  token: string;
  user: IUser;
}

export const authService = {
  login: async (credentials: Record<string, string>): Promise<LoginResponse> => {
    const response = await api.post<LoginResponse>("/auth/login", credentials);
    return response.data;
  },
  register: async (userData: Record<string, any>): Promise<{ user: IUser; token: string }> => {
    const response = await api.post<{ user: IUser; token: string }>("/auth/register", userData);
    return response.data;
  },
  getMe: async (): Promise<IUser> => {
    const response = await api.get<IUser>("/auth/me");
    return response.data;
  },
};
export default authService;
