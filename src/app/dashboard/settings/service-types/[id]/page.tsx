import ServiceTypeDetail from "@/components/admin/settings/service-types/ServiceTypeDetail";
import authOptions from "@/lib/auth/options";
import { getServerSession } from "next-auth";
import { notFound, redirect } from "next/navigation";
import { getServiceTypeById } from "@/lib/service-types/getServiceTypeById";

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

  return <ServiceTypeDetail token={token} />;
} 