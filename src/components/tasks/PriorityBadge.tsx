"use client";

import Badge from "@/components/ui/Badge";
import { ITask } from "@/types";

const labels: Record<ITask["priority"], string> = {
  low: "Low",
  medium: "Medium",
  high: "High",
  urgent: "Urgent",
};

export default function PriorityBadge({ priority }: { priority: ITask["priority"] }) {
  const variant = priority === "urgent" ? "danger" : priority === "high" ? "warning" : priority === "medium" ? "info" : "neutral";
  return <Badge variant={variant}>{labels[priority] || priority}</Badge>;
}
