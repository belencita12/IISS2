// app/dashboard/vaccine/manufacturer/[id]/page.tsx
import VaccineManufacturerForm from "@/components/admin/vaccine/VaccineManufacturerForm";
import authOptions from "@/lib/auth/options";
import { getServerSession } from "next-auth";
import { notFound } from "next/navigation";
import { getManufacturerById } from "@/lib/vaccine-manufacturer/getVaccineManufacturerById";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  // Esperamos params para obtener el id
  const { id } = await params;

  // Obtenemos la sesión en el servidor
  const session = await getServerSession(authOptions);
  const token = session?.user?.token || null;

  if (!token) {
    notFound();
  }

  // Obtenemos los datos del fabricante por ID
  const manufacturerData = await getManufacturerById(token, Number(id));

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Editar Fabricante de Vacunas</h1>
      <VaccineManufacturerForm token={token} initialData={manufacturerData} />
    </div>
  );
}
