import { redirect } from "next/navigation";
import { homeFor } from "@/lib/permissions";
import { requireSession } from "@/lib/session";

export default async function HomePage() {
  const user = await requireSession();
  redirect(homeFor(user));
}
