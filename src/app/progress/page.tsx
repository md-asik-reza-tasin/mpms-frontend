"use client";

import React, { useEffect, useState } from "react";
import { CheckCircle2, CheckSquare, Clock, ListTodo } from "lucide-react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import Card from "@/components/ui/Card";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { getUser } from "@/lib/auth";
import reportService from "@/services/reportService";
import taskService from "@/services/taskService";
import { ITask, IUserReport } from "@/types";

const getId = (value: string | { _id: string } | undefined) => (!value ? "" : typeof value === "string" ? value : value._id);
const isAssignedToUser = (task: ITask, userId?: string) => !!userId && task.assignees?.some((assignee) => getId(assignee) === userId);

export default function ProgressPage() {
  const [report, setReport] = useState<IUserReport | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [usedFallback, setUsedFallback] = useState(false);
  const user = getUser();

  useEffect(() => {
    const fetchProgress = async () => {
      setIsLoading(true);
      setError("");
      try {
        if (!user?._id) throw new Error("Missing user");
        setReport(await reportService.getUserReport(user._id));
      } catch {
        try {
          const tasks = (await taskService.getTasks()).filter((task) => isAssignedToUser(task, user?._id));
          const completedTasks = tasks.filter((task) => task.status === "done").length;
          const totalTimeLogged = tasks.reduce((sum, task) => {
            return sum + (task.timeLogs || []).reduce((logSum, log) => logSum + (Number(log.hours) || 0), 0);
          }, 0);
          setReport({
            assignedTasks: tasks.length,
            completedTasks,
            pendingTasks: tasks.length - completedTasks,
            totalTimeLogged,
          });
          setUsedFallback(true);
        } catch (fallbackError: any) {
          setError(fallbackError.response?.data?.message || "Failed to load progress.");
        }
      } finally {
        setIsLoading(false);
      }
    };
    fetchProgress();
  }, []);

  const percent = report?.assignedTasks ? Math.round((report.completedTasks / report.assignedTasks) * 100) : 0;
  const cards = report ? [
    { label: "Assigned Tasks", value: report.assignedTasks, icon: CheckSquare, className: "bg-sky-50 text-sky-600" },
    { label: "Completed Tasks", value: report.completedTasks, icon: CheckCircle2, className: "bg-emerald-50 text-emerald-600" },
    { label: "Pending Tasks", value: report.pendingTasks, icon: ListTodo, className: "bg-amber-50 text-amber-600" },
    { label: "Total Time Logged", value: `${report.totalTimeLogged}h`, icon: Clock, className: "bg-indigo-50 text-indigo-600" },
  ] : [];

  return (
    <DashboardLayout allowedRoles={["Member"]}>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-950">Progress</h1>
          <p className="mt-1 text-xs font-medium text-slate-500">Your task completion and logged time summary.</p>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center rounded-xl border border-slate-200/60 bg-white py-24 shadow-xs">
            <LoadingSpinner size="lg" />
          </div>
        ) : error ? (
          <div className="rounded-lg border border-rose-200 bg-rose-50 p-4 text-xs font-semibold text-rose-700">{error}</div>
        ) : report ? (
          <>
            {usedFallback && <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-xs font-semibold text-amber-700">Report API unavailable. Showing calculated progress from tasks.</div>}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {cards.map((card) => {
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
              <div className="mb-2 flex justify-between text-sm font-semibold text-slate-700">
                <span>Overall Completion</span>
                <span>{percent}%</span>
              </div>
              <div className="h-3 overflow-hidden rounded-full bg-slate-100">
                <div className="h-full rounded-full bg-indigo-600" style={{ width: `${percent}%` }} />
              </div>
            </Card>
          </>
        ) : (
          <div className="rounded-xl border border-slate-200/60 bg-white p-8 text-center text-xs font-semibold text-slate-500">No progress data available.</div>
        )}
      </div>
    </DashboardLayout>
  );
}
