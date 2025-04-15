"use client";

import { useEffect, useState } from "react";
import { getMovementByID } from "@/lib/movements/getMovementByID";
import { getMovementDetailsByMovementId } from "@/lib/movements/GetMovementDetailsByMovementID";
import { ExtendedMovement } from "@/lib/movements/IMovements";
import MovementDetail from "@/lib/movements/IMovementDetails";

interface Props {
  id: number;
  token: string;
}

export const MovementDetails = ({ id, token }: Props) => {
  const [movement, setMovement] = useState<ExtendedMovement | null>(null);
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
        setMovement({
          ...movementData,
          details: Array.isArray(movementData.details)
            ? movementData.details.map(detail => ({
                ...detail,
                productId: detail.product?.id || 0,
              }))
            : [],
        });
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

  return (
    <div className="container mx-auto p-4 max-w-4xl">
    <div className="flex justify-between items-center mb-6">
      <h1 className="text-2xl font-bold">{movement.type}</h1>
 
    </div>
      <h1>Movimiento #{movement.id}</h1>
      <p>Tipo: {movement.type}</p>
      <p>Fecha: {movement.dateMovement}</p>
      <p>Descripción: {movement.description || "Sin descripción"}</p>

      <h2>Productos</h2>
      <ul>
        {details.map((detail, idx) => (
          <li key={idx}>
            {detail.product.name} - Cantidad: {detail.quantity}
            {detail.product.category} - nose: {detail.product.code}
            {detail.product.cost} - {detail.product.price}
            {detail.product.price} - Cantidad: {detail.product.iva}
            
          </li>
        ))}
      </ul>
    </div>
  );
};
