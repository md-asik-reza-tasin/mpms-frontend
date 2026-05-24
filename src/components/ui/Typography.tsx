import React, { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type TextProps = HTMLAttributes<HTMLElement>;

export function PageTitle({ children, className, ...props }: TextProps) {
  return (
    <h1 className={cn("text-2xl font-bold tracking-tight text-slate-950", className)} {...props}>
      {children}
    </h1>
  );
}

export function PageSubtitle({ children, className, ...props }: TextProps) {
  return (
    <p className={cn("mt-1 text-sm text-slate-500", className)} {...props}>
      {children}
    </p>
  );
}

export function SectionTitle({ children, className, ...props }: TextProps) {
  return (
    <h2 className={cn("text-base font-semibold text-slate-950", className)} {...props}>
      {children}
    </h2>
  );
}

export function Text({ children, className, ...props }: TextProps) {
  return (
    <p className={cn("text-sm text-slate-700", className)} {...props}>
      {children}
    </p>
  );
}

export function MutedText({ children, className, ...props }: TextProps) {
  return (
    <p className={cn("text-sm text-slate-500", className)} {...props}>
      {children}
    </p>
  );
}
