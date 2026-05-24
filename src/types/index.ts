export interface IUser {
  _id: string;
  name: string;
  email: string;
  role: "Admin" | "Manager" | "Member";
  department?: string;
  skills?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface IProject {
  _id: string;
  title: string;
  client: string;
  description: string;
  startDate: string;
  endDate: string;
  budget: number;
  status: "planned" | "active" | "completed" | "archived";
  thumbnail?: string;
  totalTasks?: number;
  completedTasks?: number;
  progressPercent?: number;
  createdBy: string | IUser;
  createdAt: string;
  updatedAt: string;
}

export interface ISprint {
  _id: string;
  projectId: string;
  title: string;
  sprintNumber: number;
  startDate: string;
  endDate: string;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface ISubtask {
  title: string;
  completed: boolean;
}

export interface IComment {
  userId: string | IUser;
  message: string;
  createdAt: string;
}

export interface IActivityLog {
  userId: string | IUser;
  status: string;
  note?: string;
  createdAt: string;
}

export interface ITimeLog {
  userId: string | IUser;
  hours: number;
  note?: string;
  date: string;
}

export interface ITask {
  _id: string;
  projectId: string | IProject;
  sprintId: string | ISprint;
  title: string;
  description: string;
  assignees: (string | IUser)[];
  estimateHours: number;
  priority: "low" | "medium" | "high" | "urgent";
  status: "todo" | "in_progress" | "review" | "done";
  dueDate: string;
  attachments?: { url: string; name?: string }[];
  subtasks?: ISubtask[];
  comments: IComment[];
  activityLog: IActivityLog[];
  timeLogs: ITimeLog[];
  createdAt: string;
  updatedAt: string;
}

export type ProjectFormData = Omit<
  Partial<IProject>,
  "_id" | "createdBy" | "createdAt" | "updatedAt"
>;

export type SprintFormData = {
  title: string;
  startDate: string;
  endDate: string;
  order?: number;
};

export type TaskFormData = {
  projectId: string;
  sprintId: string;
  title: string;
  description: string;
  assignees: string[];
  estimateHours: number;
  priority: ITask["priority"];
  status: ITask["status"];
  dueDate: string;
  attachments?: { url: string; name?: string }[];
  subtasks?: ISubtask[];
};

export type UserFormData = {
  name: string;
  email: string;
  password?: string;
  role: IUser["role"];
  department?: string;
  skills?: string[];
};

export interface IProjectReport {
  totalTasks: number;
  completedTasks: number;
  remainingTasks: number;
  progressPercent: number;
  totalTimeLogged: number;
}

export interface IUserReport {
  assignedTasks: number;
  completedTasks: number;
  pendingTasks: number;
  totalTimeLogged: number;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
}
