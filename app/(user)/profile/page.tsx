"use client";

import React, { useEffect, useState } from "react";
import { useAppContext } from "@/context/AppContext";
import Profile from "@/components/Profile";
import { Mail, Calendar, Settings, ShoppingBag, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Loading from "@/components/Loading";
import ChangePasswordModal from "@/components/ChangePasswordModal";

const ProfilePage = () => {
  const { user, sessionReady, isInitializing } = useAppContext();
  const router = useRouter();
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);

  useEffect(() => {
    if (sessionReady && !user) {
      router.push("/sign-in");
    }
  }, [sessionReady, user, router]);

  if (isInitializing || !sessionReady || (!user && sessionReady)) {
    return <Loading />;
  }

  const joinDate = user?.createdAt
    ? new Date(user?.createdAt).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    })
    : "Recently joined";

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        
        {/* Profile Header */}
        <div className="bg-white rounded-md shadow-sm border border-slate-200 overflow-hidden">
          <div className="h-32 sm:h-40 bg-linear-to-r from-orange-400 to-rose-500"></div>
          <div className="relative px-6 pb-8">
            <div className="relative -mt-16 sm:-mt-20 flex justify-center sm:justify-start">
              <div className="h-32 w-32 rounded-full border-4 border-white bg-white flex items-center justify-center overflow-hidden z-10 shadow-md">
                  <Profile className="scale-[2.8] origin-center" fullName={user?.fullName || "User"} />
              </div>
            </div>

            <div className="mt-4 sm:mt-6 text-center sm:text-left">
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
                {user?.fullName}
              </h1>
              <p className="text-sm font-medium text-slate-500 mt-1 flex items-center justify-center sm:justify-start gap-1.5">
                <ShieldCheck size={16} className="text-emerald-500" />
                {user?.roles && user.roles.length > 0 ? user.roles.join(', ') : 'User'}
              </p>
            </div>
          </div>
        </div>

        {/* Profile Details & Actions */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
         
          {/* Main Info */}
          <div className="md:col-span-2 space-y-6">
            <div className="bg-white rounded-md shadow-sm border border-slate-200 p-6">
              <h2 className="text-lg font-semibold text-slate-800 mb-4 border-b border-slate-100 pb-3">
                Personal Information
              </h2>

              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="bg-orange-50 p-3 rounded-lg text-orange-600">
                    <Mail size={20} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-500">Email Address</p>
                    <p className="text-base text-slate-900">{user?.email}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-rose-50 p-3 rounded-lg text-rose-600">
                    <Calendar size={20} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-500">Member Since</p>
                    <p className="text-base text-slate-900">{joinDate}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-6">
            <div className="bg-white rounded-md shadow-sm border border-slate-200 p-6">
              <h2 className="text-lg font-semibold text-slate-800 mb-4 border-b border-slate-100 pb-3">
                Quick Actions
              </h2>

              <div className="flex flex-col gap-3">
                <Link
                  href="/profile/orders"
                  className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 text-slate-700 transition font-medium border border-transparent hover:border-slate-100"
                >
                  <ShoppingBag size={18} className="text-slate-400" />
                  My Orders
                </Link>
                <button
                  type="button"
                  onClick={() => setIsPasswordModalOpen(true)}
                  className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 text-slate-700 transition font-medium border border-transparent hover:border-slate-100 text-left w-full"
                >
                  <Settings size={18} className="text-slate-400" />
                  Account Settings
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <ChangePasswordModal 
        isOpen={isPasswordModalOpen} 
        onClose={() => setIsPasswordModalOpen(false)} 
      />
    </div>
  );
};

export default ProfilePage;
