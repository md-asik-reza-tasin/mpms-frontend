import api from "@/lib/api";
import { IProjectReport, IUserReport } from "@/types";

export const reportService = {
  getProjectReport: async (projectId: string): Promise<IProjectReport> => {
    const response = await api.get<IProjectReport>(`/reports/project/${projectId}`);
    return response.data;
  },
  getUserReport: async (userId: string): Promise<IUserReport> => {
    const response = await api.get<IUserReport>(`/reports/user/${userId}`);
    return response.data;
  },
};

export default reportService;
