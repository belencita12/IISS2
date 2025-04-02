import { getServerSession } from "next-auth";
import authOptions from "@/lib/auth/options";
import { redirect } from "next/navigation";
import { getPositionById } from "@/lib/work-position/getPositionById";
import PositionDetail from "@/components/admin/work-position/Details";

export default async function Page({ 
  params, 
}: { 
  params: Promise<{ id: string }> 
}) {
  const session = await getServerSession(authOptions);
  const { id } = await params

  if (!session) redirect("/login");

  const token = session.user.token;
  const position = await getPositionById(Number(id) , token);

  if (!id) redirect("/dashboard/settings/positions");

  return <PositionDetail position={position} />;
}
