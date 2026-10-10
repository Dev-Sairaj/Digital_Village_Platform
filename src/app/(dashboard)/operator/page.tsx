import type { Metadata } from "next";
import { OperatorDashboard } from "@/components/features/dashboard/OperatorDashboard";
import { requireRole } from "@/lib/session";

export const metadata: Metadata = {
  title: "Operator Dashboard | Digital Village Platform",
};

interface OperatorPageProps {
  searchParams: Promise<{ denied?: string }>;
}

export default async function OperatorPage({
  searchParams,
}: OperatorPageProps) {
  const user = await requireRole(["SUPER_ADMIN", "OPERATOR"]);
  const { denied } = await searchParams;
  return <OperatorDashboard user={user} denied={denied === "1"} />;
}
