"use client";

import { assets } from "@/assets/assets";
import { useAppContext } from "@/context/AppContext";
import { Bell, Search, Settings } from "lucide-react";
import Image from "next/image";
import Profile from "./Profile";

const AdminNavbar = () => {

  const { user } = useAppContext();

  const handleGetSortCutName = (name: string) => {
    const names = name.split(" ");
    if (names.length > 1) {
      return names[0].charAt(0).toUpperCase() + names[1].charAt(0).toUpperCase();
    }
    return name.charAt(0).toUpperCase();
  }

  return (
    <header className="sticky top-0 z-40 flex justify-between items-center px-12 py-8 bg-white">
      <div>
        <h1 className="text-3xl font-semibold text-slate-800">Dashboard</h1>
      </div>
      <div className="w=full flex items-center space-x-4 hover:text-slate-800">

        {/* search */}
        <div className="relative">
          <button className="absolute top-1/2 left-2 -translate-y-1/2">
            <Search className="text-slate-400" />
          </button>
          <input
            className="w-full text-slate-800 px-10 py-2.5 rounded-md bg-slate-100/50 hover:outline-2 hover:-outline-offset-2 hover:outline-orange-500"
            type="text"
            placeholder="Search stok, order, etc"
          />
        </div>

        {/* setting & notification */}
        <div className="flex space-x-4 *:p-1.5 *:hover:bg-slate-100 *:rounded-full *:text-slate-600">
          <button className="relative">
            <div className="w-2 h-2 rounded-full bg-rose-500 absolute right-1.5 top-1.5"></div>
            <Bell size={28} />
          </button>
          <button>
            <Settings size={28} />
          </button>
        </div>

        {/* profile */}
        <div className="flex items-center space-x-2 border-l pl-4 border-slate-300">
          <Profile fullName={user.fullName as string} />
          <div>
            <h2 className="text-slate-700 text-base font-medium leading-tight">{user.fullName}</h2>
            <p className="text-xs text-slate-600">{user.roles?.[0]}</p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminNavbar;
