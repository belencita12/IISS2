import { useState, useEffect, useCallback } from "react";
import { getMovements } from "@/lib/movements/getMovements";
import { GetMovementQueryParams, MovementData } from "@/lib/movements/IMovements";
import { PaginationResponse } from "@/lib/types";
import { useQuery } from "../useQuery";

interface UseMovementListProps {
  token: string;
  init?: GetMovementQueryParams;
}

export const useMovementList = ({ token, init }: UseMovementListProps) => {
  const [data, setData] = useState<PaginationResponse<MovementData> | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { query, setQuery, toQueryString } = useQuery(init);

  const queryStr = toQueryString();

  const fetchMovements = useCallback(async () => {
    setLoading(true);
    try {
      const result = await getMovements(token, queryStr);
      setData(result);
    } catch (err) {
      console.error(err);
      setError("Error al obtener movimientos");
    } finally {
      setLoading(false);
    }
  }, [token, queryStr]);

  useEffect(() => {
    fetchMovements();
  }, [fetchMovements]);

  return {
    data,
    isLoading: loading,
    error,
    query,
    setQuery,
    handleSearch: fetchMovements,
  };
};
