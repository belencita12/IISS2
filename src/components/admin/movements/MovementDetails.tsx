"use client";

import { useEffect, useState } from "react";
import { getMovementByID } from "@/lib/movements/getMovementByID";
import { getMovementDetailsByMovementId } from "@/lib/movements/GetMovementDetailsByMovementID";
import { MovementData } from "@/lib/movements/IMovements";
import MovementDetail from "@/lib/movements/IMovementDetails";
import { Card } from "@/components/ui/card";
import { Separator } from "@radix-ui/react-select";
import Image from "next/image";

interface Props {
  id: number;
  token: string;
}

export const MovementDetails = ({ id, token }: Props) => {
  const [movement, setMovement] = useState<MovementData | null>(null);
  const [details, setDetails] = useState<MovementDetail[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [movementData, detailData] = await Promise.all([
          getMovementByID(id, token),
          getMovementDetailsByMovementId(id, token),
        ]);
        setMovement(movementData);
        setDetails(Array.isArray(detailData) ? detailData : []);
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message || "Error al obtener los datos");
        } else {
          setError("Error al obtener los datos");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, token]);

  if (loading) return <p>Cargando...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!movement) return <p>No se encontró el movimiento.</p>;
return(
 <div className="container mx-auto p-4 max-w-4xl">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">{movement.type}</h1>
        <div className="text-right">
          <p className="text-gray-500">
            {new Date(movement.dateMovement).toLocaleString("es-ES", {
              day: "2-digit",
              month: "2-digit",
              year: "2-digit",
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit",
            })}
          </p>
        </div>
      </div>

      <Card className="p-6 mb-6 shadow-sm">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-500">Encargado</p>
            <p className="bg-gray-200 rounded-md px-3 py-1 text-sm mt-1">
              {movement.manager?.fullName} 
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Depósito Origen</p>
            <p className="bg-gray-200 rounded-md px-3 py-1 text-sm mt-1">
              {movement.originStock?.name || "-"}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Depósito Destino</p>
            <p className="bg-gray-200 rounded-md px-3 py-1 text-sm mt-1">
              {movement.destinationStock?.name || "-"}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Descripción</p>
            <p className="bg-gray-200 rounded-md px-3 py-1 text-sm mt-1">{movement.description || "Sin descripción"}</p>
          </div>
        </div>
      </Card>

      <h2 className="text-xl font-semibold mb-4">Productos</h2>
      <Separator className="mb-6" />


      <div className="space-y-4">
        {details.map((detail, idx) => (
          <div key={idx} className="border-b pb-4">
            <div className="flex gap-4">
                <Image
                  src={detail.product.image?.originalUrl ?? `/placeholder.svg?height=80&width=80`}
                  alt={detail.product.name ?? "Producto sin nombre"}
                  width={80}
                  height={80}
                  className="object-contain"
                />
                
              </div>
              <div className="flex-1">
                <h3 className="font-medium">{detail.product.name}</h3>
                <div className="grid grid-cols-2 gap-x-4 gap-y-1 mt-1">
                  <div>
                    <p className="text-xs text-gray-500">Categoría</p>
                    <p className="text-sm">{detail.product.category}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Precio Unit</p>
                    <p className="text-sm">{detail.product.price?.toLocaleString()} Gs.</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Precio Compra</p>
                    <p className="text-sm">{(detail.product.cost?.toLocaleString())} Gs.</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Cantidad</p>
                    <p className="text-sm">{detail.quantity}</p>
                  </div>
                </div>
              </div>
            </div>
          
        ))}

      </div>
   
  </div>
  );
};
