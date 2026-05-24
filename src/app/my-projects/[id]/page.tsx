"use client";

import React, { use, useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, ChevronDown, ChevronRight } from "lucide-react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import PriorityBadge from "@/components/tasks/PriorityBadge";
import StatusBadge from "@/components/tasks/StatusBadge";
import Badge from "@/components/ui/Badge";
import Card from "@/components/ui/Card";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { getUser } from "@/lib/auth";
import projectService from "@/services/projectService";
import sprintService from "@/services/sprintService";
import taskService from "@/services/taskService";
import { IProject, ISprint, ITask } from "@/types";

interface PageProps {
  params: Promise<{ id: string }>;
}

const getId = (value: string | { _id: string } | undefined) => (!value ? "" : typeof value === "string" ? value : value._id);
const isAssignedToUser = (task: ITask, userId?: string) => !!userId && task.assignees?.some((assignee) => getId(assignee) === userId);
const formatDate = (date?: string) => (date ? new Date(date).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" }) : "N/A");

export default function MyProjectDetailPage({ params }: PageProps) {
  const { id } = use(params);
  const [project, setProject] = useState<IProject | null>(null);
  const [sprints, setSprints] = useState<ISprint[]>([]);
  const [tasks, setTasks] = useState<ITask[]>([]);
  const [openSprints, setOpenSprints] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const user = getUser();

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError("");
    try {
      const [projectData, sprintData, taskData] = await Promise.all([
        projectService.getProjectById(id),
        sprintService.getSprints(id),
        taskService.getTasks({ projectId: id }),
      ]);
      const visibleTasks = user?.role === "Member" ? taskData.filter((task) => isAssignedToUser(task, user._id)) : taskData;
      setProject(projectData);
      setSprints(sprintData);
      setTasks(visibleTasks);
      setOpenSprints(sprintData.map((sprint) => sprint._id));
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to fetch project details.");
    } finally {
      setIsLoading(false);
    }
  }, [id, user?._id, user?.role]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const completedTasks = tasks.filter((task) => task.status === "done").length;
  const progress = tasks.length ? Math.round((completedTasks / tasks.length) * 100) : 0;

  const toggleSprint = (sprintId: string) => {
    setOpenSprints((current) => (current.includes(sprintId) ? current.filter((id) => id !== sprintId) : [...current, sprintId]));
  };

  return (
    <DashboardLayout allowedRoles={["Member", "Manager"]}>
      {isLoading ? (
        <div className="flex items-center justify-center rounded-xl border border-slate-200/60 bg-white py-24 shadow-xs">
          <LoadingSpinner size="lg" />
        </div>
      ) : error || !project ? (
        <div className="rounded-lg border border-rose-200 bg-rose-50 p-4 text-xs font-semibold text-rose-700">{error || "Project not found."}</div>
      ) : (
        <div className="space-y-6">
          <div>
            <Link href="/my-projects" className="mb-3 inline-flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-slate-900">
              <ArrowLeft className="h-4 w-4" /> Back to My Projects
            </Link>
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-2xl font-bold text-slate-950">{project.title}</h1>
              <Badge variant={project.status === "completed" ? "success" : project.status === "active" ? "info" : "neutral"}>{project.status}</Badge>
            </div>
            <p className="mt-1 text-xs font-medium text-slate-500">Client: {project.client}</p>
          </div>

          <Card className="border-slate-200/80 bg-white">
            <p className="whitespace-pre-wrap text-sm leading-6 text-slate-600">{project.description || "No description provided."}</p>
            <div className="mt-5">
              <div className="mb-1 flex justify-between text-xs font-semibold text-slate-500">
                <span>{completedTasks}/{tasks.length} visible tasks done</span>
                <span>{progress}%</span>
              </div>
              <div className="h-2.5 overflow-hidden rounded-full bg-slate-100">
                <div className="h-full rounded-full bg-indigo-600" style={{ width: `${progress}%` }} />
              </div>
            </div>
          </Card>

          <div className="space-y-4">
            <div>
              <h2 className="text-lg font-bold text-slate-950">Sprints</h2>
              <p className="mt-1 text-xs font-medium text-slate-500">Expandable sprint task lists for this project.</p>
            </div>
            {sprints.length === 0 ? (
              <div className="rounded-xl border border-slate-200/60 bg-white p-8 text-center text-xs font-semibold text-slate-500">No sprints available.</div>
            ) : (
              sprints.map((sprint) => {
                const sprintTasks = tasks.filter((task) => getId(task.sprintId) === sprint._id);
                const sprintDone = sprintTasks.filter((task) => task.status === "done").length;
                const sprintProgress = sprintTasks.length ? Math.round((sprintDone / sprintTasks.length) * 100) : 0;
                const isOpen = openSprints.includes(sprint._id);

                return (
                  <section key={sprint._id} className="rounded-xl border border-slate-200 bg-white">
                    <button type="button" className="flex w-full flex-col gap-3 border-b border-slate-100 p-4 text-left md:flex-row md:items-center md:justify-between" onClick={() => toggleSprint(sprint._id)}>
                      <span className="flex items-start gap-3">
                        <span className="mt-0.5 text-slate-500">{isOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}</span>
                        <span>
                          <span className="block text-sm font-bold text-slate-950">Sprint {sprint.sprintNumber || "-"}: {sprint.title}</span>
                          <span className="mt-1 block text-xs text-slate-500">{formatDate(sprint.startDate)} to {formatDate(sprint.endDate)}</span>
                        </span>
                      </span>
                      <span className="min-w-[160px]">
                        <span className="mb-1 flex justify-between text-[10px] font-semibold text-slate-500">
                          <span>{sprintDone}/{sprintTasks.length}</span>
                          <span>{sprintProgress}%</span>
                        </span>
                        <span className="block h-2 overflow-hidden rounded-full bg-slate-100">
                          <span className="block h-full rounded-full bg-indigo-600" style={{ width: `${sprintProgress}%` }} />
                        </span>
                      </span>
                    </button>
                    {isOpen && (
                      <div className="space-y-3 bg-slate-50/50 p-4">
                        {sprintTasks.length === 0 ? (
                          <div className="rounded-lg border border-dashed border-slate-200 bg-white p-6 text-center text-xs font-semibold text-slate-500">No visible tasks in this sprint.</div>
                        ) : (
                          sprintTasks.map((task) => (
                            <Link key={task._id} href={`/my-tasks/${task._id}`} className="block rounded-lg border border-slate-200 bg-white p-4 transition hover:border-indigo-200">
                              <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                                <div>
                                  <h3 className="text-sm font-bold text-slate-950">{task.title}</h3>
                                  <p className="mt-1 text-xs text-slate-500">Due {formatDate(task.dueDate)} | {task.estimateHours || 0}h estimate</p>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                  <PriorityBadge priority={task.priority} />
                                  <StatusBadge status={task.status} />
                                </div>
                              </div>
                            </Link>
                          ))
                        )}
                      </div>
                    )}
                  </section>
                );
              })
            )}
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}

export type { PageProps };
