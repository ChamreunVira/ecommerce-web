import { assets } from "@/assets/assets";
import Navbar from "@/components/Navbar";
import Image from "next/image";
import React from "react";

const DashboardPage = () => {
  return (
    <div className="flex min-h-screen">
      <aside className="min-w-52 border-r border-gray-300">
        {/* top logo */}
        <div className="flex space-x-2 border-b border-gray-300 p-2">
          <Image
            src={assets.brand}
            alt="main-logo"
            className="w-20 h-20 object-cover"
          />
          <div className="flex flex-col justify-center">
            <h2 className="font-medium text-gray-800 text-xl">ViraDev</h2>
            <p className="text-xs text-gray-500/90">Hello</p>
          </div>
        </div>
        {/* sidbar content */}
        <div className="p-2"></div>
      </aside>
      <main className="flex-1">
        <Navbar />
      </main>
    </div>
  );
};

export default DashboardPage;
