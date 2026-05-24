"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { isAuthenticated, getUser } from "@/lib/auth";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated()) {
      const user = getUser();
      if (user) {
        if (user.role === "Admin" || user.role === "Manager") {
          router.replace("/dashboard");
        } else {
          router.replace("/my-tasks");
        }
      } else {
        router.replace("/login");
      }
    } else {
      router.replace("/login");
    }
  }, [router]);

  return (
    <div className="flex flex-col flex-1 items-center justify-center min-h-screen bg-slate-50">
      <div className="text-center">
        <LoadingSpinner size="lg" className="mx-auto mb-4" />
        <p className="text-slate-500 text-sm font-medium">Redirecting to your workspace...</p>
      </div>
    </div>
  );
}
