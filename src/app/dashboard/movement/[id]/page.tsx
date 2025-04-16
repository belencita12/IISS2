import { MovementDetails } from "@/components/admin/movements/MovementDetails";
import authOptions from "@/lib/auth/options";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export default async function MovementDetailPage({ params }: { params: Promise< {id: string }>}) {

  const resolvedParams = await params;
  const id = Number(resolvedParams.id);
  const session = await getServerSession(authOptions);
  const token = session?.user?.token || "";


  if (!session) {
    redirect("/login");
  }
  
  return <MovementDetails token={token} id={id} />;
}