"use client";

import React from "react";
import { isElectron } from "@/lib/is-electron";

interface Props {
  children: React.ReactNode;
}

export const WebOnly: React.FC<Props> = ({ children }) => {
  // Only render children if we're NOT in electron
  if (isElectron()) {
    return null;
  }

  return <>{children}</>;
}; 