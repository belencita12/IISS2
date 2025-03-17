import { getServerSession } from "next-auth";
import authOptions from "@/lib/auth/options";
import VaccineList from "@/components/admin/vaccine/VaccineList";
import { redirect } from "next/navigation";

export default async function VaccineListPage() {
  const session = await getServerSession(authOptions);
  const token = session?.user?.token || null;

  if (!token) {
    redirect("/login");
  }

  return <VaccineList token={token} />;
}
