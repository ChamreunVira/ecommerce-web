"use client";

import React from "react";
import { useAppContext } from "@/context/AppContext";
import { hasAnyPermission, hasPermission } from "@/lib/permissions";

interface HasPermissionProps {
  name: string | string[];
  fallback?: React.ReactNode;
  children: React.ReactNode;
}

export const HasPermission: React.FC<HasPermissionProps> = ({
  name,
  fallback = null,
  children,
}) => {
  const { user } = useAppContext();

  const isAllowed = Array.isArray(name)
    ? hasAnyPermission(user, name)
    : hasPermission(user, name);

  if (!isAllowed) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
};

export default HasPermission;
