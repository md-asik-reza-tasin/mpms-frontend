import api from "@/lib/api";
import { ITask, TaskFormData } from "@/types";

export const taskService = {
  getTasks: async (filters?: Record<string, string>): Promise<ITask[]> => {
    const response = await api.get<ITask[]>("/tasks", { params: filters });
    return response.data;
  },
  getTaskById: async (id: string): Promise<ITask> => {
    const response = await api.get<ITask>(`/tasks/${id}`);
    return response.data;
  },
  createTask: async (data: TaskFormData): Promise<ITask> => {
    const response = await api.post<ITask>("/tasks", data);
    return response.data;
  },
  updateTask: async (id: string, data: Partial<TaskFormData>): Promise<ITask> => {
    const response = await api.put<ITask>(`/tasks/${id}`, data);
    return response.data;
  },
  deleteTask: async (id: string): Promise<{ message: string }> => {
    const response = await api.delete<{ message: string }>(`/tasks/${id}`);
    return response.data;
  },
  updateTaskStatus: async (id: string, status: ITask["status"]): Promise<ITask> => {
    const response = await api.patch<ITask>(`/tasks/${id}/status`, { status });
    return response.data;
  },
  addComment: async (id: string, message: string): Promise<ITask> => {
    const response = await api.post<ITask>(`/tasks/${id}/comments`, { message });
    return response.data;
  },
  addTimeLog: async (id: string, data: { hours: number; note?: string; date?: string }): Promise<ITask> => {
    const response = await api.post<ITask>(`/tasks/${id}/time-logs`, {
      ...data,
      date: data.date || new Date().toISOString(),
    });
    return response.data;
  },
};

export default taskService;
