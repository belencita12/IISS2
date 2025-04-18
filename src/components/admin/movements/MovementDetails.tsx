"use client";

import { useMovementDetails } from "@/hooks/movements/useMovementDetails";
import { Card } from "@/components/ui/card";
import { Separator } from "@radix-ui/react-select";
import Image from "next/image";

interface Props {
  id: number;
  token: string;
}

export const MovementDetails = ({ id, token }: Props) => {
  const { movement, details, loading, error } = useMovementDetails(id, token);

  if (loading) return <p className="text-center mt-10">Cargando...</p>;
  if (error) return <p className="text-center text-red-500 mt-10">Error: {error}</p>;
  if (!movement) return <p className="text-centermt-10">No se encontró el movimiento.</p>;

  const getMovementTypeLabel = (type: string) => {
    switch (type) {
      case "INBOUND":
        return "Ingreso";
      case "OUTBOUND":
        return "Egreso";
      case "TRANSFER":
        return "Transferencia";
      default:
        return type;
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-6xl">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">
          Movimiento de {getMovementTypeLabel(movement.type)}
        </h1>
        <p className="text-base text-gray-500">
          {new Date(movement.dateMovement).toLocaleString("es-ES", {
            day: "2-digit",
            month: "2-digit",
            year: "2-digit",
          })}
        </p>
      </div>

      <Card className="p-6 mb-6 shadow-sm space-y-4">
        <InfoRow label="Encargado" value={movement.manager?.fullName} />

        {movement.originStock?.name && (
          <InfoRow label="Depósito Origen" value={movement.originStock.name} />
        )}

        {movement.destinationStock?.name && (
          <InfoRow label="Depósito Destino" value={movement.destinationStock.name} />
        )}

        {movement.description && (
          <div className="flex flex-col">
            <p className="text-sm text-gray-500 mb-1">Descripción</p>
            <p className="bg-gray-200 rounded-md px-3 py-2 text-sm text-gray-800 w-full break-words">
              {movement.description}
            </p>
          </div>
        )}
      </Card>

      <h2 className="text-xl font-semibold mb-2 text-gray-700">Productos</h2>
      <Separator className="mb-4" />

      <div className="space-y-6">
        {details.map((detail, idx) => (
          <Card key={idx} className="flex p-4 items-start gap-4 shadow-sm border">
            <Image
              src={detail.product.image?.originalUrl || "/default-avatar.png"}
              alt={detail.product.name ?? "Producto sin nombre"}
              width={80}
              height={80}
              className="object-contain rounded-md border"
            />
            <div className="flex-1">
              <h3 className="font-medium text-lg">{detail.product.name}</h3>
              <div className="grid grid-cols-2 gap-4 mt-2 text-sm text-gray-700">
                <DetailItem label="Categoría" value={detail.product.category} />
                <DetailItem label="Código" value={`${detail.product.code}`} />
                <DetailItem label="Tags" value={`${detail.product.tags}`} />
                <DetailItem label="Precio Unitario" value={`${detail.product.price?.toLocaleString()} Gs.`} />
                <DetailItem label="Precio Compra" value={`${detail.product.cost?.toLocaleString()} Gs.`} />
                <DetailItem label="Cantidad" value={`${detail.quantity}`} />
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

const InfoRow = ({ label, value }: { label: string; value?: string }) => (
  <div className="flex justify-between items-center">
    <p className="text-sm text-gray-500 w-1/2">{label}</p>
    <p className="bg-gray-200 rounded-md px-3 py-1 text-sm text-right">{value || "N/A"}</p>
  </div>
);

const DetailItem = ({ label, value }: { label: string; value: string }) => (
  <div>
    <p className="text-xs text-gray-500">{label}</p>
    <p>{value}</p>
  </div>
);
