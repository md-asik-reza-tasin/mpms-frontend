"use client";

import Badge from "@/components/ui/Badge";
import { ITask } from "@/types";

const labels: Record<ITask["status"], string> = {
  todo: "To Do",
  in_progress: "In Progress",
  review: "Review",
  done: "Done",
};

export default function StatusBadge({ status }: { status: ITask["status"] }) {
  const variant = status === "done" ? "success" : status === "review" ? "warning" : status === "in_progress" ? "info" : "neutral";
  return <Badge variant={variant}>{labels[status] || status}</Badge>;
}
