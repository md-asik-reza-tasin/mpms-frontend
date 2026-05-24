"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import DashboardLayout from "@/components/layout/DashboardLayout";
import ProjectForm from "@/components/projects/ProjectForm";
import Card from "@/components/ui/Card";
import projectService from "@/services/projectService";
import { IProject } from "@/types";

export default function NewProjectPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (data: Partial<IProject>) => {
    setIsLoading(true);
    setError("");
    try {
      await projectService.createProject(data);
      router.push("/projects");
    } catch (err: any) {
      console.error(err);
      const msg = err.response?.data?.message || "Failed to create project. Please try again.";
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <DashboardLayout allowedRoles={["Admin"]}>
      <div className="max-w-2xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-950">Create New Project</h1>
          <p className="text-xs text-slate-500 mt-1 font-medium">
            Setup a new project environment for your team.
          </p>
        </div>

        {error && (
          <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-rose-700 text-xs font-semibold animate-in fade-in-50">
            {error}
          </div>
        )}

        <Card className="border-slate-200/80 bg-white">
          <ProjectForm
            onSubmit={handleSubmit}
            isLoading={isLoading}
            onCancel={() => router.push("/projects")}
          />
        </Card>
      </div>
    </DashboardLayout>
  );
}
