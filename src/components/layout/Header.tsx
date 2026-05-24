"use client";

import React, { useState } from "react";
import { getUser, logout } from "@/lib/auth";
import { Menu, LogOut, User as UserIcon } from "lucide-react";

interface HeaderProps {
  onMenuClick: () => void;
}

export default function Header({ onMenuClick }: HeaderProps) {
  const user = getUser();
  const [showDropdown, setShowDropdown] = useState(false);

  return (
    <header className="sticky top-0 z-40 flex h-16 w-full items-center justify-between border-b border-slate-200/80 bg-white px-6 shadow-sm">
      <div className="flex items-center">
        <button
          onClick={onMenuClick}
          className="mr-3 rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-600 focus:outline-none lg:hidden transition-colors"
        >
          <Menu className="h-5 w-5" />
        </button>
        <span className="text-base font-semibold text-slate-800 hidden sm:inline-block">
          Minimal Project Management System
        </span>
      </div>

      <div className="relative">
        <button
          onClick={() => setShowDropdown(!showDropdown)}
          className="flex items-center gap-2.5 rounded-lg p-1 text-sm font-medium text-slate-700 hover:bg-slate-50 focus:outline-none transition-all duration-200"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-50 text-indigo-600 font-semibold border border-indigo-100">
            {user?.name ? user.name.charAt(0).toUpperCase() : <UserIcon className="h-4 w-4" />}
          </div>
          <div className="text-left hidden md:block pr-2">
            <p className="text-xs font-semibold leading-tight text-slate-900">{user?.name}</p>
            <p className="text-[10px] leading-tight text-slate-400 mt-0.5">{user?.role}</p>
          </div>
        </button>

        {showDropdown && (
          <>
            <div 
              className="fixed inset-0 z-40" 
              onClick={() => setShowDropdown(false)}
            />
            <div className="absolute right-0 mt-2 w-52 origin-top-right rounded-xl border border-slate-200 bg-white p-1.5 shadow-lg focus:outline-none z-50 animate-in fade-in-50 slide-in-from-top-1 duration-150">
              <div className="px-3 py-2 border-b border-slate-100 mb-1">
                <p className="text-xs font-semibold text-slate-900 truncate">{user?.name}</p>
                <p className="text-[10px] text-slate-400 truncate mt-0.5">{user?.email}</p>
              </div>
              <button
                onClick={() => logout()}
                className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-xs text-rose-600 hover:bg-rose-50 font-medium transition-colors cursor-pointer"
              >
                <LogOut className="h-4 w-4" />
                Sign Out
              </button>
            </div>
          </>
        )}
      </div>
    </header>
  );
}
export type { HeaderProps };
