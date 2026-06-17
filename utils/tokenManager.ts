"use client";

let _token: string | null = null;

export const tokenManager = {

  setToken: (token: string) => {
    _token = token;
  },

  getToken: () => {
    // Prevents crashing during Next.js server-side pre-rendering
    // នៅពេល crush server-side rendering
    if (typeof window === "undefined") return null;
    return _token;
  },

  removeToken: () => {
    _token = null;
  },

}