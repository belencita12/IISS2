import authOptions from "@/lib/auth/options";
import { getServerSession } from "next-auth";
import { getVaccineRegistryById } from "@/lib/vaccine-registry/getVaccineRegistryById";
import { notFound } from "next/navigation";
import VaccineRegistryEditForm from "@/components/admin/vaccine-registry/VaccineRegistryEditForm";

export default async function Page({
  params,
}: {
  params: Promise<{
    id: string;
    petId: string;
    vaccineRegistryId: string;
  }>;
}) {
  const { id, petId, vaccineRegistryId } = await params;
  const session = await getServerSession(authOptions);
  const token = session?.user?.token || "";

  const data = await getVaccineRegistryById(token, Number(vaccineRegistryId));

  if (!data) {
    return notFound();
  }

  return (
    <div className="max-w-3xl mx-auto py-8">
      <VaccineRegistryEditForm
        token={token}
        initialData={data}
        petId={Number(petId)}
        clientId={Number(id)}
      />
    </div>
  );
}
