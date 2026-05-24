import api from "@/lib/api";
import { IUser, UserFormData } from "@/types";

export const userService = {
  getUsers: async (): Promise<IUser[]> => {
    const response = await api.get<IUser[]>("/users");
    return response.data;
  },
  getUserById: async (id: string): Promise<IUser> => {
    const response = await api.get<IUser>(`/users/${id}`);
    return response.data;
  },
  createUser: async (data: UserFormData): Promise<IUser> => {
    const response = await api.post<IUser>("/users", data);
    return response.data;
  },
  updateUser: async (id: string, data: Partial<UserFormData>): Promise<IUser> => {
    const response = await api.put<IUser>(`/users/${id}`, data);
    return response.data;
  },
  deleteUser: async (id: string): Promise<{ message: string }> => {
    const response = await api.delete<{ message: string }>(`/users/${id}`);
    return response.data;
  },
};

export default userService;
