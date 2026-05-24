import React, { HTMLAttributes, TdHTMLAttributes, ThHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

function Table({ children, className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm", className)} {...props}>
      <table className="w-full text-left">{children}</table>
    </div>
  );
}

function TableHeader({ children, className, ...props }: HTMLAttributes<HTMLTableSectionElement>) {
  return (
    <thead className={cn("border-b border-slate-200 bg-slate-50 text-[10px] font-bold uppercase text-slate-500", className)} {...props}>
      {children}
    </thead>
  );
}

function TableBody({ children, className, ...props }: HTMLAttributes<HTMLTableSectionElement>) {
  return (
    <tbody className={cn("divide-y divide-slate-100 text-xs text-slate-700", className)} {...props}>
      {children}
    </tbody>
  );
}

function TableRow({ children, className, ...props }: HTMLAttributes<HTMLTableRowElement>) {
  return (
    <tr className={cn("hover:bg-slate-50", className)} {...props}>
      {children}
    </tr>
  );
}

function TableHead({ children, className, ...props }: ThHTMLAttributes<HTMLTableCellElement>) {
  return (
    <th className={cn("px-5 py-4", className)} {...props}>
      {children}
    </th>
  );
}

function TableCell({ children, className, ...props }: TdHTMLAttributes<HTMLTableCellElement>) {
  return (
    <td className={cn("px-5 py-4", className)} {...props}>
      {children}
    </td>
  );
}

export { Table, TableHeader, TableBody, TableRow, TableHead, TableCell };
