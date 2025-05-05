"use client";

import { notFound, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useVaccineRegistryDetail } from "@/hooks/vaccine-registry/useVaccineRegistryDetail";
import { formatDate } from "@/lib/utils";

interface Props {
  id: number;
  token: string;
}

export const VaccineRegistryDetail = ({ id, token }: Props) => {
  const router = useRouter();
  const { registry, pet, owner, loading, error } = useVaccineRegistryDetail(
    id,
    token
  );

  if (loading) return <p className="text-center mt-10">Cargando...</p>;
  if (error || !registry) return notFound();

  return (
    <div className="flex flex-col justify-between mt-5 p-4 mx-2">
      <div className="flex flex-col gap-6">
        <h1 className="text-2xl font-bold">
          Detalle del Registro de Vacunación
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Detail label="Vacuna" value={registry.vaccine.name} />
          <Detail
            label="Fabricante"
            value={registry.vaccine.manufacturer.name}
          />
          <Detail label="Mascota" value={pet?.name ?? "—"} />
          <Detail label="Dueño" value={owner?.fullName ?? "—"} />
          <Detail label="Dosis aplicada" value={`${registry.dose} ml`} />
          <Detail
            label="Fecha de aplicación"
            value={
              registry.applicationDate
                ? formatDate(registry.applicationDate)
                : "—"
            }
          />
          <Detail
            label="Próxima aplicación"
            value={formatDate(registry.expectedDate)}
          />
        </div>
      </div>

      {/* Botones */}
      <div className="flex gap-4 mt-6 justify-end">
        <Button
          variant="outline"
          onClick={() => router.push("/dashboard/settings/vaccine-registry")}
        >
          Volver
        </Button>
        <Button
          onClick={() =>
            router.push(
              `/dashboard/clients/${owner?.id}/pet/${pet?.id}/${registry.id}`
            )
          }
        >
          Editar
        </Button>
      </div>
    </div>
  );
};

const Detail = ({ label, value }: { label: string; value: string }) => (
  <div className="flex justify-between items-center border-b py-1">
    <span className="text-gray-500">{label}</span>
    <span className="font-medium">{value}</span>
  </div>
);
