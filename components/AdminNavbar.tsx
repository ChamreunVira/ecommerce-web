"use client";

import { assets } from "@/assets/assets";
import { Bell, Settings } from "lucide-react";
import Image from "next/image";

const AdminNavbar = () => {
  // const {} = useAppContext();
  return (
    <header className="flex justify-between items-center px-12 py-4 border-b border-slate-300">
      <div>
        <label htmlFor="" className="text-[1.14rem] text-slate-800 leading-tight">
          Welcome back Vira!
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

        <div className="flex items-center space-x-2">
          <Image className="object-cover w-full" src={assets.facebook_icon} alt="logo" />
          <div>
            <h2 className="text-slate-700 text-base font-semibold leading-tight">Chamreun Vira</h2>
            <p className="text-xs text-slate-600">virachamreun@gmail.com</p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminNavbar;
