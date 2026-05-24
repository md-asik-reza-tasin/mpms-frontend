"use client";

import React, { useState } from "react";
import { ChevronDown, ChevronRight, Pencil, Trash2 } from "lucide-react";
import Button from "@/components/ui/Button";
import TaskCard from "@/components/tasks/TaskCard";
import { ISprint, ITask } from "@/types";

interface SprintListProps {
  sprints: ISprint[];
  tasks: ITask[];
  onEditSprint: (sprint: ISprint) => void;
  onDeleteSprint: (id: string) => void;
  onAddTask: (sprintId: string) => void;
  onEditTask: (task: ITask) => void;
  onDeleteTask: (id: string) => void;
  onTaskStatusChange: (id: string, status: ITask["status"]) => void;
}

const formatDate = (date: string) => new Date(date).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });

const sprintIdOf = (task: ITask) => (typeof task.sprintId === "string" ? task.sprintId : task.sprintId?._id);

export default function SprintList({
  sprints,
  tasks,
  onEditSprint,
  onDeleteSprint,
  onAddTask,
  onEditTask,
  onDeleteTask,
  onTaskStatusChange,
}: SprintListProps) {
  const [openSprintIds, setOpenSprintIds] = useState<string[]>(sprints.map((sprint) => sprint._id));

  if (sprints.length === 0) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-8 text-center">
        <p className="text-sm font-semibold text-slate-700">No sprints yet.</p>
        <p className="mt-1 text-xs text-slate-500">Add a sprint to start planning tasks for this project.</p>
      </div>
    );
  }

  const toggleSprint = (id: string) => {
    setOpenSprintIds((current) => (current.includes(id) ? current.filter((item) => item !== id) : [...current, id]));
  };

  return (
    <div className="space-y-4">
      {sprints.map((sprint) => {
        const sprintTasks = tasks.filter((task) => sprintIdOf(task) === sprint._id);
        const isOpen = openSprintIds.includes(sprint._id);

        return (
          <section key={sprint._id} className="rounded-xl border border-slate-200 bg-white">
            <div className="flex flex-col gap-3 border-b border-slate-100 p-4 md:flex-row md:items-center md:justify-between">
              <button type="button" className="flex min-w-0 items-start gap-3 text-left" onClick={() => toggleSprint(sprint._id)}>
                <span className="mt-0.5 text-slate-500">{isOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}</span>
                <span>
                  <span className="block text-sm font-bold text-slate-950">Sprint {sprint.sprintNumber || "-"}: {sprint.title}</span>
                  <span className="mt-1 block text-xs text-slate-500">
                    {formatDate(sprint.startDate)} to {formatDate(sprint.endDate)}
                    {typeof sprint.order === "number" ? ` | Order ${sprint.order}` : ""}
                    {` | ${sprintTasks.length} task${sprintTasks.length === 1 ? "" : "s"}`}
                  </span>
                </span>
              </button>
              <div className="flex items-center gap-2">
                <Button type="button" variant="secondary" size="sm" onClick={() => onAddTask(sprint._id)}>Add Task</Button>
                <Button type="button" variant="outline" size="sm" className="h-9 w-9 p-0" onClick={() => onEditSprint(sprint)} title="Edit sprint">
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button type="button" variant="outline" size="sm" className="h-9 w-9 p-0 hover:border-red-200 hover:bg-red-50 hover:text-red-600" onClick={() => onDeleteSprint(sprint._id)} title="Delete sprint">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
            {isOpen && (
              <div className="space-y-3 bg-slate-50/50 p-4">
                {sprintTasks.length === 0 ? (
                  <div className="rounded-lg border border-dashed border-slate-200 bg-white p-6 text-center text-xs font-semibold text-slate-500">No tasks in this sprint.</div>
                ) : (
                  sprintTasks.map((task) => (
                    <TaskCard
                      key={task._id}
                      task={task}
                      onEdit={onEditTask}
                      onDelete={onDeleteTask}
                      onStatusChange={onTaskStatusChange}
                    />
                  ))
                )}
              </div>
            )}
          </section>
        );
      })}
    </div>
  );
}
