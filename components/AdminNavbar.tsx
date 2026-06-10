"use client";

import { useAppContext } from "@/context/AppContext";
import { Bell, Search, Settings } from "lucide-react";
import Profile from "./Profile";

const AdminNavbar = () => {

  const { user, router } = useAppContext();

  return (
    <header className="sticky top-0 z-40 flex min-h-20 items-center justify-between gap-5 px-6 py-4 backdrop-blur md:px-10 lg:px-12">
      <div className="min-w-0">
        <h1 className="truncate text-2xl font-semibold text-slate-900">Dashboard</h1>
      </div>
      <div className="flex min-w-0 items-center gap-3">

        {/* search */}
        <div className="relative hidden min-w-0 lg:block">
          <button className="absolute left-3 top-1/2 -translate-y-1/2">
            <Search className="text-slate-400" size={18} />
          </button>
          <input
            className="w-72 rounded-lg bg-slate-100 px-10 py-2.5 text-sm text-slate-800 outline-none ring-1 ring-transparent transition placeholder:text-slate-400 focus:bg-white focus:ring-orange-500"
            type="text"
            placeholder="Search stock, order, customer"
          />
        </div>

        {/* setting & notification */}
        <div className="flex gap-2">
          <button className="relative rounded-full p-2 text-slate-600 transition hover:bg-slate-100 hover:text-slate-950">
            <div className="absolute right-2 top-2 h-2 w-2 rounded-full bg-rose-500"></div>
            <Bell size={22} />
          </button>
          <button
            className="rounded-full p-2 text-slate-600 transition hover:bg-slate-100 hover:text-slate-950"
            onClick={() => router.push("/admin/setting")}
          >
            <Settings size={22} />
          </button>
        </div>

        {/* profile */}
        <div className="hidden min-w-0 items-center gap-2 border-l border-slate-200 pl-4 sm:flex">
          <Profile fullName={user.fullName as string} />
          <div className="min-w-0">
            <h2 className="truncate text-sm font-semibold leading-tight text-slate-800">{user.fullName || "Admin user"}</h2>
            <p className="truncate text-xs text-slate-500">{user.roles?.[0] || "ROLE_ADMIN"}</p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminNavbar;
