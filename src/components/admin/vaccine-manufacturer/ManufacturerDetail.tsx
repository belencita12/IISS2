"use client";

import { useRouter } from "next/navigation";
import { useManufacturerDetail } from "@/hooks/vaccine-manufacturer/useManufacturerDetail";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";

interface Props {
  id: number;
  token: string;
}

export default function ManufacturerDetail({ id, token }: Props) {
  const router = useRouter();
  const { manufacturer, vaccines, loading } = useManufacturerDetail(id, token);

  const handleView = (id: number) => router.push(`/dashboard/vaccine/${id}`);

  if (loading) return <p className="text-center mt-10">Cargando...</p>;
  if (!manufacturer) return <p>No se encontró el fabricante.</p>;

  return (
    <div className="p-4 space-y-6">
      <h1 className="text-3xl font-bold">Fabricante: {manufacturer.name}</h1>
      <h2 className="text-xl font-semibold">Vacunas asociadas</h2>
      <div className="bg-white rounded shadow p-4">
        {vaccines.length === 0 ? (
          <p>No hay vacunas registradas para este fabricante.</p>
        ) : (
          <table className="w-full text-left">
            <thead>
              <tr className="border-b">
                <th className="py-2">Nombre</th>
                <th>Especie</th>
                <th>Precio</th>
                <th className="text-right">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {vaccines.map((vac) => (
                <tr key={vac.id} className="border-b hover:bg-gray-50">
                  <td className="py-2">{vac.name}</td>
                  <td>{vac.species? vac.species.name : "—"}</td>
                  <td>Gs. {vac.product?.price?.toLocaleString("es-PY")}</td>
                  <td className="text-right space-x-2">
                    <Button size="sm" variant="outline" onClick={() => handleView(vac.id)}>
                      <Eye className="w-4 h-4" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
