import { getServerSession } from "next-auth";
import authOptions from "@/lib/auth/options";
import { redirect } from "next/navigation";
import VaccineRegistryForm from "@/components/admin/vaccine-registry/VaccineRegistryForm";
import { getVaccines } from "@/lib/vaccine/getVaccines";
import { Vaccine } from "@/lib/vaccine-registry/IVaccineRegistry";
import { notFound } from "next/navigation";

interface Props {
  params: {
    petId: string;
  };
}

export default async function NewVaccineRegistryPage({ params }: Props) {
  const session = await getServerSession(authOptions);
  const token = session?.user?.token || null;

  if (!token) {
    redirect("/login");
  }

  const petId = Number(params.petId);
  if (isNaN(petId)) {
    notFound(); // o mostrar error de validación
  }

  let vaccineOptions: Vaccine[] = [];

  try {
    vaccineOptions = await getVaccines(token); // función que obtiene las vacunas desde la API
  } catch (err) {
    console.error("Error al obtener vacunas:", err);
  }

  return (
    <div>
      <VaccineRegistryForm
        token={token}
        petId={petId}
        vaccineOptions={vaccineOptions}
      />
    </div>
  );
}
