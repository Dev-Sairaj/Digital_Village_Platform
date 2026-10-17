"use client";

import { createContext, useContext } from "react";

export interface ShellContextValue {
  openDrawer: () => void;
}

export const ShellContext = createContext<ShellContextValue | null>(null);

export function useShell(): ShellContextValue {
  const context = useContext(ShellContext);
  if (!context) throw new Error("useShell must be used inside DashboardShell.");
  return context;
}
