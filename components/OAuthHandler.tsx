"use client";

import { useEffect } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { tokenManager } from "@/utils/tokenManager";

export default function OAuthHandler() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const token = searchParams.get("token");
    if (token) {
      tokenManager.setToken(token);
      
      const newSearchParams = new URLSearchParams(searchParams.toString());
      newSearchParams.delete("token");
      
      const paramString = newSearchParams.toString();
      const newPath = paramString ? `${pathname}?${paramString}` : (pathname || "/");
      
      router.replace(newPath);
      
      // Optionally trigger a reload or event so that AppContext fetches the new user
      // if it already missed it, but since this runs before AppContext useEffect, it should be fine.
    }
  }, [searchParams, router, pathname]);

  return null;
}
