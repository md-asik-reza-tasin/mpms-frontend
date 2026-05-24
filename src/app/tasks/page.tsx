"use client";

import React, { useEffect, useMemo, useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import TaskForm from "@/components/tasks/TaskForm";
import TaskTable from "@/components/tasks/TaskTable";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import Select from "@/components/ui/Select";
import projectService from "@/services/projectService";
import sprintService from "@/services/sprintService";
import taskService from "@/services/taskService";
import userService from "@/services/userService";
import { IProject, ISprint, ITask, IUser, TaskFormData } from "@/types";

const getId = (value: string | { _id: string } | undefined) => (!value ? "" : typeof value === "string" ? value : value._id);

export default function TasksPage() {
  const [tasks, setTasks] = useState<ITask[]>([]);
  const [projects, setProjects] = useState<IProject[]>([]);
  const [sprints, setSprints] = useState<ISprint[]>([]);
  const [users, setUsers] = useState<IUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const [editingTask, setEditingTask] = useState<ITask | null>(null);
  const [search, setSearch] = useState("");
  const [projectFilter, setProjectFilter] = useState("all");
  const [sprintFilter, setSprintFilter] = useState("all");
  const [assigneeFilter, setAssigneeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");

  const fetchData = async () => {
    setIsLoading(true);
    setError("");
    try {
      const [taskData, projectData, userData] = await Promise.all([
        taskService.getTasks(),
        projectService.getProjects(),
        userService.getUsers().catch(() => []),
      ]);
      const sprintResults = await Promise.all(projectData.map((project) => sprintService.getSprints(project._id).catch(() => [])));
      setTasks(taskData);
      setProjects(projectData);
      setUsers(userData);
      setSprints(sprintResults.flat());
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to fetch tasks.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      const query = search.toLowerCase();
      const taskProjectId = getId(task.projectId);
      const taskSprintId = getId(task.sprintId);
      const assigneeIds = task.assignees.map((assignee) => getId(assignee));

      return (
        (!query || task.title.toLowerCase().includes(query) || task.description?.toLowerCase().includes(query)) &&
        (projectFilter === "all" || taskProjectId === projectFilter) &&
        (sprintFilter === "all" || taskSprintId === sprintFilter) &&
        (assigneeFilter === "all" || assigneeIds.includes(assigneeFilter)) &&
        (statusFilter === "all" || task.status === statusFilter) &&
        (priorityFilter === "all" || task.priority === priorityFilter)
      );
    });
  }, [assigneeFilter, priorityFilter, projectFilter, search, sprintFilter, statusFilter, tasks]);

  const handleSubmit = async (data: TaskFormData) => {
    if (!editingTask) return;
    setIsSaving(true);
    try {
      const updatedTask = await taskService.updateTask(editingTask._id, data);
      setTasks((current) => current.map((task) => (task._id === updatedTask._id ? updatedTask : task)));
      setEditingTask(null);
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to update task.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (taskId: string) => {
    if (!window.confirm("Delete this task?")) return;
    try {
      await taskService.deleteTask(taskId);
      setTasks((current) => current.filter((task) => task._id !== taskId));
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to delete task.");
    }
  };

  const handleStatusChange = async (taskId: string, status: ITask["status"]) => {
    try {
      const updatedTask = await taskService.updateTaskStatus(taskId, status);
      setTasks((current) => current.map((task) => (task._id === updatedTask._id ? updatedTask : task)));
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to update task status.");
    }
  };

  return (
    <DashboardLayout allowedRoles={["Admin", "Manager"]}>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-950">Tasks</h1>
          <p className="mt-1 text-xs font-medium text-slate-500">Monitor, filter, and manage all dashboard tasks.</p>
        </div>

        <Card className="border-slate-200/80 bg-white">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-6">
            <div className="md:col-span-2 lg:col-span-1">
              <Input label="Search" placeholder="Task title..." value={search} onChange={(event) => setSearch(event.target.value)} />
            </div>
            <Select label="Project" value={projectFilter} onChange={(event) => setProjectFilter(event.target.value)} options={[{ value: "all", label: "All Projects" }, ...projects.map((project) => ({ value: project._id, label: project.title }))]} />
            <Select label="Sprint" value={sprintFilter} onChange={(event) => setSprintFilter(event.target.value)} options={[{ value: "all", label: "All Sprints" }, ...sprints.map((sprint) => ({ value: sprint._id, label: sprint.title }))]} />
            <Select label="Assignee" value={assigneeFilter} onChange={(event) => setAssigneeFilter(event.target.value)} options={[{ value: "all", label: "All Assignees" }, ...users.map((user) => ({ value: user._id, label: user.name }))]} />
            <Select label="Status" value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)} options={[{ value: "all", label: "All Statuses" }, { value: "todo", label: "To Do" }, { value: "in_progress", label: "In Progress" }, { value: "review", label: "Review" }, { value: "done", label: "Done" }]} />
            <Select label="Priority" value={priorityFilter} onChange={(event) => setPriorityFilter(event.target.value)} options={[{ value: "all", label: "All Priorities" }, { value: "low", label: "Low" }, { value: "medium", label: "Medium" }, { value: "high", label: "High" }, { value: "urgent", label: "Urgent" }]} />
          </div>
        </Card>

        {isLoading ? (
          <div className="flex items-center justify-center rounded-xl border border-slate-200/60 bg-white py-24 shadow-xs">
            <LoadingSpinner size="lg" />
          </div>
        ) : error ? (
          <div className="rounded-lg border border-rose-200 bg-rose-50 p-4 text-xs font-semibold text-rose-700">{error}</div>
        ) : (
          <TaskTable tasks={filteredTasks} onEdit={setEditingTask} onDelete={handleDelete} onStatusChange={handleStatusChange} />
        )}
      </div>

      {editingTask && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-xl bg-white p-6 shadow-xl">
            <div className="mb-5 flex items-center justify-between gap-4">
              <h2 className="text-lg font-bold text-slate-950">Edit Task</h2>
              <Button type="button" variant="outline" onClick={() => setEditingTask(null)}>Close</Button>
            </div>
            <TaskForm
              projectId={getId(editingTask.projectId)}
              sprints={sprints}
              users={users}
              initialData={editingTask}
              isLoading={isSaving}
              onSubmit={handleSubmit}
              onCancel={() => setEditingTask(null)}
            />
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
