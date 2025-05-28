"use client";

import React, { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { isElectron } from "@/lib/is-electron";
import { isRouteAllowedInElectron, getElectronRedirectRoute } from "@/lib/electron-config";

interface Props {
  children: React.ReactNode;
}

export const ElectronRouteGuard: React.FC<Props> = ({ children }) => {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Only apply route restrictions in electron environment
    if (isElectron()) {
      if (!isRouteAllowedInElectron(pathname)) {
        console.log(`Route ${pathname} is not allowed in Electron app, redirecting...`);
        router.push(getElectronRedirectRoute());
        return;
      }
    }
  }, [pathname, router]);

  // If we're in electron and the route is not allowed, don't render anything
  if (isElectron() && !isRouteAllowedInElectron(pathname)) {
    return null;
  }

  return <>{children}</>;
}; 