"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

/**
 * /reset-password is now handled entirely in /forgot-password via modals.
 * This page redirects users back to the forgot-password flow.
 */
const ResetPasswordPage = () => {
  const router = useRouter();

  useEffect(() => {
    router.replace("/forgot-password");
  }, [router]);

  return null;
};

export default ResetPasswordPage;
