import React, { HTMLAttributes } from "react";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  className?: string;
}

export default function Card({ children, className = "", ...props }: CardProps) {
  return (
    <div
      className={`bg-white border border-slate-200/60 rounded-xl shadow-sm p-6 hover:shadow-md/5 transition-all duration-200 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
export type { CardProps };
