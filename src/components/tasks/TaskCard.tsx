"use client";

import { Pencil, Trash2 } from "lucide-react";
import Button from "@/components/ui/Button";
import Select from "@/components/ui/Select";
import PriorityBadge from "@/components/tasks/PriorityBadge";
import StatusBadge from "@/components/tasks/StatusBadge";
import { ITask, IUser } from "@/types";

interface TaskCardProps {
  task: ITask;
  onEdit?: (task: ITask) => void;
  onDelete?: (id: string) => void;
  onStatusChange?: (id: string, status: ITask["status"]) => void;
}

const shortId = (id: string) => `${id.slice(0, 6)}...`;

export const getAssigneeNames = (task: ITask) => {
  if (!task.assignees?.length) return "Unassigned";
  return task.assignees
    .map((assignee) => {
      if (typeof assignee === "string") return shortId(assignee);
      return (assignee as IUser).name || shortId((assignee as IUser)._id);
    })
    .join(", ");
};

export const formatTaskDate = (date?: string) => {
  if (!date) return "No due date";
  return new Date(date).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
};

export default function TaskCard({ task, onEdit, onDelete, onStatusChange }: TaskCardProps) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4">
      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div className="min-w-0 flex-1">
          <h4 className="text-sm font-bold text-slate-950">{task.title}</h4>
          {task.description && <p className="mt-1 line-clamp-2 text-xs leading-5 text-slate-500">{task.description}</p>}
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <PriorityBadge priority={task.priority} />
            <StatusBadge status={task.status} />
            <span className="text-xs font-semibold text-slate-500">{task.estimateHours || 0}h</span>
            <span className="text-xs text-slate-400">{formatTaskDate(task.dueDate)}</span>
          </div>
          <p className="mt-2 text-xs text-slate-500">Assignees: {getAssigneeNames(task)}</p>
        </div>
        <div className="flex items-center gap-2">
          {onStatusChange && (
            <Select
              aria-label="Task status"
              className="h-9 py-1 text-xs"
              value={task.status}
              onChange={(event) => onStatusChange(task._id, event.target.value as ITask["status"])}
              options={[
                { value: "todo", label: "To Do" },
                { value: "in_progress", label: "In Progress" },
                { value: "review", label: "Review" },
                { value: "done", label: "Done" },
              ]}
            />
          )}
          {onEdit && (
            <Button type="button" variant="outline" size="sm" className="h-9 w-9 p-0" onClick={() => onEdit(task)} title="Edit task">
              <Pencil className="h-4 w-4" />
            </Button>
          )}
          {onDelete && (
            <Button type="button" variant="outline" size="sm" className="h-9 w-9 p-0 hover:border-red-200 hover:bg-red-50 hover:text-red-600" onClick={() => onDelete(task._id)} title="Delete task">
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
