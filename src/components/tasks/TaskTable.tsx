"use client";

import { Pencil, Trash2 } from "lucide-react";
import Button from "@/components/ui/Button";
import PriorityBadge from "@/components/tasks/PriorityBadge";
import StatusBadge from "@/components/tasks/StatusBadge";
import { formatTaskDate, getAssigneeNames } from "@/components/tasks/TaskCard";
import { IProject, ISprint, ITask } from "@/types";

interface TaskTableProps {
  tasks: ITask[];
  onEdit?: (task: ITask) => void;
  onDelete?: (id: string) => void;
  onStatusChange?: (id: string, status: ITask["status"]) => void;
}

const getTitle = (value: string | IProject | ISprint | undefined, fallback: string) => {
  if (!value) return fallback;
  if (typeof value === "string") return value.slice(0, 8);
  return "title" in value ? value.title : fallback;
};

export default function TaskTable({ tasks, onEdit, onDelete, onStatusChange }: TaskTableProps) {
  if (tasks.length === 0) {
    return <div className="rounded-xl border border-slate-200 bg-white p-8 text-center text-xs font-semibold text-slate-500">No tasks found.</div>;
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
      <table className="w-full text-left">
        <thead className="border-b border-slate-200 bg-slate-50 text-[10px] font-bold uppercase text-slate-500">
          <tr>
            <th className="px-5 py-4">Title</th>
            <th className="px-5 py-4">Project</th>
            <th className="px-5 py-4">Sprint</th>
            <th className="px-5 py-4">Assignee(s)</th>
            <th className="px-5 py-4">Estimate</th>
            <th className="px-5 py-4">Priority</th>
            <th className="px-5 py-4">Status</th>
            <th className="px-5 py-4">Due Date</th>
            <th className="px-5 py-4 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
          {tasks.map((task) => (
            <tr key={task._id} className="hover:bg-slate-50">
              <td className="px-5 py-4 font-bold text-slate-950">{task.title}</td>
              <td className="px-5 py-4">{getTitle(task.projectId, "N/A")}</td>
              <td className="px-5 py-4">{getTitle(task.sprintId, "Backlog")}</td>
              <td className="max-w-[180px] truncate px-5 py-4" title={getAssigneeNames(task)}>{getAssigneeNames(task)}</td>
              <td className="px-5 py-4">{task.estimateHours || 0}h</td>
              <td className="px-5 py-4"><PriorityBadge priority={task.priority} /></td>
              <td className="px-5 py-4"><StatusBadge status={task.status} /></td>
              <td className="px-5 py-4">{formatTaskDate(task.dueDate)}</td>
              <td className="px-5 py-4 text-right">
                <div className="flex justify-end gap-2">
                  {onEdit && (
                    <Button type="button" variant="outline" size="sm" className="h-9 w-9 p-0" onClick={() => onEdit(task)} title="Edit task">
                      <Pencil className="h-4 w-4" />
                    </Button>
                  )}
                  {onStatusChange && task.status === "review" && (
                    <Button type="button" size="sm" onClick={() => onStatusChange(task._id, "done")}>
                      Approve
                    </Button>
                  )}
                  {onDelete && (
                    <Button type="button" variant="outline" size="sm" className="h-9 w-9 p-0 hover:border-red-200 hover:bg-red-50 hover:text-red-600" onClick={() => onDelete(task._id)} title="Delete task">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
