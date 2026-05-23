import { assets } from "@/assets/assets";
import { useAppContext } from "@/context/AppContext";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import Profile from "./Profile";

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

  const {user} = useAppContext();

  return (
    <aside className="sticky top-0 min-h-screen w-70 border-r border-slate-300 overflow-y-auto overflow-x-hidden">
      <div className="flex h-full flex-col items-center justify-between">
        {/* top logo */}
        <div className="w-full flex items-center justify-center space-x-4 p-4 border-b border-slate-300 mb-4">
          <div>
            <Image className="w-18" src={assets.brand} alt="brand" />
          </div>
          <div className="flex flex-col justify-center space-x-2 text-slate-800">
            <h1 className="text-xl font-semibold text-orange-500">vSt4re</h1>
            <p className="text-slate-600 text-sm">System</p>
          </div>
        </div>
       
        {/* sidebar items */}
        <div className="w-full flex-1 flex flex-col space-y-4 p-8">{children}</div>
       
        {/* sidebar footer */}
        <div className="">
          <Profile fullName={user.fullName || "Anynouymuse"}/>
        </div>
      </div>
    </aside>
  );
};

export default Sidbar;

export const SidebarItem: React.FC<SidbarItem> = ({ label, icon, active , path}) => {
  return (
    <Link href={path}>
      <div
        className={`flex items-center rounded-md space-x-4 px-4 py-2 font-medium text-[1.15rem] p-2 ${active ? "bg-slate-100" : " hover:bg-slate-100"} cursor-pointer group`}
      >
        <button
          className={`${active ? "text-orange-500" : "text-slate-600 group-hover:text-slate-800"}`}
        >
          {icon}
        </button>
        <div>
          <h2
            className={`${active ? "text-orange-500" : "text-slate-600 group-hover:text-slate-800"}`}
          >
            {label}
          </h2>
        </div>
      </div>
    </Link>
  );
};
