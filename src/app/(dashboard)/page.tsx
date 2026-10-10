import { redirect } from "next/navigation";
import { ROLE_HOME } from "@/lib/permissions";
import { requireSession } from "@/lib/session";

export default async function HomePage() {
  const user = await requireSession();
  redirect(ROLE_HOME[user.role]);
}
