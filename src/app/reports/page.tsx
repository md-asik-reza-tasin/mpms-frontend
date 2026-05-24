"use client";

import React, { useEffect, useState } from "react";
import { Briefcase, CheckCircle2, CheckSquare, Clock, TrendingUp, Users } from "lucide-react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import Badge from "@/components/ui/Badge";
import Card from "@/components/ui/Card";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import PageHeader from "@/components/ui/PageHeader";
import Select from "@/components/ui/Select";
import { SectionTitle } from "@/components/ui/Typography";
import projectService from "@/services/projectService";
import reportService from "@/services/reportService";
import taskService from "@/services/taskService";
import userService from "@/services/userService";
import { IProject, IProjectReport, ITask, IUser, IUserReport } from "@/types";

const projectIdOf = (task: ITask) => (typeof task.projectId === "string" ? task.projectId : task.projectId?._id);

export default function ReportsPage() {
  const [projects, setProjects] = useState<IProject[]>([]);
  const [users, setUsers] = useState<IUser[]>([]);
  const [tasks, setTasks] = useState<ITask[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState("");
  const [selectedUserId, setSelectedUserId] = useState("");
  const [projectReport, setProjectReport] = useState<IProjectReport | null>(null);
  const [userReport, setUserReport] = useState<IUserReport | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isReportLoading, setIsReportLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError("");
      try {
        const [projectData, userData, taskData] = await Promise.all([
          projectService.getProjects(),
          userService.getUsers(),
          taskService.getTasks(),
        ]);
        setProjects(projectData);
        setUsers(userData);
        setTasks(taskData);
      } catch (err: any) {
        console.error(err);
        setError(err.response?.data?.message || "Failed to compile reports data.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleProjectReport = async (projectId: string) => {
    setSelectedProjectId(projectId);
    setProjectReport(null);
    if (!projectId) return;
    setIsReportLoading(true);
    try {
      setProjectReport(await reportService.getProjectReport(projectId));
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to fetch project report.");
    } finally {
      setIsReportLoading(false);
    }
  };

  const handleUserReport = async (userId: string) => {
    setSelectedUserId(userId);
    setUserReport(null);
    if (!userId) return;
    setIsReportLoading(true);
    try {
      setUserReport(await reportService.getUserReport(userId));
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to fetch user report.");
    } finally {
      setIsReportLoading(false);
    }
  };

  const getProjectCounts = (project: IProject) => {
    const relatedTasks = tasks.filter((task) => projectIdOf(task) === project._id);
    const totalTasks = project.totalTasks ?? relatedTasks.length;
    const completedTasks = project.completedTasks ?? relatedTasks.filter((task) => task.status === "done").length;
    const progressPercent = project.progressPercent ?? (totalTasks ? Math.round((completedTasks / totalTasks) * 100) : 0);
    return { totalTasks, completedTasks, progressPercent };
  };

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((task) => task.status === "done").length;
  const activeProjects = projects.filter((project) => project.status === "active").length;

  const metricCards = [
    { label: "Total Projects", value: projects.length, icon: Briefcase, className: "bg-indigo-50 text-indigo-600" },
    { label: "Active Projects", value: activeProjects, icon: TrendingUp, className: "bg-emerald-50 text-emerald-600" },
    { label: "Total Tasks", value: totalTasks, icon: CheckSquare, className: "bg-sky-50 text-sky-600" },
    { label: "Completed Tasks", value: completedTasks, icon: CheckCircle2, className: "bg-green-50 text-green-600" },
    { label: "Total Users", value: users.length, icon: Users, className: "bg-amber-50 text-amber-600" },
  ];

  return (
    <DashboardLayout allowedRoles={["Admin"]}>
      <div className="space-y-6">
        <PageHeader title="Reports" description="Project progress, team workload, and delivery summaries." />

        {isLoading ? (
          <div className="flex items-center justify-center rounded-xl border border-slate-200/60 bg-white py-24 shadow-sm">
            <LoadingSpinner size="lg" />
          </div>
        ) : error ? (
          <div className="rounded-lg border border-rose-200 bg-rose-50 p-4 text-xs font-semibold text-rose-700">{error}</div>
        ) : (
          <>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
              {metricCards.map((card) => {
                const Icon = card.icon;
                return (
                  <Card key={card.label} className="border-slate-200/80 bg-white">
                    <div className="flex items-center gap-4">
                      <div className={`rounded-xl p-3 ${card.className}`}><Icon className="h-5 w-5" /></div>
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{card.label}</p>
                        <p className="text-xl font-bold text-slate-950">{card.value}</p>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>

            <Card className="border-slate-200/80 bg-white">
              <SectionTitle className="mb-4 text-sm">Project Progress</SectionTitle>
              {projects.length === 0 ? (
                <p className="text-xs font-medium text-slate-500">No projects available to report.</p>
              ) : (
                <div className="space-y-5">
                  {projects.map((project) => {
                    const counts = getProjectCounts(project);
                    return (
                      <div key={project._id} className="border-b border-slate-100 pb-4 last:border-b-0 last:pb-0">
                        <div className="mb-2 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-bold text-slate-900">{project.title}</span>
                            <Badge variant={project.status === "completed" ? "success" : project.status === "active" ? "info" : "neutral"}>{project.status}</Badge>
                          </div>
                          <span className="text-xs font-semibold text-slate-500">
                            {counts.completedTasks}/{counts.totalTasks} tasks completed ({counts.progressPercent}%)
                          </span>
                        </div>
                        <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                          <div className="h-full rounded-full bg-indigo-600" style={{ width: `${counts.progressPercent}%` }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </Card>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              <Card className="border-slate-200/80 bg-white">
                <SectionTitle className="mb-4 text-sm">Project Report</SectionTitle>
                <Select
                  label="Select Project"
                  value={selectedProjectId}
                  onChange={(event) => handleProjectReport(event.target.value)}
                  options={[{ value: "", label: "Choose project" }, ...projects.map((project) => ({ value: project._id, label: project.title }))]}
                />
                {isReportLoading && selectedProjectId && <div className="mt-4"><LoadingSpinner size="sm" /></div>}
                {projectReport && (
                  <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
                    <ReportValue label="Percent Complete" value={`${projectReport.progressPercent}%`} />
                    <ReportValue label="Tasks Remaining" value={projectReport.remainingTasks} />
                    <ReportValue label="Time Logged" value={`${projectReport.totalTimeLogged}h`} icon={<Clock className="h-4 w-4" />} />
                  </div>
                )}
              </Card>

              <Card className="border-slate-200/80 bg-white">
                <SectionTitle className="mb-4 text-sm">User Report</SectionTitle>
                <Select
                  label="Select User"
                  value={selectedUserId}
                  onChange={(event) => handleUserReport(event.target.value)}
                  options={[{ value: "", label: "Choose user" }, ...users.map((user) => ({ value: user._id, label: user.name }))]}
                />
                {isReportLoading && selectedUserId && <div className="mt-4"><LoadingSpinner size="sm" /></div>}
                {userReport && (
                  <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
                    <ReportValue label="Percent Complete" value={`${userReport.assignedTasks ? Math.round((userReport.completedTasks / userReport.assignedTasks) * 100) : 0}%`} />
                    <ReportValue label="Tasks Remaining" value={userReport.pendingTasks} />
                    <ReportValue label="Time Logged" value={`${userReport.totalTimeLogged}h`} icon={<Clock className="h-4 w-4" />} />
                  </div>
                )}
              </Card>
            </div>
          </>
        )}
      </div>
    </DashboardLayout>
  );
}

function ReportValue({ label, value, icon }: { label: string; value: string | number; icon?: React.ReactNode }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
      <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
        {icon}
        {label}
      </div>
      <p className="mt-2 text-lg font-bold text-slate-950">{value}</p>
    </div>
  );
}
