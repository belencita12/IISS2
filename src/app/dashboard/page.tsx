import { getServerSession } from "next-auth";
import authOptions from "@/lib/auth/options";
import { redirect } from "next/navigation";
import DashboardContent from "@/components/dashboard/DashboardContent";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  const token = session?.user?.token;

  if (!token) {
    redirect("/login");
  }

  return <DashboardContent token={token} />;
}