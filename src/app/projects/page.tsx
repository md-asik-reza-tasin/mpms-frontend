"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Plus } from "lucide-react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import ProjectTable from "@/components/projects/ProjectTable";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import projectService from "@/services/projectService";
import { IProject } from "@/types";

export default function ProjectsPage() {
  const [projects, setProjects] = useState<IProject[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<IProject[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  // Filters state
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [clientFilter, setClientFilter] = useState("all");

  const fetchProjects = async () => {
    setIsLoading(true);
    setError("");
    try {
      const data = await projectService.getProjects();
      setProjects(data);
      setFilteredProjects(data);
    } catch (err: any) {
      console.error(err);
      setError("Failed to fetch projects. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  // Filter effect
  useEffect(() => {
    let result = [...projects];

    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.client.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q)
      );
    }

    if (statusFilter !== "all") {
      result = result.filter((p) => p.status === statusFilter);
    }

    if (clientFilter !== "all") {
      result = result.filter((p) => p.client === clientFilter);
    }

    setFilteredProjects(result);
  }, [search, statusFilter, clientFilter, projects]);

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this project? This will delete all associated data.")) {
      return;
    }

    try {
      await projectService.deleteProject(id);
      setProjects(projects.filter((p) => p._id !== id));
    } catch (err) {
      console.error(err);
      alert("Failed to delete project. Please try again.");
    }
  };

  const statusFilterOptions = [
    { value: "all", label: "All Statuses" },
    { value: "planned", label: "Planned" },
    { value: "active", label: "Active" },
    { value: "completed", label: "Completed" },
    { value: "archived", label: "Archived" },
  ];

  const clientFilterOptions = [
    { value: "all", label: "All Clients" },
    ...Array.from(new Set(projects.map((project) => project.client).filter(Boolean))).map((client) => ({
      value: client,
      label: client,
    })),
  ];

  return (
    <DashboardLayout allowedRoles={["Admin"]}>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-950">Projects</h1>
            <p className="text-xs text-slate-500 mt-1 font-medium">
              Manage and track your active clients and system projects.
            </p>
          </div>
          <Link href="/projects/new">
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              New Project
            </Button>
          </Link>
        </div>

        {/* Filter bar */}
        <Card className="p-4 border-slate-200/80">
          <div className="flex flex-col md:flex-row gap-4 items-end">
            <div className="flex-1 w-full">
              <Input
                label="Search Projects"
                placeholder="Search by title, client, or description..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className="w-full md:w-48">
              <Select
                label="Filter by Status"
                options={statusFilterOptions}
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              />
            </div>
            <div className="w-full md:w-48">
              <Select
                label="Filter by Client"
                options={clientFilterOptions}
                value={clientFilter}
                onChange={(e) => setClientFilter(e.target.value)}
              />
            </div>
          </div>
        </Card>

        {/* Table / Error / Loading view */}
        {isLoading ? (
          <div className="flex justify-center items-center py-24 bg-white rounded-xl border border-slate-200/60 shadow-xs">
            <LoadingSpinner size="lg" />
          </div>
        ) : error ? (
          <div className="p-4 bg-rose-50 border border-rose-200 rounded-lg text-rose-700 text-xs font-semibold">
            {error}
          </div>
        ) : (
          <ProjectTable projects={filteredProjects} onDelete={handleDelete} />
        )}
      </div>
    </DashboardLayout>
  );
}
