import type { Metadata } from "next";
import { SuperAdminDashboard } from "@/components/features/dashboard/SuperAdminDashboard";
import { requireRole } from "@/lib/session";

export const metadata: Metadata = {
  title: "Super Admin Dashboard | GramSetu",
};

export default async function SuperAdminPage() {
  const user = await requireRole(["SUPER_ADMIN"]);
  return <SuperAdminDashboard user={user} />;
}
