"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { isAuthenticated, getUser } from "@/lib/auth";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: ("Admin" | "Member")[];
}

export default function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const router = useRouter();
  const [isVerifying, setIsVerifying] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const allowedRolesKey = allowedRoles?.join("|") || "";

  useEffect(() => {
    if (!isAuthenticated()) {
      router.replace("/login");
      return;
    }

    const user = getUser();
    if (!user) {
      router.replace("/login");
      return;
    }

    const allowedRoleList = allowedRolesKey
      ? (allowedRolesKey.split("|") as ("Admin" | "Member")[])
      : undefined;

    if (allowedRoleList && !allowedRoleList.includes(user.role)) {
      router.replace(user.role === "Admin" ? "/dashboard" : "/my-tasks");
      return;
    }

    setIsAuthorized(true);
    setIsVerifying(false);
  }, [router, allowedRolesKey]);

  if (isVerifying || !isAuthorized) {
    return (
      <div className="flex flex-col flex-1 items-center justify-center min-h-screen bg-slate-50">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return <>{children}</>;
}
export type { ProtectedRouteProps };
