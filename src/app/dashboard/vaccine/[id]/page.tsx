import { VaccineDetail } from "@/components/admin/vaccine/VaccineDetail";
import authOptions from "@/lib/auth/options";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export default async function VaccineDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const id = Number(resolvedParams.id);
  const session = await getServerSession(authOptions);
  const token = session?.user?.token || "";

  if (!session) {
    redirect("/login");
  }

  return <VaccineDetail id={id} token={token} />;
}
