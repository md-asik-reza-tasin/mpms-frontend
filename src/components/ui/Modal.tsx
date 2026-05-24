import React from "react";
import { cn } from "@/lib/utils";
import Card, { CardDescription, CardHeader, CardTitle } from "./Card";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
}

export default function Modal({ open, onClose, title, description, children, footer, className }: ModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4" onMouseDown={onClose}>
      <Card className={cn("max-h-[90vh] w-full max-w-2xl overflow-y-auto border-slate-200 bg-white", className)} onMouseDown={(event) => event.stopPropagation()}>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          {description && <CardDescription>{description}</CardDescription>}
        </CardHeader>
        {children}
        {footer && <div className="mt-5 border-t border-slate-100 pt-4">{footer}</div>}
      </Card>
    </div>
  );
}

export type { ModalProps };
