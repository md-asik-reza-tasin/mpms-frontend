"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { getUser } from "@/lib/auth";
import {
  LayoutDashboard,
  FolderKanban,
  CheckSquare,
  Users,
  BarChart2,
  TrendingUp,
  X
} from "lucide-react";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();
  const user = getUser();
  const role = user?.role || "Member";

  const adminLinks = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Projects", href: "/projects", icon: FolderKanban },
    { name: "Tasks", href: "/tasks", icon: CheckSquare },
    { name: "Team", href: "/team", icon: Users },
    { name: "Reports", href: "/reports", icon: BarChart2 },
  ];

  const memberLinks = [
    { name: "My Tasks", href: "/my-tasks", icon: CheckSquare },
    { name: "My Projects", href: "/my-projects", icon: FolderKanban },
    { name: "Progress", href: "/progress", icon: TrendingUp },
  ];

  const links = role === "Admin" ? adminLinks : memberLinks;

  return (
    <>
      {/* Mobile Sidebar Overlay */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-50 bg-slate-900/30 backdrop-blur-xs lg:hidden transition-opacity"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-slate-200 bg-gray-900 transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Header/Brand */}
        <div className="flex h-16 items-center justify-between px-6 border-b border-slate-200/80">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-xl font-bold tracking-tight text-indigo-600">MPMS</span>
          </Link>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 hover:text-slate-600 lg:hidden cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Links Navigation */}
        <nav className="flex-1 space-y-1 px-4 py-6 overflow-y-auto">
          {links.map((link) => {
            // Check if active: exact match or if current route starts with this href (to cover subroutes)
            // But ensure `/dashboard` doesn't match other pages
            const isActive = link.href === "/dashboard" 
              ? pathname === "/dashboard"
              : pathname.startsWith(link.href);
            const Icon = link.icon;

            return (
              <Link
                key={link.name}
                href={link.href}
                onClick={onClose}
                className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-xs font-semibold transition-all ${
                  isActive
                    ? "bg-indigo-50 text-indigo-600"
                    : "text-white hover:bg-slate-50 hover:text-slate-900"
                }`}
              >
                <Icon className={`h-4.5 w-4.5 ${isActive ? "text-indigo-600" : "text-slate-400"}`} />
                {link.name}
              </Link>
            );
          })}
        </nav>

        {/* Footer user info summary */}
        <div className="border-t border-slate-200/80 p-4 bg-slate-950">
          <div className="rounded-lg border border-slate-200 bg-white p-3 text-[11px]">
            <p className="font-semibold text-slate-700">Signed In As</p>
            <p className="text-slate-500 font-medium truncate mt-0.5">{user?.email}</p>
          </div>
        </div>
      </aside>
    </>
  );
}
export type { SidebarProps };
