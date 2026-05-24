import React, { TextareaHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, helperText, className, ...props }, ref) => (
    <div className="w-full">
      {label && <label className="mb-1.5 block text-sm font-medium text-slate-700">{label}</label>}
      <textarea
        ref={ref}
        className={cn(
          "w-full resize-none rounded-lg border px-3 py-2 text-sm text-slate-900 outline-none transition-all duration-200 placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20",
          error
            ? "border-rose-300 bg-rose-50/20 text-rose-900 placeholder:text-rose-300 focus:border-rose-500 focus:ring-rose-500/20"
            : "border-slate-300 hover:border-slate-400",
          className
        )}
        {...props}
      />
      {error ? (
        <p className="mt-1.5 text-xs font-medium text-rose-600">{error}</p>
      ) : helperText ? (
        <p className="mt-1.5 text-xs text-slate-500">{helperText}</p>
      ) : null}
    </div>
  )
);

Textarea.displayName = "Textarea";

export default Textarea;
export type { TextareaProps };
