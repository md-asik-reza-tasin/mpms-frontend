import api from "@/lib/api";
import { ISprint, SprintFormData } from "@/types";

export const sprintService = {
  getSprints: async (projectId: string): Promise<ISprint[]> => {
    const response = await api.get<ISprint[]>(`/projects/${projectId}/sprints`);
    return response.data;
  },
  getSprintById: async (id: string): Promise<ISprint> => {
    const response = await api.get<ISprint>(`/sprints/${id}`);
    return response.data;
  },
  createSprint: async (projectId: string, data: SprintFormData): Promise<ISprint> => {
    const response = await api.post<ISprint>(`/projects/${projectId}/sprints`, data);
    return response.data;
  },
  updateSprint: async (id: string, data: Partial<SprintFormData>): Promise<ISprint> => {
    const response = await api.put<ISprint>(`/sprints/${id}`, data);
    return response.data;
  },
  deleteSprint: async (id: string): Promise<{ message: string }> => {
    const response = await api.delete<{ message: string }>(`/sprints/${id}`);
    return response.data;
  },
};

export default sprintService;
