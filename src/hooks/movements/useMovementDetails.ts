import { useEffect, useState } from "react";
import { getMovementByID } from "@/lib/movements/getMovementByID";
import { getMovementDetailsByMovementId } from "@/lib/movements/GetMovementDetailsByMovementID";
import { MovementData } from "@/lib/movements/IMovements";
import MovementDetail from "@/lib/movements/IMovementDetails";

export const useMovementDetails = (id: number, token: string) => {
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

  return { movement, details, loading, error };
};
