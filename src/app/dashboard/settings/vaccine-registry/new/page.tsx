import { getServerSession } from "next-auth";
import authOptions from "@/lib/auth/options";
import { redirect } from "next/navigation";
import VaccineRegistryForm from "@/components/admin/vaccine-registry/VaccineRegistryForm";
import { getVaccines } from "@/lib/vaccine/getVaccines";
import { Vaccine } from "@/lib/vaccine-registry/IVaccineRegistry";

interface Props {
  params: {
    petId?: string; // ← ahora opcional
  };
}

export default async function NewVaccineRegistryPage({ params }: Props) {
  const session = await getServerSession(authOptions);
  const token = session?.user?.token || null;

  if (!token) {
    redirect("/login");
  }

  const petId = params.petId ? Number(params.petId) : undefined;

  let vaccineOptions: Vaccine[] = [];

  try {
    const response = await getVaccines(token);
    vaccineOptions = Array.isArray(response) ? response : [];
  } catch (err) {
    console.error("Error al obtener vacunas:", err);
    vaccineOptions = []; // fallback para evitar el .map() error
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
