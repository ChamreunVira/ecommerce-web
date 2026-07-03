"use client";
import { useAppContext } from "@/context/AppContext";
import Link from "next/link";
import React, { useState } from "react";
import Profile from "./Profile";
import { LayoutGridIcon, MoreVertical, ChevronDown, ChevronRight } from "lucide-react";

type Sidebar = {
  children: React.ReactNode;
};

type SidbarItem = {
  label: string;
  active: boolean;
  icon?: React.ReactNode;
  path: string;
};

const Sidbar: React.FC<Sidebar> = ({ children }) => {

  const { user } = useAppContext();

  return (
    <aside className="sticky top-0 h-screen w-72 flex-none overflow-hidden bg-slate-100/50">
      <div className="h-full min-w-0">
        <div className="flex h-full flex-col items-center justify-between">
          {/* top logo */}
          <div className="w-full px-5 py-4">
            <div className="flex items-center gap-3 rounded-lg py-2 px-4">
              <LayoutGridIcon fill="orange" strokeWidth={0} className="h-8 w-8 shrink-0 text-orange-500" />
              <h1 className="truncate text-2xl font-semibold text-slate-900">ViraDev</h1>
            </div>
          </div>

          {/* sidebar items */}
          <div className="w-full flex-1 flex flex-col space-y-2.5 overflow-y-auto px-5 py-2">{children}</div>

          {/* sidebar footer */}
          <div className="w-full border-t border-slate-200 p-5">
            <div className="flex min-w-0 items-center gap-3 rounded-lg bg-slate-200/50 p-3">
              <div className="shrink-0">
                <Profile fullName={user?.fullName || "Anonymous"} />
              </div>
              <div className="flex min-w-0 flex-1 items-center justify-between gap-2">
                <div className="min-w-0 flex-1 leading-tight">
                  <h2 className="truncate text-sm font-semibold text-slate-900">{user?.fullName || "Admin user"}</h2>
                  <p className="truncate text-xs text-slate-500">{user?.email || "admin@example.com"}</p>
                </div>
                <div className="flex-none text-slate-400">
                  <MoreVertical size={18} />
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </aside>
  );
};

export default Sidbar;

export const SidebarItem: React.FC<SidbarItem> = ({ label, icon, active, path }) => {
  return (
    <Link href={path}>
      <div
        className={`group flex items-center gap-3 rounded-lg px-4 py-3 text-lg font-medium transition ${active ? "bg-orange-500 text-white shadow-sm shadow-orange-500/20" : "text-slate-600 hover:bg-slate-100 hover:text-slate-950"}`}
      >
        <span className="flex h-5 w-5 shrink-0 items-center justify-center">
          {icon}
        </span>
        <span className="truncate">{label}</span>
      </div>
    </Link>
  );
};

type SidebarGroupProps = {
  label: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  defaultOpen?: boolean;
};

export const SidebarGroup: React.FC<SidebarGroupProps> = ({ label, icon, children, defaultOpen = false }) => {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div>
      <button
        onClick={() => setOpen(prev => !prev)}
        className="w-full flex items-center justify-between gap-3 rounded-lg px-4 py-2.5 text-sm font-semibold text-slate-500 uppercase tracking-wider hover:bg-slate-100 transition"
      >
        <span className="flex items-center gap-2">
          {icon && <span className="h-4 w-4 shrink-0">{icon}</span>}
          {label}
        </span>
        <span className={`transition-transform duration-200 ${open ? "rotate-180" : "rotate-0"}`}>
          <ChevronDown size={14} />
        </span>
      </button>
      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${open ? "max-h-[500px] opacity-100 mt-1" : "max-h-0 opacity-0"}`}
      >
        <div className="ml-3 space-y-1 border-l-2 border-slate-200 pl-3">
          {children}
        </div>
      </div>
    </div>
  );
};
