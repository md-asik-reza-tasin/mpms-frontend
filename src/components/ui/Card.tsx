import React, { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  className?: string;
}

function Card({ children, className, ...props }: CardProps) {
  return (
    <div className={cn("rounded-xl border border-slate-200/60 bg-white p-6 shadow-sm transition-all duration-200", className)} {...props}>
      {children}
    </div>
  );
}

function CardHeader({ children, className, ...props }: CardProps) {
  return (
    <div className={cn("mb-5 flex flex-col gap-1", className)} {...props}>
      {children}
    </div>
  );
}

function CardTitle({ children, className, ...props }: CardProps) {
  return (
    <h2 className={cn("text-base font-semibold text-slate-950", className)} {...props}>
      {children}
    </h2>
  );
}

function CardDescription({ children, className, ...props }: CardProps) {
  return (
    <p className={cn("text-sm text-slate-500", className)} {...props}>
      {children}
    </p>
  );
}

function CardContent({ children, className, ...props }: CardProps) {
  return (
    <div className={cn(className)} {...props}>
      {children}
    </div>
  );
}

function CardFooter({ children, className, ...props }: CardProps) {
  return (
    <div className={cn("mt-5 flex items-center justify-end gap-3 border-t border-slate-100 pt-4", className)} {...props}>
      {children}
    </div>
  );
}

export default Card;
export { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter };
export type { CardProps };
