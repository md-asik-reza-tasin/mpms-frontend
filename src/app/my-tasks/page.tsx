"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Eye } from "lucide-react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import PriorityBadge from "@/components/tasks/PriorityBadge";
import StatusBadge from "@/components/tasks/StatusBadge";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import Select from "@/components/ui/Select";
import { getUser } from "@/lib/auth";
import taskService from "@/services/taskService";
import { IProject, ISprint, ITask, IUser } from "@/types";

const getId = (value: string | { _id: string } | undefined) => (!value ? "" : typeof value === "string" ? value : value._id);
const formatDate = (date?: string) => (date ? new Date(date).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" }) : "No due date");

const isAssignedToUser = (task: ITask, userId?: string) => {
  if (!userId) return false;
  return task.assignees?.some((assignee) => getId(assignee) === userId);
};

const projectName = (task: ITask) => {
  if (!task.projectId) return "N/A";
  return typeof task.projectId === "string" ? task.projectId.slice(0, 8) : (task.projectId as IProject).title;
};

const sprintName = (task: ITask) => {
  if (!task.sprintId) return "Backlog";
  return typeof task.sprintId === "string" ? task.sprintId.slice(0, 8) : (task.sprintId as ISprint).title;
};

export default function MyTasksPage() {
  const [tasks, setTasks] = useState<ITask[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const user = getUser();

  const fetchTasks = async () => {
    setIsLoading(true);
    setError("");
    try {
      const data = await taskService.getTasks();
      setTasks(data.filter((task) => isAssignedToUser(task, user?._id)));
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to fetch your tasks.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => (
      (statusFilter === "all" || task.status === statusFilter) &&
      (priorityFilter === "all" || task.priority === priorityFilter)
    ));
  }, [priorityFilter, statusFilter, tasks]);

  const canChooseStatus = (status: ITask["status"]) => status !== "done";

  const updateStatus = async (task: ITask, status: ITask["status"]) => {
    if (!canChooseStatus(status)) return;
    setUpdatingId(task._id);
    setSuccess("");
    try {
      await taskService.updateTaskStatus(task._id, status);
      await fetchTasks();
      setSuccess("Task status updated.");
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to update task status.");
    } finally {
      setUpdatingId("");
    }
  };

  return (
    <DashboardLayout allowedRoles={["Member"]}>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-950">My Tasks</h1>
          <p className="mt-1 text-xs font-medium text-slate-500">Track assigned work, update progress, and submit work for review.</p>
        </div>

        {success && <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-xs font-semibold text-emerald-700">{success}</div>}
        {error && <div className="rounded-lg border border-rose-200 bg-rose-50 p-3 text-xs font-semibold text-rose-700">{error}</div>}

        <Card className="border-slate-200/80 bg-white">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Select label="Status" value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)} options={[{ value: "all", label: "All Statuses" }, { value: "todo", label: "To Do" }, { value: "in_progress", label: "In Progress" }, { value: "review", label: "Review" }, { value: "done", label: "Done" }]} />
            <Select label="Priority" value={priorityFilter} onChange={(event) => setPriorityFilter(event.target.value)} options={[{ value: "all", label: "All Priorities" }, { value: "low", label: "Low" }, { value: "medium", label: "Medium" }, { value: "high", label: "High" }, { value: "urgent", label: "Urgent" }]} />
          </div>
        </Card>

        {isLoading ? (
          <div className="flex items-center justify-center rounded-xl border border-slate-200/60 bg-white py-24 shadow-xs">
            <LoadingSpinner size="lg" />
          </div>
        ) : filteredTasks.length === 0 ? (
          <div className="rounded-xl border border-slate-200/60 bg-white p-8 text-center text-xs font-semibold text-slate-500">No tasks found.</div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {filteredTasks.map((task) => (
              <Card key={task._id} className="border-slate-200/80 bg-white">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="text-base font-bold text-slate-950">{task.title}</h2>
                      <StatusBadge status={task.status} />
                      <PriorityBadge priority={task.priority} />
                    </div>
                    <div className="mt-3 grid grid-cols-1 gap-2 text-xs text-slate-500 sm:grid-cols-2 lg:grid-cols-4">
                      <span>Project: <strong className="text-slate-700">{projectName(task)}</strong></span>
                      <span>Sprint: <strong className="text-slate-700">{sprintName(task)}</strong></span>
                      <span>Due: <strong className="text-slate-700">{formatDate(task.dueDate)}</strong></span>
                      <span>Estimate: <strong className="text-slate-700">{task.estimateHours || 0}h</strong></span>
                    </div>
                    {task.status === "review" && (
                      <p className="mt-3 text-xs font-semibold text-amber-700">Waiting for admin approval</p>
                    )}
                  </div>
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                    <Select
                      aria-label="Quick status update"
                      className="h-9 py-1"
                      value={task.status}
                      disabled={updatingId === task._id}
                      onChange={(event) => updateStatus(task, event.target.value as ITask["status"])}
                      options={[
                        { value: "todo", label: "To Do" },
                        { value: "in_progress", label: "In Progress" },
                        { value: "review", label: "Review" },
                      ]}
                    />
                    <Link href={`/my-tasks/${task._id}`}>
                      <Button type="button" variant="outline" size="sm" className="flex w-full items-center gap-2 sm:w-auto">
                        <Eye className="h-4 w-4" /> View Details
                      </Button>
                    </Link>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
