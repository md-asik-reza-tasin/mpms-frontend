"use client";

import React, { use, useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Calendar, Clock, Paperclip, UserRound } from "lucide-react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import CommentBox from "@/components/tasks/CommentBox";
import PriorityBadge from "@/components/tasks/PriorityBadge";
import StatusBadge from "@/components/tasks/StatusBadge";
import TimeLogForm from "@/components/tasks/TimeLogForm";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import Select from "@/components/ui/Select";
import { getUser } from "@/lib/auth";
import taskService from "@/services/taskService";
import { IActivityLog, IComment, IProject, ISprint, ITask, ITimeLog, IUser } from "@/types";

interface PageProps {
  params: Promise<{ id: string }>;
}

const getId = (value: string | { _id: string } | undefined) => (!value ? "" : typeof value === "string" ? value : value._id);
const formatDate = (date?: string) => (date ? new Date(date).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" }) : "N/A");
const userName = (value?: string | IUser) => (!value ? "Unknown" : typeof value === "string" ? value.slice(0, 8) : value.name || value.email);

export default function MyTaskDetailPage({ params }: PageProps) {
  const { id } = use(params);
  const [task, setTask] = useState<ITask | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [attachmentUrl, setAttachmentUrl] = useState("");
  const [attachmentName, setAttachmentName] = useState("");
  const user = getUser();

  const fetchTask = useCallback(async () => {
    setIsLoading(true);
    setError("");
    try {
      setTask(await taskService.getTaskById(id));
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to fetch task details.");
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchTask();
  }, [fetchTask]);

  const totalLogged = useMemo(() => task?.timeLogs?.reduce((sum, log) => sum + (Number(log.hours) || 0), 0) ?? 0, [task]);

  const updateStatus = async (status: ITask["status"]) => {
    if (!task) return;
    if (status === "done") return;
    setIsSaving(true);
    setSuccess("");
    try {
      const updated = await taskService.updateTaskStatus(task._id, status);
      setTask(updated);
      setSuccess("Task status updated.");
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to update status.");
    } finally {
      setIsSaving(false);
    }
  };

  const addComment = async (message: string) => {
    if (!task) return;
    setIsSaving(true);
    setSuccess("");
    try {
      setTask(await taskService.addComment(task._id, message));
      setSuccess("Comment added.");
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to add comment.");
    } finally {
      setIsSaving(false);
    }
  };

  const addTimeLog = async (data: { hours: number; note?: string; date?: string }) => {
    if (!task) return;
    setIsSaving(true);
    setSuccess("");
    try {
      setTask(await taskService.addTimeLog(task._id, data));
      setSuccess("Time log added.");
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to add time log.");
    } finally {
      setIsSaving(false);
    }
  };

  const addAttachment = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!task || !attachmentUrl.trim()) return;
    setIsSaving(true);
    setSuccess("");
    try {
      const updated = await taskService.updateTask(task._id, {
        attachments: [...(task.attachments || []), { url: attachmentUrl.trim(), name: attachmentName.trim() || undefined }],
      });
      setTask(updated);
      setAttachmentUrl("");
      setAttachmentName("");
      setSuccess("Attachment added.");
    } catch (err: any) {
      setError(err.response?.data?.message || "Attachment URL could not be saved by the backend.");
    } finally {
      setIsSaving(false);
    }
  };

  const projectTitle = task?.projectId && typeof task.projectId !== "string" ? (task.projectId as IProject).title : getId(task?.projectId).slice(0, 8);
  const sprintTitle = task?.sprintId && typeof task.sprintId !== "string" ? (task.sprintId as ISprint).title : getId(task?.sprintId).slice(0, 8);
  const progressPercent = task?.status === "done" ? 100 : task?.status === "review" ? 75 : task?.status === "in_progress" ? 45 : 10;

  return (
    <DashboardLayout allowedRoles={["Member"]}>
      {isLoading ? (
        <div className="flex items-center justify-center rounded-xl border border-slate-200/60 bg-white py-24 shadow-xs">
          <LoadingSpinner size="lg" />
        </div>
      ) : error && !task ? (
        <div className="space-y-4">
          <div className="rounded-lg border border-rose-200 bg-rose-50 p-4 text-xs font-semibold text-rose-700">{error}</div>
          <Link href="/my-tasks"><Button variant="outline">Back to My Tasks</Button></Link>
        </div>
      ) : task ? (
        <div className="space-y-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <Link href="/my-tasks" className="mb-3 inline-flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-slate-900">
                <ArrowLeft className="h-4 w-4" /> Back to My Tasks
              </Link>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-2xl font-bold text-slate-950">{task.title}</h1>
                <StatusBadge status={task.status} />
                <PriorityBadge priority={task.priority} />
              </div>
            </div>
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
              <Select
                aria-label="Update status"
                value={task.status}
                disabled={isSaving}
                onChange={(event) => updateStatus(event.target.value as ITask["status"])}
                options={[
                  { value: "todo", label: "To Do" },
                  { value: "in_progress", label: "In Progress" },
                  { value: "review", label: "Review" },
                ]}
              />
            </div>
          </div>

          {success && <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-xs font-semibold text-emerald-700">{success}</div>}
          {error && <div className="rounded-lg border border-rose-200 bg-rose-50 p-3 text-xs font-semibold text-rose-700">{error}</div>}
          {task.status === "review" && <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-xs font-semibold text-amber-700">Waiting for admin approval</div>}

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_340px]">
            <div className="space-y-6">
              <Card className="border-slate-200/80 bg-white">
                <h2 className="text-sm font-semibold text-slate-950">Details</h2>
                <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-slate-600">{task.description || "No description provided."}</p>
                <div className="mt-5">
                  <div className="mb-1 flex justify-between text-xs font-semibold text-slate-500">
                    <span>Progress</span>
                    <span>{progressPercent}%</span>
                  </div>
                  <div className="h-2.5 overflow-hidden rounded-full bg-slate-100">
                    <div className="h-full rounded-full bg-indigo-600" style={{ width: `${progressPercent}%` }} />
                  </div>
                </div>
              </Card>

              <Card className="border-slate-200/80 bg-white">
                <CommentBox isLoading={isSaving} onSubmit={addComment} />
                <List title="Comments" emptyText="No comments yet.">
                  {(task.comments || []).map((comment: IComment, index) => (
                    <div key={`${comment.createdAt}-${index}`} className="rounded-lg border border-slate-100 bg-slate-50 p-3">
                      <p className="text-xs text-slate-700">{comment.message}</p>
                      <p className="mt-2 text-[10px] font-semibold text-slate-400">{userName(comment.userId)} - {formatDate(comment.createdAt)}</p>
                    </div>
                  ))}
                </List>
              </Card>

              <Card className="border-slate-200/80 bg-white">
                <TimeLogForm isLoading={isSaving} onSubmit={addTimeLog} />
                <List title={`Time Logs (${totalLogged}h total)`} emptyText="No time logged yet.">
                  {(task.timeLogs || []).map((log: ITimeLog, index) => (
                    <div key={`${log.date}-${index}`} className="rounded-lg border border-slate-100 bg-slate-50 p-3">
                      <p className="text-xs font-bold text-slate-900">{log.hours}h</p>
                      {log.note && <p className="mt-1 text-xs text-slate-600">{log.note}</p>}
                      <p className="mt-2 text-[10px] font-semibold text-slate-400">{userName(log.userId)} - {formatDate(log.date)}</p>
                    </div>
                  ))}
                </List>
              </Card>
            </div>

            <div className="space-y-6">
              <Card className="border-slate-200/80 bg-white">
                <h2 className="text-sm font-semibold text-slate-950">Task Summary</h2>
                <div className="mt-4 space-y-3 text-xs text-slate-600">
                  <Info icon={<UserRound className="h-4 w-4" />} label="Project" value={projectTitle || "N/A"} />
                  <Info icon={<Calendar className="h-4 w-4" />} label="Sprint" value={sprintTitle || "Backlog"} />
                  <Info icon={<Calendar className="h-4 w-4" />} label="Due Date" value={formatDate(task.dueDate)} />
                  <Info icon={<Clock className="h-4 w-4" />} label="Estimate" value={`${task.estimateHours || 0}h`} />
                  <Info icon={<UserRound className="h-4 w-4" />} label="Assignees" value={task.assignees?.map((assignee) => userName(assignee)).join(", ") || "Unassigned"} />
                </div>
              </Card>

              <Card className="border-slate-200/80 bg-white">
                <h2 className="text-sm font-semibold text-slate-950">Attachments</h2>
                <div className="mt-4 space-y-2">
                  {task.attachments?.length ? task.attachments.map((attachment, index) => (
                    <a key={`${attachment.url}-${index}`} href={attachment.url} target="_blank" rel="noreferrer" className="flex items-center gap-2 rounded-lg border border-slate-200 p-3 text-xs font-semibold text-indigo-600 hover:bg-slate-50">
                      <Paperclip className="h-4 w-4" /> {attachment.name || attachment.url}
                    </a>
                  )) : <p className="text-xs font-medium text-slate-500">No attachments yet.</p>}
                </div>
                <form onSubmit={addAttachment} className="mt-4 space-y-3 border-t border-slate-100 pt-4">
                  <Input label="Attachment URL" value={attachmentUrl} onChange={(event) => setAttachmentUrl(event.target.value)} disabled={isSaving} />
                  <Input label="Attachment Name" value={attachmentName} onChange={(event) => setAttachmentName(event.target.value)} disabled={isSaving} />
                  <Button type="submit" variant="outline" isLoading={isSaving}>Add Attachment</Button>
                </form>
              </Card>

              <Card className="border-slate-200/80 bg-white">
                <List title="Activity Log" emptyText="No activity yet.">
                  {(task.activityLog || []).map((activity: IActivityLog, index) => (
                    <div key={`${activity.createdAt}-${index}`} className="rounded-lg border border-slate-100 bg-slate-50 p-3">
                      <p className="text-xs font-semibold text-slate-700">{activity.status}</p>
                      {activity.note && <p className="mt-1 text-xs text-slate-500">{activity.note}</p>}
                      <p className="mt-2 text-[10px] font-semibold text-slate-400">{userName(activity.userId)} - {formatDate(activity.createdAt)}</p>
                    </div>
                  ))}
                </List>
              </Card>
            </div>
          </div>
        </div>
      ) : null}
    </DashboardLayout>
  );
}

function Info({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-start gap-3">
      <span className="mt-0.5 text-slate-400">{icon}</span>
      <div>
        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{label}</p>
        <p className="mt-0.5 font-semibold text-slate-800">{value}</p>
      </div>
    </div>
  );
}

function List({ title, emptyText, children }: { title: string; emptyText: string; children: React.ReactNode[] }) {
  return (
    <div className="mt-5 space-y-3 border-t border-slate-100 pt-5">
      <h3 className="text-sm font-semibold text-slate-950">{title}</h3>
      {children.length ? children : <p className="text-xs font-medium text-slate-500">{emptyText}</p>}
    </div>
  );
}

export type { PageProps };
