"use client";

import React, { useEffect, useState } from "react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import Textarea from "@/components/ui/Textarea";
import { ISprint, ITask, IUser, TaskFormData } from "@/types";

interface TaskFormProps {
  projectId: string;
  sprints: ISprint[];
  users?: IUser[];
  initialData?: ITask | null;
  defaultSprintId?: string;
  isLoading?: boolean;
  onSubmit: (data: TaskFormData) => void;
  onCancel: () => void;
}

const getId = (value: string | { _id: string } | null | undefined) => {
  if (!value) return "";
  return typeof value === "string" ? value : value._id;
};

export default function TaskForm({
  projectId,
  sprints,
  users = [],
  initialData,
  defaultSprintId,
  isLoading = false,
  onSubmit,
  onCancel,
}: TaskFormProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [sprintId, setSprintId] = useState(defaultSprintId || "");
  const [assignees, setAssignees] = useState("");
  const [estimateHours, setEstimateHours] = useState(0);
  const [priority, setPriority] = useState<ITask["priority"]>("medium");
  const [status, setStatus] = useState<ITask["status"]>("todo");
  const [dueDate, setDueDate] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!initialData) {
      setSprintId(defaultSprintId || sprints[0]?._id || "");
      return;
    }
    setTitle(initialData.title || "");
    setDescription(initialData.description || "");
    setSprintId(getId(initialData.sprintId));
    setAssignees((initialData.assignees || []).map((item) => getId(item)).filter(Boolean).join(", "));
    setEstimateHours(initialData.estimateHours || 0);
    setPriority(initialData.priority || "medium");
    setStatus(initialData.status || "todo");
    setDueDate(initialData.dueDate ? new Date(initialData.dueDate).toISOString().split("T")[0] : "");
  }, [defaultSprintId, initialData, sprints]);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!title.trim() || !sprintId || !dueDate) {
      setError("Title, sprint, and due date are required.");
      return;
    }
    setError("");
    onSubmit({
      projectId,
      sprintId,
      title: title.trim(),
      description: description.trim(),
      assignees: assignees.split(",").map((item) => item.trim()).filter(Boolean),
      estimateHours: Number(estimateHours),
      priority,
      status,
      dueDate: new Date(dueDate).toISOString(),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <div className="rounded-lg border border-rose-200 bg-rose-50 p-3 text-xs font-semibold text-rose-700">{error}</div>}
      <Input label="Task Title *" value={title} onChange={(event) => setTitle(event.target.value)} disabled={isLoading} />
      <Textarea label="Description" rows={3} value={description} onChange={(event) => setDescription(event.target.value)} disabled={isLoading} />
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Select
          label="Sprint *"
          value={sprintId}
          onChange={(event) => setSprintId(event.target.value)}
          disabled={isLoading}
          options={[
            { value: "", label: "Select sprint" },
            ...sprints.map((sprint) => ({ value: sprint._id, label: `Sprint ${sprint.sprintNumber || "-"}: ${sprint.title}` })),
          ]}
        />
        <Input
          label="Assignees"
          placeholder={users.length ? "Comma-separated user IDs" : "Comma-separated user IDs"}
          value={assignees}
          onChange={(event) => setAssignees(event.target.value)}
          disabled={isLoading}
          list="task-assignees"
        />
        <datalist id="task-assignees">
          {users.map((user) => (
            <option key={user._id} value={user._id}>{user.name}</option>
          ))}
        </datalist>
        <Input label="Estimate Hours" type="number" min={0} value={estimateHours || ""} onChange={(event) => setEstimateHours(Number(event.target.value))} disabled={isLoading} />
        <Input label="Due Date *" type="date" value={dueDate} onChange={(event) => setDueDate(event.target.value)} disabled={isLoading} />
        <Select
          label="Priority"
          value={priority}
          onChange={(event) => setPriority(event.target.value as ITask["priority"])}
          disabled={isLoading}
          options={[
            { value: "low", label: "Low" },
            { value: "medium", label: "Medium" },
            { value: "high", label: "High" },
            { value: "urgent", label: "Urgent" },
          ]}
        />
        <Select
          label="Status"
          value={status}
          onChange={(event) => setStatus(event.target.value as ITask["status"])}
          disabled={isLoading}
          options={[
            { value: "todo", label: "To Do" },
            { value: "in_progress", label: "In Progress" },
            { value: "review", label: "Review" },
            { value: "done", label: "Done" },
          ]}
        />
      </div>
      <div className="flex justify-end gap-3 border-t border-slate-100 pt-4">
        <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>Cancel</Button>
        <Button type="submit" isLoading={isLoading}>{initialData ? "Save Task" : "Add Task"}</Button>
      </div>
    </form>
  );
}
