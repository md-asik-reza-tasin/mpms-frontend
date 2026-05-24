"use client";

import React, { use, useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Calendar, DollarSign, Edit, Plus } from "lucide-react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import SprintForm from "@/components/sprints/SprintForm";
import SprintList from "@/components/sprints/SprintList";
import TaskForm from "@/components/tasks/TaskForm";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import projectService from "@/services/projectService";
import sprintService from "@/services/sprintService";
import taskService from "@/services/taskService";
import userService from "@/services/userService";
import { IProject, ISprint, ITask, IUser, SprintFormData, TaskFormData } from "@/types";

interface PageProps {
  params: Promise<{ id: string }>;
}

type ModalMode = "sprint" | "task" | null;

export default function ProjectDetailsPage({ params }: PageProps) {
  const { id } = use(params);
  const router = useRouter();
  const [project, setProject] = useState<IProject | null>(null);
  const [sprints, setSprints] = useState<ISprint[]>([]);
  const [tasks, setTasks] = useState<ITask[]>([]);
  const [users, setUsers] = useState<IUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const [modalMode, setModalMode] = useState<ModalMode>(null);
  const [editingSprint, setEditingSprint] = useState<ISprint | null>(null);
  const [editingTask, setEditingTask] = useState<ITask | null>(null);
  const [selectedSprintId, setSelectedSprintId] = useState("");

  const loadProjectWorkspace = useCallback(async () => {
    setIsLoading(true);
    setError("");
    try {
      const [projectData, sprintData, taskData, userData] = await Promise.all([
        projectService.getProjectById(id),
        sprintService.getSprints(id),
        taskService.getTasks({ projectId: id }),
        userService.getUsers().catch(() => []),
      ]);
      setProject(projectData);
      setSprints(sprintData);
      setTasks(taskData);
      setUsers(userData);
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to fetch project workspace.");
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadProjectWorkspace();
  }, [loadProjectWorkspace]);

  const closeModal = () => {
    setModalMode(null);
    setEditingSprint(null);
    setEditingTask(null);
    setSelectedSprintId("");
  };

  const handleSprintSubmit = async (data: SprintFormData) => {
    setIsSaving(true);
    try {
      if (editingSprint) {
        await sprintService.updateSprint(editingSprint._id, data);
      } else {
        await sprintService.createSprint(id, data);
      }
      closeModal();
      await loadProjectWorkspace();
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to save sprint.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteSprint = async (sprintId: string) => {
    if (!window.confirm("Delete this sprint? Tasks assigned to it may also be affected.")) return;
    try {
      await sprintService.deleteSprint(sprintId);
      await loadProjectWorkspace();
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to delete sprint.");
    }
  };

  const handleTaskSubmit = async (data: TaskFormData) => {
    setIsSaving(true);
    try {
      if (editingTask) {
        await taskService.updateTask(editingTask._id, data);
      } else {
        await taskService.createTask(data);
      }
      closeModal();
      await loadProjectWorkspace();
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to save task.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    if (!window.confirm("Delete this task?")) return;
    try {
      await taskService.deleteTask(taskId);
      setTasks((current) => current.filter((task) => task._id !== taskId));
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to delete task.");
    }
  };

  const handleTaskStatusChange = async (taskId: string, status: ITask["status"]) => {
    try {
      const updatedTask = await taskService.updateTaskStatus(taskId, status);
      setTasks((current) => current.map((task) => (task._id === taskId ? updatedTask : task)));
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to update task status.");
    }
  };

  const getStatusVariant = (status: string) => {
    if (status === "completed") return "success";
    if (status === "active") return "info";
    if (status === "planned") return "warning";
    return "neutral";
  };

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "N/A";
    return new Date(dateStr).toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" });
  };

  const completedTasks = project?.completedTasks ?? tasks.filter((task) => task.status === "done").length;
  const totalTasks = project?.totalTasks ?? tasks.length;
  const progressPercent = project?.progressPercent ?? (totalTasks ? Math.round((completedTasks / totalTasks) * 100) : 0);

  return (
    <DashboardLayout allowedRoles={["Admin"]}>
      {isLoading ? (
        <div className="flex items-center justify-center rounded-xl border border-slate-200/60 bg-white py-24 shadow-xs">
          <LoadingSpinner size="lg" />
        </div>
      ) : error || !project ? (
        <div className="space-y-4">
          <div className="rounded-lg border border-rose-200 bg-rose-50 p-4 text-xs font-semibold text-rose-700">{error || "Project not found."}</div>
          <Button variant="outline" className="flex items-center gap-2" onClick={() => router.push("/projects")}>
            <ArrowLeft className="h-4 w-4" /> Back to Projects
          </Button>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm" className="h-8 w-8 p-0" onClick={() => router.push("/projects")}>
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-2xl font-bold text-slate-950">{project.title}</h1>
                  <Badge variant={getStatusVariant(project.status)}>{project.status}</Badge>
                </div>
                <p className="mt-0.5 text-xs font-medium text-slate-500">Client: {project.client}</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button type="button" className="flex items-center gap-2" onClick={() => setModalMode("sprint")}>
                <Plus className="h-4 w-4" /> Add Sprint
              </Button>
              <Button
                type="button"
                variant="secondary"
                className="flex items-center gap-2"
                onClick={() => {
                  setSelectedSprintId(sprints[0]?._id || "");
                  setModalMode("task");
                }}
                disabled={sprints.length === 0}
              >
                <Plus className="h-4 w-4" /> Add Task
              </Button>
              <Link href={`/projects/${project._id}/edit`}>
                <Button variant="outline" className="flex items-center gap-2">
                  <Edit className="h-4 w-4" /> Edit Project
                </Button>
              </Link>
            </div>
          </div>

          <Card className="border-slate-200/80 bg-white">
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_320px]">
              <div>
                <h2 className="text-sm font-semibold text-slate-950">Project Summary</h2>
                <p className="mt-2 whitespace-pre-wrap text-xs leading-6 text-slate-600">{project.description || "No description provided."}</p>
                <div className="mt-5">
                  <div className="mb-1 flex items-center justify-between text-xs font-semibold text-slate-600">
                    <span>{completedTasks}/{totalTasks} tasks completed</span>
                    <span>{progressPercent}%</span>
                  </div>
                  <div className="h-2.5 overflow-hidden rounded-full bg-slate-100">
                    <div className="h-full rounded-full bg-indigo-600" style={{ width: `${progressPercent}%` }} />
                  </div>
                </div>
              </div>
              <div className="space-y-4 rounded-lg border border-slate-100 bg-slate-50 p-4">
                <div className="flex items-start gap-3">
                  <DollarSign className="mt-0.5 h-4 w-4 text-slate-500" />
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Budget</p>
                    <p className="text-sm font-bold text-slate-950">${project.budget.toLocaleString()}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Calendar className="mt-0.5 h-4 w-4 text-slate-500" />
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Timeline</p>
                    <p className="text-xs font-semibold text-slate-700">{formatDate(project.startDate)}</p>
                    <p className="mt-0.5 text-xs font-semibold text-slate-500">to {formatDate(project.endDate)}</p>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          <div className="space-y-4">
            <div>
              <h2 className="text-lg font-bold text-slate-950">Sprints & Tasks</h2>
              <p className="mt-1 text-xs font-medium text-slate-500">Plan milestones, assign work, and update progress inside each sprint.</p>
            </div>
            <SprintList
              sprints={sprints}
              tasks={tasks}
              onEditSprint={(sprint) => {
                setEditingSprint(sprint);
                setModalMode("sprint");
              }}
              onDeleteSprint={handleDeleteSprint}
              onAddTask={(sprintId) => {
                setSelectedSprintId(sprintId);
                setModalMode("task");
              }}
              onEditTask={(task) => {
                setEditingTask(task);
                setModalMode("task");
              }}
              onDeleteTask={handleDeleteTask}
              onTaskStatusChange={handleTaskStatusChange}
            />
          </div>
        </div>
      )}

      {modalMode && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-xl bg-white p-6 shadow-xl">
            <div className="mb-5">
              <h3 className="text-lg font-bold text-slate-950">
                {modalMode === "sprint" ? (editingSprint ? "Edit Sprint" : "Add Sprint") : editingTask ? "Edit Task" : "Add Task"}
              </h3>
            </div>
            {modalMode === "sprint" ? (
              <SprintForm initialData={editingSprint} isLoading={isSaving} onSubmit={handleSprintSubmit} onCancel={closeModal} />
            ) : (
              <TaskForm
                projectId={id}
                sprints={sprints}
                users={users}
                initialData={editingTask}
                defaultSprintId={selectedSprintId}
                isLoading={isSaving}
                onSubmit={handleTaskSubmit}
                onCancel={closeModal}
              />
            )}
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}

export type { PageProps };
