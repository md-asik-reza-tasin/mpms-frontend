"use client";

import React from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import Card from "@/components/ui/Card";
import { getUser } from "@/lib/auth";

export default function DashboardPage() {
  const user = getUser();

  return (
    <DashboardLayout allowedRoles={["Admin"]}>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-950">Dashboard</h1>
          <p className="text-xs text-slate-500 mt-1 font-medium">
            Welcome back, {user?.name}! Core layout & authentication flow verified.
          </p>
        </div>

        <Card className="border-slate-200/80">
          <h2 className="text-sm font-semibold text-slate-800 mb-2">Workspace Overview</h2>
          <p className="text-xs text-slate-600 leading-relaxed">
            This dashboard layout and navigation sidebar are now fully configured. 
            We can verify authentication sessions and role permissions. Next, we will proceed with the Projects CRUD implementation.
          </p>
        </Card>
      </div>
    </DashboardLayout>
  );
}
