"use client";
import { useAppContext } from "@/context/AppContext";
import { clearAccessToken, setAccessToken } from "@/lib/axios";
import { authService } from "@/services/auth-service";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import z from "zod";

const signInSchema = z.object({
  email: z.email(),
  password: z.string().min(8)
});

type SignInType = z.infer<typeof signInSchema>;

const SignInPage: React.FC = () => {

  const {register , handleSubmit , formState: { errors }} = useForm<SignInType>({
    resolver: zodResolver(signInSchema),
  });

  const [isLoading, setIsLoading] = useState(false);

  const { router } = useAppContext();

  const handleSignIn = async (data: SignInType) => {
    clearAccessToken();
    setIsLoading(true);
    try {
      const response = await authService.signIn(data);
      if (response.success) {
        toast.success("Welcome back!");
        setAccessToken(response.data.accessToken);
        if (response.data.roles.includes("ROLE_ADMIN")) {
          router.push("/admin/dashboard");
        } else {
          router.push("/");
        }
      } else {
         toast.error(response.message || "Sign in failed");
      }
    } catch (error: any) {
       toast.error(error?.response?.data?.message || "Sign in failed");
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
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Sign In</h2>
            <p className="text-gray-500">
              Please enter your credentials to access your account.
            </p>Email Address
          </div>
          
          <form onSubmit={handleSubmit(handleSignIn)} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                {...register("email")}
                type="email"
                placeholder="virachamreun@gmail.com"
                className="w-full rounded-lg border border-gray-200 px-4 py-3 text-gray-800 placeholder-gray-400 focus:border-orange-500 transition-all"
              />
              {errors.email && <p className="text-sm text-rose-500">{errors.email.message}</p>}
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <Link href="#" className="text-sm font-medium text-orange-600 hover:text-orange-500 transition-colors">
                  Forgot password?
                </Link>
              </div>
              <input
                {...register("password")}
                type="password"
                placeholder="Enter password..."
                className="w-full rounded-lg border border-gray-200 px-4 py-3 text-gray-800 placeholder-gray-400 focus:border-orange-500 transition-all"
              />
              {errors.password && <p className="text-sm text-rose-500">{errors.password.message}</p>}
            </div>

            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full flex justify-center py-3.5 px-4 border border-transparent rounded-lg text-sm font-bold text-white bg-linear-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-all disabled:opacity-70 disabled:cursor-not-allowed transform hover:-translate-y-0.5"
            >
              {isLoading ? "Signing In..." : "Sign In"}
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-gray-600">
            Don't have an account yet?{" "}
            <Link href="/sign-up" className="font-semibold text-orange-600 hover:text-orange-500 transition-colors">
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignInPage;