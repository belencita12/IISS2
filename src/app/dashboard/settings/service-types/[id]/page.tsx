import ServiceTypeDetail from "@/components/admin/settings/service-types/ServiceTypeDetail";
import authOptions from "@/lib/auth/options";
import { getServerSession } from "next-auth";
import { notFound, redirect } from "next/navigation";
import { getServiceTypeById } from "@/lib/service-types/getServiceTypeById";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function ServiceTypeDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = await params;
  const serviceTypeId = resolvedParams.id;

  const session = await getServerSession(authOptions);
  if (!session) {
    redirect("/login");
  }
  const token = session.user.token as string;

  // Obtenemos el tipo de servicio, si no existe -> 404
  const serviceType = await getServiceTypeById(serviceTypeId, token).catch(() => null);
  if (!serviceType) {
    notFound();
  }

  return (
    <div className="relative">
      <div className="absolute my-2 -top-14 left-8 z-50">
        <Link href="/dashboard/settings/service-types">
          <Button
            variant="outline"
            className="px-6 border-gray-200 border-solid"
          >
            Volver
          </Button>
        </Link>
      </div>
      <div className="mt-28">
        <ServiceTypeDetail data={serviceType} />
      </div>
    </div>
  );
} 
