import React, { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";
import LoadingSpinner from "./LoadingSpinner";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger";
  size?: "sm" | "md" | "lg" | "icon";
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const variants = {
  primary: "bg-indigo-600 text-white shadow-sm hover:bg-indigo-700 focus:ring-indigo-500",
  secondary: "bg-slate-100 text-slate-800 hover:bg-slate-200 focus:ring-slate-500",
  outline: "border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 focus:ring-indigo-500",
  ghost: "text-slate-700 hover:bg-slate-100 focus:ring-slate-500",
  danger: "bg-rose-600 text-white shadow-sm hover:bg-rose-700 focus:ring-rose-500",
};

const sizes = {
  sm: "h-8 px-3 text-xs",
  md: "h-10 px-4 text-sm",
  lg: "h-11 px-5 text-base",
  icon: "h-9 w-9 p-0",
};

export default function Button({
  children,
  variant = "primary",
  size = "md",
  isLoading = false,
  leftIcon,
  rightIcon,
  className,
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      disabled={disabled || isLoading}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {isLoading ? <LoadingSpinner className="h-4 w-4 text-current" size="sm" /> : leftIcon}
      {children}
      {!isLoading && rightIcon}
    </button>
  );
}

export type { ButtonProps };
