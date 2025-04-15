import { MovementDetails } from "@/components/admin/movements/MovementDetails";
import authOptions from "@/lib/auth/options";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

interface MovementDetailPageProps {
  params: {
    id: string;
  };
}

export default async function MovementDetailPage({ params }: MovementDetailPageProps) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  const token = session.user.token;
  const id = Number(params.id);

  return <MovementDetails token={token} id={id} />;
}
