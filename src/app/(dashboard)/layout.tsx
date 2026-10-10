import type { ReactNode } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { requireSession } from "@/lib/session";

export default async function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  const user = await requireSession();
  return <MainLayout user={user}>{children}</MainLayout>;
}
