"use client";

import React from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import Card, { CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import PageHeader from "@/components/ui/PageHeader";
import { getUser } from "@/lib/auth";

export default function DashboardPage() {
  const user = getUser();

  return (
    <DashboardLayout allowedRoles={["Admin"]}>
      <div className="space-y-6">
        <PageHeader title="Dashboard" description={`Welcome back, ${user?.name}! Core layout & authentication flow verified.`} />

        <Card className="border-slate-200/80">
          <CardHeader>
            <CardTitle>Workspace Overview</CardTitle>
            <CardDescription className="leading-relaxed">
            This dashboard layout and navigation sidebar are now fully configured. 
            We can verify authentication sessions and role permissions. Next, we will proceed with the Projects CRUD implementation.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    </DashboardLayout>
  );
}
