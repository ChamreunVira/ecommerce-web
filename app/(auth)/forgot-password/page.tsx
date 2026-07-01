"use client";

import { authService } from "@/services/auth-service";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { toast } from "react-toastify";

const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast.error("Please enter a valid email address");
      return;
    }
    
    setIsLoading(true);
    try {
      await authService.forgotPassword({ email });
      toast.success("OTP sent to your email!");
      router.push("/reset-password");
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to send reset email");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex text-gray-900 bg-white">
      <div className="w-full flex items-center justify-center p-8 sm:p-12 lg:p-24 shadow-2xl relative z-10 bg-white">
        <div className="w-full max-w-md">
          <div className="mb-10 text-center lg:text-left">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Forgot Password</h2>
            <p className="text-gray-500">
              Enter your email address and we'll send you an OTP to reset your password.
            </p>
          </div>
          
          <form onSubmit={handleForgotPassword} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="virachamreun@gmail.com"
                className="w-full rounded-lg border border-gray-200 px-4 py-3 text-gray-800 placeholder-gray-400 focus:border-orange-500 outline-none transition-all"
              />
            </div>

            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full flex justify-center py-3.5 px-4 border border-transparent rounded-lg text-sm font-bold text-white bg-linear-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-all disabled:opacity-70 disabled:cursor-not-allowed transform hover:-translate-y-0.5"
            >
              {isLoading ? "Sending OTP..." : "Send Reset OTP"}
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-gray-600">
            Remember your password?{" "}
            <Link href="/sign-in" className="font-semibold text-orange-600 hover:text-orange-500 transition-colors">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
