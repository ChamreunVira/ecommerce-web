import { assets } from "@/assets/assets";
import { useAppContext } from "@/context/AppContext";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import Profile from "./Profile";
import { LayoutGrid, LayoutGridIcon, MoreVertical } from "lucide-react";

type Sidebar = {
  children: React.ReactNode;
};

type SidbarItem = {
  label: string;
  active: boolean;
  icon?: any;
  path: string;
};

const Sidbar: React.FC<Sidebar> = ({ children }) => {

  const { user } = useAppContext();

  return (
    <aside className="sticky top-0 w-70 min-h-screen bg-gray-100/50 overflow-y-auto overflow-x-hidden">
      <div className="h-full">
        <div className="flex h-full flex-col items-center justify-between">
          {/* top logo */}
          <div className="w-full px-8 py-8">
            <div className="px-4 flex space-x-2">
              <LayoutGridIcon fill="orange" stroke="false" className="w-8 h-8" />
              <h1 className="text-2xl font-semibold text-slate-800">ViraDev</h1>
            </div>
          </div>

          {/* sidebar items */}
          <div className="w-full flex-1 flex flex-col space-y-4 py-2 px-8">{children}</div>

          {/* sidebar footer */}
          <div className="w-full py-4 px-8">
            <div className="flex items-center justify-between space-x-2 bg-zinc-50 rounded-lg">
              <Profile fullName={user.fullName || "Anynouymuse"} />
              <div className="flex items-center gap-2">
                <div className="flex-1 min-w-0 leading-tight overflow-hidden">
                  <h2 className="text-base font-medium truncate">{user.fullName}</h2>
                  <p className="text-label text-slate-600 truncate">{user.email}</p>
                </div>
                <div className="flex-none">
                  <MoreVertical />
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
        className={`flex items-center rounded-lg space-x-4 px-4 py-2 text-lg p-2 ${active ? "bg-orange-500" : " hover:bg-slate-100"} cursor-pointer group`}
      >
        <button
          className={`${active ? "text-white" : "text-slate-600 group-hover:text-slate-800"}`}
        >
          {icon}
        </button>
        <div>
          <h2
            className={`${active ? "text-white" : "text-slate-600 group-hover:text-slate-800"}`}
          >
            {label}
          </h2>
        </div>
      </div>
    </Link>
  );
};
