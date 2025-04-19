import { useEffect, useState, useCallback } from "react";
import { getMovementByID } from "@/lib/movements/getMovementByID";
import { getMovementDetailsByMovementId } from "@/lib/movements/GetMovementDetailsByMovementID";
import { MovementData } from "@/lib/movements/IMovements";
import MovementDetail from "@/lib/movements/IMovementDetails";
import { PaginationResponse } from "@/lib/types";
import { useQuery } from "../useQuery";
import { BaseQueryParams } from "@/lib/types";

export const useMovementDetails = (id: number, token: string, init?: Partial<BaseQueryParams>) => {
  const [movement, setMovement] = useState<MovementData | null>(null);
  const [detailsData, setDetailsData] = useState<PaginationResponse<MovementDetail> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { query, setQuery, toQueryString } = useQuery({
    page: 1,
    size: 10,
    ...init,
  });

  const fetchDetails = useCallback(async () => {
    setLoading(true);
    try {
      const [movementData, detailsResponse] = await Promise.all([
        getMovementByID(id, token),
        getMovementDetailsByMovementId(id, token, toQueryString()),
      ]);

      setMovement(movementData);
      setDetailsData(detailsResponse);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message || "Error al obtener los datos");
      } else {
        setError("Error al obtener los datos");
      }
    } finally {
      setLoading(false);
    }
  }, [id, token, toQueryString]);

  useEffect(() => {
    fetchDetails();
  }, [fetchDetails]);

  return {
    movement,
    details: detailsData?.data || [],
    pagination: detailsData,
    query,
    setQuery,
    loading,
    error,
    refetch: fetchDetails,
  };
};
