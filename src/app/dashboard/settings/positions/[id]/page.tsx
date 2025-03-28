import PositionDetail from "@/components/admin/work-position/Details";
import authOptions from "@/lib/auth/options";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

interface Props {
  params: {
    id: string;
  };
}

export default async function PositionDetailPage({ params }: Props) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  const token = session.user.token;

  return <PositionDetail token={token} />;
}
