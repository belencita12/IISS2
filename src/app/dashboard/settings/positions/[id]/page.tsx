import { getServerSession } from "next-auth";
import authOptions from "@/lib/auth/options";
import { redirect } from "next/navigation";
import { getPositionById } from "@/lib/work-position/getPositionById";
import PositionDetail from "@/components/admin/work-position/Details";
import { Button } from "@/components/ui/button";
import Link from "next/link";

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

  return (
    <div className="relative">
      <div className="absolute my-2 -top-14 left-8 z-50">
        <Link href="/dashboard/settings/positions">
          <Button
            variant="outline"
            className="px-6 border-gray-200 border-solid"
          >
            Volver
          </Button>
        </Link>
      </div>
      <div className="mt-28">
        <PositionDetail position={position} />
      </div>
    </div>
  );
}
