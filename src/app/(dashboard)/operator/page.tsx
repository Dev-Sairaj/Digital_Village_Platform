import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { OperatorDashboard } from "@/components/features/dashboard/OperatorDashboard";
import { requireRole } from "@/lib/session";

export const metadata: Metadata = {
  title: "Operator Dashboard | GramSetu",
};

interface OperatorPageProps {
  searchParams: Promise<{ denied?: string }>;
}

export default async function OperatorPage({
  searchParams,
}: OperatorPageProps) {
  const user = await requireRole(["SUPER_ADMIN", "OPERATOR"]);
  // Village operators work in the workspace shell.
  if (user.role === "OPERATOR" && user.scope.level === "VILLAGE") redirect("/village");
  const { denied } = await searchParams;
  return <OperatorDashboard user={user} denied={denied === "1"} />;
}
