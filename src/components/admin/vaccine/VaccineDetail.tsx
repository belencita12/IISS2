"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useVaccineDetail } from "@/hooks/vaccine/useVaccineDetail";

interface Props {
  id: number;
  token: string;
}

export const VaccineDetail = ({ id, token }: Props) => {
  const router = useRouter();
  const { vaccine, loading, error } = useVaccineDetail(id, token);

  if (loading) return <p className="text-center mt-10">Cargando...</p>;
  if (error || !vaccine)
    return <p className="text-center mt-10">No se encontró la vacuna.</p>;

  return (
    <div className="flex flex-col justify-between mt-5 p-4 mx-2">
      <div className="flex flex-col md:flex-row gap-6 items-start">
        {/* Imagen o inicial */}
        <div className="w-full md:w-1/4 flex justify-center">
          {vaccine.image?.originalUrl ? (
            <Image
              src={vaccine.image.originalUrl}
              alt={vaccine.name}
              width={260}
              height={260}
              className="object-contain"
            />
          ) : (
            <div className="w-64 h-64 bg-gray-200 flex items-center justify-center text-4xl font-bold rounded">
              {vaccine.name.charAt(0).toUpperCase()}
            </div>
          )}
        </div>

        {/* Detalles */}
        <div className="w-full md:w-3/4 space-y-4 mr-4">
          <h1 className="text-2xl font-bold">{vaccine.name}</h1>
          <Detail label="Fabricante" value={vaccine.manufacturer.name} />
          <Detail label="Especie" value={vaccine.species.name} />
          <Detail
            label="Costo"
            value={`Gs. ${vaccine.cost.toLocaleString("es-PY")}`}
          />
          <Detail
            label="IVA"
            value={`${vaccine.iva.toLocaleString("es-PY")} %`}
          />
          <Detail
            label="Precio"
            value={`Gs. ${vaccine.price.toLocaleString("es-PY")}`}
          />
        </div>
      </div>

      {/* Botones */}
      <div className="flex gap-4 mt-6 justify-end">
        <Button variant="outline" onClick={() => router.push("/dashboard/vaccine")}>
          Volver
        </Button>
        <Button onClick={() => router.push(`/dashboard/vaccine/edit/${vaccine.id}`)}>
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
