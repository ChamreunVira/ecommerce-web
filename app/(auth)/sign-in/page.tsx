"use client";
import { useAppContext } from "@/context/AppContext";
import { setAccessToken } from "@/lib/axios";
import { authService } from "@/services/auth-service";
import { User } from "@/types/user";
import React, { useState } from "react";
import { toast } from "react-toastify";

const SignInPage = () => {
  const [authData, setAuthData] = useState<Partial<User>>({
    email: "",
    password: "",
  });

  const { router } = useAppContext();

  const handleAuthDataChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAuthData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSignIn = async (e: React.SubmitEvent) => {
    e.preventDefault();
    try {
      const response = await authService.signIn(authData);
      if (response.success) {
        toast.success("Sign in successfully.");
        setAccessToken(response.data.accessToken);
        if (response.data.roles.includes("ROLE_ADMIN")) {
          router.push("/dashboard");
        } else {
          router.push("/");
        }
      }
    } catch (e: any) {
      console.log(e.message);
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center">
      <div className="p-6 min-w-xl rounded-md border border-gray-300">
        <h1 className="text-2xl mb-4 font-medium text-center uppercase text-orange-500">
          Sign Up
        </h1>
        <form action="#" onSubmit={handleSignIn}>
          <div className="mb-4">
            <label className="text-sm text-gray-800">Email</label>
            <input
              type="text"
              placeholder="Enter email..."
              name="email"
              onChange={handleAuthDataChange}
              className="w-full rounded-md px-3 py-1.5 text-gray-500/90 outline-1 -outline-offset-1 outline-gray-300 focus:outline-2 focus:outline-offset-2 focus:outline-orange-500"
            />
          </div>

          <div>
            <label className="text-sm text-gray-800">Password</label>
            <input
              type="text"
              name="password"
              onChange={handleAuthDataChange}
              placeholder="Enter password..."
              className="w-full rounded-md px-3 py-1.5 text-gray-500/90 outline-1 -outline-offset-1 outline-gray-300 focus:outline-2 focus:outline-offset-2 focus:outline-orange-500"
            />
          </div>
          <p className="py-4 text-gray-500/90">
            Do you don't have an account?{" "}
            <span className="font-medium underline cursor-pointer ml-2">
              sign Up
            </span>
          </p>
          <button className="w-full text-white font-medium rounded-md bg-orange-500 px-3 py-1.5">
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
};

export default SignInPage;
