import { getServerSession } from "next-auth";
import authOptions from "@/lib/auth/options";
import { notFound } from "next/navigation";
import VaccineRegistryForm from "@/components/admin/vaccine-registry/VaccineRegistryForm";
import { getVaccineRegistryById } from "@/lib/vaccine-registry/getVaccineRegistryById";
import { VaccineRecord } from "@/lib/vaccine-registry/IVaccineRegistry";

export default async function Page({
  params,
}: {
  params: Promise<{ idVaccineRegistry: string; petId: string; clientId: string }>;
}) {
  const { idVaccineRegistry, petId } = await params;

  const session = await getServerSession(authOptions);
  const token = session?.user?.token || null;

  if (!token) {
    notFound();
  }

  const registryId = Number(idVaccineRegistry);
  const petIdNumber = Number(petId);

  if (isNaN(registryId) || isNaN(petIdNumber)) {
    notFound();
  }

  // Obtener el registro de vacunación
  const registry: VaccineRecord | null = await getVaccineRegistryById(token, registryId);

  if (!registry) {
    notFound();
  }

  // Obtener vacunas disponibles
  /*let vaccineOptions: Vaccine[] = [];

  try {
    vaccineOptions = await getVaccines(token);
  } catch (error) {
    console.error("Error al obtener vacunas:", error);
  }*/

  return (
    <div>
      <VaccineRegistryForm
        token={token}
        petId={petIdNumber}
      />
    </div>
  );
}
