import api from "@/lib/api";
import { IProject } from "@/types";

export const projectService = {
  getProjects: async (filters?: Record<string, string>): Promise<IProject[]> => {
    const response = await api.get<IProject[]>("/projects", { params: filters });
    return response.data;
  },
  getProjectById: async (id: string): Promise<IProject> => {
    const response = await api.get<IProject>(`/projects/${id}`);
    return response.data;
  },
  createProject: async (data: Partial<IProject>): Promise<IProject> => {
    const response = await api.post<IProject>("/projects", data);
    return response.data;
  },
  updateProject: async (id: string, data: Partial<IProject>): Promise<IProject> => {
    const response = await api.put<IProject>(`/projects/${id}`, data);
    return response.data;
  },
  deleteProject: async (id: string): Promise<{ message: string }> => {
    const response = await api.delete<{ message: string }>(`/projects/${id}`);
    return response.data;
  },
};

export default projectService;
