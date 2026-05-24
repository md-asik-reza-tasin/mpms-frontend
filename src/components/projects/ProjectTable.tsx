"use client";

import React from "react";
import Link from "next/link";
import { Eye, Pencil, Trash2 } from "lucide-react";
import Badge from "@/components/ui/Badge";
import { IProject } from "@/types";

interface ProjectTableProps {
  projects: IProject[];
  onDelete: (id: string) => void;
}

export default function ProjectTable({ projects, onDelete }: ProjectTableProps) {
  const getStatusVariant = (status: string) => {
    switch (status) {
      case "completed":
        return "success";
      case "active":
        return "info";
      case "planned":
        return "warning";
      default:
        return "neutral";
    }
  };

  const formatDate = (dateStr: string) => new Date(dateStr).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  if (projects.length === 0) {
    return (
      <div className="rounded-xl border border-slate-200/60 bg-white p-8 text-center">
        <p className="text-xs font-semibold text-slate-500">No projects found matching the criteria.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-slate-200/60 bg-white shadow-xs">
      <table className="w-full border-collapse text-left">
        <thead>
          <tr className="border-b border-slate-200/80 bg-slate-50/50 text-[10px] font-bold uppercase tracking-wider text-slate-500">
            <th className="px-6 py-4">Title</th>
            <th className="px-6 py-4">Client</th>
            <th className="px-6 py-4">Status</th>
            <th className="px-6 py-4">Progress</th>
            <th className="px-6 py-4">Budget</th>
            <th className="px-6 py-4">Timeline</th>
            <th className="px-6 py-4 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 text-xs font-medium text-slate-700">
          {projects.map((project) => (
            <tr key={project._id} className="transition-colors hover:bg-slate-50/50">
              <td className="px-6 py-4">
                <Link href={`/projects/${project._id}`} className="text-xs font-bold text-indigo-600 hover:text-indigo-700 hover:underline">
                  {project.title}
                </Link>
                {project.description && (
                  <p className="mt-0.5 max-w-xs truncate text-[10px] font-normal text-slate-400">{project.description}</p>
                )}
              </td>
              <td className="px-6 py-4 text-slate-500">{project.client}</td>
              <td className="px-6 py-4">
                <Badge variant={getStatusVariant(project.status)}>{project.status}</Badge>
              </td>
              <td className="px-6 py-4">
                {typeof project.progressPercent === "number" || typeof project.totalTasks === "number" ? (
                  <div className="min-w-[130px]">
                    <div className="mb-1 flex items-center justify-between text-[10px] font-semibold text-slate-500">
                      <span>{project.completedTasks ?? 0}/{project.totalTasks ?? 0} tasks</span>
                      <span>{project.progressPercent ?? 0}%</span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                      <div className="h-full rounded-full bg-indigo-600" style={{ width: `${project.progressPercent ?? 0}%` }} />
                    </div>
                  </div>
                ) : (
                  <span className="text-[10px] text-slate-400">No stats</span>
                )}
              </td>
              <td className="px-6 py-4 font-semibold text-slate-900">${project.budget.toLocaleString()}</td>
              <td className="px-6 py-4 text-[10px] font-normal text-slate-400">
                {formatDate(project.startDate)} - {formatDate(project.endDate)}
              </td>
              <td className="px-6 py-4 text-right">
                <div className="flex items-center justify-end gap-1.5">
                  <Link
                    href={`/projects/${project._id}`}
                    className="h-9 w-9 inline-flex items-center justify-center rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition"
                    title="View Details"
                  >
                    <Eye className="h-4 w-4" />
                  </Link>
                  <Link
                    href={`/projects/${project._id}/edit`}
                    className="h-9 w-9 inline-flex items-center justify-center rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition"
                    title="Edit Project"
                  >
                    <Pencil className="h-4 w-4" />
                  </Link>
                  <button
                    type="button"
                    className="h-9 w-9 inline-flex items-center justify-center rounded-lg border border-gray-200 text-gray-600 hover:text-red-600 hover:border-red-200 hover:bg-red-50 transition"
                    title="Delete Project"
                    onClick={() => onDelete(project._id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export type { ProjectTableProps };
