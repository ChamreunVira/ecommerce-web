"use client";

import { assets } from "@/assets/assets";
import { Bell, Settings } from "lucide-react";
import Image from "next/image";

const AdminNavbar = () => {
  // const {} = useAppContext();
  return (
    <header className="flex justify-between items-center px-12 py-4 border-b border-slate-300">
      <div>
        <label htmlFor="" className="text-[1.12rem] text-slate-700 leading-tight">
          Welcome back Chamreun Vira!
        </label>
        <p className="text-xs text-gray-600">Can i help you today.</p>
      </div>
      <div className="max-w-lg w-full">
        <input
          className="w-full px-3 py-1.5 rounded-md outline-1 -outline-offset-1 outline-slate-300 hover:outline-2 hover:-outline-offset-2 hover:outline-orange-500"
          type="text"
          placeholder="Search..."
        />
      </div>
      <div className="flex items-center space-x-4 hover:text-slate-800">
        <div className="flex space-x-4 *:p-1.5 *:hover:bg-slate-100 *:rounded-full *:text-slate-600">
          <button>
            <Bell />
          </button>
          <button>
            <Settings />
          </button>
        </div>
        {/* profile */}

        <div className="flex items-center space-x-2 border-l pl-4 border-slate-300">
          <div className="w-10 h-10 bg-indigo-50 rounded-full flex items-center justify-center text-indigo-500 font-medium">
            VR
          </div>
          <div>
            <h2 className="text-slate-700 text-base font-medium leading-tight">Chamreun Vira</h2>
            <p className="text-xs text-slate-600">virachamreun@gmail.com</p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminNavbar;
