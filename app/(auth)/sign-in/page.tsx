"use client";
import { useAppContext } from "@/context/AppContext";
import { authService } from "@/services/auth-service";
import { tokenManager } from "@/utils/tokenManager";
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
    tokenManager.removeToken();
    setIsLoading(true);
    try {
      const response = await authService.signIn(data);
      if (response.success) {
        toast.success("Welcome back!");
        tokenManager.setToken(response.data.accessToken);
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
                className="w-full rounded-lg border border-gray-200 px-4 py-3 text-gray-800 placeholder-gray-400 focus:border-indigo-500 transition-all"
              />
              {errors.email && <p className="text-sm text-rose-500">{errors.email.message}</p>}
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <Link href="/forgot-password" className="text-sm font-medium text-indigo-600 hover:text-indigo-500 transition-colors">
                  Forgot password?
                </Link>
              </div>
              <input
                {...register("password")}
                type="password"
                placeholder="Enter password..."
                className="w-full rounded-lg border border-gray-200 px-4 py-3 text-gray-800 placeholder-gray-400 focus:border-indigo-500 transition-all"
              />
              {errors.password && <p className="text-sm text-rose-500">{errors.password.message}</p>}
            </div>

            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full flex justify-center py-3.5 px-4 border border-transparent rounded-lg text-sm font-bold text-white bg-linear-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all disabled:opacity-70 disabled:cursor-not-allowed transform hover:-translate-y-0.5"
            >
              {isLoading ? "Signing In..." : "Sign In"}
            </button>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">Or continue with</span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => window.location.href = "http://localhost:8081/api/v1/oauth2/authorization/google"}
            className="w-full flex justify-center items-center py-3.5 px-4 mb-2 border border-gray-300 rounded-lg text-sm font-bold text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-200 transition-all transform hover:-translate-y-0.5"
          >
            <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Sign in with Google
          </button>

          <p className="mt-8 text-center text-sm text-gray-600">
            Don't have an account yet?{" "}
            <Link href="/sign-up" className="font-semibold text-indigo-600 hover:text-indigo-500 transition-colors">
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignInPage;