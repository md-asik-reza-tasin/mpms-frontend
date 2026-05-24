"use client";

import { Pencil, Trash2 } from "lucide-react";
import Button from "@/components/ui/Button";
import EmptyState from "@/components/ui/EmptyState";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/Table";
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
    return <EmptyState title="No tasks found" description="No tasks match the current filters." />;
  }

  return (
    <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead>Title</TableHead>
            <TableHead>Project</TableHead>
            <TableHead>Sprint</TableHead>
            <TableHead>Assignee(s)</TableHead>
            <TableHead>Estimate</TableHead>
            <TableHead>Priority</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Due Date</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tasks.map((task) => (
            <TableRow key={task._id}>
              <TableCell className="font-bold text-slate-950">{task.title}</TableCell>
              <TableCell>{getTitle(task.projectId, "N/A")}</TableCell>
              <TableCell>{getTitle(task.sprintId, "Backlog")}</TableCell>
              <TableCell className="max-w-[180px] truncate" title={getAssigneeNames(task)}>{getAssigneeNames(task)}</TableCell>
              <TableCell>{task.estimateHours || 0}h</TableCell>
              <TableCell><PriorityBadge priority={task.priority} /></TableCell>
              <TableCell><StatusBadge status={task.status} /></TableCell>
              <TableCell>{formatTaskDate(task.dueDate)}</TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  {onEdit && (
                    <Button type="button" variant="outline" size="icon" onClick={() => onEdit(task)} title="Edit task">
                      <Pencil className="h-4 w-4" />
                    </Button>
                  )}
                  {onStatusChange && task.status === "review" && (
                    <Button type="button" size="sm" onClick={() => onStatusChange(task._id, "done")}>
                      Approve as Done
                    </Button>
                  )}
                  {onDelete && (
                    <Button type="button" variant="outline" size="icon" className="hover:border-rose-200 hover:bg-rose-50 hover:text-rose-700" onClick={() => onDelete(task._id)} title="Delete task">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
    </Table>
  );
}
