"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { FolderKanban } from "lucide-react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import Badge from "@/components/ui/Badge";
import Card from "@/components/ui/Card";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { getUser } from "@/lib/auth";
import projectService from "@/services/projectService";
import taskService from "@/services/taskService";
import { IProject, ITask } from "@/types";

const getId = (value: string | { _id: string } | undefined) => (!value ? "" : typeof value === "string" ? value : value._id);
const isAssignedToUser = (task: ITask, userId?: string) => !!userId && task.assignees?.some((assignee) => getId(assignee) === userId);

export default function MyProjectsPage() {
  const [projects, setProjects] = useState<IProject[]>([]);
  const [tasks, setTasks] = useState<ITask[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const user = getUser();

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError("");
      try {
        const taskData = (await taskService.getTasks()).filter((task) => isAssignedToUser(task, user?._id));
        const populatedProjects = taskData
          .map((task) => task.projectId)
          .filter((project): project is IProject => !!project && typeof project !== "string");
        const projectMap = new Map(populatedProjects.map((project) => [project._id, project]));
        const missingIds = Array.from(new Set(taskData.map((task) => getId(task.projectId)).filter((id) => id && !projectMap.has(id))));
        const fetchedProjects = await Promise.all(missingIds.map((id) => projectService.getProjectById(id).catch(() => null)));
        fetchedProjects.filter(Boolean).forEach((project) => projectMap.set((project as IProject)._id, project as IProject));
        setTasks(taskData);
        setProjects(Array.from(projectMap.values()));
      } catch (err: any) {
        setError(err.response?.data?.message || "Failed to fetch your projects.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const getCounts = (projectId: string) => {
    const projectTasks = tasks.filter((task) => getId(task.projectId) === projectId);
    const completed = projectTasks.filter((task) => task.status === "done").length;
    const progress = projectTasks.length ? Math.round((completed / projectTasks.length) * 100) : 0;
    return { total: projectTasks.length, completed, progress };
  };

  return (
    <DashboardLayout allowedRoles={["Member", "Manager"]}>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-950">My Projects</h1>
          <p className="mt-1 text-xs font-medium text-slate-500">Projects connected to your assigned tasks.</p>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center rounded-xl border border-slate-200/60 bg-white py-24 shadow-xs">
            <LoadingSpinner size="lg" />
          </div>
        ) : error ? (
          <div className="rounded-lg border border-rose-200 bg-rose-50 p-4 text-xs font-semibold text-rose-700">{error}</div>
        ) : projects.length === 0 ? (
          <div className="rounded-xl border border-slate-200/60 bg-white p-8 text-center text-xs font-semibold text-slate-500">No assigned projects found.</div>
        ) : (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            {projects.map((project) => {
              const counts = getCounts(project._id);
              return (
                <Link key={project._id} href={`/my-projects/${project._id}`}>
                  <Card className="h-full border-slate-200/80 bg-white transition hover:border-indigo-200 hover:shadow-md">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex min-w-0 items-start gap-3">
                        <div className="rounded-lg bg-indigo-50 p-2 text-indigo-600">
                          <FolderKanban className="h-5 w-5" />
                        </div>
                        <div className="min-w-0">
                          <h2 className="truncate text-base font-bold text-slate-950">{project.title}</h2>
                          <p className="mt-1 text-xs font-medium text-slate-500">{project.client}</p>
                        </div>
                      </div>
                      <Badge variant={project.status === "completed" ? "success" : project.status === "active" ? "info" : "neutral"}>{project.status}</Badge>
                    </div>
                    <div className="mt-6">
                      <div className="mb-1 flex justify-between text-xs font-semibold text-slate-500">
                        <span>{counts.completed}/{counts.total} my tasks done</span>
                        <span>{counts.progress}%</span>
                      </div>
                      <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                        <div className="h-full rounded-full bg-indigo-600" style={{ width: `${counts.progress}%` }} />
                      </div>
                    </div>
                  </Card>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
