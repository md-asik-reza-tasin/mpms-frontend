"use client";

import React from "react";
import Link from "next/link";
import { Eye, Pencil, Trash2 } from "lucide-react";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import EmptyState from "@/components/ui/EmptyState";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/Table";
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
        return "muted";
    }
  };

  const formatDate = (dateStr: string) => new Date(dateStr).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  if (projects.length === 0) {
    return <EmptyState title="No projects found" description="No projects match the current filters." />;
  }

  return (
    <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead className="px-6">Title</TableHead>
            <TableHead className="px-6">Client</TableHead>
            <TableHead className="px-6">Status</TableHead>
            <TableHead className="px-6">Progress</TableHead>
            <TableHead className="px-6">Budget</TableHead>
            <TableHead className="px-6">Timeline</TableHead>
            <TableHead className="px-6 text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="font-medium">
          {projects.map((project) => (
            <TableRow key={project._id}>
              <TableCell className="px-6">
                <Link href={`/projects/${project._id}`} className="text-xs font-bold text-indigo-600 hover:text-indigo-700 hover:underline">
                  {project.title}
                </Link>
                {project.description && (
                  <p className="mt-0.5 max-w-xs truncate text-[10px] font-normal text-slate-400">{project.description}</p>
                )}
              </TableCell>
              <TableCell className="px-6 text-slate-500">{project.client}</TableCell>
              <TableCell className="px-6">
                <Badge variant={getStatusVariant(project.status)}>{project.status}</Badge>
              </TableCell>
              <TableCell className="px-6">
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
              </TableCell>
              <TableCell className="px-6 font-semibold text-slate-900">${project.budget.toLocaleString()}</TableCell>
              <TableCell className="px-6 text-[10px] font-normal text-slate-400">
                {formatDate(project.startDate)} - {formatDate(project.endDate)}
              </TableCell>
              <TableCell className="px-6 text-right">
                <div className="flex items-center justify-end gap-1.5">
                  <Link href={`/projects/${project._id}`} title="View Details">
                    <Button type="button" variant="outline" size="icon"><Eye className="h-4 w-4" /></Button>
                  </Link>
                  <Link href={`/projects/${project._id}/edit`} title="Edit Project">
                    <Button type="button" variant="outline" size="icon"><Pencil className="h-4 w-4" /></Button>
                  </Link>
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    className="hover:border-rose-200 hover:bg-rose-50 hover:text-rose-700"
                    title="Delete Project"
                    onClick={() => onDelete(project._id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
    </Table>
  );
}

export type { ProjectTableProps };
