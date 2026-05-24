"use client";

import React, { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import DashboardLayout from "@/components/layout/DashboardLayout";
import ProjectForm from "@/components/projects/ProjectForm";
import Card from "@/components/ui/Card";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import projectService from "@/services/projectService";
import { IProject } from "@/types";

interface EditPageProps {
  params: Promise<{ id: string }>;
}

export default function EditProjectPage({ params }: EditPageProps) {
  const { id } = use(params);
  const router = useRouter();
  const [project, setProject] = useState<IProject | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProject = async () => {
      setIsLoading(true);
      setError("");
      try {
        const data = await projectService.getProjectById(id);
        setProject(data);
      } catch (err: any) {
        console.error(err);
        setError("Failed to fetch project details. It might have been deleted.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchProject();
  }, [id]);

  const handleSubmit = async (data: Partial<IProject>) => {
    setIsSaving(true);
    setError("");
    try {
      await projectService.updateProject(id, data);
      router.push(`/projects/${id}`);
    } catch (err: any) {
      console.error(err);
      const msg = err.response?.data?.message || "Failed to update project. Please try again.";
      setError(msg);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <DashboardLayout allowedRoles={["Admin"]}>
      <div className="max-w-2xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-950">Edit Project</h1>
          <p className="text-xs text-slate-500 mt-1 font-medium">
            Update the project's settings, client details, and timeline.
          </p>
        </div>

        {error && (
          <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-rose-700 text-xs font-semibold animate-in fade-in-50">
            {error}
          </div>
        )}

        {isLoading ? (
          <div className="flex justify-center items-center py-24 bg-white rounded-xl border border-slate-200/60 shadow-xs">
            <LoadingSpinner size="lg" />
          </div>
        ) : (
          project && (
            <Card className="border-slate-200/80 bg-white">
              <ProjectForm
                initialData={project}
                onSubmit={handleSubmit}
                isLoading={isSaving}
                onCancel={() => router.push(`/projects/${id}`)}
              />
            </Card>
          )
        )}
      </div>
    </DashboardLayout>
  );
}
export type { EditPageProps };
