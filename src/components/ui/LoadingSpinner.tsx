import React from "react";
import { cn } from "@/lib/utils";

interface LoadingSpinnerProps {
  className?: string;
  size?: "sm" | "md" | "lg";
}

const sizes = {
  sm: "h-4 w-4 border-2",
  md: "h-8 w-8 border-2",
  lg: "h-12 w-12 border-[3px]",
};

export default function LoadingSpinner({ className, size = "md" }: LoadingSpinnerProps) {
  return (
    <div className={cn("animate-spin rounded-full border-slate-200 border-t-indigo-600", sizes[size], className)} role="status">
      <span className="sr-only">Loading...</span>
    </div>
  );
}

export type { LoadingSpinnerProps };
