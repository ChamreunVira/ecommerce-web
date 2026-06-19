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

const signUpSchema = z.object({
  fullName: z.string().min(5, "Fullname must be at least 5 characters."),
  email: z.email("Invalid email."),
  password: z.string().min(8, "Password must be at least 8 characters."),
});

type SignUpType = z.infer<typeof signUpSchema>;

const SignUpPage: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpType>({
    resolver: zodResolver(signUpSchema),
  });
  const [isLoading, setIsLoading] = useState(false);

  const { router } = useAppContext();

  const handleSignUp = async (data: SignUpType) => {
    const newData = { ...data, roles: ['ROLE_CUSTOMER'] };
    try {
      setIsLoading(true);
      const response = await authService.signUp(newData);
      if (response.success) {
        toast.success("Account created successfully!");
        tokenManager.setToken(response.data.accessToken);
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
        {/* container wrapper */}
        <div className="w-full max-w-md">
          <div className="mb-10 text-center lg:text-left">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Sign Up</h2>
            <p className="text-gray-500">Create your new QuickCart account.</p>
          </div>

          <form onSubmit={handleSubmit(handleSignUp)} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name
              </label>
              <input
                {...register("fullName")}
                type="text"
                placeholder="Chamreun Vira"
                className="w-full rounded-lg border border-gray-200 px-4 py-3 text-gray-800 placeholder-gray-400 focus:border-orange-500 transition-all"
              />
              {errors.fullName && (
                <p className="text-sm text-rose-500">
                  {errors.fullName.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                {...register("email")}
                type="email"
                placeholder="you@example.com"
                className="w-full rounded-lg border border-gray-200 px-4 py-3 text-gray-800 placeholder-gray-400 focus:border-orange-500 transition-all"
              />
              {errors.email && (
                <p className="text-sm text-rose-500">{errors.email.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <input
                {...register("password")}
                type="password"
                placeholder="Secure password (min 8 chars)"
                className="w-full rounded-lg border border-gray-200 px-4 py-3 text-gray-800 placeholder-gray-400 focus:border-orange-500 transition-all"
              />
              {errors.password && (
                <p className="text-sm text-rose-500">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/*<input type="hidden" {...register("roles")} />*/}
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
            <Link
              href="/sign-in"
              className="font-semibold text-orange-600 hover:text-orange-500 transition-colors"
            >
              Sign In Instead
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
