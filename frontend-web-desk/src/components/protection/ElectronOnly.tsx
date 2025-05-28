"use client";

import React, { useEffect } from "react";
import { isElectron } from "@/lib/is-electron";
import { useRouter } from "next/navigation";

interface Props {
  children: React.ReactNode;
  fallbackRedirect?: string; // Optional fallback path
}

export const ElectronOnly: React.FC<Props> = ({ children, fallbackRedirect = "/auth/login" }) => {
  const router = useRouter();

  useEffect(() => {
    if (!isElectron()) {
      router.push(fallbackRedirect);
    }
  }, []);

  if (!isElectron()) {
    return null; // Prevents flicker before redirect
  }

  return <>{children}</>;
};
