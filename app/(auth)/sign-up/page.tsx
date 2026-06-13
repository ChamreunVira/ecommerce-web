"use client";
import { useAppContext } from "@/context/AppContext";
import { setAccessToken } from "@/lib/axios";
import { authService } from "@/services/auth-service";
import { User } from "@/types/user";
import Link from "next/link";
import React, { useState } from "react";
import { toast } from "react-toastify";

const SignUpPage = () => {
  const [authData, setAuthData] = useState<Partial<User>>({
    fullName: "",
    email: "",
    password: "",
    roles: []
  });
  const [isLoading, setIsLoading] = useState(false);

  const { router } = useAppContext();

  const handleAuthDataChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAuthData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await authService.signUp(authData);
      if (response.success) {
        toast.success("Account created successfully!");
        setAccessToken(response.data.accessToken);
        router.push("/");
      } else {
        toast.error(response.message || "Sign up failed");
      }
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Sign up failed");
      console.log(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex text-gray-900 bg-white">
      <div className="w-full flex items-center justify-center p-8 sm:p-12 lg:p-24 shadow-2xl relative z-10 bg-white">
        <div className="w-full max-w-md">
          <div className="mb-10 text-center lg:text-left">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Sign Up</h2>
            <p className="text-gray-500">
              Create your new QuickCart account.
            </p>
          </div>

          <form onSubmit={handleSignUp} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name
              </label>
              <input
                type="text"
                placeholder="Chamreun Vira"
                name="fullName"
                required
                onChange={handleAuthDataChange}
                className="w-full rounded-lg border border-gray-200 px-4 py-3 text-gray-800 placeholder-gray-400 focus:border-orange-500 transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                placeholder="you@example.com"
                name="email"
                required
                onChange={handleAuthDataChange}
                className="w-full rounded-lg border border-gray-200 px-4 py-3 text-gray-800 placeholder-gray-400 focus:border-orange-500 transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <input
                type="password"
                name="password"
                required
                minLength={6}
                onChange={handleAuthDataChange}
                placeholder="Secure password (min 6 chars)"
                className="w-full rounded-lg border border-gray-200 px-4 py-3 text-gray-800 placeholder-gray-400 focus:border-orange-500 transition-all"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center py-3.5 px-4 border border-transparent rounded-lg text-sm font-bold text-white bg-linear-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-all disabled:opacity-70 disabled:cursor-not-allowed transform hover:-translate-y-0.5"
            >
              {isLoading ? "Creating Account..." : "Create Account"}
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-gray-600">
            Already have an account?{" "}
            <Link href="/sign-in" className="font-semibold text-orange-600 hover:text-orange-500 transition-colors">
              Sign In Instead
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
